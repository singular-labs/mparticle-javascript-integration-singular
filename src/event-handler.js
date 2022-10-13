/*
A non-ecommerce event has the following schema:

{
    DeviceId: "a80eea1c-57f5-4f84-815e-06fe971b6ef2",
    EventAttributes: {test: "Error", t: 'stack trace in string form'},
    EventName: "Error",
    MPID: "123123123123",
    UserAttributes: {userAttr1: 'value1', userAttr2: 'value2'},
    UserIdentities: [{Identity: 'email@gmail.com', Type: 7}]
    User Identity Types can be found here:
}

*/

function EventHandler(common) {
    this.common = common || {};
}

EventHandler.prototype.logEvent = function(event) {
    if (!this.common.forwardWebRequestsServerSide) {
        let newAttributes = {} 
        if (event.ProductAction && event.ProductAction.ProductList) {
            for (var att in event.EventAttributes) {
                newAttributes[att] = event.EventAttributes[att]
            } 
            newAttributes[productList] = event.ProductAction.ProductList
        } else {
            newAttributes = event.EventAttributes
        }
        singularSdk.event(event.EventName, newAttributes)
        return true
    }
    return false 
};

EventHandler.prototype.logError = function(event) {

};
EventHandler.prototype.logPageView = function(event) {

};

module.exports = EventHandler;
