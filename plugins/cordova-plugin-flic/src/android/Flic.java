package com.jguix.cordova;

import android.content.Intent;
import android.util.Log;
import android.content.Context;
import android.content.IntentFilter;
import android.widget.Toast;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.List;
import java.util.concurrent.CountDownLatch;

import io.flic.lib.FlicButton;
import io.flic.lib.FlicButtonCallback;
import io.flic.lib.FlicButtonCallbackFlags;
import io.flic.lib.FlicManager;
import io.flic.lib.FlicManagerInitializedCallback;
import io.flic.lib.FlicBroadcastReceiver;
import io.flic.lib.FlicBroadcastReceiverFlags;


/**
 * Flic SDK Plugin
 */
public class Flic extends CordovaPlugin {

    public static final String LOG_TAG = "Flic";
    private static final String ACTION_INIT = "init";
    private static final String ACTION_GET_KNOWN_BUTTONS = "getKnownButtons";
    private static final String ACTION_GRAB_BUTTON = "grabButton";
    private static final String ACTION_FORGET_BUTTON = "forgetButton";
    private static final String ACTION_ENABLE_BUTTON = "enableButton";
    private static final String ACTION_DISABLE_BUTTON = "disableButton";
    private static final String ACTION_TRIGGER_BUTTON_EVENT = "triggerButtonEvent";
    private static final String ACTION_MESSAGE_CHANNEL = "messageChannel";
    private static final String FLICLIB_EVENT = "io.flic.FLICLIB_EVENT";
    private FlicManager manager;
    private CallbackContext messageChannel;
    private CallbackContext grabButtonCallbackContext;
    private enum BUTTON_STATUS {BUTTON_DISCONNECTED, BUTTON_CONNECTION_STARTED, BUTTON_CONNECTION_COMPLETED};

    private String _appId;
    private String _appSecret;
    private String _appName;

    /**
     * Constructor.
     */
    public Flic() { }

