package org.example.project.core.storage

import java.util.prefs.Preferences

actual object SessionStorage {
    private val prefs = Preferences.userRoot().node("org/example/project/auth")
    private const val KEY_TOKEN = "access_token"

    actual fun saveToken(token: String) { prefs.put(KEY_TOKEN, token) }
    actual fun getToken(): String? = prefs.get(KEY_TOKEN, null)
    actual fun clearToken() { prefs.remove(KEY_TOKEN) }
}