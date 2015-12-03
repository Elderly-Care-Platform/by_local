define(['byProductApp', 'videoImageDirective'], function (byProductApp, videoImageDirective) {

    /* @ngInject */
    function ProductDescriptionController($scope,
                                          $rootScope,
                                          $log,
                                          $q,
                                          $window,
                                          $routeParams,
                                          $modal,
                                          $location,
                                          $filter,
                                          $timeout,
                                          ProductDescriptionService,
                                          CartService,
                                          BreadcrumbService,
                                          PAGE_URL,
                                          INVENTORY,
                                          SERVERURL_IMAGE,
                                          MEDIATYPE,
                                          STATIC_IMAGE,
                                          TEMPLATE_URL,
                                          Utility, LogisticService) {

        $log.debug('Inside ProductDescriptionController');

        // Variables
        var breadCrumb, customerId = null;

        if (localStorage.getItem("by_cust_id")) {
            customerId = localStorage.getItem("by_cust_id")
        }

        $scope.constant = INVENTORY;
        $scope.serverurl = SERVERURL_IMAGE.hostUrl;
        $scope.productId = $routeParams.productId;
        $scope.quantityAvailable = 0;
        $scope.userRequiredQuantity = 1;
        $scope.inventoryType = null;
        $scope.pincodeAvailablity = '';
        $scope.addToCartDisable = false;
        $scope.addToCartFailedMsg = "";
        $scope.adjustedPrice = null;
        $scope.ByContactNo = BY.config.constants.byContactNumber;
        $scope.productAddSuccess = false;
        var productOptions = {};

        // uiData mapping
        $scope.uiData = {};
        $scope.logisticInfo = {};

        $scope.$on('ngRepeatFinished', function () {
            $window.initSlideShow();
        });

        // Function Declaration
        $scope.disableAddToCartButton = disableAddToCartButton();
        $scope.openProductDescription = openProductDescription;
        $scope.addProductToCart = addProductToCart;
        $scope.checkProductCashOnDeliveryPincode = checkProductCashOnDeliveryPincode;
        $scope.closeModelInstance = closeModelInstance;
        $scope.playVideo = playVideo;
        $scope.promise = getProductDescription();
        $scope.fedexRateWebService = getFedexRateWebService();
        $scope.productOptionSelected = productOptionSelected;
	    $scope.checkLogisticAvailability = checkLogisticAvailability;

        $scope.leftPanelHeight = function(){            
            var clientHeight = $( window ).height() - 57;
            $(".by_menuDetailed").css('height', clientHeight+"px");
        }

        function getFedexRateWebService() {
            ProductDescriptionService.fedexRateWebService().then(getFedexRateWebServiceSuccess, failure);
        }

        function getFedexRateWebServiceSuccess(result) {
            if (result.rateServiceSeverity === 'SUCCESS') {
                $scope.rateServiceSeverity = result.rateServiceSeverity;
                var deliveryDate = new Date(result.deliveryDate);
                var todayDate = new Date();
                var miliseconds = deliveryDate - todayDate;
                var seconds = miliseconds / 1000;
                var minutes = seconds / 60;
                var hours = minutes / 60;
                var days = hours / 24;
                $scope.estimatedDays = Math.ceil(days);
            } else {
                $scope.rateServiceSeverity = result.rateServiceSeverity;
                $scope.rateServiceMessage = result.rateServiceMessage;
            }
        }

        /**
         * To disable the add to cart and buy now button if product is already added to cart
         * @return {void}
         */
        function disableAddToCartButton() {
            var params = {};
            params.customerId = customerId;
            // Requests
            CartService.getCartDetail(params).then(cartServiceSuccess, failure);
        }

        /**
         * Disable addcart depends on productIf got in response
         * @param  {object} result cartDetail
         * @return {void}
         */
        function cartServiceSuccess(result) {
            var flag = true;
            var productId = parseInt($scope.productId, 10);
            if (result.orderItems) {
                angular.forEach(result.orderItems, function (orderItem) {
                    if (flag) {
                        if (productId === orderItem.productId) {
                            $scope.addToCartDisable = true;
                            flag = false;
                        } else {
                            $scope.addToCartDisable = false;
                        }
                    }
                });
            }
        }

        /**
         * Request to get Product Description
         * @return {object} if all promise fullfilled then call productDescriptionSuccess
         */
        function getProductDescription() {
            var params = {};
            params.id = $scope.productId;
            var productDescriptionPromise = ProductDescriptionService.getProductDescription(params),
                loadPromise = $q.all({productDescription: productDescriptionPromise});
            //if ($location.search().q) {
            //    try {
            //        $scope.category = JSON.parse($location.search().q);
            //    } catch (e) {
            //        $scope.category = $location.search().q;
            //    }
            //    delete $location.$$search.q;
            //}

            return loadPromise.then(productDescriptionSuccess, failure);

            /**
             * Identify image and video from response,set type of it in response
             * @param  {object} result ProductDescription object
             * @return {void}
             */
            function productDescriptionSuccess(result) {
                var params = {},
                    data = result.productDescription,
                    path = PAGE_URL.root;
                //if ($scope.category !== undefined) {
                //    path += '?q=' + $filter('encodeUri')($scope.category);
                //}
                //breadCrumb = {'url': path, 'displayName': data.categoryName};
                //BreadcrumbService.setBreadCrumb(breadCrumb, data.name);
                params.id = $scope.productId;
                $scope.promise = ProductDescriptionService.getProductSku(params)
                    .then(getProductSkuSuccess, failure);
                $scope.uiData = data;
                /* for(var i = 0; i<data.productOptions.length; i++ ){
                 productOptions[data.productOptions[i].attributeName] = null;
                 };*/
                $scope.uiData.name = data.name;
                Utility.checkImages($scope.uiData);
                if (data.mediaItems) {
                    angular.forEach(data.mediaItems, function (mediaItem) {
                        var params = {};
                        params.image = mediaItem.url;
                        CartService.loadImage(params).then(loadImageSuccess, loadImageFailure);
                        function loadImageSuccess() {
                            $log.debug('success in getting image');
                            mediaItem.url = SERVERURL_IMAGE.hostUrl + mediaItem.url;
                            Utility.checkMediaType(mediaItem);
                        }

                        function loadImageFailure() {
                            $log.debug('failure in getting image');
                            mediaItem.url = STATIC_IMAGE.imageNotAvailable;
                            Utility.checkMediaType(mediaItem);
                        }
                    });
                }
                $scope.uiData.media = data.mediaItems;
                angular.forEach(data.mediaItems, function (mediaItem) {
                    var url = mediaItem.url;
                    if (Utility.getImageExt().test(url)) {
                        mediaItem.type = MEDIATYPE.mediaTypeImage;
                    } else if (Utility.getVideoExt().test(url)) {
                        mediaItem.type = MEDIATYPE.mediaTypeVideo;
                        mediaItem.poster = STATIC_IMAGE.videoPoster;
                        mediaItem.extension = mediaItem.url.split('.').pop();
                    } else {
                        mediaItem.type = MEDIATYPE.mediaTypeNotSupported;
                        mediaItem.poster = STATIC_IMAGE.unsupportedMedia;
                    }
                });
                params = {};
                params.id = data.defaultCategoryId;
                params.q = '*';
                $scope.promise = ProductDescriptionService.getProductListByCategory(params)
                    .then(similarProductSuccess, failure);
            }

            /**
             * Get Product Sku Details Success Function
             * @param  {[type]} result [description]
             * @return {[type]}        [description]
             */
            function getProductSkuSuccess(result) {
                var params = {};
                params.id = result[0].id;
                var getProductSkuInventoryPromise = ProductDescriptionService.getProductSkuInventory
                (params).then(getProductSkuInventorySuccess, failure);
                $scope.promise = getProductSkuInventoryPromise;
            }

            /**
             * set the quantityAvialable
             * @param  {object} result productskuinventory
             * @return {void}
             */
            function getProductSkuInventorySuccess(result) {
                $scope.inventoryType = result[0].inventoryType;
                if (result[0].quantityAvailable) {
                    $scope.quantityAvailable = parseInt(result[0].quantityAvailable, 10);
                } else {
                    if ($scope.inventoryType === null) {
                        $scope.quantityAvailable = 0;
                    }
                    if ($scope.inventoryType === INVENTORY.alwaysAvailable) {
                        $scope.quantityAvailable = result[0].quantityAvailable;
                    }
                }
                $log.debug('quantityAvailable:' + result[0].quantityAvailable);
            }

            /**
             * Set the similar product list
             * @param  {object} result similarproductobject
             * @return {void}
             */
            function similarProductSuccess(result) {
                // var length = result.products.length;
                var products = [],
                    similarProductList = [];

                if (Array.isArray(result)) {
                    products = result;
                } else {
                    $log.debug('Root category tree structure');
                    products = Utility.grabProducts(result, products);
                }

                angular.forEach(products, function (product) {
                    if (product.id !== parseInt(($scope.productId), 10) && similarProductList.length < 3) {
                        similarProductList.push(product);
                    }
                });

                Utility.checkImages(similarProductList);
                $scope.uiData.similarProduct = similarProductList;
                $scope.uiData.similarProductLength = $scope.uiData.similarProduct.length;
            }
        }

        // Failure
        function failure() {
            $log.debug('Failure');
        }


        function productOptionSelected(prodOption, selectedVal) {
            $scope.addToCartFailedMsg = "";
            if(prodOption.attributeName.toLowerCase() === "productoption.size"){
                $scope.adjustedPrice = parseFloat($scope.uiData.salePrice.amount) + parseFloat(selectedVal.priceAdjustment.amount);
            }
        }
        /**
         * Checking the Cash on delivery pincodes if available or not
         * @param  {integer} pincode pincode
         * @return {void}
         */
        function checkProductCashOnDeliveryPincode(pincode) {
            var flag = true;
            pincode = parseInt(pincode, 10);
            angular.forEach($scope.uiData.productCashOnDeliveryPincode, function (cashOnDeliveryPincode) {
                if (flag) {
                    if (pincode === cashOnDeliveryPincode.productCashOnDeliveryPincode) {
                        $scope.pincodeAvailablity = 1;
                        $scope.availablePincode = cashOnDeliveryPincode.productCashOnDeliveryPincode;
                        flag = false;
                    } else {
                        $scope.pincodeAvailablity = 0;
                        $scope.availablePincode = pincode;
                    }
                }
            });
        }

        /**
         * Add product to cart
         * @param {integer} productId
         */
        $scope.activeProductColor = function () {
            $(".by_productDetail_optionColor_size").click(function () {
                $(".by_productDetail_optionColor_size").css('border-color', 'transparent');
                $(".by_productDetail_optionColor_size").css('opacity', '1');
                $(this).css('border-color', 'green');
                $(this).css('opacity', '0.5');
                $scope.selectedColor = $(this).attr("data-color");

            });
        };

        $scope.activeProductSize = function () {
            $(".by_productDetail_optionSize_size").click(function () {
                $(".by_productDetail_optionSize_size").css('border-color', '#ccc');
                $(this).css('border-color', 'green');
                $scope.selectedSize = $(this).attr("data-size");
            });
        }

        $scope.updateRequiredQuantity = function(val){
            $scope.userRequiredQuantity = val;
        }


        function checkLogisticAvailability(pincode){
            var checkLogistic = LogisticService.checkLogisticAvailability(pincode);
            if(checkLogistic){
                checkLogistic.then(logisticSuccessRes, logisticErrorRes);
            }

            function logisticSuccessRes(data){
                console.log("Logistic Available");
                if(data.data === "" || data.status === 240){
                    $scope.logisticInfo.cashOnDelivery = "NA";
                    $scope.logisticInfo.deliveryDetail = "NA";
                }else{
                    $scope.logisticInfo.cashOnDelivery = "eligible";
                    $scope.logisticInfo.deliveryDetail = "standard";
                }

            }

            function logisticErrorRes(data){
                console.log("Logistic Unavailable");
                $scope.logisticInfo.cashOnDelivery = "NA";
                $scope.logisticInfo.deliveryDetail = "NA";
            }
        }

        function addProductToCart(productId, nextLocation) {
            if($scope.logisticInfo && $scope.logisticInfo.deliveryDetail && $scope.logisticInfo.deliveryDetail==="standard"){
                $log.debug('Add product to cart');
                if ($scope.uiData.productOptions && $scope.uiData.productOptions.length > 0) {
                    for (var i = 0; i < $scope.uiData.productOptions.length; i++) {
                        if ($scope.selectedColor && $scope.uiData.productOptions[i].attributeName.toLowerCase() === "productoption.color") {
                            productOptions[$scope.uiData.productOptions[i].attributeName] = $scope.selectedColor;
                        }
                        else if ($scope.selectedSize && $scope.uiData.productOptions[i].attributeName.toLowerCase() === "productoption.size") {
                            productOptions[$scope.uiData.productOptions[i].attributeName] = $scope.selectedSize;
                        }
                    };
                }


                if ($scope.userRequiredQuantity >= 1 && $scope.inventoryType === INVENTORY.alwaysAvailable) {
                    Utility.checkCartAvailability(customerId, productId, $scope.userRequiredQuantity, productOptions, nextLocation);
                } else {
                    if ($scope.userRequiredQuantity >= 1 &&
                        $scope.userRequiredQuantity <= $scope.quantityAvailable) {
                        Utility.checkCartAvailability(customerId, productId, $scope.userRequiredQuantity, productOptions, nextLocation);
                    }
                }
            } else{
                if($scope.logisticInfo && !$scope.logisticInfo.deliveryDetail){
                    $scope.checkLogisticDetail = true;
                }
            }


            //$location.path('/cart/');
        }

        /**
         * Play Video modal on page
         * @param  {object} videoUrl videourl which contains source
         * @return {void}
         */
        function playVideo(videoUrl) {
            $scope.videoSource = videoUrl;
            $rootScope.modalInstance = $modal.open({
                templateUrl: TEMPLATE_URL.playVideo,
                controller: 'VideoModalController',
                resolve: {
                    videoSource: function () {
                        return $scope.videoSource;
                    }
                },
                backdrop: true,
                windowClass: 'videoModal'
            });
        }

        /**
         * Close template
         * @return {void}
         */
        function closeModelInstance() {
            $rootScope.modalInstance.dismiss();
        }

        $scope.$on('addToCartFailed', function (event, args) {
            $scope.addToCartFailedMsg = "Please select size/color";
        });

        $scope.$on('newItemAddedToCart', function (event, args) {
            $scope.productAddSuccess = true;
            $window.setTimeout(function(){
                $scope.productAddSuccess = false;
                $scope.$apply();
            }, 2000);

        });



        /**
         * Open productDescription page
         * @param  {integer} productId
         * @param  {object} categoryId
         * @param  {object} categoryName
         * @return {void}
         */
        function openProductDescription(productId, productName) {
            var prodName = productName.replace(/\s+/g, '-').toLowerCase(),
                path = '/' + prodName + PAGE_URL.productDescription + "/"+ productId;
            $location.path(path);
        }

        $scope.galleryClickHover = function () {
            $(".small-width").click(function () {
                var urlPopup = $(this).attr('src');
                $(".by_productMainImage").attr('src', urlPopup);
            });
        };

        $scope.slideIndex = 1;


        $scope.slideGallery = function (dir) {
            if ($scope.slideIndex < 1) {
                $scope.slideIndex = 1;
            }
            $scope.byimageGallery = $(".by-imageGallery").outerWidth() - 60;
            $scope.bygallerycontainer = $(".by-gallery-container").outerWidth();
            $scope.w = $scope.bygallerycontainer / $scope.byimageGallery;
            //alert($scope.w);
            if ($scope.slideIndex < $scope.w && dir === "r") {
                $('.by-gallery-container').css("-webkit-transform", "translate(-" + ($scope.byimageGallery) * ($scope.slideIndex) + "px, 0px)");
                $scope.slideIndex++;
            }
            if ($scope.slideIndex >= 0 && dir === "l") {
                $('.by-gallery-container').css("-webkit-transform", "translate(-" + ($scope.byimageGallery) * ($scope.slideIndex - 2) + "px, 0px)");
                $scope.slideIndex--;
            }

        };


    }

    ProductDescriptionController.$inject = ['$scope',
        '$rootScope',
        '$log',
        '$q',
        '$window',
        '$routeParams',
        '$modal',
        '$location',
        '$filter',
        '$timeout',
        'ProductDescriptionService',
        'CartService',
        'BreadcrumbService',
        'PAGE_URL',
        'INVENTORY',
        'SERVERURL_IMAGE',
        'MEDIATYPE',
        'STATIC_IMAGE',
        'TEMPLATE_URL',
        'Utility', 'LogisticService'];

    byProductApp.registerController('ProductDescriptionController', ProductDescriptionController);
    return ProductDescriptionController;
});
