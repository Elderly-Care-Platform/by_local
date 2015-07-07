byControllers.controller('regInstitutionController', ['$scope', '$rootScope', '$http', '$location', '$routeParams','UserProfile','ServiceTypeList',
    function ($scope, $rootScope, $http, $location, $routeParams, UserProfile, ServiceTypeList) {
        $scope.ServiceTypeList = ServiceTypeList.get({}, function(){
            console.log($scope.ServiceTypeList);
        })

        $scope.profileOld = UserProfile.get({id:$scope.id}, function(profile){
            $scope.profile = profile;
            $scope.basicProfileInfo = $scope.profile.basicProfileInfo;
            $scope.serviceProviderInfo = $scope.profile.serviceProviderInfo;
            $scope.address = $scope.basicProfileInfo.userAddress;
        });

        $scope.selectedServices = {};

        //$scope.newAddress = new addressFormat($scope.basicProfileInfo.userAddress.length);
        //$scope.basicProfileInfo.userAddress.push($scope.newAddress);

        $('input[type=checkbox][data-toggle^=toggle]').bootstrapToggle();

        function addressFormat(index){
            return {
                "index":index, "city":"","zip":"","locality":"", "landmark":"", "address":""
            }
        }

        $scope.addPhoneNumber = function(){
            var number = {value:""};
            if($scope.basicProfileInfo.secondaryPhoneNos.length < BY.regConfig.maxSecondaryPhoneNos){
                $scope.basicProfileInfo.secondaryPhoneNos.push(number);
            }
        }

        $scope.addEmail = function(){
            var email = {value:""};
            if( $scope.basicProfileInfo.secondaryEmails.length < BY.regConfig.maxSecondaryEmailId){
                $scope.basicProfileInfo.secondaryEmails.push(email);
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
            if($scope.basicProfileInfo.profileImage && $scope.basicProfileInfo.profileImage.file && $scope.basicProfileInfo.profileImage.file!==""){
                var formData = new FormData();
                formData.append('image', $scope.basicProfileInfo.profileImage.file, $scope.basicProfileInfo.profileImage.file.name);

                $http.post('UploadFile?transcoding=true', formData, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                }).success(function(result) {
                    $scope.basicProfileInfo.profileImage = result.original;
                    $scope.uploadGallery();
                }).error(function(result) {
                    console.log("Upload profile image failed");
                });
            } else{
                $scope.uploadGallery();
            }

        }

        $scope.uploadGallery= function(){
            if($scope.basicProfileInfo.photoGalleryURLs.length > 0){
                var formData = new FormData();
                for(var i=0; i<$scope.basicProfileInfo.photoGalleryURLs.length; i++){
                    formData.append('image', $scope.basicProfileInfo.photoGalleryURLs[i].file, $scope.basicProfileInfo.photoGalleryURLs[i].file.name);
                }

                $http.post('UploadFile?transcoding=true', formData, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                }).success(function(result) {
                    $scope.basicProfileInfo.photoGalleryURLs = [];
                    $scope.basicProfileInfo.photoGalleryURLs.push(result.original);
                    $scope.postUserProfile();
                }).error(function(result) {
                    console.log("Upload gallery images failed");
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
            $scope.id = $scope.$parent.id;
            $scope.serviceProviderInfo.services = $scope.getServiceList();
            $scope.serviceProviderInfo.homeVisits = $('#homeVisit')[0].checked;

            $scope.basicProfileInfo.secondaryPhoneNos = $.map($scope.basicProfileInfo.secondaryPhoneNos, function(value, key){
                return value.value;
            });

            $scope.basicProfileInfo.secondaryEmails = $.map($scope.basicProfileInfo.secondaryEmails, function(value, key){
                return value.value;
            });

            var userProfile = new UserProfile();
            angular.extend(userProfile,$scope.profile);
            userProfile.$update({id:$scope.id}, function(profileOld){
                console.log("success");
                $location.path("/users/home");
            }, function(err){
                console.log(err);
            });

        }


    }]);