/**
 * Created by sanjukta on 25-06-2015.
 */
define(['byApp', 'byUtil'], function(byApp, byUtil) {
    function instProfileLeftCtrl($scope, $routeParams, $location){

        $scope.institutionProfile   = $scope.$parent.profileData;
        $scope.branchId             = $routeParams.branchId ? $routeParams.branchId : null;
        $scope.allBranches        = [];
        $scope.selectedBranch = null;

        if($scope.institutionProfile.serviceBranches.length > 0){

            for (var i = 0; i < $scope.institutionProfile.serviceBranches.length; i++) {
                $scope.allBranches.push($scope.institutionProfile.serviceBranches[i]);

                if($scope.branchId && $scope.branchId  === $scope.institutionProfile.serviceBranches[i].id){
                    //var branchLocation = $scope.institutionProfile.serviceBranches[i].basicProfileInfo.primaryUserAddress.city;
                    //$scope.allBranches[branchLocation] = $scope.institutionProfile.serviceBranches[i]

                    $scope.selectedBranch = $scope.institutionProfile.serviceBranches[i];
                }
            }

        }

        
        $scope.setHrefInst = function(profile, queryParams){
            var newHref = getProfileDetailUrlBrnach(profile, queryParams, false);
            newHref = "#!" + newHref;
            return newHref;
        };

        function getProfileDetailUrlBrnach(profile, urlQueryParams, isAngularLocation){
            var proTitle = "others";
             if(profile && profile.basicProfileInfo.firstName && profile.basicProfileInfo.firstName.length > 0){
                 proTitle = profile.basicProfileInfo.firstName;
                 if(profile.individualInfo.lastName && profile.individualInfo.lastName != null && profile.individualInfo.lastName.length > 0){
                     proTitle = proTitle + " " + profile.individualInfo.lastName;
                 }
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

        /*$scope.setLocation = function ($event, url, queryParams) {
            $event.stopPropagation();
            if(Object.keys(queryParams).length > 0){
                angular.forEach(queryParams, function (value, key) {
                    $location.search(key, value);
                })
            }else{
                angular.forEach($location.search, function (value, key) {
                    $location.search(key, null);
                })
            }

            $location.path(url);
        }*/

        //$scope.$on('handleBroadcast', function() {
        //    $scope.facilityData = broadCastData.newData;
        //    $http.get('api/v1/housing/getRelated?id=' + $scope.facilityData.id).success(function(response){
        //        if(Object.keys(response.data).length > 0){
        //            $scope.relatedFacilities = response.data;
        //            $scope.otherBranches = $scope.relatedFacilities[$scope.facilityData.primaryAddress.city];
        //            if($scope.otherBranches && $scope.otherBranches.length <= 1){
        //                $scope.otherBranches = null;
        //            }
        //
        //        }
        //    }).error(function(errorResponse){
        //        console.log(errorResponse);
        //    });
        //});
    }

    instProfileLeftCtrl.$inject = ['$scope', '$routeParams', '$location'];
    byApp.registerController('instProfileLeftCtrl', instProfileLeftCtrl);
    return instProfileLeftCtrl;
});
