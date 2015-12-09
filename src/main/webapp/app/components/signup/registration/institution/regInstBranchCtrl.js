define(['byApp', 'byUtil'], function(byApp, byUtil){
    function regInstBranchCtrl($scope, $rootScope, $http, $location, $routeParams, UserProfile){
        $scope.submitted = false;
        $scope.websiteError = false;
        $scope.serviceBranches =  $scope.$parent.serviceBranches;

       /* $scope.addressCallback = function (response, addressObj) {
            $('#addressLocality').blur();
            addressObj.city = "";
            addressObj.locality = response.name;
            addressObj.country = "";
            addressObj.zip = "";

            for (var i = 0; i < response.address_components.length; i++) {
                if (response.address_components[i].types.length > 0) {
                    if (response.address_components[i].types[0] == "locality") {
                        addressObj.city += response.address_components[i].long_name;
                    }

                    else if (response.address_components[i].types[0].indexOf("administrative_area_level_3") != -1) {
                        addressObj.city = response.address_components[i].long_name;
                    }
                    else if (response.address_components[i].types[0] == "country") {
                        //this is the object you are looking for
                        addressObj.country = response.address_components[i].long_name;
                    }
                    else if (response.address_components[i].types[0] == "postal_code") {
                        //this is the object you are looking for
                        addressObj.zip = response.address_components[i].long_name;
                    }
                    else if (response.address_components[i].types.indexOf("sublocality") != -1 && response.address_components[i].types.indexOf("political") != -1) {
                        $scope.address.locality = response.address_components[i].long_name;
                    }
                }

            }
            addressObj.streetAddress = response.formatted_address;


        }*/

        
        $scope.addressCallback = function (response) {
            $('#addressLocality').blur();
            $scope.serviceBranches.basicBranchInfo.primaryUserAddress.city = "";
            $scope.serviceBranches.basicBranchInfo.primaryUserAddress.locality = response.name;
            $scope.serviceBranches.basicBranchInfo.primaryUserAddress.country = "";
            $scope.serviceBranches.basicBranchInfo.primaryUserAddress.zip = "";

            for (var i = 0; i < response.address_components.length; i++) {
                if (response.address_components[i].types.length > 0) {
                    if (response.address_components[i].types[0] == "locality") {
                        $scope.serviceBranches.basicBranchInfo.primaryUserAddress.city += response.address_components[i].long_name;
                    }

                    else if (response.address_components[i].types[0].indexOf("administrative_area_level_3") != -1) {
                        $scope.serviceBranches.basicBranchInfo.primaryUserAddress.city = response.address_components[i].long_name;
                    }
                    else if (response.address_components[i].types[0] == "country") {
                        //this is the object you are looking for
                        $scope.serviceBranches.basicBranchInfo.primaryUserAddress.country = response.address_components[i].long_name;
                    }
                    else if (response.address_components[i].types[0] == "postal_code") {
                        //this is the object you are looking for
                        $scope.serviceBranches.basicBranchInfo.primaryUserAddress.zip = response.address_components[i].long_name;
                    }
                    else if (response.address_components[i].types.indexOf("sublocality") != -1 && response.address_components[i].types.indexOf("political") != -1) {
                        $scope.serviceBranches.basicBranchInfo.primaryUserAddress.locality = response.address_components[i].long_name;
                    }
                }

            }
            $scope.serviceBranches.basicBranchInfo.primaryUserAddress.streetAddress = response.formatted_address;
        };

        //Get location details based on pin code
        $scope.getLocationByPincode = function (element) {
            var element = document.getElementById("zipcode");
            $scope.serviceBranches.basicBranchInfo.primaryUserAddress.city = "";
            $scope.serviceBranches.basicBranchInfo.primaryUserAddress.locality = "";
            $scope.serviceBranches.basicBranchInfo.primaryUserAddress.country = "";
            $http.get("api/v1/location/getLocationByPincode?pincode=" + $scope.serviceBranches.basicBranchInfo.primaryUserAddress.zip)
                .success(function (response) {
                    if (response) {
                        $scope.serviceBranches.basicBranchInfo.primaryUserAddress.city = response.districtname;
                        $scope.serviceBranches.basicBranchInfo.primaryUserAddress.locality = response.officename;
                        $scope.serviceBranches.basicBranchInfo.primaryUserAddress.streetAddress = response.officename + ", Distt: " + response.districtname + " , State: " + response.statename;
                        $scope.serviceBranches.basicBranchInfo.primaryUserAddress.country = "India";
                    }
                });
        }

        $scope.options = {
            country: "in",
            resetOnFocusOut: false
        };



        /*$scope.getLocationByPincode = function (event, addressObj) {
            var element = document.getElementById("zipcode");
            addressObj.city = "";
            addressObj.locality = "";
            addressObj.country = "";
            $http.get("api/v1/location/getLocationByPincode?pincode=" + addressObj.zip)
                .success(function (response) {
                    if (response) {
                        addressObj.city = response.districtname;
                        addressObj.locality = response.officename;
                        addressObj.streetAddress = response.officename + ", Distt: " + response.districtname + " , State: " + response.statename;
                        addressObj.country = "India";
                    }
                });
        }

        $scope.options = {
            country: "in",
            resetOnFocusOut: false

        };*/



        function addressFormat(index) {
            return {
                "index": index, "city": "", "zip": "", "locality": "", "landmark": "", "address": ""
            }
        }


        //Add secondary phone numbers
        $scope.addPhoneNumber = function () {
            //var number = {value:""};
            if ($scope.serviceBranches.basicBranchInfo.secondaryPhoneNos.length < BY.config.regConfig.formConfig.maxSecondaryPhoneNos) {
                $scope.serviceBranches.basicBranchInfo.secondaryPhoneNos.push("");
            }

            if ($scope.serviceBranches.basicBranchInfo.secondaryPhoneNos.length === BY.config.regConfig.formConfig.maxSecondaryPhoneNos) {
                $(".add-phone").hide();
            }
        }

        //Add secondary email details
        $scope.addEmail = function () {
            //var email = {value:""};
            if ($scope.serviceBranches.basicBranchInfo.secondaryEmails.length < BY.config.regConfig.formConfig.maxSecondaryEmailId) {
                $scope.serviceBranches.basicBranchInfo.secondaryEmails.push("");
            }

            if ($scope.serviceBranches.basicBranchInfo.secondaryEmails.length === BY.config.regConfig.formConfig.maxSecondaryEmailId) {
                $(".add-email").hide();
            }
        }


        $scope.postUserProfile = function (isValidForm, addAnotherBranch) {
            $(".by_btn_submit").prop("disabled", true);
            $scope.submitted = true;
            $scope.websiteError = false;
            
            var regex = /(?:)+([\w-])+(\.[a-z]{2,6}([-a-zA-Z0-9@:%_\+.~#?&!//=]*))+/ ;
           if($scope.serviceBranches.serviceProviderInfo && $scope.serviceBranches.serviceProviderInfo.website && $scope.serviceBranches.serviceProviderInfo.website.length > 0){
                if(regex.exec($scope.serviceBranches.serviceProviderInfo.website)){
                    $scope.serviceBranches.serviceProviderInfo.website = regex.exec($scope.serviceBranches.serviceProviderInfo.website)[0];
                } else{
                    $scope.websiteError = true;
                }
            }


            if (isValidForm.$invalid  || $scope.websiteError) {
                window.scrollTo(0, 0);
                $(".by_btn_submit").prop('disabled', false);
            } else {
                $scope.serviceBranches.basicBranchInfo.secondaryPhoneNos = $.map($scope.serviceBranches.basicBranchInfo.secondaryPhoneNos, function (value, key) {
                    if (value && value !== "") {
                        return value;
                    }
                });

                $scope.serviceBranches.basicBranchInfo.secondaryEmails = $.map($scope.serviceBranches.basicBranchInfo.secondaryEmails, function (value, key) {
                    if (value && value !== "") {
                        return value;
                    }
                });
                $scope.$parent.postUserProfile(isValidForm, addAnotherBranch);
            }
        };
    }
    regInstBranchCtrl.$inject = ['$scope', '$rootScope', '$http', '$location', '$routeParams', 'UserProfile'];
    byApp.registerController('regInstBranchCtrl', regInstBranchCtrl);
    return regInstBranchCtrl;
});
