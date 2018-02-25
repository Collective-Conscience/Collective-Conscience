# Cordova-Flic
A Cordova plugin providing access to the Flic SDK

## Installation
    $ cordova plugin add cordova-plugin-flic

Set android:minSdkVersion="19" or higher in AndroidManifest.xml

    $ cordova build android

## Plugin API
It has been currently stripped to the minimum needed from a Javascript app.

The following functions are available:

* Flic.init (appId, appSecret, appName, options). Initialize Flic and register known buttons for receiving single click, double click and hold events
  * appId: your app client ID
  * appSecret: your app client secret
  * appName: your app name
  * options: a properties object with 2 function callbacks
    * options.success: called on function success
    * options.error: called on function error
* Flic.getKnownButtons(options). Get known buttons. Returns the list of buttons grabbed in a previous run of the app
  * options: a properties object with 2 function callbacks
    * options.success: called on function success
    * options.error: called on function error
* Flic.grabButton(options). Grab a button and register it for receiving single click, double click and hold events. Returns the grabbed button
  * options: a properties object with 2 function callbacks
    * options.success: called on function success
    * options.error: called on function error

## Sample usage code
    // Init flic
    Flic.init(appId, appSecret, appName, {
        success: function(result) {
            console.log('Flic init succeeded');

            // Get known buttons
            Flic.getKnownButtons({
                success: function(buttons) {
                    console.log('Flic getKnownButtons succeeded');
                    console.log('Flic known buttons: ' + JSON.stringify(buttons));
                },
                error: function(message) {
                    console.log('Flic getKnownButtons failed: ' + message);
                }
            });

        },
        error: function(message) {
            console.log('Flic init failed: ' + message);
        }
    });

    // Subscription to button events
    document.addEventListener('flicButtonClick', this.onFlicButtonPressed, false);
    document.addEventListener('flicButtonDblClick', this.onFlicButtonPressed, false);
    document.addEventListener('flicButtonHold', this.onFlicButtonPressed, false);

    function onFlicButtonPressed(event) {
        console.log(event.type); //flicButtonClick
        console.log(event.buttonId); //70:d4:db:69:2f:4e
        console.log(event.color); //green
        console.log(event.status); //BUTTON_CONNECTION_COMPLETED
    }
## Sample app

Copy the files from the example folder to your project's platforms/android/assets/wwww folder.

![Sample app screenshot](/sample/sample_app_screenshot.jpg)

## Roadmap
Next steps:

* Implement function forgetButton(buttonId). Forget a button, which will never be associated to the app until it is grabbed again.
* Implement function enableButton(buttonId). Subscribe button to single click, double click and hold events.
* Implement function disableButton(buttonId). Unsubscribe button to single click, double click and hold events. Unlike when forgetting the button, the button will still be associated the app.
* Implement function getButton(buttonId). Get a button by its device ID.
* Implement function setActiveMode(buttonId). Set button active mode.
* Implement function for more refined event subscription (onButtonClickOrHold, onButtonSingleOrDoubleClick, onButtonSingleOrDoubleClickOrHold, onButtonUpOrDown, onConnectionCompleted, onConnectionFailed, onConnectionStarted, onDisconnect, onReadRemoteRSSI)
