define(['byProductApp'], function (byProductApp) {
    function EditAddressController($scope,
        $routeParams,
        $log,
        $location,
        SelectAddressService,
        PAGE_URL, SessionIdService, $http) {

        $log.debug('Inside SelectAddress Controller');
        var addressIndex = $routeParams.id,
            initialize = init();

        $scope.address = {};
        $scope.selectAddress = selectAddress;
        $scope.errorMessage = '';
        $scope.showError = showError;
        $scope.updateAddress = updateAddress;
        $scope.addressCallback = addressCallback;
        $scope.getLocationByPincode = getLocationByPincode;
        $scope.googleLocationOptions = {
            country: "in",
            resetOnFocusOut: false
        };

        function init() {
            $("#preloader").show();
            if (localStorage.getItem("by_cust_id")) {
                $scope.customerId = localStorage.getItem("by_cust_id");
            }else{
                $scope.customerId = null;
            }

            var getAddressPromise = SelectAddressService.getAddress(addressIndex);
            if(getAddressPromise){
                getAddressPromise.then(successCallBack, errorCallBack);
            }
        };

        /**
         * Get the requested address and store it in addess object
         * @param  {object} result list of addresses
         * @return {void}
         */
        function successCallBack(result) {
            $scope.address = result.data.data[0];
            $("#preloader").hide();
        }

        function errorCallBack() {
            $("#preloader").hide();
            console.log('can\'t get the data');
        }

        function showError(ngModelController, error) {
            return ngModelController.$error[error];
        };

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
                var params = {};
                params.address = $scope.address;
                SelectAddressService.updateAddress(params).then(addressUpdateSuccess, addressUpdateError);
            }

            function addressUpdateSuccess(result) {
                $location.path('/selectAddress/');
            }

            function addressUpdateError(errorCode) {
                $log.info(errorCode);
            }
        }

        $scope.leftPanelHeight = function(){            
            var clientHeight = $( window ).height() - 57;
            $(".by_menuDetailed").css('height', clientHeight+"px");
        }

        $scope.subMenuTabMobileShow = function () {
            $(".by_mobile_leftPanel_image").click(function () {
                if ($(".by_mobile_leftPanel_hide").css('left') == '0px') {
                    $(".by_mobile_leftPanel_image").animate({left: "0%"}, {duration: 400});
                    $(".by_mobile_leftPanel_image").css('background', "url('assets/img/community/mobile/humburgerG.png?versionTimeStamp=%PROJECT_VERSION%')");
                    $(".by_mobile_leftPanel_hide").animate({left: "-90%"}, {duration: 400});
                } else {
                    $(".by_mobile_leftPanel_image").animate({left: "90%"}, {duration: 400});
                    $(".by_mobile_leftPanel_image").css('background', "url('assets/img/community/mobile/humburger-minG.png?versionTimeStamp=%PROJECT_VERSION%')");
                    $(".by_mobile_leftPanel_hide").animate({left: "0%"}, {duration: 400});
                }
            });
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
        }

        function getLocationByPincode(element) {
            $scope.address.address.city = "";
            $scope.address.address.locality = "";
            $scope.address.address.country = "";
            $scope.address.address.streetAddress = "";
            
            $http.get(apiPrefix + "api/v1/location/getLocationByPincode?pincode=" + $scope.address.address.zip)
                .success(function (response) {
                    if (response) {
                        $scope.address.address.city = response.districtname;
                        $scope.address.address.locality = response.officename;
                        $scope.address.address.streetAddress = response.officename + ", Distt: " + response.districtname + " , State: " + response.statename;
                        $scope.address.address.country = "India";
                    }
                });
        };

        function selectAddress(){
            $location.path('/selectAddress/');
        };

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
