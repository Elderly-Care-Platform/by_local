define([],function(){
    function config($routeProvider) {
        $routeProvider
            .when('/products/list/:slug/:menuId/all', {templateUrl: 'app/components/product/product-listing/products.html?versionTimeStamp=%PROJECT_VERSION%', controller: 'ProductsController',
                resolve:{
                    load:['$q', function($q){
                        var defered = $q.defer();
                        require(['app/components/product/product-listing/productController.js'], function(){
                            defered.resolve();
                        });
                        return defered.promise;
                    }]
                }})

            .when('/productDescription/:productId',
                {templateUrl: 'app/components/product/productDescription/product-description.html?versionTimeStamp=%PROJECT_VERSION%',
                controller: 'ProductDescriptionController',
                resolve:{
                    load:['$q', function($q){
                        var defered = $q.defer();
                        require(['productDescCtrl','videoModalController'], function(productDescCtrl, videoModalController){
                            defered.resolve();
                        });
                        return defered.promise;
                    }]
                }})
    }

    config.$inject=['$routeProvider'];
    return config;
});

