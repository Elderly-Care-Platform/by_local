byControllers.controller('regIndividualController', ['$scope', '$rootScope', '$http', '$location', '$routeParams', 'UserProfile', 'ServiceTypeList',
    function ($scope, $rootScope, $http, $location, $routeParams, UserProfile, ServiceTypeList) {
        $scope.userId = localStorage.getItem("USER_ID");
        $scope.profileImage = [];
        $scope.galleryImages = [];
        $scope.submitted = false;
        $scope.regConfig = BY.config.regConfig.indvUserRegConfig;
        $scope.medicalIssuesOptions = $rootScope.menuCategoryMapByName[$scope.regConfig.medical_issues.fetchFromMenu].children;
        $scope.hobbiesOptions = $rootScope.menuCategoryMapByName[$scope.regConfig.hobbies.fetchFromMenu].children;
        $scope.interestsOptions = $rootScope.mainMenu;
        $scope.selectedLanguages = {};

        var editorInitCallback = function(){
            if(tinymce.get("registrationDescription") && $scope.basicProfileInfo && $scope.basicProfileInfo.description){
                tinymce.get("registrationDescription").setContent($scope.basicProfileInfo.description);
            }
        }
        var tinyEditor = BY.addEditor({"editorTextArea": "registrationDescription"}, editorInitCallback);
        $(function() {

        });

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

        var getLanguages = function(){
            $http.get("api/v1/by/getLanguages/")
                .success(function (response) {
                    if (response) {
                        $scope.languages = response.data;

                        $scope.languages = $.map($scope.languages, function (value, key) {
                            return {label:value.name, value:value.name, obj:value};
                        });
                    }
                }).error(function(errorRes){
                    console.log(errorRes);
                });
        }

        //Prefill form with previously selected data
        var initializeRegForm = function () {
            $scope.basicProfileInfo = $scope.profile.basicProfileInfo;
            $scope.serviceProviderInfo = $scope.profile.serviceProviderInfo;
            $scope.individualInfo = $scope.profile.individualInfo;
            $scope.address = $scope.basicProfileInfo.primaryUserAddress;


            if(!$scope.individualInfo.salutation){
                $scope.individualInfo.salutation = $scope.regConfig.salutations[0];
            }

            if(!$scope.individualInfo.occupation){
                $scope.individualInfo.occupation = $scope.regConfig.occupation[0];
            }

            if(!$scope.individualInfo.maritalStatus){
                $scope.individualInfo.maritalStatus = $scope.regConfig.maritalStatus[0];
            }

            if ($scope.basicProfileInfo.primaryUserAddress && $scope.basicProfileInfo.primaryUserAddress.country === null) {
                $scope.basicProfileInfo.primaryUserAddress.country = "India";
            }

            $("#datepicker" ).datepicker({
                showOn: "button",
                buttonImage: "assets/img/icons/callender.png",
                buttonImageOnly: true,
                buttonText: "Select date",
                changeMonth: true,
                changeYear: true,
                yearRange: "1900:2015"
            });
            editorInitCallback();
            getLanguages();
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

        $scope.langSelectCallback = function(changedVal, actualValue){
            //{label:value.name, value:value.name, obj:value}
            if(changedVal && changedVal!==""){
                $scope.selectedLanguages[changedVal.label] = changedVal.obj;
            }else{
                delete $scope.selectedLanguages[actualValue.name];
            }

            $("#langField").val("");
            if($scope.selectedLanguages.length > 0){
                $("#langField").show();
            }else{
                $("#langField").hide();
            }

            $scope.$apply();
            console.log($scope.selectedLanguages);
            //$scope.individualInfo.language.push(language.obj);
        };

        $scope.addLangField = function(){
            $("#langField").show();
            console.log($scope.selectedLanguages);
        };

        //Add secondary phone numbers
        $scope.addPhoneNumber = function () {
            //var number = {value:""};
            if ($scope.basicProfileInfo.secondaryPhoneNos.length < BY.config.regConfig.formConfig.maxSecondaryPhoneNos) {
                $scope.basicProfileInfo.secondaryPhoneNos.push("");
            }
            else{
                $(".add-phone").hide();
            }
        }

        //Add secondary email details
        $scope.addEmail = function () {
            //var email = {value:""};
            if ($scope.basicProfileInfo.secondaryEmails.length < BY.config.regConfig.formConfig.maxSecondaryEmailId) {
                $scope.basicProfileInfo.secondaryEmails.push("");
            }
            else{
                $(".add-email").hide();
            }
        }

        $scope.selectMedicalIssue = function(option){
            var index = -1;
            if($scope.individualInfo.medicalIssues && $scope.individualInfo.medicalIssues.length > 0){
                index = $scope.individualInfo.medicalIssues.indexOf(option);
            }else{
                $scope.individualInfo.medicalIssues = [];
            }

            if(index > -1){
                $scope.individualInfo.medicalIssues.splice($scope.individualInfo.medicalIssues.indexOf(option), 1);
            }else{
                $scope.individualInfo.medicalIssues.push(option);
            }
        };

        $scope.selectHobbies = function(option){
            var index = -1;
            if($scope.individualInfo.hobbies && $scope.individualInfo.hobbies.length > 0){
                index = $scope.individualInfo.hobbies.indexOf(option);
            }else{
                $scope.individualInfo.hobbies = [];
            }

            if(index > -1){
                $scope.individualInfo.hobbies.splice($scope.individualInfo.hobbies.indexOf(option), 1);
            }else{
                $scope.individualInfo.hobbies.push(option);
            }
        };

        $scope.selectEmotionalIssue = function (option) {
            var index = -1;
            if($scope.individualInfo.emotionalIssues && $scope.individualInfo.emotionalIssues.length > 0){
                index = $scope.individualInfo.emotionalIssues.indexOf(option);
            }else{
                $scope.individualInfo.emotionalIssues = [];
            }

            if(index > -1){
                $scope.individualInfo.emotionalIssues.splice($scope.individualInfo.emotionalIssues.indexOf(option), 1);
            }else{
                $scope.individualInfo.emotionalIssues.push(option);
            }

            console.log($scope.individualInfo.emotionalIssues);
        };

        $scope.selectTopicOfInterest = function(option){
            var index = -1;
            if($scope.individualInfo.interests && $scope.individualInfo.interests.length > 0){
                index = $scope.individualInfo.interests.indexOf(option);
            }else{
                $scope.individualInfo.interests = [];
            }

            if(index > -1){
                $scope.individualInfo.interests.splice($scope.individualInfo.interests.indexOf(option), 1);
            }else{
                $scope.individualInfo.interests.push(option);
            }
        };

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
        
        // Default avatar
        $scope.defaultImage = function(url){
        	$scope.basicProfileInfo.profileImage = url;
        	$scope.profileImage = [];
        };


        //Post individual form
        $scope.postUserProfile = function (isValidForm) {
            $(".by_btn_submit").prop("disabled", true);
            $scope.submitted = true;
            $scope.basicProfileInfo.profileImage = $scope.profileImage.length > 0 ? $scope.profileImage[0] : $scope.basicProfileInfo.profileImage ;
            $scope.basicProfileInfo.photoGalleryURLs = $scope.basicProfileInfo.photoGalleryURLs.concat($scope.galleryImages);

            $scope.basicProfileInfo.description = tinymce.get("registrationDescription").getContent();

            if($scope.selectedLanguages.length > 0){
                $scope.individualInfo.language = $.map($scope.selectedLanguages, function(value, key){
                    return value;
                });
            }

            console.log($scope.profile);
            if (isValidForm.$invalid || $scope.minCategoryError) {
                window.scrollTo(0, 0);
                $(".by_btn_submit").prop('disabled', false);
            } else {
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

    }]);