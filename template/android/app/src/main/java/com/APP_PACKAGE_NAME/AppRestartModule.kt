package {{PACKAGE_NAME}}

import android.content.Intent
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class AppRestartModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "AppRestart"

    /**
     * Restarts the app by launching a fresh instance of the launch Activity
     * and finishing the current one. This is the reliable way to apply
     * RTL/LTR direction changes without killing the process.
     */
    @ReactMethod
    fun restart() {
        val activity = reactContext.currentActivity ?: return
        val packageName = reactContext.packageName
        val intent = reactContext.packageManager
            .getLaunchIntentForPackage(packageName) ?: return
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK)
        activity.runOnUiThread {
            reactContext.startActivity(intent)
            activity.finish()
        }
    }
}
