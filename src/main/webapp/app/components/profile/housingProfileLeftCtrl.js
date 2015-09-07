/**
 * Created by sanjukta on 25-06-2015.
 */
byControllers.controller('housingProfileLeftCtrl', ['$scope', '$rootScope', '$routeParams','broadCastData','$http',
    function ($scope, $rootScope, $routeParams, broadCastData, $http) {

        $scope.$on('handleBroadcast', function() {
            $scope.facilityData = broadCastData.newData;
            $http.get('api/v1/housing/getRelated?id=' + $scope.facilityData.id).success(function(response){
                $scope.relatedFacilities = response.data;
                $scope.otherBranches = $scope.relatedFacilities[$scope.facilityData.primaryAddress.city];


                console.log($scope.relatedFacilities);
                console.log($scope.otherBranches);

            }).error(function(errorResponse){
                console.log(errorResponse);
            });
        });


    }]);