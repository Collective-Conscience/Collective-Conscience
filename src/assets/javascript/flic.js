var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener('resume', this.onAppResume, false);
        document.getElementById('myBtn1').addEventListener('click', this.grabButton);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready')
        
        var config = {
            appId: 'd56a9887-0034-44f1-a8d2-2e5fe296e1c4',
            appSecret: 'bfdc34b8-2289-4de4-800e-d2e886bf69e4',
            appName: 'Collective-Conscience',
            reloadOnFlicEvent: true
        }

        console.log('Starting Flic Manager');

        function successInit(result) {
            console.log('Flic init succeeded');
            document.querySelector('#deviceready').setAttribute('style', 'display:block;');
           
            Flic.onButtonClick(app.onFlicButtonPressed, function(errorMessage){
                console.log(errorMessage)
            })
            app.renderKnownButtons()
        }

        function errorInit(message) {
            console.log('Flic init failed: ' + message);
        }

        try {
            Flic.init(config, successInit, errorInit);
        } catch (e) {
            console.log('Flic exception: ' + e.message);
        }
    },
    onAppResume: function() {
        console.log('App resume');
        app.renderKnownButtons();
    },
    onFlicButtonPressed: function(result) {
        console.log(result.event); // (String) singleClick or doubleClick or hold
        console.log(result.button.buttonId); // (String)
        console.log(result.button.color); // (String) green
        console.log(result.wasQueued); // (Boolean) If the event was locally queued in the button because it was disconnected. After the connection is completed, the event will be sent with this parameter set to true.
        console.log(result.timeDiff); // (Number) If the event was queued, the timeDiff will be the number of seconds since the event happened.

        var button = document.querySelector('#' + app.escapeId(result.button.buttonId));
        if(button) {
            button.classList.remove('shake'); 
            setTimeout(function(){
                button.classList.add('shake')
            }, 20)
        } else {
            console.log('button not found')
        }
    },

    renderKnownButtons: function() {
        Flic.getKnownButtons(function(buttons) {
            console.log('Flic getKnownButtons succeeded');
            console.log('Flic known buttons: ' + JSON.stringify(buttons));
            var buttonsCont = document.querySelector('#buttons');
            buttonsCont.innerHTML = '';
            for (var i = 0; i < buttons.length; i += 1) {
                var button = buttons[i];
                var element = document.createElement('div');
                element.classList.add('btn')
                if (button.colorHex) {
                    element.style.borderColor = '#' + button.colorHex;
                } else {
                    element.style.borderColor = button.color;
                } 
                element.innerHTML = 'Button status: ' + button.status;
                element.id = app.escapeId(button.buttonId);
                buttonsCont.appendChild(element);
            }
        },
        function(message) {
            console.log('Flic getKnownButtons failed: ' + message);
        });
    },

    grabButton: function() {
        Flic.grabButton(function(button) {
            console.log('Flic grabButton succeeded');
            console.log('Flic grabbed button: ' + JSON.stringify(button));
            app.renderKnownButtons()
        },
        function(message) {
            console.log('Flic grabButton failed: ' + message);
        });
    },

    escapeId: function(id) {
        return id ? id.replace(/[^a-zA-Z]/g, '') : null
    }
};

app.initialize();