byControllers.controller('regHousingController', ['$scope', '$rootScope', '$http', '$location', '$routeParams', 'UserProfile', 'ServiceTypeList',
    function ($scope, $rootScope, $http, $location, $routeParams, UserProfile, ServiceTypeList) {
        $scope.userId = localStorage.getItem("USER_ID");
        $scope.profileImage = [];
        $scope.galleryImages = [];
        $scope.submitted = false;
        $scope.regConfig = BY.config.regConfig.housingFacility;

       
        var tempCheck=true;

    	$scope.showAddressButton = function(){
    		if ($(".showAddress").css('display')=='none') 
    		{
    			$(".showAddress").show();
    			$(".showAddressButton").val('- Remove Address');
    			tempCheck=false;
    		}
    		else
    		{
    			$(".showAddress").hide();
    			$(".showAddressButton").val('+ Add Address');
    			tempCheck=true;
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

            if ($scope.basicProfileInfo.primaryUserAddress && $scope.basicProfileInfo.primaryUserAddress.country === null) {
                $scope.basicProfileInfo.primaryUserAddress.country = "India";
            }

            if($scope.profile.facilities.length===0){
                var facilityObj = (JSON.parse(JSON.stringify(BY.config.regConfig.housingFacility))) ;
                $scope.profile.facilities.push(facilityObj);
            }

            $scope.facility = $scope.profile.facilities[0];
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
            $http.get("api/v1/location/getLocationByPincode?pincode=" + $scope.address.zip)
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


        $('input[type=checkbox][data-toggle^=toggle]').bootstrapToggle();  //Apply bootstrap toggle for house visit option
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

       

        //Delete profile Image
        $scope.deleteProfileImage = function () {
            $scope.profileImage = [];
            $scope.basicProfileInfo.profileImage = null;
        };

        //Delete gallery images
        $scope.deleteGalleryImage = function (img) {
            var imgIndex = $scope.galleryImages.indexOf(img);
            if (imgIndex > -1) {
                $scope.galleryImages.splice(imgIndex, 1);
            }
            imgIndex = $scope.basicProfileInfo.photoGalleryURLs.indexOf(img);
            if (imgIndex > -1) {
                $scope.basicProfileInfo.photoGalleryURLs.splice(imgIndex, 1);
            }
        };
        
        //Post individual form
        $scope.postUserProfile = function (isValidForm) {
            $(".by_btn_submit").prop("disabled", true);
            $scope.submitted = true;
            $scope.basicProfileInfo.profileImage = $scope.profileImage.length > 0 ? $scope.profileImage[0] : $scope.basicProfileInfo.profileImage ;
            $scope.basicProfileInfo.photoGalleryURLs = $scope.basicProfileInfo.photoGalleryURLs.concat($scope.galleryImages);
            //$scope.basicProfileInfo.description = tinymce.get("registrationDescription").getContent();

            var regex = /(?:[\w-]+\.)+[\w-]+/ ;
            if($scope.serviceProviderInfo && $scope.serviceProviderInfo.website && $scope.serviceProviderInfo.website.length > 0){
            	$scope.serviceProviderInfo.website = regex.exec($scope.serviceProviderInfo.website)[0];
            }

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

                var userProfile = new UserProfile();
                angular.extend(userProfile, $scope.profile);
                userProfile.$update({userId: $scope.userId}, function (profileOld) {
                    console.log("success");
                    $scope.submitted = false;
                    $scope.$parent.exit();
                }, function (err) {
                    console.log(err);
                    $scope.$parent.exit();
                });
            }
        }
        
        // Adding another faciltiy
        $scope.addingFacilty = function(){
            //$scope.views.contentPanel = "app/components/signup/registration/regHousingAddFacility.html?versionTimeStamp=%PROJECT_VERSION%";
        };
        

    }]);