function CommerceHandler(common) {
    this.common = common || {};
}

    /*
        Sample ecommerce event schema:
        {
            CurrencyCode: 'USD',
            DeviceId:'a80eea1c-57f5-4f84-815e-06fe971b6ef2', // MP generated
            EventAttributes: { key1: 'value1', key2: 'value2' },
            EventType: 16,
            EventCategory: 10, // (This is an add product to cart event, see below for additional ecommerce EventCategories)
            EventName: "eCommerce - AddToCart",
            MPID: "8278431810143183490",
            ProductAction: {
                Affiliation: 'aff1',
                CouponCode: 'coupon',
                ProductActionType: 7,
                ProductList: [
                    {
                        Attributes: { prodKey1: 'prodValue1', prodKey2: 'prodValue2' },
                        Brand: 'Apple',
                        Category: 'phones',
                        CouponCode: 'coupon1',
                        Name: 'iPhone',
                        Price: '600',
                        Quantity: 2,
                        Sku: "SKU123",
                        TotalAmount: 1200,
                        Variant: '64GB'
                    }
                ],
                TransactionId: "tid1",
                ShippingAmount: 10,
                TaxAmount: 5,
                TotalAmount: 1215,
            },
            UserAttributes: { userKey1: 'userValue1', userKey2: 'userValue2' }
            UserIdentities: [
                {
                    Identity: 'test@gmail.com', Type: 7
                }
            ]
        }

        If your SDK has specific ways to log different eCommerce events, see below for
        mParticle's additional ecommerce EventCategory types:

            10: ProductAddToCart, (as shown above)
            11: ProductRemoveFromCart,
            12: ProductCheckout,
            13: ProductCheckoutOption,
            14: ProductClick,
            15: ProductViewDetail,
            16: ProductPurchase,
            17: ProductRefund,
            18: PromotionView,
            19: PromotionClick,
            20: ProductAddToWishlist,
            21: ProductRemoveFromWishlist,
            22: ProductImpression
        */

CommerceHandler.prototype.logCommerceEvent = function(event) {
    let eventName = event.EventName;
    if(event.ProductAction && event.ProductAction.ProductList && event.ProductAction.ProductList.length != 0){
        for (let i = 0 ; i < event.ProductAction.ProductList.length ; i++){
            if (event.EventCategory == 16 && event.ProductAction){
                let currency = event.CurrencyCode ? event.CurrencyCode : "USD";
                let amount = event.ProductAction.ProductList[i].TotalAmount;
                let newAttributes = {} 
                for (var att in event.EventAttributes) {
                    newAttributes[att] = event.EventAttributes[att]
                } 
                for (var att in event.ProductAction.ProductList[i].Attributes){
                    newAttributes[att] = event.ProductAction.ProductList[i].Attributes[att]
                }
                singularSdk.revenue(eventName, currency, amount, newAttributes);
            }else{
                let newAttributes = {} 
                for (var att in event.EventAttributes) {
                    newAttributes[att] = event.EventAttributes[att]
                } 
                for (var att in event.ProductAction.ProductList[i].Attributes){
                    newAttributes[att] = event.ProductAction.ProductList[i].Attributes[att]
                }
                singularSdk.event(eventName, newAttributes);
            }
        }
    }else{
        if (event.EventCategory == 16 && event.ProductAction) {
            let currency = event.CurrencyCode ? event.CurrencyCode : "USD";
            let amount = event.ProductAction?event.ProductAction.TotalAmount:0;
            singularSdk.revenue(eventName, currency, amount, event.EventAttributes);
        } else {
            singularSdk.event(eventName,  event.EventAttributes);
        }
    }




    
};

module.exports = CommerceHandler;
