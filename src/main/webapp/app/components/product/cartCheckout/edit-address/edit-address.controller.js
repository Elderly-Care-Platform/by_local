define(['byProductApp'], function (byProductApp) {
    function EditAddressController($scope,
        $routeParams,
        $log,
        $location,
        SelectAddressService,
        PAGE_URL, SessionIdService, $http) {

        $log.debug('Inside SelectAddress Controller');


        if (localStorage.getItem("by_cust_id")) {
            $scope.customerId = localStorage.getItem("by_cust_id");
        }else{
            $scope.customerId = null;
        }

        //$scope.getFilterAddress = getFilterAddress;
        $scope.address = {};
        $scope.selectAddress = selectAddress;
        $scope.errorMessage = '';
        $scope.showError = showError;
        $scope.updateAddress = updateAddress;
        $scope.addressIndex = $routeParams.id;

        /**
         *Retrieve the list of address
         */
        var getProfilePromise = SelectAddressService.getCustomerProfile();
        if(getProfilePromise){
            getProfilePromise.then(successCallBack, errorCallBack);
        }
        SelectAddressService.getCustomerProfile($scope.customerId).then(successCallBack, errorCallBack);

        $scope.googleLocationOptions = {
            country: "in",
            resetOnFocusOut: false
        };

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

        function showError(ngModelController, error) {
            return ngModelController.$error[error];
        }

        /**
         * Get the requested address and store it in addess object
         * @param  {object} result list of addresses
         * @return {void}
         */
        function successCallBack(result) {
            var userAddress = [];
            $scope.userProfile = result.data.data;
            var userBasicProfile = result.data.data.basicProfileInfo;
            userAddress.push(userBasicProfile.primaryUserAddress);
            if(userBasicProfile.otherAddresses.length > 0){
                userAddress = userAddress.concat(userBasicProfile.otherAddresses);
            }
            $scope.address = userAddress[$scope.addressIndex];
        }

        function errorCallBack() {
            console.log('can\'t get the data');
        }

        ///**
        // * Find the correct address
        // * @param  {object} addresses list of address
        // * @return {void}
        // */
        //function getFilterAddress(addresses) {
        //    for (var index = 0; index < addresses.length; index = index + 1) {
        //        if (addresses[index].address.id === parseInt($scope.addressId)) {
        //            return addresses[index];
        //        }
        //    }
        //    return {};
        //}

        /**
        // * If address id passed make request for editing this adress
        // * else if address id not passed make request for adding new address
        // * and redirect to  payment gateway
        // * @return {void}
        // */
        //function saveAddress() {
        //    console.log($scope.address);
        //    //if (StateParamsValidator.isStateParamValid($scope.addressId)) {
        //    //    updateAddress();
        //    //} else {
        //    //    // If no address id passed in query parameter,
        //    //    // add new address and ship to this address
        //    //    addAddress();
        //    //}
        //}

        function selectAddress(){            
           $location.path('/selectAddress/');
        }

        /**
         * Updated the address of id passed
         * @return {void}
         */
        function updateAddress(form) {
            $(".by_btn_submit").prop("disabled", true);
            $scope.submitted = true;
            if (form.$invalid) {
                window.scrollTo(0, 0);
                $(".by_btn_submit").prop('disabled', false);
            }else{
                var params = {}, putData = {};
                putData.profile = $scope.userProfile;
                SelectAddressService.updateProfile(params, putData).
                    then(addressUpdateSuccess, addressUpdateError);
            }
            //var params = {}, putData = {};
            //params.addressIndex = $scope.addressIndex;
            //putData.address = angular.copy($scope.address);
            //SelectAddressService.updateAddress(params, putData).
            //    then(addressUpdateSuccess, addressUpdateError);

            function addressUpdateSuccess(result) {
                $location.path('/selectAddress/');
            }

            function addressUpdateError(errorCode) {
                $log.info(errorCode);
            }
        }

        ///**
        // * Add new address and redirect to payment gateway on sucess
        // */
        //function addAddress() {
        //    var params = {}, postData = {};
        //    params.customerId = $scope.customerId;
        //    postData = angular.copy($scope.address);
        //    postData.address.country = {};
        //    postData.address.country.name = 'United States';
        //    postData.address.country.abbreviation = 'US';
        //    AddAddressService.addAddress(params, postData)
        //        .then(addAddressSuccess, addAddressError);
        //
        //    function addAddressSuccess(result) {
        //        $location.path(PAGE_URL.paymentGateway + result.id);
        //    }
        //
        //    function addAddressError(errorCode) {
        //        $log.info(errorCode);
        //    }
        //}

        $scope.$on('getCartItemCount', function (event, args) {
            $scope.cartItemCount = args;
        });


    }

    EditAddressController.$inject = ['$scope',
        '$routeParams',
        '$log',
        '$location',
        'SelectAddressService',
        'PAGE_URL', 'SessionIdService', '$http'];

    byProductApp.registerController('EditAddressController', EditAddressController);
    return EditAddressController;
});
