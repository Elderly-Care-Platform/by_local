define(['byProductApp'], function (byProductApp) {
    function AddAddressController($scope,
                                  $location,
                                  $log,
                                  $http,
                                  SelectAddressService) {

        $log.debug('Inside AddAddress Controller');
        $scope.address = null;
        $scope.googleLocationOptions = {
            country: "in",
            resetOnFocusOut: false
        };
        $scope.selectAddress = selectAddress;
        $scope.saveAddress = saveAddress;
        $scope.addressCallback = addressCallback;
        $scope.getLocationByPincode = getLocationByPincode;
        var initialize = init();

        function init() {
            if (localStorage.getItem("by_cust_id")) {
                $scope.customerId = localStorage.getItem("by_cust_id");
            } else {
                $scope.customerId = null;
            }

            $scope.address = SelectAddressService.getAddressFormat();
        };

        function saveAddress(addressForm) {
            $(".by_btn_submit").prop("disabled", true);
            $scope.submitted = true;
            if (addressForm.$invalid) {
                window.scrollTo(0, 0);
                $(".by_btn_submit").prop('disabled', false);
            } else {
                var params = {};
                params.address = $scope.address;
                SelectAddressService.addNewAddress(params).then(addressUpdateSuccess, addressUpdateError);
            }


            function addressUpdateSuccess(result) {
                $location.path('/selectAddress/');
            }

            function addressUpdateError(errorCode) {
                $log.info(errorCode);
            }
        };


        function selectAddress() {
            $location.path('/selectAddress/');
        };

        function addressCallback(response) {
            $('#addressLocality').blur();
            $scope.address.address.city = "";
            $scope.address.address.locality = response.name;
            $scope.address.address.country = "";
            $scope.address.address.zip = "";
            $scope.address.address.streetAddress = "";

            for (var i = 0; i < response.address_components.length; i++) {
                if (response.address_components[i].types.length > 0) {
                    if (response.address_components[i].types[0] == "locality") {
                        $scope.address.address.city += response.address_components[i].long_name;
                    }

                    else if (response.address_components[i].types[0].indexOf("administrative_area_level_3") != -1) {
                        $scope.address.address.city = response.address_components[i].long_name;
                    }
                    else if (response.address_components[i].types[0] == "country") {
                        //this is the object you are looking for
                        $scope.address.address.country = response.address_components[i].long_name;
                    }
                    else if (response.address_components[i].types[0] == "postal_code") {
                        //this is the object you are looking for
                        $scope.address.address.zip = response.address_components[i].long_name;
                    }
                    else if (response.address_components[i].types.indexOf("sublocality") != -1 && response.address_components[i].types.indexOf("political") != -1) {
                        $scope.address.address.locality = response.address_components[i].long_name;
                    }
                }

            }
            $scope.address.address.streetAddress = response.formatted_address;
        };

        function getLocationByPincode() {
            $scope.address.address.city = "";
            $scope.address.address.locality = "";
            $scope.address.address.country = "";
            $scope.address.address.streetAddress = "";

            $http.get("api/v1/location/getLocationByPincode?pincode=" + $scope.address.address.zip)
                .success(function (response) {
                    if (response) {
                        $scope.address.address.city = response.districtname;
                        $scope.address.address.locality = response.officename;
                        $scope.address.address.streetAddress = response.officename + ", Distt: " + response.districtname + " , State: " + response.statename;
                        $scope.address.address.country = "India";
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


        //function successCallBack(result){
        //    var userAddress = [];
        //    $scope.userProfile = result.data.data;
        //    var userBasicProfile = result.data.data.basicProfileInfo;
        //}
        //
        //function errorCallBack(){
        //    console.log('can\'t get the data');
        //}
        /**
         * Make request for adding shipping address
         */

    }

    AddAddressController.$inject = ['$scope',
        '$location',
        '$log',
        '$http',
        'SelectAddressService'];
    byProductApp.registerController('AddAddressController', AddAddressController);
    return AddAddressController;
});