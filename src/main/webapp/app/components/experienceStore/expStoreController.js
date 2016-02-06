define(['byApp', 'byUtil'], function(byApp, byUtil) {
    function expStoreCtrl($scope, $rootScope, $routeParams, $timeout, $location, $sce) {
        
       $scope.telNo = BY.config.constants.byContactNumber;
       window.scrollTo(0, 0);
       
    }

    expStoreCtrl.$inject = ['$scope', '$rootScope', '$routeParams', '$timeout', '$location', '$sce'];
    byApp.registerController('expStoreCtrl', expStoreCtrl);

    return expStoreCtrl;
});