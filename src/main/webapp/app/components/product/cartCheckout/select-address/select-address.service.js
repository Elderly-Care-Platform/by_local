define([], function () {

    function SelectAddressFactory($rootScope, $location, $http, UserProfile, UserValidationFilter, SharedContextService, $q) {
        var addressFormat = {
            "firstName": "",
            "lastName": "",
            "phoneNumber": "",
            "email": "",
            "address": {
                "city": "", "country": "", "locality": "", "streetAddress": "", "zip": ""
            },
            "userId": ""
        }

        return {
            //getCustomerProfile: getCustomerProfile,
            getAddress: getAddress,
            updateAddress: updateAddress,
            addNewAddress: addNewAddress,
            getAddressFormat: getAddressFormat
            //updateProfile:updateProfile
        };


        function getAddressFormat() {
            var addressFormat = {
                "firstName": "",
                "lastName": "",
                "phoneNumber": "",
                "email": "",
                "address": {
                    "city": "", "country": "", "locality": "", "streetAddress": "", "zip": ""
                },
                "userId": ""
            }
            return addressFormat;
        }

        function getAddress(addressIdx) {
            var userSessionType = UserValidationFilter.getUserSessionType(),
                userId = localStorage.getItem("USER_ID"),
                deliveryMode = SharedContextService.getDeliveryMode(), deferred = $q.defer();

            if (userSessionType && userSessionType === BY.config.sessionType.SESSION_TYPE_FULL) {
                if (addressIdx) {
                    if (deliveryMode === 0) {
                        return $http.get(apiPrefix + 'api/v1/userAddress/' + userId + '?addressId=' + addressIdx).success(function (userAddress) {
                            deferred.resolve(userAddress);
                        }).error(function (error) {
                            var errorMsg = "address not found";
                            deferred.reject(errorMsg);
                        });
                    } else {
                        var pickupAddress = {data: {data: [SharedContextService.getPickupAddress(addressIdx)]}};
                        deferred.resolve(pickupAddress);
                    }

                } else {
                    return $http.get(apiPrefix + 'api/v1/userAddress/' + userId).success(function (userAddress) {
                        deferred.resolve(userAddress);
                    }).error(function (error) {
                        var errorMsg = "address not found";
                        deferred.reject(errorMsg);
                    });
                }
            } else {
                $("#preloader").hide();
                $rootScope.nextLocation = "/selectAddress"
                $location.path('/users/login');
            }
            return deferred.promise;
        }



    function updateAddress(params) {
        var userSessionType = UserValidationFilter.getUserSessionType();
        var userId = localStorage.getItem("USER_ID");
        if (userSessionType && userSessionType === BY.config.sessionType.SESSION_TYPE_FULL) {
            return $http.put(apiPrefix + 'api/v1/userAddress/' + userId, params.address);
        } else {
            $("#preloader").hide();
            $rootScope.nextLocation = "/selectAddress"
            $location.path('/users/login');
        }
    }

    function addNewAddress(params) {
        var userSessionType = UserValidationFilter.getUserSessionType();
        var userId = localStorage.getItem("USER_ID");
        if (userSessionType && userSessionType === BY.config.sessionType.SESSION_TYPE_FULL) {
            return $http.post(apiPrefix + 'api/v1/userAddress/' + userId, params.address);
        } else {
            $("#preloader").hide();
            $rootScope.nextLocation = "/selectAddress"
            $location.path('/users/login');
        }
    }


    //function getCustomerProfile() {
    //    var userId = localStorage.getItem("USER_ID");
    //    if(userId){
    //        return $http.get('api/v1/userProfile/'+userId);
    //    }else{
    //        $rootScope.nextLocation = "/selectAddress"
    //        $location.path('/users/login');
    //    }
    //}

    //function getProfile(){
    //    var userId = localStorage.getItem("USER_ID");
    //    var userProfile = UserProfile.get({userId: userId});
    //    return userProfile;
    //}


    //function updateProfile(params, data){
    //    var userId = localStorage.getItem("USER_ID");
    //    if(userId) {
    //        var userProfile = new UserProfile();
    //        angular.extend(userProfile, data.profile);
    //        if(userProfile.userId){
    //            return $http.put('api/v1/userProfile/'+userId, userProfile);
    //        }else{
    //            return $http.post('api/v1/userProfile', userProfile);
    //        }
    //
    //    }
    //
    //
    //    //userProfile.$update({userId: $scope.userId}, function (profileOld) {
    //    //    console.log("success");
    //    //    $scope.submitted = false;
    //    //    $scope.$parent.exit();
    //    //}, function (err) {
    //    //    console.log(err);
    //    //    $scope.$parent.exit();
    //    //});
    //}

}

return SelectAddressFactory;
})
;