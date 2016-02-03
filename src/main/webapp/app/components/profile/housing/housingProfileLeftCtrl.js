/**
 * Created by sanjukta on 25-06-2015.
 */
define(['byApp', 'byUtil'], function(byApp, byUtil) {
    function housingProfileLeftCtrl($scope, $rootScope, $routeParams, $location, broadCastData, $http){
        $scope.otherBranches = null;
        $scope.relatedFacilities = null;

        $scope.$on('handleBroadcast', function() {
            $scope.facilityData = broadCastData.newData;
            $http.get(apiPrefix + 'api/v1/housing/getRelated?id=' + $scope.facilityData.id).success(function(response){
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

        $scope.setHrefInst = function(profile, queryParams){
            var newHref = getProfileDetailUrlBrnach(profile, queryParams, false);
            newHref = "#!" + newHref;
            return newHref;
        };

        function getProfileDetailUrlBrnach(profile, urlQueryParams, isAngularLocation){
            var proTitle = "others";
            if(profile && profile.name && profile.name.length > 0){
               proTitle = profile.name;
           }else{
               proTitle = "others";
           }

           proTitle = BY.byUtil.getSlug(proTitle);
           var newHref = "/users/"+proTitle;


           if(urlQueryParams && Object.keys(urlQueryParams).length > 0){
                //Set query params through angular location search method
                if(isAngularLocation){
                    angular.forEach($location.search(), function (value, key) {
                        $location.search(key, null);
                    });
                    angular.forEach(urlQueryParams, function (value, key) {
                        $location.search(key, value);
                    });
                } else{ //Set query params manually
                    newHref = newHref + "?"

                    angular.forEach(urlQueryParams, function (value, key) {
                        newHref = newHref + key + "=" + value + "&";
                    });

                    //remove the last  '&' symbol from the url, otherwise browser back does not work
                    newHref = newHref.substr(0, newHref.length - 1);
                }
            }

            return newHref;
        };

        
    }

    housingProfileLeftCtrl.$inject = ['$scope', '$rootScope', '$routeParams', '$location', 'broadCastData','$http'];
    byApp.registerController('housingProfileLeftCtrl', housingProfileLeftCtrl);
    return housingProfileLeftCtrl;
});
