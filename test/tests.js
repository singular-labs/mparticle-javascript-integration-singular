/* eslint-disable no-undef*/
describe('XYZ Forwarder', function () {
    // -------------------DO NOT EDIT ANYTHING BELOW THIS LINE-----------------------
    var MessageType = {
            SessionStart: 1,
            SessionEnd: 2,
            PageView: 3,
            PageEvent: 4,
            CrashReport: 5,
            OptOut: 6,
            AppStateTransition: 10,
            Profile: 14,
            Commerce: 16
        },
        EventType = {
            Unknown: 0,
            Navigation: 1,
            Location: 2,
            Search: 3,
            Transaction: 4,
            UserContent: 5,
            UserPreference: 6,
            Social: 7,
            Other: 8,
            Media: 9,
            ProductPurchase: 16,
            getName: function() {
                return 'blahblah';
            }
        },
        ProductActionType = {
            Unknown: 0,
            AddToCart: 1,
            RemoveFromCart: 2,
            Checkout: 3,
            CheckoutOption: 4,
            Click: 5,
            ViewDetail: 6,
            Purchase: 7,
            Refund: 8,
            AddToWishlist: 9,
            RemoveFromWishlist: 10
        },
        IdentityType = {
            Other: 0,
            CustomerId: 1,
            Facebook: 2,
            Twitter: 3,
            Google: 4,
            Microsoft: 5,
            Yahoo: 6,
            Email: 7,
            Alias: 8,
            FacebookCustomAudienceId: 9,
        },
        ReportingService = function () {
            var self = this;

            this.id = null;
            this.event = null;

            this.cb = function (forwarder, event) {
                self.id = forwarder.id;
                self.event = event;
            };

            this.reset = function () {
                this.id = null;
                this.event = null;
            };
        },
        reportService = new ReportingService();

// -------------------DO NOT EDIT ANYTHING ABOVE THIS LINE-----------------------
// -------------------START EDITING BELOW:-----------------------
// -------------------mParticle stubs - Add any additional stubbing to our methods as needed-----------------------
    mParticle.Identity = {
        getCurrentUser: function() {
            return {
                getMPID: function() {
                    return '123';
                }

            };
        }
    };
// -------------------START EDITING BELOW:-----------------------
    var SingularSDKForwarder = function() {
        var self = this;
        this.eventCalled = false;
        this.loginCalled = false;
        this.currency = '';
        this.amount = 0;
        this.revenueCalled = false;
        this.userId = null;
        this.init = function(config) {

        };

        this.event = function(name, args){
            self.eventCalled = true;
            self.eventName = name;
            self.eventArgs = args;
            // Return true to indicate event should be reported
            return true;
        };

        this.revenue = function(name, currency, amount, args){
            self.revenueCalled = true;
            self.eventName = name;
            self.currency = currency;
            self.amount = amount
            self.eventArgs = args;
            // Return true to indicate event should be reported
            return true;
        }

        this.login = function(userId){
            self.loginCalled = true;
            self.userId = userId;
        }

    };

    before(function () {

    });

    beforeEach(function() {
        singularSdk = new SingularSDKForwarder();
        // Include any specific settings that is required for initializing your SDK here
        var sdkSettings = {
            clientKey: '123456',
            appId: 'abcde',
            userIdField: 'customerId'
        };
        // You may require userAttributes or userIdentities to be passed into initialization
        var userAttributes = {
            color: 'green'
        };
        var userIdentities = [{
            Identity: 'customerId',
            Type: IdentityType.CustomerId
        }, {
            Identity: 'email',
            Type: IdentityType.Email
        }, {
            Identity: 'facebook',
            Type: IdentityType.Facebook
        }];
        mParticle.forwarder.init(sdkSettings, reportService.cb, true, null, userAttributes, userIdentities);
    });

    it('should log event', function(done) {
         mParticle.forwarder.process({
             EventDataType: MessageType.PageEvent,
             EventName: 'Test Event',
             EventAttributes: {
                 label: 'label',
                 value: 200,
                 category: 'category'
             }
         });

         singularSdk.eventCalled.should.equal(true);
        
         singularSdk.eventName.should.equal('Test Event');
         singularSdk.eventArgs.label.should.equal('label');
         singularSdk.eventArgs.value.should.equal(200);
         singularSdk.eventArgs.category.should.equal('category');



        done();
    });


    it('should log a product purchase commerce event', function(done) {
         mParticle.forwarder.process({
             EventName: 'Test Purchase Event',
             EventDataType: MessageType.Commerce,
             EventCategory: EventType.ProductPurchase,
             ProductAction: {
                 ProductActionType: ProductActionType.Purchase,
                 ProductList: [
                     {
                         Sku: '12345',
                         Name: 'iPhone 6',
                         Category: 'Phones',
                         Brand: 'iPhone',
                         Variant: '6',
                         Price: 400,
                         TotalAmount: 400,
                         CouponCode: 'coupon-code',
                         Quantity: 1
                     }
                 ],
                 TransactionId: 123,
                 Affiliation: 'my-affiliation',
                 TotalAmount: 450,
                 TaxAmount: 40,
                 ShippingAmount: 10,
                 CouponCode: null
             }
         });

        singularSdk.revenueCalled.should.equal(true);
        singularSdk.eventName.should.equal('Test Purchase Event');
        singularSdk.currency.should.equal('USD');
        singularSdk.amount.should.equal(450);
        done();
    });


    it('should log a product purchase commerce regular event', function(done) {
        mParticle.forwarder.process({
            EventName: 'Test Purchase Event',
            EventDataType: MessageType.Commerce,
            ProductAction: {
                ProductActionType: ProductActionType.Purchase,
                ProductList: [
                    {
                        Sku: '12345',
                        Name: 'iPhone 6',
                        Category: 'Phones',
                        Brand: 'iPhone',
                        Variant: '6',
                        Price: 400,
                        TotalAmount: 400,
                        CouponCode: 'coupon-code',
                        Quantity: 1
                    }
                ],
                TransactionId: 123,
                Affiliation: 'my-affiliation',
                TotalAmount: 450,
                TaxAmount: 40,
                ShippingAmount: 10,
                CouponCode: null
            }
        });

        singularSdk.eventCalled.should.equal(true);
        singularSdk.eventName.should.equal('Test Purchase Event');
        singularSdk.eventArgs.productList[0].Sku.should.equal('12345');
        done();
   });

    it('should login comlete', function(done) {
         var fakeUserStub = {
             getUserIdentities: function() {
                 return {
                     userIdentities: {
                         customerid: '123'
                     }
                 };
             },
             getMPID: function() {
                 return 'testMPID';
             },
             setUserAttribute: function() {
        
             },
             removeUserAttribute: function() {
        
             }
         };
        
         mParticle.forwarder.onLoginComplete(fakeUserStub);
         singularSdk.loginCalled.should.equal(true);
         singularSdk.userId.should.equal('testMPID');

        done();
    });
});
