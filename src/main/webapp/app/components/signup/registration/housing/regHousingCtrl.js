define(['byApp', 'byUtil', 'regHousingFacilityCtrl'], function(byApp, byUtil, regHousingFacilityCtrl) {
    function regHousingCtrl($scope, $rootScope, $http, $location, $routeParams, UserProfile){
        $scope.userId = localStorage.getItem("USER_ID");
        //$scope.profileImage = [];
        //$scope.galleryImages = [];
        $scope.submitted = false;
        $scope.regConfig = BY.config.regConfig.housingFacility;
        $scope.views = {};
        $scope.addFacility = false;
        $scope.facilityIndex = 0;

        $scope.showAddressButton = function(){
            if ($(".showAddress").css('display')=='none')
            {
                $(".showAddress").show();
                $(".showAddressButton").val('- Hide Address');
            }
            else
            {
                $(".showAddress").hide();
                $(".showAddressButton").val('+ Add Address');
            }
        };

        //var editorInitCallback = function(){
        //    if(tinymce.get("facilityDescription") && $scope.facility && $scope.facility.description){
        //        tinymce.get("facilityDescription").setContent($scope.facility.description);
        //    }
        //}
        //
        //$scope.addEditor = function(){
        //	 var tinyEditor = BY.addEditor({"editorTextArea": "facilityDescription"}, editorInitCallback);
        //};


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
        };



        //Prefill form with previously selected data
        var initializeRegForm = function () {
            $scope.basicProfileInfo = $scope.profile.basicProfileInfo;
            $scope.serviceProviderInfo = $scope.profile.serviceProviderInfo;
            $scope.individualInfo = $scope.profile.individualInfo;
            $scope.address = $scope.basicProfileInfo.primaryUserAddress;


            if($scope.profile.facilities.length > 0){
                for(var i=0; i < $scope.profile.facilities.length; i++){
                    if(!$scope.profile.facilities[i] || $scope.profile.facilities[i]==null){
                        $scope.profile.facilities.splice(i, 1);
                    }
                }
            }

            if ($scope.basicProfileInfo.primaryUserAddress && $scope.basicProfileInfo.primaryUserAddress.country === null) {
                $scope.basicProfileInfo.primaryUserAddress.country = "India";
            }

            if($scope.profile.facilities.length===0){
                var facilityObj = (JSON.parse(JSON.stringify(BY.config.regConfig.housingFacility))) ;
                $scope.profile.facilities.push(facilityObj);
                $scope.facility = $scope.profile.facilities[0];
            } else if($routeParams.facilityIndex){
                $scope.facilityIndex = parseInt($routeParams.facilityIndex);
                if($scope.profile.facilities.length < $scope.facilityIndex){
                    var facilityObj = (JSON.parse(JSON.stringify(BY.config.regConfig.housingFacility))) ;
                    $scope.profile.facilities.push(facilityObj);
                    $scope.facility = $scope.profile.facilities[$scope.facilityIndex-1];
                }else{
                    $scope.facility = $scope.profile.facilities[$scope.facilityIndex];
                }

            } else{
                $scope.facility = $scope.profile.facilities[0];
            }

            if($scope.facilityIndex == 0){
                $scope.views.corporateFormView = "app/components/signup/registration/housing/regHousingCorp.html?versionTimeStamp=%PROJECT_VERSION%";
            }

            $scope.views.facilityFormView = "app/components/signup/registration/housing/regHousingFacility.html?versionTimeStamp=%PROJECT_VERSION%";
        };




        //Initialize individual registration
        if ($scope.$parent.profile) {
            $scope.profile = $scope.$parent.profile;
            initializeRegForm();
        } else {
            $scope.profile = UserProfile.get({userId: $scope.userId}, function (profile) {
                $scope.profile = profile.data;
                initializeRegForm();
            });
        }



        //Get location details based on pin code
        $scope.getLocationByPincode = function (element) {
            var element = document.getElementById("zipcode");
            $scope.address.city = "";
            $scope.address.locality = "";
            $scope.address.country = "";
            $http.get(apiPrefix + "api/v1/location/getLocationByPincode?pincode=" + $scope.address.zip)
                .success(function (response) {
                    if (response) {
                        $scope.address.city = response.districtname;
                        $scope.address.locality = response.officename;
                        $scope.address.streetAddress = response.officename + ", Distt: " + response.districtname + " , State: " + response.statename;
                        $scope.address.country = "India";
                    }
                });
        }

        $scope.options = {
            country: "in",
            resetOnFocusOut: false
        };


        function addressFormat(index) {
            return {
                "index": index, "city": "", "zip": "", "locality": "", "landmark": "", "address": ""
            }
        }


        //Add secondary phone numbers
        $scope.addPhoneNumber = function () {
            //var number = {value:""};
            if ($scope.basicProfileInfo.secondaryPhoneNos.length < BY.config.regConfig.formConfig.maxSecondaryPhoneNos) {
                $scope.basicProfileInfo.secondaryPhoneNos.push("");
            }

            if ($scope.basicProfileInfo.secondaryPhoneNos.length === BY.config.regConfig.formConfig.maxSecondaryPhoneNos){
                $(".add-phone").hide();
            }
        }

        //Add secondary email details
        $scope.addEmail = function () {
            //var email = {value:""};
            if ($scope.basicProfileInfo.secondaryEmails.length < BY.config.regConfig.formConfig.maxSecondaryEmailId) {
                $scope.basicProfileInfo.secondaryEmails.push("");
            }

            if ($scope.basicProfileInfo.secondaryEmails.length === BY.config.regConfig.formConfig.maxSecondaryEmailId){
                $(".add-email").hide();
            }
        }



        //Post individual form
        $scope.postUserProfile = function (isValidForm, addAnotherFacility) {
            $scope.addFacility = addAnotherFacility;

            if (isValidForm.$invalid || $scope.minCategoryError) {
                window.scrollTo(0, 0);
                $(".by_btn_submit").prop('disabled', false);
            } else {
                $scope.basicProfileInfo.secondaryPhoneNos = $.map($scope.basicProfileInfo.secondaryPhoneNos, function(value, key)
                {
                    if (value && value !== "") {
                        return value;
                    }
                });

                $scope.basicProfileInfo.secondaryEmails = $.map($scope.basicProfileInfo.secondaryEmails, function(value, key)
                {
                    if (value && value !== "") {
                        return value;
                    }
                });

                if($scope.profile.facilities.length > 0){
                    for(var i=0; i < $scope.profile.facilities.length; i++){
                        if(!$scope.profile.facilities[i] || $scope.profile.facilities[i]==null){
                            $scope.profile.facilities.splice(i, 1);
                        }
                    }
                }


                var userProfile = new UserProfile();
                angular.extend(userProfile, $scope.profile);

                userProfile.$update({userId: $scope.userId}, function (profileOld) {
                    console.log("success");
                    $scope.submitted = false;
                    if($scope.addFacility){
                        $location.path('/users/housingRegistration/'+ ($scope.profile.facilities.length + 1));
                        //$templateCache.removeAll();
                        ////$scope.views = {};
                        //$scope.addNewFacilty();
                    }else{
                        $scope.$parent.exit();
                    }

                }, function (err) {
                    console.log(err);
                    $scope.$parent.exit();
                });
            }
        }
    }
    regHousingCtrl.$inject = ['$scope', '$rootScope', '$http', '$location', '$routeParams', 'UserProfile'];
    byApp.registerController('regHousingCtrl', regHousingCtrl);
    return regHousingCtrl;
});
