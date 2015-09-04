byControllers.controller('regHousingFacilityController', ['$scope', '$rootScope', '$http', '$location',
    '$routeParams',
    function ($scope, $rootScope, $http, $location, $routeParams) {
        $scope.profileImage = [];
        $scope.galleryImages = [];
        $scope.submitted = false;
        $scope.facility = $scope.$parent.facility;

        var editorInitCallback = function(){
            if(tinymce.get("facilityDescription") && $scope.facility && $scope.facility.description){
                tinymce.get("facilityDescription").setContent($scope.facility.description);
            }
        }

        $scope.addEditor = function(){
            var tinyEditor = BY.addEditor({"editorTextArea": "facilityDescription"}, editorInitCallback);
        };
        editorInitCallback();

        $scope.addressCallback = function (response) {
            $('#addressLocality').blur();
            $scope.facility.primaryAddress.city = "";
            $scope.facility.primaryAddress.locality = response.name;
            $scope.facility.primaryAddress.country = "";
            $scope.facility.primaryAddress.zip = "";

            for (var i = 0; i < response.address_components.length; i++) {
                if (response.address_components[i].types.length > 0) {
                    if (response.address_components[i].types[0] == "locality") {
                        $scope.facility.primaryAddress.city += response.address_components[i].long_name;
                    }

                    else if (response.address_components[i].types[0].indexOf("administrative_area_level_3") != -1) {
                        $scope.facility.primaryAddress.city = response.address_components[i].long_name;
                    }
                    else if (response.address_components[i].types[0] == "country") {
                        //this is the object you are looking for
                        $scope.facility.primaryAddress.country = response.address_components[i].long_name;
                    }
                    else if (response.address_components[i].types[0] == "postal_code") {
                        //this is the object you are looking for
                        $scope.facility.primaryAddress.zip = response.address_components[i].long_name;
                    }
                    else if (response.address_components[i].types.indexOf("sublocality") != -1 && response.address_components[i].types.indexOf("political") != -1) {
                        $scope.facility.primaryAddress.locality = response.address_components[i].long_name;
                    }
                }

            }
            $scope.facility.primaryAddress.streetAddress = response.formatted_address;
        };

        //Get location details based on pin code
        $scope.getLocationByPincode = function (element) {
            var element = document.getElementById("zipcode");
            $scope.facility.primaryAddress.city = "";
            $scope.facility.primaryAddress.locality = "";
            $scope.facility.primaryAddress.country = "";
            $http.get("api/v1/location/getLocationByPincode?pincode=" + $scope.facility.primaryAddress.zip)
                .success(function (response) {
                    if (response) {
                        $scope.facility.primaryAddress.city = response.districtname;
                        $scope.facility.primaryAddress.locality = response.officename;
                        $scope.facility.primaryAddress.streetAddress = response.officename + ", Distt: " + response.districtname + " , State: " + response.statename;
                        $scope.facility.primaryAddress.country = "India";
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
            if ($scope.facility.secondaryPhoneNos.length < BY.config.regConfig.formConfig.maxSecondaryPhoneNos) {
                $scope.facility.secondaryPhoneNos.push("");
            }

            if ($scope.facility.secondaryPhoneNos.length === BY.config.regConfig.formConfig.maxSecondaryPhoneNos){
                $(".add-phone").hide();
            }
        }

        //Add secondary email details
        $scope.addEmail = function () {
            //var email = {value:""};
            if ($scope.facility.secondaryEmails.length < BY.config.regConfig.formConfig.maxSecondaryEmailId) {
                $scope.facility.secondaryEmails.push("");
            }

            if ($scope.facility.secondaryEmails.length === BY.config.regConfig.formConfig.maxSecondaryEmailId){
                $(".add-email").hide();
            }
        }



        //Delete profile Image
        $scope.deleteProfileImage = function () {
            $scope.profileImage = [];
            $scope.facility.profileImage = null;
        };

        //Delete gallery images
        $scope.deleteGalleryImage = function (img) {
            var imgIndex = $scope.galleryImages.indexOf(img);
            if (imgIndex > -1) {
                $scope.galleryImages.splice(imgIndex, 1);
            }
            imgIndex = $scope.facility.photoGalleryURLs.indexOf(img);
            if (imgIndex > -1) {
                $scope.facility.photoGalleryURLs.splice(imgIndex, 1);
            }
        };


        $scope.postUserProfile = function(isValidForm){
            $(".by_btn_submit").prop("disabled", true);
            $scope.submitted = true;

            $scope.facility.profileImage = $scope.profileImage.length > 0 ? $scope.profileImage[0] : $scope.facility.profileImage ;
            $scope.facility.photoGalleryURLs = $scope.facility.photoGalleryURLs.concat($scope.galleryImages);
            $scope.facility.description = tinymce.get("facilityDescription").getContent();

            if (isValidForm.$invalid || $scope.minCategoryError) {
                window.scrollTo(0, 0);
                $(".by_btn_submit").prop('disabled', false);
            } else {
                $scope.facility.secondaryPhoneNos = $.map($scope.facility.secondaryPhoneNos, function(value, key)
                {
                    if (value && value !== "") {
                        return value;
                    }
                });

                $scope.facility.secondaryEmails = $.map($scope.facility.secondaryEmails, function(value, key)
                {
                    if (value && value !== "") {
                        return value;
                    }
                });
                $scope.$parent.postUserProfile(isValidForm);
                //var userProfile = new UserProfile();
                //angular.extend(userProfile, $scope.profile);
                //userProfile.$update({userId: $scope.userId}, function (profileOld) {
                //    console.log("success");
                //    $scope.submitted = false;
                //    $scope.$parent.exit();
                //}, function (err) {
                //    console.log(err);
                //    $scope.$parent.exit();
                //});
            }
        };
        ////Post individual form
        //$scope.postUserProfile = function (isValidForm) {
        //
        //}


    }]);