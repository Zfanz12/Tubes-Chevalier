package org.example.project.core.storage

import platform.Foundation.NSUserDefaults

actual object SessionStorage {
    private const val KEY_TOKEN = "access_token"
    private val defaults = NSUserDefaults.standardUserDefaults

    actual fun saveToken(token: String) { defaults.setObject(token, KEY_TOKEN) }
    actual fun getToken(): String? = defaults.stringForKey(KEY_TOKEN)
    actual fun clearToken() { defaults.removeObjectForKey(KEY_TOKEN) }
}