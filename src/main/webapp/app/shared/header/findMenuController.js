/**
 * Created by sanjukta on 08-07-2015.
 */
byControllers.controller('FindMenuController', ['$scope', '$rootScope', '$http', '$location', '$routeParams','ServiceTypeList',
    function ($scope, $rootScope, $http, $location, $routeParams, ServiceTypeList) {
        $scope.ServiceTypeList = ServiceTypeList.get({}, function(){
            console.log($scope.ServiceTypeList);
        })


    }]);