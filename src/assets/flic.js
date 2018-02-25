function successInit(result) {
    console.log('Flic init succeeded');

    // Get known buttons
    Flic.getKnownButtons(
        function(buttons) {
            console.log('Flic getKnownButtons succeeded');
            console.log('Flic known buttons: ' + JSON.stringify(buttons));
        },
        function(message) {
            console.log('Flic getKnownButtons failed: ' + message);
        });
}

function errorInit(message) {
    console.log('Flic init failed: ' + message);
}

function onFlicButtonPressed(result) {
    console.log(result.event); // (String) singleClick or doubleClick or hold
    console.log(result.button.buttonId); // (String)
    console.log(result.button.color); // (String) green
    console.log(result.wasQueued); // (Boolean) If the event was locally queued in the button because it was disconnected. After the connection is completed, the event will be sent with this parameter set to true.
    console.log(result.timeDiff); // (Number) If the event was queued, the timeDiff will be the number of seconds since the event happened.
}

function onFlicButtonPressedError(err){
    console.log(err);
}

var config = {
    appId: 'd56a9887-0034-44f1-a8d2-2e5fe296e1c4',
    appSecret: 'bfdc34b8-2289-4de4-800e-d2e886bf69e4',
    appName: 'Collective Conscience',
    reloadOnFlicEvent: true,
}

// Init flic
Flic.init(config, successInit, errorInit);

// Subscription to button events
Flic.onButtonClick(onFlicButtonPressed, onFlicButtonPressedError)