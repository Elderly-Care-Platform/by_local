define(['byApp', 'byUtil'], function(byApp, byUtil) {
    function LogoutController($rootScope, $scope,$location, $rootScope, $http, SessionIdService) {
        if($rootScope.sessionId != '') {
            $location.path("/users/login");
        }
        $http.get(apiPrefix + "api/v1/users/logout");
        $rootScope.sessionId = undefined;
        $rootScope.bc_discussType = '';
        $rootScope.bc_username = '';
        $rootScope.bc_userId = '';
        localStorage.removeItem("by_cust_id");
        //SessionIdService.setSessionId("");
        //BY.byUtil.inValidateSession();
        //$http.defaults.headers.common.sess = "";

        $location.path("/users/login");
        $rootScope.$broadcast('byUserLogout', '');

    }

    LogoutController.$inject = ['$rootScope', '$scope', '$location', '$rootScope' ,'$http','SessionIdService'];
    byApp.registerController('LogoutController', LogoutController);

    return LogoutController;
});
