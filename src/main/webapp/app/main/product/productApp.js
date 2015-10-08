define([
    'angular',
    'angularRoute',
    'byProductRoute',
    'byProductConfig',
    'byProductResources',
    'angularResource','angularInfiniteScroll',
    'angularGoogleLocation',  'angularCache','angularBootstrap', 'angularBusy', 'angularSanitize'
], function(angular, angularRoute, byProductRoute, byProductConfig, byProductResources, angularResource,
            angularInfiniteScroll, angularGoogleLocation, angularCache, angularBootstrap, angularBusy, angularSanitize) {

    var byProductApp = angular.module('byProductApp', ["ngRoute", "ngResource",
                                                        "byProductResources",
                                                        "infinite-scroll",
                                                        "jmdobry.angular-cache",
                                                        "ui.bootstrap", "cgBusy", "ngSanitize"
    ]);


    byProductApp.config(['$controllerProvider', function($controllerProvider){
        byProductApp.registerController = $controllerProvider.register;
    }]);

    byProductApp.config(byProductRoute);
    byProductConfig(byProductApp);

    byProductApp.filter('encodeUri', function encodeUri($window) {
        return function(value) {
            try {
                return $window.encodeURIComponent(JSON.stringify(value));
            } catch (e) {
                return $window.encodeURIComponent(value);
            }
        };
    });

    byProductApp.filter('handleInterpolate', function handleInterpolateFilter($window) {
        return function handleInterpolate(url) {
            return $sce.trustAsResourceUrl(url);
        };
    });

    return byProductApp;
});


