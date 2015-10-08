/**
 * Created by sanjukta on 02-07-2015.
 */
define(['angular', 'DelegatorFactory', 'urlTemplateFactory', 'CachedRequestFactory',
        'ProductServiceFactory', 'ErrorStoreFactory', 'urlUtilsFactory', 'CategoryServiceFactory',
        'CartServiceFactory', 'BreadcrumbServiceFactory', 'GlobalServiceFactory', 'UtilFactory',
    'ProductDescFactory', 'stateParamValidatorFactory'],

    function (angular, DelegatorFactory, urlTemplateFactory, CachedRequestFactory,
              ProductServiceFactory, ErrorStoreFactory, urlUtilsFactory,
              CategoryServiceFactory, CartServiceFactory, BreadcrumbServiceFactory, GlobalServiceFactory,
              UtilFactory, ProductDescFactory, stateParamValidatorFactory) {

    var byProductResources = angular.module('byProductResources', ['ngResource']);

    var productService = byProductResources.factory('ProductService', ProductServiceFactory);

    var CachedRequestHandler = byProductResources.factory('CachedRequestHandler', CachedRequestFactory);

    var ErrorStore = byProductResources.factory('ErrorStore', ErrorStoreFactory);

    var DelegatorService = byProductResources.factory('DelegatorService', DelegatorFactory);

    var urlTemplate = byProductResources.factory('urlTemplate', urlTemplateFactory);

    var URLUtils = byProductResources.factory('URLUtils', urlUtilsFactory);

    var CategoryService = byProductResources.factory('CategoryService', CategoryServiceFactory);

    var CartService = byProductResources.factory('CartService', CartServiceFactory);

    var BreadcrumbService = byProductResources.factory('BreadcrumbService', BreadcrumbServiceFactory);

    var Global = byProductResources.factory('Global', GlobalServiceFactory);

    var Utility = byProductResources.factory('Utility', UtilFactory);

    var ProductDescriptionService = byProductResources.factory('ProductDescriptionService', ProductDescFactory);

    var StateParamsValidator = byProductResources.factory('StateParamsValidator', stateParamValidatorFactory);

    var apiCache = byProductResources.factory('apiCache', function($angularCacheFactory,
                                                                                paramCache,
                                                                                DelegatorService,
                                                                                APPLICATION){

        var apiCache;
        var cacheName    = APPLICATION.cache;
        var cacheOptions = {onExpire: onExpire};

        apiCache = $angularCacheFactory.get(cacheName);
        apiCache = apiCache || $angularCacheFactory(cacheName, cacheOptions);

        return apiCache;

        function onExpire(key) {
            DelegatorService.get(key, paramCache.get(key), true);
        }

    });

    var paramCache = byProductResources.factory('paramCache', function($angularCacheFactory, APPLICATION){
        var paramCache;
        var cacheName    = APPLICATION.paramCache;
        var cacheOptions = {
            maxAge:      25000, // expired items in 25  seconds
            recycleFreq: 10000
        };

        paramCache = $angularCacheFactory.get(cacheName);
        paramCache = paramCache || $angularCacheFactory(cacheName, cacheOptions);

        return paramCache;
    });

    return byProductResources;
});
