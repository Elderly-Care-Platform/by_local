define([], function () {
    function config($routeProvider) {
        $routeProvider
            .when('/products/:menuId', {
                templateUrl: 'app/components/product/product-listing/products.html?versionTimeStamp=%PROJECT_VERSION%',
                controller: 'ProductsController',
                resolve: {
                    load: ['$q', function ($q) {
                        var defered = $q.defer();
                        require(['productController', 'productMenuCtrl'], function (productController, productMenuCtrl) {
                            defered.resolve();
                        });
                        return defered.promise;
                    }],
                    byMenu: ['$route', '$rootScope', '$q', function ($route, $rootScope, $q) {
                        var defered = $q.defer();
                        if($rootScope.menuCategoryMap[$route.current.params.menuId]){
                            defered.resolve();
                        }else{
                            defered.reject();
                        }
                        return defered.promise;
                    }]
                }
            })

            .when('/shop/:menuId', {
                templateUrl: 'app/components/product/product-listing/products.html?versionTimeStamp=%PROJECT_VERSION%',
                controller: 'ProductsController',
                resolve: {
                    load: ['$q', function ($q) {
                        var defered = $q.defer();
                        require(['productController', 'productMenuCtrl'], function (productController, productMenuCtrl) {
                            defered.resolve();
                        });
                        return defered.promise;
                    }],
                    byMenu: ['$route', '$rootScope', '$q', function ($route, $rootScope, $q) {
                        var defered = $q.defer();
                        if($rootScope.menuCategoryMap[$route.current.params.menuId]){
                            defered.resolve();
                        }else{
                            defered.reject();
                        }
                        return defered.promise;
                    }]
                }
            })

            .when('/products/:productSlug/:menuId', {
                templateUrl: 'app/components/product/product-listing/products.html?versionTimeStamp=%PROJECT_VERSION%',
                controller: 'ProductsController',
                resolve: {
                    load: ['$q', function ($q) {
                        var defered = $q.defer();
                        require(['productController', 'productMenuCtrl'], function (productController, productMenuCtrl) {
                            defered.resolve();
                        });
                        return defered.promise;
                    }],
                    byMenu: ['$route', '$rootScope', '$q', function ($route, $rootScope, $q) {
                        var defered = $q.defer();
                        if($rootScope.menuCategoryMap[$route.current.params.menuId]){
                            defered.resolve();
                        }else{
                            defered.reject();
                        }
                        return defered.promise;
                    }]
                }
            })

            .when('/shop/:productSlug/:menuId', {
                templateUrl: 'app/components/product/product-listing/products.html?versionTimeStamp=%PROJECT_VERSION%',
                controller: 'ProductsController',
                resolve: {
                    load: ['$q', function ($q) {
                        var defered = $q.defer();
                        require(['productController', 'productMenuCtrl'], function (productController, productMenuCtrl) {
                            defered.resolve();
                        });
                        return defered.promise;
                    }],
                    byMenu: ['$route', '$rootScope', '$q', function ($route, $rootScope, $q) {
                        var defered = $q.defer();
                        if($rootScope.menuCategoryMap[$route.current.params.menuId]){
                            defered.resolve();
                        }else{
                            defered.reject();
                        }
                        return defered.promise;
                    }]
                }
            })
            //.when('/products/:menuId/all', {
            //    templateUrl: 'app/components/product/product-listing/products.html?versionTimeStamp=%PROJECT_VERSION%',
            //    controller: 'ProductsController',
            //    resolve: {
            //        load: ['$q', function ($q) {
            //            var defered = $q.defer();
            //            require(['productController', 'productMenuCtrl'], function (productController, productMenuCtrl) {
            //                defered.resolve();
            //            });
            //            return defered.promise;
            //        }]
            //    }
            //})
            .when('/products/reviews/:menuId', {
                templateUrl: 'app/components/product/product-listing/products.html?versionTimeStamp=%PROJECT_VERSION%',
                controller: 'ProductsController',
                resolve: {
                    load: ['$q', function ($q) {
                        var defered = $q.defer();
                        require(['productController', 'productMenuCtrl', 'editorController'], function (productController, productMenuCtrl, editorController) {
                            defered.resolve();
                        });
                        return defered.promise;
                    }],
                    byMenu: ['$route', '$rootScope', '$q', function ($route, $rootScope, $q) {
                        var defered = $q.defer();
                        if($rootScope.menuCategoryMap[$route.current.params.menuId]){
                            defered.resolve();
                        }else{
                            defered.reject();
                        }
                        return defered.promise;
                    }]
                }
            })

            .when('/shop/reviews/:menuId', {
                templateUrl: 'app/components/product/product-listing/products.html?versionTimeStamp=%PROJECT_VERSION%',
                controller: 'ProductsController',
                resolve: {
                    load: ['$q', function ($q) {
                        var defered = $q.defer();
                        require(['productController', 'productMenuCtrl', 'editorController'], function (productController, productMenuCtrl, editorController) {
                            defered.resolve();
                        });
                        return defered.promise;
                    }],
                    byMenu: ['$route', '$rootScope', '$q', function ($route, $rootScope, $q) {
                        var defered = $q.defer();
                        if($rootScope.menuCategoryMap[$route.current.params.menuId]){
                            defered.resolve();
                        }else{
                            defered.reject();
                        }
                        return defered.promise;
                    }]
                }
            })

            .when('/:productSlug/pd/:productId', {
                templateUrl: 'app/components/product/productDescription/product-desc.html?versionTimeStamp=%PROJECT_VERSION%',
                controller: 'ProductDescriptionController',
                resolve: {
                    load: ['$q', function ($q) {
                        var defered = $q.defer();
                        require(['productDescCtrl', 'videoModalController'], function (productDescCtrl, videoModalController) {
                            defered.resolve();
                        });
                        return defered.promise;
                    }]
                }
            })

            .when('/cart', {templateUrl: 'app/components/product/cart/cart.html?versionTimeStamp=%PROJECT_VERSION%',
                controller: 'CartController',
                resolve: {
                    load: ['$q', function ($q) {
                        var defered = $q.defer();
                        require(['cartController'], function (cartController) {
                            defered.resolve();
                        });
                        return defered.promise;
                    }]
                }
            })

            .when('/selectAddress', {templateUrl: 'app/components/product/cartCheckout/select-address/select-address.html?versionTimeStamp=%PROJECT_VERSION%',
                controller: 'SelectAddressController',
                resolve: {
                    load: ['$q', function ($q) {
                        var defered = $q.defer();
                        require(['selectAddressController'], function (ctrl) {
                            defered.resolve();
                        });
                        return defered.promise;
                    }]
                }
            })

            .when('/addAddress/', {templateUrl: 'app/components/product/cartCheckout/add-address/add-address.html?versionTimeStamp=%PROJECT_VERSION%',
                controller: 'AddAddressController',
                resolve: {
                    load: ['$q', function ($q) {
                        var defered = $q.defer();
                        require(['addAddressController'], function (ctrl) {
                            defered.resolve();
                        });
                        return defered.promise;
                    }]
                }
            })

            .when('/editAddress/:id', {templateUrl: 'app/components/product/cartCheckout/edit-address/edit-address.html?versionTimeStamp=%PROJECT_VERSION%',
                controller: 'EditAddressController',
                resolve: {
                    load: ['$q', function ($q) {
                        var defered = $q.defer();
                        require(['editAddressController'], function (ctrl) {
                            defered.resolve();
                        });
                        return defered.promise;
                    }]
                }
            })

            .when('/paymentGatway/:addressId', {templateUrl: 'app/components/product/cartCheckout/payment-gateway/payment-gateway.html?versionTimeStamp=%PROJECT_VERSION%',
                controller: 'PaymentGatewayController',
                resolve: {
                    load: ['$q', function ($q) {
                        var defered = $q.defer();
                        require(['paymentGatewayController'], function (ctrl) {
                            defered.resolve();
                        });
                        return defered.promise;
                    }]
                }
            })

            .when('/paymentFailure/:addressId', {templateUrl: 'app/components/product/cartCheckout/payment-gateway/payment-failure.html?versionTimeStamp=%PROJECT_VERSION%',
                controller: 'PaymentGatewayController',
                resolve: {
                    load: ['$q', function ($q) {
                        var defered = $q.defer();
                        require(['paymentGatewayController'], function (ctrl) {
                            defered.resolve();
                        });
                        return defered.promise;
                    }]
                }
            })

            .when('/shoppingConfirmation/:addressId/:gateway', {templateUrl: 'app/components/product/cartCheckout/shopping-confirmation/shopping-confirmation.html?versionTimeStamp=%PROJECT_VERSION%',
                controller: 'ShoppingConfirmationCtrl',
                resolve: {
                    load: ['$q', function ($q) {
                        var defered = $q.defer();
                        require(['shoppingConfirmationCtrl'], function (ctrl) {
                            defered.resolve();
                        });
                        return defered.promise;
                    }]
                }
            })

            .otherwise({
                redirectTo: '/pageNotFound'
            });

            //.when('/orderFeedback', {templateUrl: 'app/components/product/cartCheckout/select-address/select-address.html?versionTimeStamp=%PROJECT_VERSION%',
            //    controller: 'AddAddressController',
            //    resolve: {
            //        load: ['$q', function ($q) {
            //            var defered = $q.defer();
            //            require(['addAddressController'], function (ctrl) {
            //                defered.resolve();
            //            });
            //            return defered.promise;
            //        }]
            //    }
            //})
            //
            //.when('/orderHistory', {templateUrl: 'app/components/product/cartCheckout/select-address/select-address.html?versionTimeStamp=%PROJECT_VERSION%',
            //    controller: 'AddAddressController',
            //    resolve: {
            //        load: ['$q', function ($q) {
            //            var defered = $q.defer();
            //            require(['addAddressController'], function (ctrl) {
            //                defered.resolve();
            //            });
            //            return defered.promise;
            //        }]
            //    }
            //})
    }

    config.$inject = ['$routeProvider'];
    return config;
});

