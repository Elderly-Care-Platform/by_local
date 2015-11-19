define(['byApp', 'byUtil'], function(byApp, byUtil) {
    function LogoutController($rootScope, $scope,$location, $rootScope, $http, SessionIdService) {
        $http.get(apiPrefix + "api/v1/users/logout");
        localStorage.removeItem("by_cust_id");
        $location.path("/users/login");
        $rootScope.$broadcast('byUserLogout', '');
    }

    LogoutController.$inject = ['$rootScope', '$scope', '$location', '$rootScope' ,'$http','SessionIdService'];
    byApp.registerController('LogoutController', LogoutController);

    return LogoutController;
});
