byControllers.controller('regInstitutionController', ['$scope', '$rootScope', '$http', '$location', '$routeParams','UserProfile','ServiceTypeList',
    function ($scope, $rootScope, $http, $location, $routeParams, UserProfile, ServiceTypeList) {
        $scope.userId = localStorage.getItem("USER_ID");
        $scope.selectedServices = {};
        $scope.profileImage = null;
        $scope.galleryImages = [];
        $scope.ServiceTypeList = ServiceTypeList.get({}, function(){
            console.log($scope.ServiceTypeList);
        })

        if($scope.$parent.profile){
            $scope.profile = $scope.$parent.profile;
            $scope.basicProfileInfo = $scope.profile.basicProfileInfo;
            $scope.serviceProviderInfo = $scope.profile.serviceProviderInfo;
            $scope.address = $scope.basicProfileInfo.userAddress;
        }else{
            $scope.profile = UserProfile.get({userId:$scope.userId}, function(profile){
                $scope.basicProfileInfo = $scope.profile.basicProfileInfo;
                $scope.serviceProviderInfo = $scope.profile.serviceProviderInfo;
                $scope.address = $scope.basicProfileInfo.userAddress;
            });
        }


        //$scope.newAddress = new addressFormat($scope.basicProfileInfo.userAddress.length);
        //$scope.basicProfileInfo.userAddress.push($scope.newAddress);

        $('input[type=checkbox][data-toggle^=toggle]').bootstrapToggle();

        function addressFormat(index){
            return {
                "index":index, "city":"","zip":"","locality":"", "landmark":"", "address":""
            }
        }

        $scope.addPhoneNumber = function(){
            //var number = {value:""};
            if($scope.basicProfileInfo.secondaryPhoneNos.length < BY.regConfig.maxSecondaryPhoneNos){
                $scope.basicProfileInfo.secondaryPhoneNos.push("");
            }
        }

        $scope.addEmail = function(){
            //var email = {value:""};
            if( $scope.basicProfileInfo.secondaryEmails.length < BY.regConfig.maxSecondaryEmailId){
                $scope.basicProfileInfo.secondaryEmails.push("");
            }
        }

        $scope.addNewAddress = function(){
            //if($scope.basicProfileInfo.userAddress.length < BY.regConfig.maxUserAddress){
            //    $scope.newAddress = new addressFormat($scope.basicProfileInfo.userAddress.length);
            //    $scope.basicProfileInfo.userAddress.push($scope.newAddress);
            //}

        }


        $scope.selectServiceType = function(elem){
            if(elem.selected){
                $scope.selectedServices[elem.id] = elem;
            }else{
                delete $scope.selectedServices[elem.id];
            }
        }

        $scope.submitData = function(){
            $scope.uploadProfileImage();
        }

        $scope.uploadProfileImage = function(){
            if($scope.profileImage && $scope.profileImage.file && $scope.profileImage.file!==""){
                var formData = new FormData();
                formData.append('image', $scope.profileImage.file, $scope.profileImage.file.name);

                $http.post('UploadFile?transcoding=true', formData, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                }).success(function(result) {
                    $scope.profileImage = "";
                    $scope.basicProfileInfo.profileImage = result.thumbnailImage;
                    $scope.uploadGallery();
                }).error(function(result) {
                    console.log("Upload profile image failed");
                });
            } else{
                $scope.uploadGallery();
            }

        }

        $scope.uploadGallery= function(){
            if($scope.galleryImages.length > 0){
                var formData = new FormData();
                for(var i=0; i < $scope.galleryImages.length; i++){
                    formData.append('image', $scope.galleryImages[i].file, $scope.galleryImages[i].file.name);
                }

                $http.post('UploadFile?transcoding=true', formData, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                }).success(function(result) {
                    $scope.galleryImages = [];
                    $scope.basicProfileInfo.photoGalleryURLs.push(result.thumbnailImage);
                    $scope.postUserProfile();
                }).error(function(result) {
                    console.log("Upload gallery images failed");
                    $scope.postUserProfile();
                });
            } else{
                $scope.postUserProfile();
            }
        }

        $scope.getServiceList = function(){
            for(key in $scope.selectedServices){
                if($scope.selectedServices[key] && $scope.selectedServices[key].parentId){
                    $scope.selectedServices[$scope.selectedServices[key].parentId] = $scope.selectedServices[key];
                }
            }

            var finalServiceList = $.map($scope.selectedServices, function(value, key){
                return key;
            });

            return finalServiceList;
        }

        $scope.postUserProfile = function(){
            $scope.serviceProviderInfo.services = $scope.getServiceList();
            $scope.serviceProviderInfo.homeVisits = $('#homeVisit')[0].checked;

            //$scope.basicProfileInfo.secondaryPhoneNos = $.map($scope.basicProfileInfo.secondaryPhoneNos, function(value, key){
            //    return value.value;
            //});
            //
            //$scope.basicProfileInfo.secondaryEmails = $.map($scope.basicProfileInfo.secondaryEmails, function(value, key){
            //    return value.value;
            //});

            var userProfile = new UserProfile();
            angular.extend(userProfile,$scope.profile);
            userProfile.$update({userId:$scope.userId}, function(profileOld){
                console.log("success");
                $scope.$parent.exit();
            }, function(err){
                console.log(err);
                $scope.$parent.exit();
            });
        }


    }]);