
var initialization = {
    name: 'Singular',

    initForwarder: function(forwarderSettings, testMode, userAttributes, userIdentities, processEvent, eventQueue, isInitialized, common, appVersion, appName, customFlags, clientId) {
        if (!testMode) {
             var clientScript = document.createElement('script');
             clientScript.type = 'text/javascript';
             clientScript.async = true;
             clientScript.src = 'https://web-sdk-cdn.singular.net/singular-sdk/latest/singular-sdk.js';   
             (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(clientScript);
             clientScript.onload = function() {
                 if (singularSdk && eventQueue.length > 0) {
                     // Process any events that may have been queued up while forwarder was being initialized.
                     for (var i = 0; i < eventQueue.length; i++) {
                         processEvent(eventQueue[i]);
                     }
                      // now that each queued event is processed, we empty the eventQueue
                     eventQueue = [];
                 }

                 var config = new SingularConfig(forwarderSettings.apiKey, forwarderSettings.secret, forwarderSettings.productId).withPersistentSingularDeviceId(mParticle.getDeviceId())
                 singularSdk.init(config)
             };
        }
    }
};

module.exports = initialization;
