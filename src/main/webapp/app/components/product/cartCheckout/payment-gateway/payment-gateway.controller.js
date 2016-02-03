define(['byProductApp'], function (byProductApp) {
    function PaymentGatewayController($scope,
                                      $routeParams,
                                      $log,
                                      $location,
                                      $http,
                                      $q,
                                      BreadcrumbService,
                                      SelectAddressService,
                                      ProductDescriptionService,
                                      CartService,
                                      PAGE_URL,
                                      SERVERURL, SessionIdService) {

        $log.debug('Inside PaymentGateway Controller');

        // if (angular.isUndefined($routeParams.addressId) && '' !== $routeParams.addressId &&
        //  isNaN($routeParams.addressId)) {
        //   $location.path(PAGE_URL.cart);
        // }

        $scope.addressId = $routeParams.addressId;
        $scope.customerId = null;
        if (localStorage.getItem("by_cust_id")) {
            $scope.customerId = localStorage.getItem("by_cust_id");
        }
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
        $scope.isCODavailable = false;

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

        function getOrder() {
            var params = {};
            params.customerId = $scope.customerId;
            params.addressIndex = $scope.addressId;
            var orderPromise = CartService.getCartDetail(params),
                custAddressPromise = SelectAddressService.getAddress($scope.addressId);
            $scope.promise = $q.all({order: orderPromise, custAddress: custAddressPromise});
            return $scope.promise.then(getOrderSuccess, failure);
        }

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

        function validateCODzip(userAddress) {
            var selectedPincode = userAddress.address.zip, str1 = "bangalore", str2 = "bengaluru";
            if (selectedPincode) {
                $http.get(apiPrefix + "api/v1/location/getLocationByPincode?pincode=" + selectedPincode)
                    .success(function (response) {
                        if (response) {
                            if (response.districtname.toLowerCase().indexOf(str1) > -1 || response.districtname.toLowerCase().indexOf(str2) > -1)
                                $scope.isCODavailable = true;

                            if (response.regionname.toLowerCase().indexOf(str1) > -1 || response.regionname.toLowerCase().indexOf(str2) > -1)
                                $scope.isCODavailable = true;

                            if (response.taluk.toLowerCase().indexOf(str1) > -1 || response.taluk.toLowerCase().indexOf(str2) > -1)
                                $scope.isCODavailable = true;

                        }
                    });
            }

        }

        function getOrderSuccess(result) {
            $log.debug('Success in getting order' + JSON.stringify(result));

            var order = result.order || {},
                userAddress = result.custAddress.data.data[0] || {};
            if (userAddress) {
                validateCODzip(userAddress);
                $scope.payu.email = userAddress.email;
                $scope.payu.phone = userAddress.phoneNumber;
                $scope.payu.firstname = userAddress.firstName;
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
                            $scope.payu.amount = $scope.uiData.amount;
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
            $location.path(PAGE_URL.shoppingConfirmation + SERVERURL.forwardslash + $scope.addressId +
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
                code = a + ' ' + b + ' ' + ' ' + c + ' ' + d;
            $scope.trimmedCaptchaCode = a + b + c + d;
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
        'SelectAddressService',
        'ProductDescriptionService',
        'CartService',
        'PAGE_URL',
        'SERVERURL', 'SessionIdService'];
    byProductApp.registerController('PaymentGatewayController', PaymentGatewayController);
    return PaymentGatewayController;
});