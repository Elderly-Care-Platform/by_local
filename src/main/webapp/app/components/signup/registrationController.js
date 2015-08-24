byControllers.controller('RegistrationController', ['$scope', '$rootScope', '$http', '$location', '$routeParams','UserProfile',
    function ($scope, $rootScope, $http, $location, $routeParams, UserProfile) {

        $scope.views = {};
        $scope.views.leftPanel = "app/components/signup/registrationLeftPanel.html?versionTimeStamp=%PROJECT_VERSION%";
        $scope.profile = {};

        (function(){
            var metaTagParams = {
                title:  "Beautiful Years | Registration",
                imageUrl:   "",
                description:   ""
            }
            BY.byUtil.updateMetaTags(metaTagParams);
        })();
        
        $scope.changeUsername = function(){
        	 $scope.views.contentPanel = "app/components/signup/login/modifySignup.html?versionTimeStamp=%PROJECT_VERSION%";
        	 $(".list-group-item").removeClass('active');
        	 $scope.classActive = 'active';
        };
        

        $scope.updateRegistration = function (regLevel) {
            $scope.userId = localStorage.getItem("USER_ID");
            $scope.userProfile = UserProfile.get({userId:$scope.userId}, function(profile){
                $scope.profile = profile.data;
                if($scope.profile.userTypes.length > 0){
                    if($scope.profile.userTypes.indexOf(4)!== -1){
                        $scope.regLevel = 2;
                        $scope.sectionLabel = "INSTITUTION INFO";
                        $scope.views.contentPanel = "app/components/signup/registration/regInstitution.html?versionTimeStamp=%PROJECT_VERSION%";
                    }else if($scope.profile.userTypes.indexOf(7)!== -1){
                        $scope.regLevel = 2;
                        $scope.sectionLabel = "PROFESSIONAL SERVICE PROVIDER INFO";
                        $scope.views.contentPanel = "app/components/signup/registration/regProfessional.html?versionTimeStamp=%PROJECT_VERSION%";
                    }else if(($scope.profile.userTypes.indexOf(1) || $scope.profile.userTypes.indexOf(0) || $scope.profile.userTypes.indexOf(2))!== -1){
                        $scope.regLevel = 2;
                        $scope.sectionLabel = "INDIVIDUAL SERVICE PROVIDER INFO";
                        $scope.views.contentPanel = "app/components/signup/registration/regIndividual.html?versionTimeStamp=%PROJECT_VERSION%";
                    } else {
                        $scope.exit();
                    }
                } else{
                    $scope.regLevel = 1;
                    $scope.views.contentPanel = "app/components/signup/regUserType.html?versionTimeStamp=%PROJECT_VERSION%";
                }
            });
        }

        if(localStorage.getItem('SessionId') == '' || localStorage.getItem('SessionId') == undefined)
        {
            $scope.views.leftPanel = "app/components/signup/login/loginLeftPanel.html?versionTimeStamp=%PROJECT_VERSION%";
            $scope.views.contentPanel = "app/components/signup/login/login.html?versionTimeStamp=%PROJECT_VERSION%";
            $scope.regLevel = 0;
        } else {
            $scope.views.leftPanel = "app/components/signup/registration/registrationLeftPanel.html?versionTimeStamp=%PROJECT_VERSION%";
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
