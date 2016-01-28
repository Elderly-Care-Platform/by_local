define(['byApp'],
    function (byApp) {

        'use strict';

        function errorController($scope, $rootScope, $location, $route, $routeParams) {
            $("meta[name='robots']").attr("content", "noindex, nofollow");
        }
        errorController.$inject = ['$scope', '$rootScope', '$location', '$route', '$routeParams'];

        byApp.registerController('errorController', errorController);
        return errorController;

    });
