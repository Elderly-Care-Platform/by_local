byControllers.controller('regInstitutionController', ['$scope', '$rootScope', '$http', '$location', '$routeParams', 'UserProfile', 'ServiceTypeList',
    function ($scope, $rootScope, $http, $location, $routeParams, UserProfile, ServiceTypeList) {
        $scope.userId = localStorage.getItem("USER_ID");
        $scope.selectedServices = {};
        $scope.profileImage = [];
        $scope.galleryImages = [];
        $scope.submitted = false;
        $scope.minCategoryError = false;
        $scope.otherLocations = [];
        $scope.selectedMenuList = {};



        var editorInitCallback = function(){
            if(tinymce.get("registrationDescription") && $scope.basicProfileInfo && $scope.basicProfileInfo.description){
                tinymce.get("registrationDescription").setContent($scope.basicProfileInfo.description);
            }
        }
        var tinyEditor = BY.addEditor({"editorTextArea": "registrationDescription"}, editorInitCallback);

        $scope.addressCallback = function (response, addressObj) {
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
                }

            }
            addressObj.streetAddress = response.formatted_address;


        }

        ////Request service type list
        //$scope.ServiceTypeList = ServiceTypeList.get({}, function () {
        //    var selectedServices = $scope.serviceProviderInfo.services;
        //    if(selectedServices.length > 0){
        //        angular.forEach($scope.ServiceTypeList, function(type, index){
        //            if(selectedServices.indexOf(type.id) > -1){
        //                type.selected = true;
        //                $scope.selectServiceType(type);
        //            }
        //
        //            angular.forEach(type.children, function(subType, index){
        //                if(selectedServices.indexOf(subType.id) > -1){
        //                    subType.selected = true;
        //                    $scope.selectServiceType(subType);
        //                }
        //            });
        //        });
        //    }
        //
        //})

        ////Select type of services provided by the institute
        //$scope.selectServiceType = function (elem) {
        //    if (elem.selected) {
        //        $scope.selectedServices[elem.id] = elem;
        //    } else {
        //        delete $scope.selectedServices[elem.id];
        //
        //        if (elem.parentId && $scope.selectedServices[elem.parentId]) {
        //            delete $scope.selectedServices[elem.parentId];
        //        }
        //    }
        //}

        $scope.selectTag = function(event, category){
            if(event.target.checked){
                $scope.selectedMenuList[category.id] = category;
                if(category.parentMenuId && $scope.selectedMenuList[category.parentMenuId]){
                    delete $scope.selectedMenuList[category.parentMenuId];
                }
            }else{
                delete $scope.selectedMenuList[category.id];
            }
        }

        //Prefill form with previously selected data
        $scope.extractData = function () {
            $scope.basicProfileInfo = $scope.profile.basicProfileInfo;
            $scope.serviceProviderInfo = $scope.profile.serviceProviderInfo;
            $scope.address = $scope.basicProfileInfo.primaryUserAddress;
            $scope.otherLocations = $scope.basicProfileInfo.otherAddresses;
            $('#homeVisit')[0].checked = $scope.serviceProviderInfo.homeVisits;

            if ($scope.address && $scope.address.country === null) {
                $scope.address.country = "India";
            }
            editorInitCallback();

            for(var i=0; i<$scope.serviceProviderInfo.services.length; i++){
                var menuId = $scope.serviceProviderInfo.services[i];
                $scope.selectedMenuList[menuId] = $rootScope.menuCategoryMap[menuId];
            }
        }

        if ($scope.$parent.profile) {
            $scope.profile = $scope.$parent.profile;
            $scope.extractData();
        } else {
            $scope.profile = UserProfile.get({userId: $scope.userId}, function (profile) {
                $scope.profile = profile.data;
                $scope.extractData();
            });
        }


        //Get location details based on pin code
        $scope.getLocationByPincode = function (event, addressObj) {
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

        };


        $('input[type=checkbox][data-toggle^=toggle]').bootstrapToggle();  //Apply bootstrap toggle for house visit option

        //$scope.newAddress = new addressFormat($scope.basicProfileInfo.userAddress.length);
        //$scope.basicProfileInfo.userAddress.push($scope.newAddress);

        function addressFormat(index) {
            return {
                "city": "", "country": "", "locality": "",  "streetAddress": "", "zip": ""
            }
        }

        //Function to be used to add additional address
        $scope.addNewAddress = function () {
            if($scope.otherLocations.length < BY.regConfig.maxUserAddress){
                $scope.newAddress = new addressFormat($scope.otherLocations.length);
                $scope.otherLocations.push($scope.newAddress);
            }
        }


        //Add secondary phone numbers
        $scope.addPhoneNumber = function () {
            //var number = {value:""};
            if ($scope.basicProfileInfo.secondaryPhoneNos.length < BY.regConfig.maxSecondaryPhoneNos) {
                $scope.basicProfileInfo.secondaryPhoneNos.push("");
            }
            else{
            	$(".add-phone").hide();
            }
        }

        //Add secondary email details
        $scope.addEmail = function () {
            //var email = {value:""};
            if ($scope.basicProfileInfo.secondaryEmails.length < BY.regConfig.maxSecondaryEmailId) {
                $scope.basicProfileInfo.secondaryEmails.push("");
            }
            else{
            	$(".add-email").hide();
            }
        }

        //Delete profile Image
        $scope.deleteProfileImage = function () {
            $scope.profileImage = [];
            $scope.basicProfileInfo.profileImage = null;
        }

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
        }


        ////Get service list array out of selectedService object
        //$scope.getServiceList = function () {
        //    for (key in $scope.selectedServices) {
        //        if ($scope.selectedServices[key] && $scope.selectedServices[key].parentId) {
        //            $scope.selectedServices[$scope.selectedServices[key].parentId] = $scope.selectedServices[key];
        //        }
        //    }
        //
        //    var finalServiceList = $.map($scope.selectedServices, function (value, key) {
        //        return key;
        //    });
        //
        //    return finalServiceList;
        //}

        var systemTagList = {};
        var getSystemTagList = function(data){
            function rec(data){
                angular.forEach(data, function(menu, index){
                    systemTagList[menu.id] = menu.tags;
                    if(menu.ancestorIds.length > 0){
                        for(var j=0; j < menu.ancestorIds.length; j++){
                            var ancestordata = {};
                            ancestordata[menu.ancestorIds[j]] =  $rootScope.menuCategoryMap[menu.ancestorIds[j]];
                            rec(ancestordata);
                        }
                    }
                })
            }

            rec(data);

            return  $.map(systemTagList, function(value, key){
                return value;
            });
        }

        //Post institution form
        $scope.postUserProfile = function (isValidForm) {
            $(".by_btn_submit").prop("disabled", true);
            $scope.submitted = true;
            $scope.minCategoryError = false;
            $scope.serviceProviderInfo.services = $.map($scope.selectedMenuList, function(value, key){
                return value.id;
            });

            $scope.serviceProviderInfo.homeVisits = $('#homeVisit')[0].checked;

            $scope.basicProfileInfo.profileImage = $scope.profileImage.length > 0 ? $scope.profileImage[0] : $scope.basicProfileInfo.profileImage ;
            $scope.basicProfileInfo.photoGalleryURLs = $scope.basicProfileInfo.photoGalleryURLs.concat($scope.galleryImages);

            if($scope.otherLocations.length > 0){
                $scope.basicProfileInfo.otherAddresses =  $.map($scope.otherLocations, function (value, key) {
                    return value;
                });
            }

            $scope.profile.systemTags = getSystemTagList($scope.selectedMenuList);
            if ( $scope.profile.systemTags.length === 0) {
                $scope.minCategoryError = true;
            }
            
            var regex = /(?:[\w-]+\.)+[\w-]+/ ;
            $scope.serviceProviderInfo.website = regex.exec($scope.serviceProviderInfo.website)[0];

            $scope.basicProfileInfo.description = tinymce.get("registrationDescription").getContent();

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