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
                                            AddAddressService,
                                            ShoppingConfirmationService) {

        $log.debug('Inside ShoppingConfirmation Controller');

        //Variables
        var breadCrumb,
            addressId = $routeParams.addressId,
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
        $scope.customerId = 700;
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
        function payment() {
            $log.debug('Make payment through rest');
            var params = {};
            params.customerId = $scope.customerId;
            params.addressId = addressId;
            $scope.promise = CartService.getCartDetail(params.customerId)
                .then(getCartSuccess, cartfailure);
            $scope.promise = AddAddressService.getAddress(params.addressId)
                .then(getAddressSuccess, addressfailure);
        }

        /**
         * [getAddressSuccess description]
         * @param  {[type]} result [description]
         * @return {[type]}        [description]
         */
        function getAddressSuccess(result) {
            $log.debug('Success in getting shipping address');
            address = result;
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
            order.fulfillmentGroups[0].address = address;
            var postData = {},
                params = {};
            params.customerId = $scope.customerId;
            postData.order = angular.copy(order);
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
            $scope.deliveryDate = new Date(result.trackingInfo.deliveryDate);
            $scope.trackingNumber = result.trackingInfo.trackingNumber;
            var estiDate = new Date(result.trackingInfo.deliveryDate);
            $scope.estimatedDate = estiDate.setDate($scope.deliveryDate.getDate() + 2);
            $scope.uiData.order = result;
            if ($scope.uiData.order.status === 'SUBMITTED') {
                $scope.uiData.cartItems = [];
                $scope.uiData.totalCartItem = 0;
                $rootScope.$broadcast('uiDataChanged', $scope.uiData);
                $rootScope.$broadcast('getCartItemCount', $scope.uiData.totalCartItem);
            }
        }

        /**
         * @param  {result}
         * @return {void}
         */
        function failure(result) {
            $log.debug('Failure JSON Data: ' + JSON.stringify(result));
            $scope.uiData.processingError = true;
        }

        function addressfailure(result) {
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
        $rootScope.$watch(function () {
            return $location.path();
        }, function (newLocation) {
            //if the new location is equal to previousLocation then borowsers back button is clicked
            if ($rootScope.actualLocation === newLocation) {
                $location.path(PAGE_URL.root);
            }
        });

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
        'AddAddressService',
        'ShoppingConfirmationService'];
    byProductApp.registerController('ShoppingConfirmationCtrl', ShoppingConfirmationCtrl);
    return ShoppingConfirmationCtrl;
});
