/**
 * Created by sanjukta on 02-07-2015.
 */
define(['angular', 'DelegatorFactory', 'urlTemplateFactory', 'CachedRequestFactory',
        'ProductServiceFactory', 'ErrorStoreFactory', 'urlUtilsFactory', 'CategoryServiceFactory',
        'CartServiceFactory', 'BreadcrumbServiceFactory', 'GlobalServiceFactory', 'UtilFactory',
        'ProductDescFactory', 'stateParamValidatorFactory', 'CustomValidationFactory', 'AddAddressFactory', 'EditAddressFactory',
        'SelectAddressFactory', 'PaymentGatewayFactory', 'ShoppingConfirmationFactory', 'OrderHistoryFactory', 'LogisticServiceFactory'],

    function (angular, DelegatorFactory, urlTemplateFactory, CachedRequestFactory,
              ProductServiceFactory, ErrorStoreFactory, urlUtilsFactory,
              CategoryServiceFactory, CartServiceFactory, BreadcrumbServiceFactory, GlobalServiceFactory,
              UtilFactory, ProductDescFactory, stateParamValidatorFactory, CustomValidationFactory, AddAddressFactory,
              EditAddressFactory, SelectAddressFactory, PaymentGatewayFactory, ShoppingConfirmationFactory, OrderHistoryFactory,
              LogisticServiceFactory) {

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

        var CustomValidation = byProductResources.factory('CustomValidation', CustomValidationFactory);

        var AddAddressService = byProductResources.factory('AddAddressService', AddAddressFactory);

        var EditAddressService = byProductResources.factory('EditAddressService', EditAddressFactory);

        var PaymentGatewayService = byProductResources.factory('PaymentGatewayService', PaymentGatewayFactory);

        var SelectAddressService = byProductResources.factory('SelectAddressService', SelectAddressFactory);

        var ShoppingConfirmationService = byProductResources.factory('ShoppingConfirmationService', ShoppingConfirmationFactory);

        var OrderHistoryService = byProductResources.factory('OrderHistoryService', OrderHistoryFactory);

        var logisticService = byProductResources.factory('LogisticService', LogisticServiceFactory);

        var apiCache = byProductResources.factory('apiCache', function ($angularCacheFactory,
                                                                        paramCache,
                                                                        DelegatorService,
                                                                        APPLICATION) {

            var apiCache;
            var cacheName = APPLICATION.cache;
            var cacheOptions = {onExpire: onExpire};

            apiCache = $angularCacheFactory.get(cacheName);
            apiCache = apiCache || $angularCacheFactory(cacheName, cacheOptions);

            return apiCache;

            function onExpire(key) {
                DelegatorService.get(key, paramCache.get(key), true);
            }

        });

        var paramCache = byProductResources.factory('paramCache', function ($angularCacheFactory, APPLICATION) {
            var paramCache;
            var cacheName = APPLICATION.paramCache;
            var cacheOptions = {
                maxAge: 25000, // expired items in 25  seconds
                recycleFreq: 10000
            };

            paramCache = $angularCacheFactory.get(cacheName);
            paramCache = paramCache || $angularCacheFactory(cacheName, cacheOptions);

            return paramCache;
        });

        var CacheFunctions = byProductResources.factory('CacheFunctions', function ($log,
                                                                                    apiCache,
                                                                                    APPLICATION,
                                                                                    DelegatorService) {
            $log = $log.context('CacheFunctions');

            return {
                updateCache: updateCache,
                removeCache: removeCache
            };

            //Method for the updation(add new object to the cache data present) of the cache
            //based on the given user data
            //(i.e add the user given data to the cached copy)
            function updateCache(url, jsondata) {
                $log.debug('inside the updateCache() Method');
                DelegatorService.get(url).then(success, failure);
                function success(result) {
                    $log.debug(result);
                    //For original data
                    result.data.push(jsondata);
                    //remove the cache data
                    apiCache.remove(APPLICATION.host + url);
                    //Update the cache data to add the json data to the response
                    apiCache.put(APPLICATION.host + url, result);
                }

                function failure() {
                    $log.debug('failure in getting data from' + url);
                }
            }

            //Method for the updation(i.e delete the data from the cache) of the cache
            //based on the given user data
            //(i.e add the user given data to the cached copy)
            function removeCache(url, jsondata, successCallback, failureCallback) {
                $log.debug('inside the updateCache() Method');
                DelegatorService.get(url).then(success, failure);

                function success(result) {
                    $log.debug(result);
                    var newCacheData = {};
                    newCacheData.data = [];
                    //Get the data verified with the json array and remove from the json
                    //(i.e delete from the json)
                    angular.forEach(result.data, function (rawData) {
                        if (rawData !== jsondata) {
                            newCacheData.data.push(rawData);
                        }
                    });
                    //remove the cache data
                    apiCache.remove(APPLICATION.host + url);
                    //append the new cache data for this key
                    apiCache.put(APPLICATION.host + url, newCacheData);
                    if (successCallback) {
                        successCallback(apiCache.get(APPLICATION.host + url));
                    }
                }

                function failure() {
                    $log.debug('failure in getting data from' + url);
                    if (failureCallback) {
                        failureCallback();
                    }
                }
            }
        });

        return byProductResources;
    });
