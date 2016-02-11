define(['byProductApp'], function (byProductApp) {
    function ShoppingConfirmationCtrl($scope,
                                            $rootScope,
                                            $routeParams,
                                            $log,
                                            $window,
                                            $location,
                                            BreadcrumbService,
                                            PAGE_URL,
                                            CartService,
                                            SelectAddressService,
                                            ShoppingConfirmationService, SessionIdService, SharedContextService) {

        $log.debug('Inside ShoppingConfirmation Controller');

        //Variables
        var breadCrumb,
            addressIndex = $routeParams.addressId,
            address = {}, 
            paymentInfo = {
                orderId: 0,
                type: 'THIRD_PARTY_ACCOUNT',
                amount: 0,
                currency: '',
                gatewayType: 'PayUMoney',
                transactions: [{
                    type: 'AUTHORIZE_AND_CAPTURE',
                    success: true
                }]
            };
        if ($routeParams.gateway === 'cod') {
            paymentInfo.type = 'COD';
            paymentInfo.gatewayType = 'Passthrough';
        }
        $scope.uiData = {
            oreder: {},
            noCart: false,
            processingError: false
        };

        $scope.customerId = null;
        if (localStorage.getItem("by_cust_id")) {
            $scope.customerId = localStorage.getItem("by_cust_id");
        }
        $scope.tabId = 1;

        //Functions
        $scope.promise = payment();
        $scope.orderHistory = orderHistory;

        breadCrumb = {'url': PAGE_URL.cart, 'displayName': 'CART'};
        BreadcrumbService.setBreadCrumb(breadCrumb, 'CONFIRMATION');

        /**
         * Update the crat/itemCount
         * @param  {object} event
         * @param  {object} args) {                 $scope.cartItemCount number of items
         * @return {void}
         */
        $scope.$on('getCartItemCount', function (event, args) {
            $scope.cartItemCount = args;
        });

        /**
         * @return {void}
         */

         $scope.leftPanelHeight = function(){            
            var clientHeight = $( window ).height() - 57;
            $(".by_menuDetailed").css('height', clientHeight+"px");
        }

        $scope.subMenuTabMobileShow = function () {
            $(".by_mobile_leftPanel_image").click(function () {
                if ($(".by_mobile_leftPanel_hide").css('left') == '0px') {
                    $(".by_mobile_leftPanel_image").animate({left: "0%"}, {duration: 400});
                    $(".by_mobile_leftPanel_image").css('background', "url('assets/img/community/mobile/humburgerG.png?versionTimeStamp=%PROJECT_VERSION%')");
                    $(".by_mobile_leftPanel_hide").animate({left: "-90%"}, {duration: 400});
                } else {
                    $(".by_mobile_leftPanel_image").animate({left: "90%"}, {duration: 400});
                    $(".by_mobile_leftPanel_image").css('background', "url('assets/img/community/mobile/humburger-minG.png?versionTimeStamp=%PROJECT_VERSION%')");
                    $(".by_mobile_leftPanel_hide").animate({left: "0%"}, {duration: 400});
                }
            });
        };
        function payment() {
            $log.debug('Make payment through rest');
            var params = {};
            params.customerId = $scope.customerId;
            $scope.promise = CartService.getCartDetail(params)
                .then(getCartSuccess, cartfailure);
            $scope.promise = SelectAddressService.getAddress(addressIndex).then(getAddressSuccess, getAddressFailure);
        }

        /**
         * [getAddressSuccess description]
         * @param  {[type]} result [description]
         * @return {[type]}        [description]
         */
        function getAddressSuccess(result) {
            $log.debug('Success in getting shipping address');
            address = result.data.data[0];
        }

        /**
         * [getCartSuccess description]
         * @param  {[type]} result [description]
         * @return {[type]}        [description]
         */
        function getCartSuccess(result) {
            $log.debug('Success in getting cart' + JSON.stringify(result));
            var postData = {};
            var params = {};
            if (result.orderItems) {
                paymentInfo.orderId = result.id;
                paymentInfo.amount = result.total.amount;
                paymentInfo.currency = result.total.currency;
                paymentInfo.transactions[0].amount = result.total.amount;
                paymentInfo.transactions[0].currency = result.total.currency;
                params.customerId = $scope.customerId;
                postData.paymentInfo = angular.copy(paymentInfo);
                $scope.promise = ShoppingConfirmationService.makePayment(params, postData)
                    .then(paymentSuccess, failure);
            } else {
                cartfailure(result);
            }
        }

        /**
         * [paymentSuccess description]
         * @param  {[type]} result [description]
         * @return {[type]}        [description]
         */
        function paymentSuccess(result) {
            $log.debug('Success in making payment' + JSON.stringify(result));
            var params = {};
            params.customerId = $scope.customerId;
            $scope.promise = CartService.getCartDetail(params).then(getOrderSuccess, failure);
        }

        /**
         * [getOrderSuccess description]
         * @param  {[type]} result [description]
         * @return {[type]}        [description]
         */
        function getOrderSuccess(result) {
            $log.debug('Success in getting order');
            var order = result;
            order.fulfillmentGroups[0].address = {};
            order.fulfillmentGroups[0].address.addressLine1 = address.address.streetAddress;
            order.fulfillmentGroups[0].address.addressLine2 = address.address.locality;
            order.fulfillmentGroups[0].address.city = address.address.city;
            order.fulfillmentGroups[0].address.country = {};
            order.fulfillmentGroups[0].address.country.name= address.address.country;
            order.fulfillmentGroups[0].address.country.abbreviation= "IN";
            order.fulfillmentGroups[0].address.postalCode = address.address.zip;
            order.fulfillmentGroups[0].address.firstName = address.firstName;
            order.fulfillmentGroups[0].address.lastName = address.lastName;

            order.fulfillmentGroups[0].address.primaryEmail = address.email;
            order.fulfillmentGroups[0].address.phonePrimary = {};
            order.fulfillmentGroups[0].address.phonePrimary.phoneNumber = address.phoneNumber;
            
            
            var postData = {},
                params = {};
            params.customerId = $scope.customerId;
            postData.order = angular.copy(order);
            postData.order.deliveryMode = SharedContextService.getDeliveryMode();
            $scope.promise = ShoppingConfirmationService.checkout(params, postData)
                .then(checkoutSuccess, failure);
        }

        /**
         * [checkoutSuccess description]
         * @param  {[type]} result [description]
         * @return {[type]}        [description]
         */
        function checkoutSuccess(result) {
            $log.debug('Success in checkout' + JSON.stringify(result));
            $scope.uiData.order = result;
            $scope.deliveryDate = new Date(result.submittedDate);
            //$scope.trackingNumber = result.trackingInfo.trackingNumber;
            var estiDate = new Date();
            $scope.estimatedDate = estiDate.setDate($scope.deliveryDate.getDate() + 10);
            if ($scope.uiData.order.status === 'SUBMITTED') {
                $scope.uiData.cartItems = [];
                $scope.uiData.totalCartItem = 0;
                $rootScope.$broadcast('uiDataChanged', $scope.uiData);
                $rootScope.$broadcast('getCartItemCount', $scope.uiData.totalCartItem);
            }
            localStorage.removeItem("USER_PRODUCT_DELIVERYMODE");
            localStorage.removeItem("USER_PRODUCT_PICKUP_DETAILS");
        }

        /**
         * @param  {result}
         * @return {void}
         */
        function failure(result) {
            $log.debug('Failure JSON Data: ' + JSON.stringify(result));
            $scope.uiData.processingError = true;
        }

        function getAddressFailure(result) {
            $log.debug('Failure JSON Data: ' + JSON.stringify(result));
            $scope.uiData.processingError = true;
        }

        function cartfailure(result) {
            $log.debug('Failure JSON Data: ' + JSON.stringify(result));
            $scope.uiData.noCart = true;
        }

        function orderHistory() {
            $location.path(PAGE_URL.orderHistory);
        }

        /*
         Store the actual location
         */
        $rootScope.$on('$locationChangeSuccess', function () {
            $rootScope.actualLocation = $location.path();
        });

        /*
         Watch for changes in location
         */
        //$rootScope.$watch(function () {
        //    return $location.path();
        //}, function (newLocation) {
        //    //if the new location is equal to previousLocation then borowsers back button is clicked
        //    if ($rootScope.actualLocation === newLocation) {
        //        $location.path(PAGE_URL.root);
        //    }
        //});

    }

    ShoppingConfirmationCtrl.$inject = ['$scope',
        '$rootScope',
        '$routeParams',
        '$log',
        '$window',
        '$location',
        'BreadcrumbService',
        'PAGE_URL',
        'CartService',
        'SelectAddressService',
        'ShoppingConfirmationService', 'SessionIdService', 'SharedContextService'];
    byProductApp.registerController('ShoppingConfirmationCtrl', ShoppingConfirmationCtrl);
    return ShoppingConfirmationCtrl;
});
