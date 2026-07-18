package org.example.project.core.storage

import android.content.Context
import android.content.SharedPreferences

actual object SessionStorage {
    private const val PREF_NAME = "auth_prefs"
    private const val KEY_TOKEN = "access_token"
    private lateinit var prefs: SharedPreferences

    // Panggil sekali di Application/MainActivity sebelum UI dibuat.
    fun init(context: Context) {
        prefs = context.applicationContext.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
    }

    actual fun saveToken(token: String) { prefs.edit().putString(KEY_TOKEN, token).apply() }
    actual fun getToken(): String? = if (::prefs.isInitialized) prefs.getString(KEY_TOKEN, null) else null
    actual fun clearToken() { prefs.edit().remove(KEY_TOKEN).apply() }
}