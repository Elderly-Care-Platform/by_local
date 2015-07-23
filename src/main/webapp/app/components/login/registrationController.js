byControllers.controller('RegistrationController', ['$scope', '$rootScope', '$http', '$location', '$routeParams','UserProfile',
    function ($scope, $rootScope, $http, $location, $routeParams, UserProfile) {

        //$rootScope.nextLocation = $location.path();
        $scope.views = {};
        $scope.views.leftPanel = "app/components/login/registrationLeftPanel.html";
        $scope.profile = {};

        $scope.updateRegistration = function (regLevel) {
            $scope.userId = localStorage.getItem("USER_ID");
            $scope.userProfile = UserProfile.get({userId:$scope.userId}, function(profile){
                $scope.profile = profile.data;
                if($scope.profile.userTypes.length > 0){
                    if($scope.profile.userTypes.indexOf(4)!== -1){
                        $scope.regLevel = 2;
                        $scope.sectionLabel = "INSTITUTION INFO";
                        $scope.views.contentPanel = "app/components/login/regInstitution.html";
                    }else if($scope.profile.userTypes.indexOf(7)!== -1){
                        $scope.regLevel = 2;
                        $scope.sectionLabel = "INDIVIDUAL SERVICE PROVIDER INFO";
                        $scope.views.contentPanel = "app/components/login/regIndividual.html";                    	
                    } else {
                        $scope.exit();
                    }
                } else{
                    $scope.regLevel = 1;
                    $scope.views.contentPanel = "app/components/login/regUserType.html";
                }
            });
        }

        if(localStorage.getItem('SessionId') == '' || localStorage.getItem('SessionId') == undefined)
        {
            $scope.views.contentPanel = "app/components/login/login.html";
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
