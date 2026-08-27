package org.example.project.search.presentation

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import org.example.project.core.theme.AppColors
import org.example.project.core.theme.HarvestaTheme
import org.example.project.cart.presentation.CartViewModel
import org.example.project.cart.presentation.components.AddToCartSheet
import org.example.project.home.domain.model.ProductPreview
import org.example.project.search.domain.usecase.GetRecommendedSearchItemsUseCase
import org.example.project.search.domain.usecase.GetSearchSuggestionsUseCase
import org.example.project.search.domain.usecase.SearchProductsUseCase
import org.example.project.search.presentation.components.SearchFilterSheet
import org.example.project.search.presentation.components.SearchProductCard
import org.example.project.search.presentation.components.SearchTopBar
import androidx.compose.ui.tooling.preview.Preview
import org.example.project.core.preview.FakeSearchRepository

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SearchScreen(
    viewModel: SearchViewModel,
    onBack: () -> Unit,
    cartViewModel: CartViewModel
) {
    val state by viewModel.uiState.collectAsState()
    val sheetState = rememberModalBottomSheetState()
    val addToCartSheetState = rememberModalBottomSheetState()
    var productForAddToCart by remember { mutableStateOf<ProductPreview?>(null) }

    Column(modifier = Modifier.fillMaxSize().background(AppColors.White)) {
        SearchTopBar(
            query = state.query,
            onQueryChange = viewModel::onQueryChange,
            onBack = onBack,
            onSubmit = { viewModel.onSubmitSearch() },
            onClear = viewModel::onClearQuery,
            onFilterClick = if (state.stage == SearchStage.RESULT) viewModel::openFilterSheet else null,
            modifier = Modifier.padding(horizontal = 24.dp)
        )

        when (state.stage) {
            SearchStage.DEFAULT -> DefaultContent(state.recommendedItems, onItemClick = { viewModel.onSubmitSearch(it) })
            SearchStage.SUGGESTING -> SuggestingContent(state.query, state.suggestions, onSuggestionClick = { viewModel.onSubmitSearch(it) })
            SearchStage.RESULT -> ResultContent(state.results, state.isLoading, onAddToCart = { productForAddToCart = it })
        }
    }

    if (state.isFilterSheetVisible) {
        ModalBottomSheet(onDismissRequest = viewModel::closeFilterSheet, sheetState = sheetState) {
            SearchFilterSheet(
                filter = state.filter,
                onSelectRating = viewModel::onSelectRatingSort,
                onSelectPrice = viewModel::onSelectPriceSort,
                onSelectLocation = viewModel::onSelectLocationSort,
                onApply = viewModel::applyFilter
            )
        }
    }

    // Overlay "Masukkan Keranjang" (Figma), muncul saat tombol "Tambahkan" ditekan.
    productForAddToCart?.let { product ->
        ModalBottomSheet(
            onDismissRequest = { productForAddToCart = null },
            sheetState = addToCartSheetState
        ) {
            AddToCartSheet(
                product = product,
                onConfirm = { weight, quantity ->
                    cartViewModel.onAddProduct(product, weight, quantity)
                    productForAddToCart = null
                }
            )
        }
    }
}

// Figma "searching before" (698:268) -- "Anda mungkin suka" + list produk bergambar
@Composable
private fun DefaultContent(products: List<ProductPreview>, onItemClick: (String) -> Unit) {
    LazyColumn(modifier = Modifier.padding(horizontal = 24.dp)) {
        item {
            Text(
                "Anda mungkin suka",
                color = AppColors.Text,
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(vertical = 8.dp)
            )
        }
        items(products) { product ->
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable { onItemClick(product.name) }
                    .padding(vertical = 8.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                // TODO: ganti dengan AsyncImage begitu imageUrl dari API tersedia
                Box(
                    modifier = Modifier
                        .size(52.dp)
                        .clip(RoundedCornerShape(8.dp))
                        .background(AppColors.Neutral)
                )
                Text(product.name, color = AppColors.Subtitle, fontSize = 14.sp, fontWeight = FontWeight.Medium)
            }
            HorizontalDivider(color = AppColors.Neutral)
        }
    }
}

// Figma "searching after" (698:1932) -- daftar nama, huruf yang cocok query ditebalkan
@Composable
private fun SuggestingContent(query: String, suggestions: List<String>, onSuggestionClick: (String) -> Unit) {
    LazyColumn(modifier = Modifier.padding(horizontal = 24.dp)) {
        items(suggestions) { suggestion ->
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable { onSuggestionClick(suggestion) }
                    .padding(vertical = 16.dp, horizontal = 8.dp)
            ) {
                HighlightedSuggestionText(suggestion, query)
            }
            HorizontalDivider(color = AppColors.Neutral)
        }
    }
}

// Menebalkan bagian awal nama produk yang cocok dengan ketikan user (persis pola di Figma:
// "Bayam Organik" dengan "B" bold saat user mengetik "B")
@Composable
private fun HighlightedSuggestionText(suggestion: String, query: String) {
    val matchLength = if (suggestion.startsWith(query, ignoreCase = true)) query.length else 0
    Text(
        highlightPrefix(suggestion, matchLength),
        color = AppColors.Subtitle,
        fontSize = 14.sp,
        fontWeight = FontWeight.Medium
    )
}

private fun highlightPrefix(text: String, boldLength: Int) =
    androidx.compose.ui.text.buildAnnotatedString {
        if (boldLength > 0) {
            withStyle(androidx.compose.ui.text.SpanStyle(fontWeight = FontWeight.Bold, color = AppColors.Text)) {
                append(text.take(boldLength))
            }
            append(text.substring(boldLength))
        } else {
            append(text)
        }
    }

// Figma "searching result" (701:2283) -- grid 2 kolom kartu produk
@Composable
private fun ResultContent(results: List<ProductPreview>, isLoading: Boolean, onAddToCart: (ProductPreview) -> Unit) {
    if (isLoading) {
        Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            CircularProgressIndicator(color = AppColors.Primary)
        }
        return
    }

    if (results.isEmpty()) {
        Box(modifier = Modifier.fillMaxSize().padding(24.dp), contentAlignment = Alignment.Center) {
            Text("Produk tidak ditemukan", color = AppColors.TextMuted)
        }
        return
    }

    LazyVerticalGrid(
        columns = GridCells.Fixed(2),
        contentPadding = PaddingValues(horizontal = 24.dp, vertical = 16.dp),
        horizontalArrangement = Arrangement.spacedBy(8.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp),
        modifier = Modifier.fillMaxSize()
    ) {
        items(results) { product ->
            SearchProductCard(product = product, onAddToCart = onAddToCart)
        }
    }
}

@Preview
@Composable
private fun SearchScreenPreview() {
    val repository = remember { FakeSearchRepository() }
    val viewModel = remember {
        SearchViewModel(
            GetRecommendedSearchItemsUseCase(repository),
            GetSearchSuggestionsUseCase(repository),
            SearchProductsUseCase(repository)
        )
    }
    val cartViewModel = org.example.project.core.preview.rememberPreviewCartViewModel()

    HarvestaTheme {
        SearchScreen(viewModel = viewModel, onBack = {}, cartViewModel = cartViewModel)
    }
}