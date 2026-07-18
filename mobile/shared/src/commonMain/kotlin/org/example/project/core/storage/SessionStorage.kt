package org.example.project.core.storage

expect object SessionStorage {
    fun saveToken(token: String)
    fun getToken(): String?
    fun clearToken()
}