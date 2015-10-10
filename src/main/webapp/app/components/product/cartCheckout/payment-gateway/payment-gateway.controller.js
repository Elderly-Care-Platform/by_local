define(['byProductApp'], function (byProductApp) {
    function PaymentGatewayController($scope,
                                      $routeParams,
                                      $log,
                                      $location,
                                      $http,
                                      $q,
                                      BreadcrumbService,
                                      AddAddressService,
                                      ProductDescriptionService,
                                      CartService,
                                      PAGE_URL,
                                      SERVERURL) {

        $log.debug('Inside PaymentGateway Controller');

        // if (angular.isUndefined($routeParams.addressId) && '' !== $routeParams.addressId &&
        //  isNaN($routeParams.addressId)) {
        //   $location.path(PAGE_URL.cart);
        // }
        var breadCrumb,
            addressId = $routeParams.addressId;
        $scope.customerId = 700;
        $scope.tabId = 1;
        $scope.trimmedCaptchaCode = 0;
        $scope.uiData = {
            amount: 0,
            captchaCode: 0,
            totalShipping: 0,
            noCart: false
        };

        // Fucntion Declaration
        $scope.promise = getOrder();
        $scope.checkifValid = checkIfValid;
        $scope.setTabId = setTabId;
        $scope.checkOut = checkOut;
        $scope.drawCaptcha = drawCaptcha();
        $scope.drawCaptcha = drawCaptcha;

        // payUMoney

        $scope.payu = {
            key: 'TUoLhS',
            salt: 'cvwlTJU9',
            txnid: '',
            udf2: '',
            amount: '',
            productinfo: 'productinfo',
            firstname: '',
            email: '',
            hash: '',
            phone: '',
            surl: SERVERURL.hostUrl + SERVERURL.siteName + PAGE_URL.shoppingConfirmation +
            SERVERURL.forwardslash + $routeParams.addressId + SERVERURL.forwardslash + 'payu',
            furl: SERVERURL.hostUrl + SERVERURL.siteName + PAGE_URL.paymentFailure +
            SERVERURL.forwardslash + $routeParams.addressId,
            serviceProvider: 'payu_paisa'
        };

        var random = new Date().valueOf().toString();
        $scope.payu.txnid = sha256(random).substring(0, 20);
        $scope.payu.udf2 = $scope.payu.txnid;

        // End payUMoney

        breadCrumb = {'url': PAGE_URL.cart, 'displayName': 'CART'};
        BreadcrumbService.setBreadCrumb(breadCrumb, 'PAYMENT OPTION');

        function getOrder() {
            var params = {};
            params.customerId = $scope.customerId;
            params.addressId = addressId;
            var orderPromise = CartService.getCartDetail(params.customerId),
                addressPromise = AddAddressService.getAddress(params.addressId);
            $scope.promise = $q.all({order: orderPromise, address: addressPromise});
            return $scope.promise.then(getOrderSuccess, failure);
        }

        function getOrderSuccess(result) {
            $log.debug('Success in getting order' + JSON.stringify(result));
            var order = result.order || {},
                address = result.address || {};
            if (address) {
                $scope.payu.email = address.primaryEmail;
                $scope.payu.phone = address.phonePrimary.phoneNumber;
                $scope.payu.firstname = address.firstName;
            }
            if (order) {
                if (order.orderItems) {
                    $scope.uiData.amount = parseFloat(order.total.amount);
                    angular.forEach(order.orderItems, function (orderItem) {
                        var params = {};
                        params.id = orderItem.productId;
                        $scope.promise = ProductDescriptionService.getProductDescription(params)
                            .then(productDescriptionSuccess, failure);
                        function productDescriptionSuccess(result) {
                            $log.debug('Success in getting product' + JSON.stringify(result));
                            orderItem.productDeliveryCharges = result.productDeliveryCharges;
                            var totalProductDeliveryCharges = 0;
                            angular.forEach(order.orderItems, function (item) {
                                totalProductDeliveryCharges += item.productDeliveryCharges;
                            });
                            order.totalShipping.amount = totalProductDeliveryCharges;
                            $scope.uiData.totalShipping = parseFloat(order.totalShipping.amount);
                            $scope.payu.amount = $scope.uiData.amount + $scope.uiData.totalShipping;
                            makePayuChecksum();
                        }
                    });
                } else {
                    $location.path(PAGE_URL.root);
                }
            }
        }

        function makePayuChecksum() {
            var hasSequence = 'key|txnid|amount|productinfo|firstname|email|udf1|udf2' +
                    '|udf3|udf4|udf5|udf6|udf7|udf8|udf9|udf10',
                hashKey = hasSequence.split('|'),
                hashString = '';

            angular.forEach(hashKey, function (part) {
                if ($scope.payu[part]) {
                    hashString = hashString.concat($scope.payu[part]);
                } else {
                    hashString = hashString.concat('');
                }
                hashString = hashString.concat('|');
            });
            hashString = hashString.concat($scope.payu.salt);
            $scope.payu.hash = sha512(hashString.toString());
        }

        function failure(result) {
            $log.debug('Failure');
            $log.debug('Failure JSON Data: ' + JSON.stringify(result));
        }

        function checkIfValid(reference, status) {
            if (status) {
                reference.attr('css', 'border-color:red');
            }
        }

        function setTabId(id) {
            $scope.tabId = id;
        }

        function checkOut() {
            $log.debug('checkOut');
            $location.path(PAGE_URL.shoppingConfirmation + SERVERURL.forwardslash + addressId +
                SERVERURL.forwardslash + 'cod');
        }

        function drawCaptcha() {
            var a = Math.ceil(Math.random() * 10) + '',
                b = Math.ceil(Math.random() * 10) + '',
                c = Math.ceil(Math.random() * 10) + '',
                d = Math.ceil(Math.random() * 10) + '',
                e = Math.ceil(Math.random() * 10) + '',
                f = Math.ceil(Math.random() * 10) + '',
                g = Math.ceil(Math.random() * 10) + '',
                code = a + ' ' + b + ' ' + ' ' + c + ' ' + d + ' ' + e + ' ' + f + ' ' + g;
            $scope.trimmedCaptchaCode = a + b + c + d + e + f + g;
            $scope.uiData.captchaCode = code;
        }

        $scope.$on('getCartItemCount', function (event, args) {
            $scope.cartItemCount = args;
        });


    }

    PaymentGatewayController.$inject = ['$scope',
        '$routeParams',
        '$log',
        '$location',
        '$http',
        '$q',
        'BreadcrumbService',
        'AddAddressService',
        'ProductDescriptionService',
        'CartService',
        'PAGE_URL',
        'SERVERURL'];
    byProductApp.registerController('PaymentGatewayController', PaymentGatewayController);
    return PaymentGatewayController;
});