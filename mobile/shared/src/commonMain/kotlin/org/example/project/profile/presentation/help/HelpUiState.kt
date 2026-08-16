package org.example.project.profile.presentation.help

data class FaqItem(
    val id: String,
    val question: String,
    val answerText: String,
    val linkText: String? = null,
    val linkUrl: String? = null
)

data class HelpUiState(
    val searchQuery: String = "",
    val faqs: List<FaqItem> = defaultFaqs,
    val expandedId: String? = defaultFaqs.firstOrNull()?.id,
    val pertanyaanLain: String = ""
) {
    val filteredFaqs: List<FaqItem>
        get() = if (searchQuery.isBlank()) faqs else faqs.filter {
            it.question.contains(searchQuery, ignoreCase = true)
        }
}

private val defaultFaqs = listOf(
    FaqItem(
        id = "ubah_alamat",
        question = "Bagaimana cara menggati alamat?",
        answerText = "Untuk upload tugas, silakan ikuti panduan berikut:",
        linkText = "https://lms.telkomuniversity.ac.id/task/submit_1",
        linkUrl = "https://lms.telkomuniversity.ac.id/task/submit_1"
    ),
    FaqItem(
        id = "ubah_foto",
        question = "Bagaimana cara menggati foto profil?",
        answerText = "Untuk mengganti profil, silakan ikuti panduan berikut:",
        linkText = "https://harvesta/task/profile",
        linkUrl = "https://harvesta/task/profile"
    )
)