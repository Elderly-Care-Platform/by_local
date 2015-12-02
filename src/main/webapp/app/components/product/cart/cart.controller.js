define(['byProductApp'], function (byProductApp) {
    function CartController($scope,
                            $rootScope,
                            $log,
                            $q,
                            $window,
                            $location,
                            ProductDescriptionService,
                            BreadcrumbService,
                            Utility,
                            PAGE_URL,
                            SERVERURL_IMAGE,
                            CartService,
                            DISCOUNT_TYPE, SessionIdService) {

        $log.debug('Inside CartController');

        // Variables
        var customerId = null;

        if (localStorage.getItem("by_cust_id")) {
            customerId = localStorage.getItem("by_cust_id");
        }

        $scope.serverurl = SERVERURL_IMAGE.hostUrl;
        $scope.quantityAvailable = '';
        $scope.enterProperInput = false;
        $scope.discountType = DISCOUNT_TYPE;
        $scope.isLoggedinUser = false;

        // uiData mapping
        $scope.uiData = {
            cartItems: [],
            totalCartItem: 0,
            productDeliveryCharges:0,
            totalProductDeliveryCharges: 0,
            totalAmount: 0,
            subTotalAmount: 0,
            outOfStock: false,
            fulfillmentGroups: [],
            orderAdjustments: []
        };

        // Function Declaration
        $scope.updateProductQuantity = updateProductQuantity;
        $scope.checkCartAvailability = checkCartAvailability;
        $scope.removeItemFromCart = removeItemFromCart;
        $scope.validatePromoCode = validatePromoCode;
        $scope.getFedexRateWebService = getFedexRateWebService;
        $scope.selectAddress = selectAddress;
        $scope.promise = getCartDetails();
        $scope.login = login;


        function selectAddress(){
            $location.path('/selectAddress/');
        }
        /**
         * Set the breadcrum and check cartavailability
         * @return {void}
         */
        function getCartDetails() {
            $scope.isLoggedinUser = localStorage.getItem("USER_ID") ? true : false;
            if ($location.path() === PAGE_URL.cart) {
                BreadcrumbService.setBreadCrumb(undefined, 'CART');
            }
            checkCartAvailability();
            //getFedexRateWebService();
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

        function getFedexRateWebService() {
            ProductDescriptionService.fedexRateWebService().then(getFedexRateWebServiceSuccess, failure);
        }

        function getFedexRateWebServiceSuccess(result) {
            if (result.rateServiceSeverity === 'SUCCESS') {
                $scope.rateServiceSeverity = result.rateServiceSeverity;
                $scope.deliveryDate = new Date(result.deliveryDate);
            } else {
                $scope.rateServiceSeverity = result.rateServiceSeverity;
                $scope.rateServiceMessage = result.rateServiceMessage;
            }
        }

        /**
         * Make request for removing item form cart
         * @param  {integer} orderItemId
         * @return {void}
         */
        function removeItemFromCart(orderItemId) {
            var params = {};
            params.id = orderItemId;
            params.customerId = customerId;
            $scope.promise = CartService.removeItemFromCart(params)
                .then(removeItemFromCartSuccess, failure);
        }

        /**
         * removes item from cart,Reload page
         * @param  {object} result cartDetail
         * @return {void}
         */
        function removeItemFromCartSuccess(result) {
            $log.debug('removeItemFromCartSuccess');
            $scope.uiData.cartItems = result.orderItems;
            $scope.uiData.fulfillmentGroups = result.fulfillmentGroups;
            if (result.orderItems) {
                $scope.uiData.totalCartItem = result.orderItems.length;
            } else {
                $scope.uiData.totalCartItem = 0;
            }
            $rootScope.$broadcast('getCartItemCount', $scope.uiData.totalCartItem);
            $rootScope.totalCartItem = $scope.uiData.totalCartItem;
            $scope.uiData.totalAmount = parseFloat(result.total.amount);
            $scope.uiData.subTotalAmount = parseFloat(result.subTotal.amount);
            $window.location.reload();
        }

        /**
         * Check whether cart is created for user or not
         * @param  {integer} customerId
         * @return {void}
         */
        function checkCartAvailability() {
            $log.debug('Check cart availability');
            if (customerId === null) {
                // Guest user
                // Create cart for guest
                $log.debug('Guest');
                createCart();
            } else {
                // Registered User
                // Check whether cart is created or not
                $log.debug('Registered');
                var params = {};
                params.customerId = customerId;
                CartService.getCartDetail(params)
                    .then(cartAvailabilitySuccess, cartAvailabilityFailure);
            }
        }

        /**
         * Fill the property of uiData object from cart object,
         * Get the productsku detail,getProductSkuInventory detail,ProductDescription detail
         * @param  {object} result cart
         * @return {void}
         */
        function cartAvailabilitySuccess(result) {
            $log.debug('Success in getting cart');

            if(result && result.customer && result.customer.id){
                localStorage.setItem("by_cust_id", result.customer.id);
                localStorage.setItem("by_cust_cart_id", result.id);
                customerId = result.customer.id;
            }

            $scope.uiData.orderAdjustments = result.orderAdjustments;

            if (!result.orderItems && result.orderAdjustments) {
                var params = {};
                params.customerId = customerId;
                CartService.removePromoCodes(params).then(removePromoCodeSucess, removePromoCodeFailure);
            }
            function removePromoCodeSucess(result) {
                $scope.uiData.orderAdjustments = result.orderAdjustments;
            }

            function removePromoCodeFailure(response) {
                $log.info(response);
            }

            if (result.orderItems) {
                $scope.uiData.totalCartItem = result.orderItems.length;
            } else {
                $scope.uiData.totalCartItem = 0;
            }
            if (undefined === result.total) {
                $scope.uiData.totalAmount = 0;
                $scope.uiData.subTotalAmount = 0;
            } else {
                $scope.uiData.totalAmount = parseFloat(result.total.amount);
                $scope.uiData.subTotalAmount = parseFloat(result.subTotal.amount);
            }
            $rootScope.$broadcast('getCartItemCount', $scope.uiData.totalCartItem);
            $rootScope.totalCartItem = $scope.uiData.totalCartItem;
            $rootScope.$broadcast('uiDataChanged', $scope.uiData);
            if (result.orderItems) {
                angular.forEach(result.orderItems, function (orderItem) {
                    var params = {};
                    params.id = orderItem.productId;
                    $scope.promise = ProductDescriptionService.getProductDescription(params)
                        .then(productDescriptionSuccess, failure);
                    $scope.promise = ProductDescriptionService.getProductSku(params)
                        .then(getProductSkuSuccess, failure);

                    function getProductSkuSuccess(result) {
                        var params = {};
                        params.id = result[0].id;
                        var getProductSkuInventoryPromise = ProductDescriptionService.getProductSkuInventory
                        (params).then(getProductSkuInventorySuccess, failure);
                        $scope.promise = getProductSkuInventoryPromise;
                    }

                    function getProductSkuInventorySuccess(result) {
                        $log.debug('quantityAvailable:' + result[0].quantityAvailable);
                        $scope.inventoryType = result[0].inventoryType;
                        if (result[0].inventoryType === 'CHECK_QUANTITY') {
                            if (result[0].quantityAvailable) {
                                $scope.quantityAvailable = parseInt(result[0].quantityAvailable, 10);
                            } else {
                                $scope.quantityAvailable = 0;
                            }
                        }
                        if (result[0].inventoryType === 'UNAVAILABLE') {
                            $scope.quantityAvailable = 0;
                        }
                        orderItem.quantityAvailable = $scope.quantityAvailable;
                        orderItem.inventoryType = $scope.inventoryType;
                    }

                    function productDescriptionSuccess(result) {
                        orderItem.primaryMedia = result.primaryMedia;
                        Utility.checkImages(orderItem);
                        orderItem.productDeliveryCharges = result.productDeliveryCharges;
                        var floatValue =
                            parseFloat(orderItem.orderItemPriceDetails[0].totalAdjustedPrice.amount);
                        orderItem.orderItemPriceDetails[0].totalAdjustedPrice.amount = floatValue;
                        var totalProductDeliveryCharges = 0;
                        angular.forEach($scope.uiData.cartItems, function (item) {
                            totalProductDeliveryCharges += item.productDeliveryCharges;
                        });
                        $scope.uiData.totalProductDeliveryCharges = totalProductDeliveryCharges;
                    }
                });
            }

            $scope.uiData.cartItems = result.orderItems;
        }

        /**
         * Failure in getting cart for customer
         * Create a new cart for customer
         * @return {void}
         */
        function cartAvailabilityFailure() {
            $log.debug('Failure in getting cart');
            // Create a new cart
            createCart(customerId);
        }

        // Create a new cart
        function createCart(customerId) {
            $log.debug('Create a new Cart');
            var params = {};
            if (customerId && customerId !== null){
                params.customerId = customerId;
            }

            var createCartPromise = CartService.createCart(params)
                .then(createCartSuccess, failure);
            $scope.promise = createCartPromise;
        }

        /**
         * Update the total and subtotal amount as from createCartSuccess
         * @param  {object} result response from createcart object
         * @return {void}
         */
        function createCartSuccess(result) {
            $log.debug('Success in creating Cart');
            if(result && result.customer && result.customer.id){
                localStorage.setItem("by_cust_id", result.customer.id);
                localStorage.setItem("by_cust_cart_id", result.id);
                customerId = result.customer.id;
            }
            $scope.uiData.cartItems = result.orderItems;
            if (result.orderItems) {
                $scope.uiData.totalCartItem = result.orderItems.length;
            } else {
                $scope.uiData.totalCartItem = 0;
            }
            $rootScope.$broadcast('getCartItemCount', $scope.uiData.totalCartItem);
            $rootScope.totalCartItem = $scope.uiData.totalCartItem;
            if (undefined === result.total) {
                $scope.uiData.totalAmount = 0;
                $scope.uiData.subTotalAmount = 0;
            } else {
                $scope.uiData.totalAmount = parseFloat(result.total.amount);
                $scope.uiData.subTotalAmount = parseFloat(result.subTotal.amount);
            }
        }

        /**
         * TO Update Product Quantity
         * @param  {object} cartItem
         * @param  {integer} quantity
         * @return {void}
         */
        function updateProductQuantity(cartItem, quantity) {
            $log.debug('updateProductQuantity');
            if (angular.isDefined(quantity.target)) {
                quantity = parseInt(quantity.target.value);
            }
            var params = {};
            params.id = cartItem.id;
            params.customerId = customerId;
            params.quantity = quantity;
            $scope.promise = ProductDescriptionService.updateProductQuantity(params)
                .then(cartAvailabilitySuccess, updateProductQuantityFailure);

            function updateProductQuantityFailure(result) {
                $log.debug('updateProductQuantityFailure: ' + result);
                if (quantity > cartItem.quantityAvailable) {
                    cartItem.outOfStock = true;
                    cartItem.enterProperInput = false;
                } else {
                    cartItem.outOfStock = false;
                    cartItem.enterProperInput = true;
                }
            }
        }

        // Failure
        function failure(result) {
            $log.debug('Failure');
            $log.debug('Failure JSON Data: ' + JSON.stringify(result));
        }

        function validatePromoCode() {
            if (angular.isUndefined($scope.promoCode)) {
                return;
            }
            var params = {};
            params.promoCode = $scope.promoCode;
            params.customerId = customerId;
            $scope.promise = CartService.applyPromoCode(params).then(successCallBack, errorCallBack);

            function successCallBack(result) {
                $scope.promoCodeIsValid = 'valid';
                if (!result.orderAdjustments) {
                    $scope.promoNotApplicable = true;
                } else {
                    $scope.promoNotApplicable = false;
                }

                $scope.uiData.orderAdjustments = result.orderAdjustments;
                $scope.uiData.totalAmount = parseFloat(result.total.amount);
                $scope.uiData.subTotalAmount = parseFloat(result.subTotal.amount);
                $rootScope.$broadcast('uiDataChanged', $scope.uiData);
            }

            function errorCallBack(response) {
                $scope.promoCodeIsValid = 'invalid';
                $scope.promoNotApplicable = false;
                $log.info('error code' + response);
            }
        }


        function mergeCartSuccess(){
            CartService.getCartDetail()
                .then(cartAvailabilitySuccess, cartAvailabilityFailure);
        }


        function mergeCartFailure(){
            CartService.getCartDetail()
                .then(cartAvailabilitySuccess, cartAvailabilityFailure);
        }

        function login(){
            $rootScope.nextLocation = "/selectAddress"
            $location.path('/users/login');
        }
        /**
         * To update cart detail when cartDetail chaned in one instance of CartController
         * @param  {object} event
         * @param  {object} data) {                 $scope.uiData changeduiData
         * @return {void}
         */
        $scope.$on('uiDataChanged', function (event, data) {
            $scope.uiData = data;
        });

        $scope.$on('newItemAddedToCart', function (event, args) {
            $scope.promise = getCartDetails();
        });

        $scope.$on('byUserLogin', function (event, args) {
            customerId = null;
            var params = {};
            params.guestOrderId = localStorage.getItem("by_cust_cart_id");
            CartService.mergeCart(params).then(mergeCartSuccess, mergeCartFailure);

        });

        $scope.$on('byUserLogout', function (event, args) {
            customerId = null;
            //$scope.promise = getCartDetails();

            var params = {};
            //params.customerId = customerId;
            CartService.getCartDetail(params)
                .then(cartAvailabilitySuccess, cartAvailabilityFailure);
        });
        $scope.showCart = function(e){
        	e.stopPropagation();
        	$(".badge-open").slideDown();
        };
        $scope.hideCart = function(){
        	$(".badge-open").slideUp();
        }


    }

    CartController.$inject = ['$scope',
        '$rootScope',
        '$log',
        '$q',
        '$window',
        '$location',
        'ProductDescriptionService',
        'BreadcrumbService',
        'Utility',
        'PAGE_URL',
        'SERVERURL_IMAGE',
        'CartService',
        'DISCOUNT_TYPE', 'SessionIdService'];

    return CartController;
});
