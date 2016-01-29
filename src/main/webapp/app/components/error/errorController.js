define(['byApp'],
    function (byApp) {

        'use strict';

        function errorController($scope, $rootScope, $location, $route, $routeParams) {
            $("meta[name='robots']").attr("content", "noindex");
            $("meta[name='by-status-code']").attr("content","404");
        }
        errorController.$inject = ['$scope', '$rootScope', '$location', '$route', '$routeParams'];

        byApp.registerController('errorController', errorController);
        return errorController;

    });
