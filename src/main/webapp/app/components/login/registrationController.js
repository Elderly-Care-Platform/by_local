byControllers.controller('RegistrationController', ['$scope', '$rootScope', '$http', '$location', '$routeParams','UserProfile',
    function ($scope, $rootScope, $http, $location, $routeParams, UserProfile) {

        $scope.views = {};
        $scope.views.leftPanel = "app/components/login/registrationLeftPanel.html?versionTimeStamp=%PROJECT_VERSION%";
        $scope.profile = {};

        (function(){
            var metaTagParams = {
                title:  "Beautiful Years | Registration",
                imageUrl:   "",
                description:   ""
            }
            BY.byUtil.updateMetaTags(metaTagParams);
        })();

        $scope.updateRegistration = function (regLevel) {
            $scope.userId = localStorage.getItem("USER_ID");
            $scope.userProfile = UserProfile.get({userId:$scope.userId}, function(profile){
                $scope.profile = profile.data;
                if($scope.profile.userTypes.length > 0){
                    if($scope.profile.userTypes.indexOf(4)!== -1){
                        $scope.regLevel = 2;
                        $scope.sectionLabel = "INSTITUTION INFO";
<<<<<<< HEAD
                        $scope.views.contentPanel = "app/components/login/regInstitution.html";
                    }else if($scope.profile.userTypes.indexOf(7)!== -1){
                        $scope.regLevel = 2;
                        $scope.sectionLabel = "INDIVIDUAL SERVICE PROVIDER INFO";
                        $scope.views.contentPanel = "app/components/login/regIndividual.html";                    	
=======
                        $scope.views.contentPanel = "app/components/login/regInstitution.html?versionTimeStamp=%PROJECT_VERSION%";
                    }else if($scope.profile.userTypes.indexOf(7)!== -1){
                        $scope.regLevel = 2;
                        $scope.sectionLabel = "INDIVIDUAL SERVICE PROVIDER INFO";
                        $scope.views.contentPanel = "app/components/login/regIndividual.html?versionTimeStamp=%PROJECT_VERSION%";                    	
>>>>>>> remotes/origin/profileChanges
                    } else {
                        $scope.exit();
                    }
                } else{
                    $scope.regLevel = 1;
                    $scope.views.contentPanel = "app/components/login/regUserType.html?versionTimeStamp=%PROJECT_VERSION%";
                }
            });
        }

        if(localStorage.getItem('SessionId') == '' || localStorage.getItem('SessionId') == undefined)
        {
            $scope.views.contentPanel = "app/components/login/login.html?versionTimeStamp=%PROJECT_VERSION%";
            $scope.regLevel = 0;
        } else {
            $scope.updateRegistration();
        }

        $scope.exit = function(){
            if($rootScope.nextLocation)
            {
                $location.path($rootScope.nextLocation);
            }
            else
            {
                $location.path("/users/home");
            }
        }

    }]);
