define([], function () {

    function UtilFactory($rootScope,
                         $log,
                         $window,
                         CartService,
                         $location,
                         ProductDescriptionService,
                         SERVERURL_IMAGE,
                         STATIC_IMAGE,
                         MEDIATYPE) {

        return {
            checkCartAvailability: checkCartAvailability,
            grabProducts: grabProducts,
            checkImages: checkImages,
            checkMediaType: checkMediaType,
            getImageExt: getImageExt,
            getVideoExt: getVideoExt
        };
        // Check whether cart is created for user or not
        function checkCartAvailability(customerId, productId, userRequiredQuantity, productOptionParam, nextLocation) {
            var nextLocation = nextLocation;
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

            // Success in getting cart
            function cartAvailabilitySuccess(result) {
                $log.debug('Success in getting cart' + result);
                var customerId = result.customer.id;
                // Add product to cart
                addToCart(productId, customerId, productOptionParam);
            }

            // Failure in getting cart for customer
            // Create a new cart for customer
            function cartAvailabilityFailure() {
                $log.debug('Failure in getting cart');
                // Create a new cart
                createCart(customerId);
            }

            // Create a new cart
            function createCart(customerId) {
                $log.debug('Create a new Cart');
                var params = {};
                params.customerId = customerId;
                CartService.createCart(params)
                    .then(createCartSuccess, failure);
            }

            function createCartSuccess(result) {
                $log.debug('Success in creating Cart' + result);
                customerId = result.customer.id;
                // Add product to cart
                addToCart(productId, customerId, productOptionParam);
            }

            function addToCart(productId, customerId, productOptionParam) {
                var params = {};
                params.productId = productId;
                params.customerId = customerId;
                var productOptionString = "";
                for (productOption in productOptionParam) {
                    productOptionString += "&" + productOption + "=" + encodeURIComponent(productOptionParam[productOption]);
                }
                if (productOptionString.length > 0) {
                    params["productOptions"] = productOptionString;
                }

                CartService.addProductToCart(params)
                    .then(addProductSuccess, failure);
            }

            function addProductSuccess(result) {
                $log.debug('Success in adding product to the cart' + result);
                var orderItemId;
                angular.forEach(result.orderItems, function (orderItem) {
                    if (orderItem.productId === parseInt(productId, 10)) {
                        orderItemId = orderItem.id;
                    }
                });
                var params = {};
                params.id = orderItemId;
                params.quantity = userRequiredQuantity;
                params.customerId = customerId;
                ProductDescriptionService.updateProductQuantity(params).
                    then(updateProductQuantitySuccess, failure);

            }

            function updateProductQuantitySuccess(result) {
                console.log('updateProductQuantitySuccess JSON Data: ' + JSON.stringify(result));
                //$window.location.reload();
                //CartService.updateCartDetail();
                $rootScope.$broadcast('newItemAddedToCart', '');
                if(nextLocation){
                    $location.path("/"+nextLocation);
                }

            }

            // Failure
            function failure(failError) {
                $log.debug('Failure');
                $rootScope.$broadcast('addToCartFailed', failError);
                //console.log(failError);
                //alert("Please select the color and size of the product");
            }
        }

        // Recursive function for getting all product of category having subcategories
        function grabProducts(result, productList) {
            if (result.subcategories) {
                var subCategories = result.subcategories;
                angular.forEach(subCategories, function (subCategory) {
                    grabProducts(subCategory, productList);
                });
            }
            if (result.products) {
                var products = result.products;
                angular.forEach(products, function (product) {
                    //$log.debug(product.name);
                    productList.push(product);
                });
            }
            return productList;
        }

        function checkImages(products) {
            if (Array.isArray(products)) {
                angular.forEach(products, function (product) {
                    checkImagesFromObject(product);
                });
            } else {
                checkImagesFromObject(products);
            }
        }

        function checkImagesFromObject(product) {
            if (product.primaryMedia) {
                var image = product.primaryMedia.url;
                var params = {};
                params.image = image;
                product.primaryMedia.url = SERVERURL_IMAGE.hostUrl + image;
                //CartService.loadImage(params).then(loadImageSuccess, loadImageFailure);
            } else {
                product.primaryMedia = {};
                product.primaryMedia.url = STATIC_IMAGE.imageNotAvailable;
            }
            function loadImageSuccess() {
                //$log.debug('success in getting image');
                product.primaryMedia.url = SERVERURL_IMAGE.hostUrl + image;
            }

            function loadImageFailure() {
                $log.debug('failure in getting image');
                product.primaryMedia.url = STATIC_IMAGE.imageNotAvailable;
            }
        }

        function checkMediaType(mediaItem) {
            var imageExtensions = getImageExt(),
                videoExtensions = getVideoExt();
            if (imageExtensions.test(mediaItem.url)) {
                mediaItem.type = MEDIATYPE.mediaTypeImage;
            } else if (videoExtensions.test(mediaItem.url)) {
                mediaItem.type = MEDIATYPE.mediaTypeVideo;
                mediaItem.poster = STATIC_IMAGE.videoPoster;
                mediaItem.extension = mediaItem.url.split('.').pop();
            } else {
                mediaItem.type = MEDIATYPE.mediaTypeNotSupported;
                mediaItem.poster = STATIC_IMAGE.unsupportedMedia;
            }
        }

        function getImageExt() {
            /*jslint maxlen: 1000*/
            return /(?:([^:/?#]+):)?(?:\/([^/?#]*))?([^?#]*\.(?:jpg|jpeg|jpe|bmp|gif|png))(?:\?([^#]*))?(?:#(.*))?/;
        }

        function getVideoExt() {
            return /(?:([^:/?#]+):)?(?:\/([^/?#]*))?([^?#]*\.(?:mp4|webm|ogg))(?:\?([^#]*))?(?:#(.*))?/;
        }
    }

    return UtilFactory;
});
