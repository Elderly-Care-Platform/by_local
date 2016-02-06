define(['byApp', 'byUtil'], function(byApp, byUtil) {
    function expStoreCtrl($scope, $rootScope, $routeParams, $timeout, $location, $sce) {
        
       $scope.telNo = BY.config.constants.byContactNumber;
       
    }

    expStoreCtrl.$inject = ['$scope', '$rootScope', '$routeParams', '$timeout', '$location', '$sce'];
    byApp.registerController('expStoreCtrl', expStoreCtrl);

    return expStoreCtrl;
});