define(['byProductApp'], function (byProductApp) {
    function AddAddressController($scope,
        $location,
        $log,
        $http,
        SelectAddressService,
        BreadcrumbService,
        PAGE_URL, SessionIdService) {

        $log.debug('Inside AddAddress Controller');
        var breadCrumb;
        $scope.address = {
            "city": "", "country": "", "locality": "",  "streetAddress": "", "zip": ""
        };

        $scope.googleLocationOptions = {
            country: "in",
            resetOnFocusOut: false
        };
        $scope.selectAddress = selectAddress;

        $scope.addressCallback = function (response) {
            $('#addressLocality').blur();
            $scope.address.city = "";
            $scope.address.locality = response.name;
            $scope.address.country = "";
            $scope.address.zip = "";

            for (var i = 0; i < response.address_components.length; i++) {
                if (response.address_components[i].types.length > 0) {
                    if (response.address_components[i].types[0] == "locality") {
                        $scope.address.city += response.address_components[i].long_name;
                    }

                    else if (response.address_components[i].types[0].indexOf("administrative_area_level_3") != -1) {
                        $scope.address.city = response.address_components[i].long_name;
                    }
                    else if (response.address_components[i].types[0] == "country") {
                        //this is the object you are looking for
                        $scope.address.country = response.address_components[i].long_name;
                    }
                    else if (response.address_components[i].types[0] == "postal_code") {
                        //this is the object you are looking for
                        $scope.address.zip = response.address_components[i].long_name;
                    }
                    else if (response.address_components[i].types.indexOf("sublocality") != -1 && response.address_components[i].types.indexOf("political") != -1) {
                        $scope.address.locality = response.address_components[i].long_name;
                    }
                }

            }
            $scope.address.streetAddress = response.formatted_address;
        }

        $scope.getLocationByPincode = function (element) {
            var element = document.getElementById("zipcode");
            $scope.address.city = "";
            $scope.address.locality = "";
            $scope.address.country = "";
            $http.get("api/v1/location/getLocationByPincode?pincode=" + $scope.address.zip)
                .success(function (response) {
                    if (response) {
                        $scope.address.city = response.districtname;
                        $scope.address.locality = response.officename;
                        $scope.address.streetAddress = response.officename + ", Distt: " + response.districtname + " , State: " + response.statename;
                        $scope.address.country = "India";
                    }
                });
        };

        //$scope.ADDRESS_FIELDS = ADDRESS_FIELDS;
        //$scope.secondaryMobile = false;
        //$scope.secondaryEmail = false;
        //$scope.toggleMobileField = toggleMobileField;
        //$scope.shipToAddress = shipToAddress;
        //$scope.customerId = null;
        //$scope.addAddress = addAddress;

        if (localStorage.getItem("by_cust_id")) {
            $scope.customerId = localStorage.getItem("by_cust_id");
        }else{
            $scope.customerId = null;
        }

        var getProfilePromise = SelectAddressService.getCustomerProfile();
        if(getProfilePromise){
            getProfilePromise.then(successCallBack, errorCallBack);
        }

        function successCallBack(result){
            var userAddress = [];
            $scope.userProfile = result.data.data;
            var userBasicProfile = result.data.data.basicProfileInfo;
        }

        function errorCallBack(){
            console.log('can\'t get the data');
        }
        /**
         * Make request for adding shipping address
         */
        $scope.saveAddress = function(addressForm) {
            $(".by_btn_submit").prop("disabled", true);
            $scope.submitted = true;
            if (addressForm.$invalid) {
                window.scrollTo(0, 0);
                $(".by_btn_submit").prop('disabled', false);
            } else {
                var params = {}, putData = {};
                $scope.userProfile.basicProfileInfo.otherAddresses.push($scope.address);
                putData.profile = $scope.userProfile;
                SelectAddressService.updateProfile(params, putData).
                    then(addressUpdateSuccess, addressUpdateError);
            }


            function addressUpdateSuccess(result) {
                $location.path('/selectAddress/');
            }

            function addressUpdateError(errorCode) {
                $log.info(errorCode);
            }
        }


        function selectAddress(){            
           $location.path('/selectAddress/');           
        }

    }

    AddAddressController.$inject = ['$scope',
        '$location',
        '$log',
        '$http',
        'SelectAddressService',
        'BreadcrumbService',
        'PAGE_URL', 'SessionIdService'];
    byProductApp.registerController('AddAddressController', AddAddressController);
    return AddAddressController;
});