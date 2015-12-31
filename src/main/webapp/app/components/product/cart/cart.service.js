define([], function () {

    function CartServiceFactory(CachedRequestHandler,
                                APPLICATION,
                                REST_URL,
                                urlTemplate,
                                SERVERURL_IMAGE,
                                $q,
                                $log, $injector) {
        $log.debug('Inside CartService Service');

        var cartService, urls, userSessionType;
        urls = {
            forCartDetail: urlTemplate(REST_URL.getCartDetail + '?customerId=:customerId'),
            createCart: urlTemplate(REST_URL.getCartDetail + '?customerId=:customerId&:productOptions', {},
                {type: 'post'}),
            createCartForGuest: urlTemplate(REST_URL.getCartDetail, {}, {type: 'post'}),
            forAddProductToCart: urlTemplate(REST_URL.getCartDetail +
                '/:productId?customerId=:customerId:productOptions', {}, {type: 'post'}),
            forRemoveItemFromCart: urlTemplate(REST_URL.removeItemFromCart + '/:id', {}, {type: 'delete'}),
            loadImage: urlTemplate('/:image'),
            forPromoCodeApply: urlTemplate(REST_URL.offerApply +
                '?promoCode=:promoCode&customerId=:customerId', {}, {type: 'post'}),
            forRemovePromoCodes: urlTemplate(REST_URL.offersRemove + '?customerId=:customerId',
                {}, {type: 'delete'}),

            mergeGuestCart: urlTemplate(REST_URL.mergeCart + '?guestOrderId=:guestOrderId', {}, {type: 'post'})
        };

        cartService = angular.extend(
            {},
            CachedRequestHandler,
            {
                modelName: 'cart',
                baseURL: urls.base,
                urls: urls
            },
            {
                getCartDetail: getCartDetail,
                createCart: createCart,
                addProductToCart: addProductToCart,
                removeItemFromCart: removeItemFromCart,
                loadImage: loadImage,
                applyPromoCode: applyPromoCode,
                removePromoCodes: removePromoCodes,
                mergeCart:mergeCart
            }
        );

        return cartService;

        function getCartDetail(params) {
            var userSessionType = localStorage.getItem("SESSION_TYPE");
            if ((params && params.customerId) || (userSessionType && userSessionType === BY.config.sessionType.SESSION_TYPE_FULL)) {
                return this.$get(urls.forCartDetail(params));
            } else {
                return this.$get(urls.createCartForGuest());
            }
        }

        function createCart(params) {
            if (params.customerId) {
                return this.$post(urls.createCart(params), params);
            } else {
                return this.$post(urls.createCartForGuest(params));
            }
        }

        function addProductToCart(params) {
            return this.$post(urls.forAddProductToCart(params), params);
        }

        function removeItemFromCart(params) {
            return this.$remove(urls.forRemoveItemFromCart(params), params);
        }

        function loadImage(params) {
            return this.$get(SERVERURL_IMAGE.hostUrl + params.image);
        }

        function applyPromoCode(params) {
            return this.$post(urls.forPromoCodeApply(params), params);
        }

        function removePromoCodes(params) {
            return this.$remove(urls.forRemovePromoCodes(params), params);
        }

        function mergeCart(params){
            return this.$post(urls.mergeGuestCart(params), params);
        }
    }

    return CartServiceFactory;
});
