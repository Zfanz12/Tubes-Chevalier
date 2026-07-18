package org.example.project.core.network

sealed class AppError(override val message: String) : Exception(message) {
    data class Validation(val fieldErrors: Map<String, List<String>>, val text: String) : AppError(text)
    data class Unauthorized(val text: String) : AppError(text)
    data class Server(val code: Int, val text: String) : AppError(text)
    data class Network(val text: String) : AppError(text)
    data class Unknown(val text: String) : AppError(text)
}