define(['byApp', 'byUtil'], function (byApp, byUtil) {
    function regInstBranchCtrl($scope, $rootScope, $http, $location, $routeParams, UserProfile) {
        $scope.submitted = false;
        $scope.websiteError = false;
        $scope.profile = $scope.$parent.profile;
        $scope.selectedBranch = $scope.$parent.serviceBranches;

        $scope.addressCallback = function (response) {
            $('#addressLocality').blur();
            $scope.selectedBranch.basicProfileInfo.primaryUserAddress.city = "";
            $scope.selectedBranch.basicProfileInfo.primaryUserAddress.locality = response.name;
            $scope.selectedBranch.basicProfileInfo.primaryUserAddress.country = "";
            $scope.selectedBranch.basicProfileInfo.primaryUserAddress.zip = "";

            for (var i = 0; i < response.address_components.length; i++) {
                if (response.address_components[i].types.length > 0) {
                    if (response.address_components[i].types[0] == "locality") {
                        $scope.selectedBranch.basicProfileInfo.primaryUserAddress.city += response.address_components[i].long_name;
                    }

                    else if (response.address_components[i].types[0].indexOf("administrative_area_level_3") != -1) {
                        $scope.selectedBranch.basicProfileInfo.primaryUserAddress.city = response.address_components[i].long_name;
                    }
                    else if (response.address_components[i].types[0] == "country") {
                        //this is the object you are looking for
                        $scope.selectedBranch.basicProfileInfo.primaryUserAddress.country = response.address_components[i].long_name;
                    }
                    else if (response.address_components[i].types[0] == "postal_code") {
                        //this is the object you are looking for
                        $scope.selectedBranch.basicProfileInfo.primaryUserAddress.zip = response.address_components[i].long_name;
                    }
                    else if (response.address_components[i].types.indexOf("sublocality") != -1 && response.address_components[i].types.indexOf("political") != -1) {
                        $scope.selectedBranch.basicProfileInfo.primaryUserAddress.locality = response.address_components[i].long_name;
                    }
                }

            }
            $scope.selectedBranch.basicProfileInfo.primaryUserAddress.streetAddress = response.formatted_address;
        };

        //Get location details based on pin code
        $scope.getLocationByPincode = function (element) {
            var element = document.getElementById("zipcode");
            $scope.selectedBranch.basicProfileInfo.primaryUserAddress.city = "";
            $scope.selectedBranch.basicProfileInfo.primaryUserAddress.locality = "";
            $scope.selectedBranch.basicProfileInfo.primaryUserAddress.country = "";
            $http.get("api/v1/location/getLocationByPincode?pincode=" + $scope.selectedBranch.basicProfileInfo.primaryUserAddress.zip)
                .success(function (response) {
                    if (response) {
                        $scope.selectedBranch.basicProfileInfo.primaryUserAddress.city = response.districtname;
                        $scope.selectedBranch.basicProfileInfo.primaryUserAddress.locality = response.officename;
                        $scope.selectedBranch.basicProfileInfo.primaryUserAddress.streetAddress = response.officename + ", Distt: " + response.districtname + " , State: " + response.statename;
                        $scope.selectedBranch.basicProfileInfo.primaryUserAddress.country = "India";
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
            if ($scope.selectedBranch.basicProfileInfo.secondaryPhoneNos.length < BY.config.regConfig.formConfig.maxSecondaryPhoneNos) {
                $scope.selectedBranch.basicProfileInfo.secondaryPhoneNos.push("");
            }

            if ($scope.selectedBranch.basicProfileInfo.secondaryPhoneNos.length === BY.config.regConfig.formConfig.maxSecondaryPhoneNos) {
                $(".add-phone").hide();
            }
        }

        //Add secondary email details
        $scope.addEmail = function () {
            //var email = {value:""};
            if ($scope.selectedBranch.basicProfileInfo.secondaryEmails.length < BY.config.regConfig.formConfig.maxSecondaryEmailId) {
                $scope.selectedBranch.basicProfileInfo.secondaryEmails.push("");
            }

            if ($scope.selectedBranch.basicProfileInfo.secondaryEmails.length === BY.config.regConfig.formConfig.maxSecondaryEmailId) {
                $(".add-email").hide();
            }
        }


        $scope.postUserProfile = function (isValidForm, addAnotherBranch) {
            $scope.addBranch = addAnotherBranch;
            $(".by_btn_submit").prop("disabled", true);
            $scope.submitted = true;
            $scope.websiteError = false;

            var regex = /(?:)+([\w-])+(\.[a-z]{2,6}([-a-zA-Z0-9@:%_\+.~#?&!//=]*))+/;
            if ($scope.selectedBranch.serviceProviderInfo && $scope.selectedBranch.serviceProviderInfo.website && $scope.selectedBranch.serviceProviderInfo.website.length > 0) {
                if (regex.exec($scope.selectedBranch.serviceProviderInfo.website)) {
                    $scope.selectedBranch.serviceProviderInfo.website = regex.exec($scope.selectedBranch.serviceProviderInfo.website)[0];
                } else {
                    $scope.websiteError = true;
                }
            }

            if (isValidForm.$invalid || $scope.websiteError) {
                window.scrollTo(0, 0);
                $(".by_btn_submit").prop('disabled', false);
            } else {
                $scope.selectedBranch.basicProfileInfo.secondaryPhoneNos = $.map($scope.selectedBranch.basicProfileInfo.secondaryPhoneNos, function (value, key) {
                    if (value && value !== "") {
                        return value;
                    }
                });

                $scope.selectedBranch.basicProfileInfo.secondaryEmails = $.map($scope.selectedBranch.basicProfileInfo.secondaryEmails, function (value, key) {
                    if (value && value !== "") {
                        return value;
                    }
                });
                var userProfile = new UserProfile();
                angular.extend(userProfile, $scope.profile);
                userProfile.$update({userId: $scope.userId}, function (profileOld) {
                    console.log("success");
                    $scope.submitted = false;
                    if ($scope.addBranch) {
                        $location.path('/users/institutionRegistration/' + ($scope.profile.serviceBranches.length + 1));
                    } else {
                        $scope.$parent.exit();
                    }
                }, function (err) {
                    console.log(err);
                    $scope.$parent.exit();
                });
            }
        };
    }

    regInstBranchCtrl.$inject = ['$scope', '$rootScope', '$http', '$location', '$routeParams', 'UserProfile'];
    byApp.registerController('regInstBranchCtrl', regInstBranchCtrl);
    return regInstBranchCtrl;
});