    /**
     * Sets the context of the Command. This can then be used to do things like
     * get file paths associated with the Activity.
     *
     * @param cordova The context of the main Activity.
     * @param webView The CordovaWebView Cordova is running in.
     */
    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);
        Log.v(LOG_TAG, "Init Flic");
    }

    @Override
    public boolean execute(final String action, JSONArray args, final CallbackContext callbackContext) throws JSONException {
        Log.v(LOG_TAG, "Flic action: " + action);

        if (ACTION_INIT.equals(action)) {
            Log.d(LOG_TAG, "ACTION: Init");

            InitAppCredentials(args);

            InitBroadcastReceiver();

            // Get manager
            FlicManager.getInstance(this.cordova.getActivity().getApplicationContext(), new FlicManagerInitializedCallback() {
                @Override
                public void onInitialized(FlicManager manager) {
                    Log.d(LOG_TAG, "FlicManager Ready");
                    Flic.this.manager = manager;

                    // Auto-enable buttons grabbed in a previous run of the activity
                    List<FlicButton> buttons = manager.getKnownButtons();
                    for (FlicButton button : buttons) {
                        // Register events for button
                        enableButton(button);
                    }

                    // Call callback function
                    callbackContext.success("Done initializing Flic");
                }
            });

            return true;
        } else if (ACTION_GET_KNOWN_BUTTONS.equals(action)) {
            Log.d(LOG_TAG, "ACTION: Get Known Buttons");
            JSONArray jsonButtons = new JSONArray();
            // Restore buttons grabbed in a previous run of the activity
            List<FlicButton> buttons = manager.getKnownButtons();
            for (FlicButton button : buttons) {
                JSONObject jsonButton = createJSONButton(button);
                jsonButtons.put(jsonButton);
                Log.d(LOG_TAG, "Found an existing button: " + jsonButton.get("buttonId")
                      + ", color: " + jsonButton.get("color")
                      + ", status: " + jsonButton.get("status"));
            }
            // Call callback function
            callbackContext.success(jsonButtons);

            return true;
        } else if (ACTION_GRAB_BUTTON.equals(action)) {
            // Keeps track of invoking callback context for later use
            this.grabButtonCallbackContext = callbackContext;
            // Tells cordova to send the callback to this plugin
            this.cordova.setActivityResultCallback(this);
            // Initiate grab button
            manager.initiateGrabButton(this.cordova.getActivity());
            Log.d(LOG_TAG, "ACTION: Grabbing button");

            return true;
        } else if (ACTION_FORGET_BUTTON.equals(action)) {
            Log.d(LOG_TAG, "ACTION: Forget Button");
            // Get buttonId from arguments
            final JSONObject options = args.getJSONObject(0);
            final String buttonId = options.getString("buttonId");

            // Forget button
            manager.forgetButton(manager.getButtonByDeviceId(buttonId));

            // Call callback function
            callbackContext.success();

            return true;
        } else if (ACTION_ENABLE_BUTTON.equals(action)) {
            // Get buttonId from arguments
            final JSONObject options = args.getJSONObject(0);
            final String buttonId = options.getString("buttonId");
            FlicButton button = manager.getButtonByDeviceId(buttonId);

            // Enable button
            enableButton(button);

            // Call callback function
            callbackContext.success();
            Log.d(LOG_TAG, "ACTION: Enable Button");

            return true;
        } else if (ACTION_DISABLE_BUTTON.equals(action)) {
            // Get buttonId from arguments
            final JSONObject options = args.getJSONObject(0);
            final String buttonId = options.getString("buttonId");
            FlicButton button = manager.getButtonByDeviceId(buttonId);

            // Disable button
            disableButton(button);

            // Call callback function
            callbackContext.success();
            Log.d(LOG_TAG, "ACTION: Disable Button");

            return true;
        } else if (ACTION_MESSAGE_CHANNEL.equals(action)) {
            Log.d(LOG_TAG, "ACTION: Message Channel OPEN");
            messageChannel = callbackContext;
            return true;
        } else {
            Log.w(LOG_TAG, "ACTION: UNKNOWN");
            callbackContext.error("Flic." + action + " is not a supported function.");
            return false;
        }
    }

    private void enableButton(FlicButton button) {
        if (button != null) {
            button.registerListenForBroadcast(FlicBroadcastReceiverFlags.CLICK_OR_DOUBLE_CLICK_OR_HOLD);
            Log.d(LOG_TAG, "SUCCESS: Registered a button " + button.getButtonId());
            Log.d(LOG_TAG, "Registerd  FlicBroadcastReceiverFlags=" + FlicBroadcastReceiverFlags.CLICK_OR_DOUBLE_CLICK_OR_HOLD);
            Toast.makeText(super.webView.getContext(), "Flic Button Registered", Toast.LENGTH_SHORT).show();
        } else {
            Log.w(LOG_TAG, "WARNING: Did not register any button");
            Toast.makeText(super.webView.getContext(), "WARNING: Did not register any button", Toast.LENGTH_SHORT).show();
        }
    }

    private void disableButton(FlicButton button) {
        // Unregister button from any events
        button.removeAllFlicButtonCallbacks();

        // Set inactive mode
        button.setActiveMode(false);
        sendButtonEvent("disabled", button);
    }

    private JSONObject createJSONButton(FlicButton button) {
        String buttonId = null, color = null, status = null;
        JSONObject jsonButton = new JSONObject();

        try {
            if (button != null) {
                buttonId = button.getButtonId();
                color = button.getColor();
                status = BUTTON_STATUS.values()[button.getConnectionStatus()].name();
            }
            jsonButton.put("buttonId", buttonId);
            jsonButton.put("color", color);
            jsonButton.put("status", status);
        } catch (JSONException e) {
            e.printStackTrace();
        }

        return jsonButton;
    }

    private JSONObject createJSONButtonEvent(FlicButton button, String event) {
        JSONObject jsonButtonEvent = new JSONObject();

        try {
            JSONObject jsonButton;
            jsonButton = createJSONButton(button);
            jsonButtonEvent.put("button", jsonButton);
            jsonButtonEvent.put("event", event);
        } catch (JSONException e) {
            e.printStackTrace();
        }

        return jsonButtonEvent;
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        FlicButton button = manager.completeGrabButton(requestCode, resultCode, data);

        if (button != null) {
            JSONObject jsonButton = createJSONButton(button);
            Log.d(LOG_TAG, "Got a button: " + button.getButtonId()
                  + ", color: " + button.getColor()
                  + ", status: " + BUTTON_STATUS.values()[button.getConnectionStatus()].name());
            // Register events for button
            enableButton(button);
            grabButtonCallbackContext.success(jsonButton);
        }
    }
    private void InitAppCredentials(JSONArray args) throws JSONException {
        // Get app credentials from arguments
        final JSONObject options = args.getJSONObject(0);
        _appId = options.getString("appId");
        _appSecret = options.getString("appSecret");
        _appName = options.getString("appName");

        setAppCredentials();
    }
    private void InitBroadcastReceiver() {
        Log.d(LOG_TAG, "InitBroadcastReceiver()");

        FlicBroadcastReceiver receiver = new FlicBroadcastReceiver() {
            @Override
            protected void onRequestAppCredentials(Context context) {
                Log.d(LOG_TAG, "FlicBroadcastReceiver ***onRequestAppCredentials AppId: " + _appId);
                setAppCredentials();
            }
            @Override
            public void onButtonSingleOrDoubleClickOrHold(Context context, FlicButton button, boolean wasQueued, int timeDiff, boolean isSingleClick, boolean isDoubleClick, boolean isHold) {
                String action = isSingleClick ? "singleClick" : (isDoubleClick ? "doubleClick" : "hold");
                Log.d(LOG_TAG, "onButtonSingleOrDoubleClickOrHold action: " + action);
                sendButtonEvent(action, button);
            }
            @Override
            public void onButtonRemoved(Context context, FlicButton button) {
                Log.d(LOG_TAG, "onButtonRemoved");
                sendButtonEvent("onButtonRemoved", button);
            }
        };

        //Register the broadcast reciever
        IntentFilter filter = new IntentFilter();
        filter.addAction(FLICLIB_EVENT);
        Log.d(LOG_TAG, "***Registering Receiver*** IntentFilter: " + FLICLIB_EVENT);
        this.cordova.getActivity().getApplicationContext().registerReceiver(receiver, filter);
    }
    public void sendButtonEvent(String action, FlicButton button) {
        Log.d(LOG_TAG, "Sending Event Event to Plugin Action: " + action + " Button: " + button);

        JSONObject event = createJSONButtonEvent(button, action);

        PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, event);
        pluginResult.setKeepCallback(true);
        if (messageChannel != null) {
            messageChannel.sendPluginResult(pluginResult);
        }
    }
    public void setAppCredentials() {
        Log.d(LOG_TAG, "Setting Flic App Credentials");
        FlicManager.setAppCredentials(_appId, _appSecret, _appName);
    }
}
