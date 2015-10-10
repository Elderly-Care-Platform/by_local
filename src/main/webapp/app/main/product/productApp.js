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

    byProductApp.filter('dateSuffix', function($window) {
        var suffixes = ['th', 'st', 'nd', 'rd'];
        return function(input) {
            var dtfilter = $filter('date')(input, 'EEE.dd');
            var dtfiltermonth = $filter('date')(input, ' MMM');
            var dtfilteryr = $filter('date')(input, 'yy');
            var day = parseInt(dtfilter.slice(4,6));
            var relevantDigits = (day < 30) ? day % 20 : day % 30;
            var suffix = (relevantDigits <= 3) ? suffixes[relevantDigits] : suffixes[0];
            return dtfilter + suffix + dtfiltermonth + '\'' + dtfilteryr;
        };
    });

    return byProductApp;
});


