define([], function () {

    /* @ngInject */
    function SelectAddressFactory($rootScope, $location, $http, UserProfile) {


        return {
            getCustomerProfile: getCustomerProfile,
            getAddress:getAddress,
            updateAddress:updateAddress,
            addNewAddress:addNewAddress,
            updateProfile:updateProfile
        };

        //function getProfile(){
        //    var userId = localStorage.getItem("USER_ID");
        //    var userProfile = UserProfile.get({userId: userId});
        //    return userProfile;
        //}

        function getCustomerProfile() {
            var userId = localStorage.getItem("USER_ID");
            if(userId){
                return $http.get('api/v1/userProfile/'+userId);
            }else{
                $rootScope.nextLocation = "/selectAddress"
                $location.path('/users/login');
            }
        }

        function getAddress(addressIdx){
            var userId = localStorage.getItem("USER_ID");
            if(userId) {
                return $http.get('api/v1/userProfile/address/'+userId+'?addressIndex=' + addressIdx);
            }
        }

        function updateAddress(params, newAddress){
            var userId = localStorage.getItem("USER_ID");
            if(userId) {
                var addressIndex = params.addressIndex, address = newAddress.address;
                return $http.put('api/v1/userProfile/address/'+userId+'?addressIndex=' + addressIndex, address);
            }
        }

        function addNewAddress(newAddress){
            var userId = localStorage.getItem("USER_ID");
            if(userId) {
                //var address = newAddress;
                return $http.post('api/v1/userProfile/address/'+userId, newAddress);
            }
        }

        function updateProfile(params, data){
            var userId = localStorage.getItem("USER_ID");
            if(userId) {
                var userProfile = new UserProfile();
                angular.extend(userProfile, data.profile);
                if(userProfile.userId){
                    return $http.put('api/v1/userProfile/'+userId, userProfile);
                }else{
                    return $http.post('api/v1/userProfile', userProfile);
                }

            }


            //userProfile.$update({userId: $scope.userId}, function (profileOld) {
            //    console.log("success");
            //    $scope.submitted = false;
            //    $scope.$parent.exit();
            //}, function (err) {
            //    console.log(err);
            //    $scope.$parent.exit();
            //});
        }

    }

    return SelectAddressFactory;
});