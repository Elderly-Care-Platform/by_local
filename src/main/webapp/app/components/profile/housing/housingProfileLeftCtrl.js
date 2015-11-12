/**
 * Created by sanjukta on 25-06-2015.
 */
define(['byApp', 'byUtil'], function(byApp, byUtil) {
    function housingProfileLeftCtrl($scope, $rootScope, $routeParams, broadCastData, $http){
        $scope.otherBranches = null;
        $scope.relatedFacilities = null;

        $scope.$on('handleBroadcast', function() {
            $scope.facilityData = broadCastData.newData;
            $http.get('api/v1/housing/getRelated?id=' + $scope.facilityData.id).success(function(response){
                if(Object.keys(response.data).length > 0){
                    $scope.relatedFacilities = response.data;
                    $scope.otherBranches = $scope.relatedFacilities[$scope.facilityData.primaryAddress.city];
                    if($scope.otherBranches && $scope.otherBranches.length <= 1){
                        $scope.otherBranches = null;
                    }

                    /* if(Object.keys($scope.relatedFacilities).length <=1){
                     $scope.relatedFacilities = null;
                     }*/
                }
            }).error(function(errorResponse){
                console.log(errorResponse);
            });
        });
    }

    housingProfileLeftCtrl.$inject = ['$scope', '$rootScope', '$routeParams','broadCastData','$http'];
    byApp.registerController('housingProfileLeftCtrl', housingProfileLeftCtrl);
    return housingProfileLeftCtrl;
});
