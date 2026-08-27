package org.example.project.core.presentation.component

import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.ui.graphics.Shape
import org.example.project.core.theme.AppColors

@Composable
fun AppTextField(
    value: String,
    onValueChange: (String) -> Unit,
    label: String,
    modifier: Modifier = Modifier,
    placeholder: String? = null,
    enabled: Boolean = true,
    readOnly: Boolean = false,
    singleLine: Boolean = true,
    isError: Boolean = false,
    shape: Shape = OutlinedTextFieldDefaults.shape,
    keyboardOptions: KeyboardOptions = KeyboardOptions.Default,
    keyboardActions: KeyboardActions = KeyboardActions.Default
) {

    OutlinedTextField(
        value = value,
        onValueChange = onValueChange,
        label = {
            Text(label)
        },
        placeholder = placeholder?.let { { Text(it, color = AppColors.Hint) } },
        modifier = modifier.fillMaxWidth(),
        enabled = enabled,
        readOnly = readOnly,
        singleLine = singleLine,
        isError = isError,
        shape = shape,
        keyboardOptions = keyboardOptions,
        keyboardActions = keyboardActions
    )

}