define([], function () {
    function BYProductConfig(byapp) {
        byapp.constant('APPLICATION', {
            host: BY.config.constants.productHost,
            cache: 'byCache',
            paramCache: 'byParamCache',
            pageSize: 100000
        })
            .constant('SERVERURL_IMAGE', {
                hostUrl: BY.config.constants.productImageHost,
                forwardslash: '/'
            })
            .constant('SERVERURL', {
                hostUrl: BY.config.constants.selfHost,
                siteName: '/#!',
                forwardslash: '/'
            })
            .constant('REST_URL', {
                search: '/catalog/search/products',
                getProductById: '/catalog/product',
                getProductList: '/catalog/products',
                getFeaturedProductList: '/catalog/products/featured',
                getProductSku: '/skus',
                getProductSkuInventory: '/catalog/sku/inventory',
                getProductListByCategory: '/catalog/search/category',
                getCartDetail: '/cart',
                updateProductQuantity: '/cart/items',
                getSkuInventory: '/catalog/sku/inventory',
                removeItemFromCart: '/cart/items',
                getAddress: '/address',
                allCategories: '/catalog/categories',
                rootCategories: '/catalog/categories/root',
                subCategories: 'catalog/category',
                editAddress: '/address/edit',
                addAddress: '/address/add',
                getAddressById: '/address/get',
                offerApply: '/cart/offer',
                offersRemove: '/cart/offers',
                getOrder: '/orders',
                makePayment: '/cart/checkout/payment',
                checkout: '/cart/checkout',
                fedexRateWebService: '/fedex/rate',
                orderFeedback: '/orders/feedback',
                mergeCart: '/cart/merge',
                getCustomerProfile: '/userProfile/',
                orderSummary: '/cart/checkout/getOrderSummary/'
            })
            .constant('PAGE_URL', {
                root: '/products',
                productDescription: '/pd',
                cart: '/cart',
                selectAddress: '/selectAddress',
                addAddress: '/addAddress',
                editAddress: '/editAddress/',
                paymentGateway: '/paymentGatway/',
                orderHistory: '/orderHistory',
                shoppingConfirmation: '/shoppingConfirmation',
                paymentFailure: '/paymentFailure',
                orderFeedback: '/orderFeedback'
            })
            .constant('TEMPLATE_URL', {
                productList: 'app/productList/products.html',
                productDescription: 'app/productDescription/product-description.html',
                cart: 'app/cart/cart.html',
                selectAddress: 'app/cartCheckout/select-address/select-address.html',
                addAddress: 'app/cartCheckout/add-address/add-address.html',
                editAddress: 'app/cartCheckout/edit-address/edit-address.html',
                paymentGateway: 'app/cartCheckout/payment-gateway/payment-gateway.html',
                playVideo: 'app/productDescription/playVideo.html',
                orderHistory: 'app/orderHistory/order-history.html',
                shoppingConfirmation: 'app/cartCheckout/shopping-confirmation/shopping-confirmation.html',
                paymentFailure: 'app/cartCheckout/payment-gateway/payment-failure.html',
                orderFeedback: 'app/orderHistory/order-feedback.html'
            })
            .constant('INVENTORY', {
                inventoryType: 'inventoryType',
                alwaysAvailable: 'ALWAYS_AVAILABLE'
            })
            .constant('STATIC_IMAGE', {
                //imageNotAvailable: 'assets/images/noImageAvailable.jpg',
                //videoPoster: 'assets/images/video-play.png',
                //unsupportedMedia: 'assets/images/unsupported.png',
                //videoImage: 'assets/images/play-video.png'
            })
            .constant('MEDIATYPE', {
                mediaTypeImage: 'image',
                mediaTypeVideo: 'video',
                mediaTypeNotSupported: 'notSupportedMedia'
            })
            .constant('ADDRESS_FIELDS', {
                firstName: 'First name',
                lastName: 'Last name',
                addressLine1: 'Address line 1',
                addressLine2: 'Address line 2',
                city: 'City',
                postalCode: 'Zip code',
                phoneNumber: 'Mobile number',
                emailId: 'E-mail ID'
            })
            .constant('DISCOUNT_TYPE', {
                amountOff: 'AMOUNT_OFF',
                fixedPrice: 'FIXED_PRICE',
                percentOff: 'PERCENT_OFF'
            })
            .constant('ORDER_HISTORY_TYPE', {
                pastSixMonths: 'Past 6 months',
                pastThirtyDays: 'Past 30 Days',
                all: 'All'
            })
            .constant('PAGINATION', {
                pageSize: 18
            })
            .constant('CONSTANT', {
                products: 'products'
            })
            .constant('META_TAGS', {
                title: "elder care products",
                keywords: "Elder care products, senior care products, products for elders, products for elders in bangalore, products for elders in India, " +
                "elderly care products, products for seniors, products for senior citizens"
            });
    }

    return BYProductConfig;
});
