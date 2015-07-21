//DIscuss All
byControllers.controller('ProfileController', ['$scope', '$rootScope', '$location', '$route', '$routeParams','UserProfile',
    function ($scope, $rootScope, $location, $route, $routeParams, UserProfile) {

        $scope.profileViews = {};
        $scope.profileType = $routeParams.profileType;
        $scope.profileId = $routeParams.profileId;
        $scope.isIndividualProfile = false;

        $scope.profileViews.leftPanel = "app/components/profile/profileLeftPanel.html?versionTimeStamp=%PROJECT_VERSION%";

        $("#preloader").show();
        $scope.profileData = UserProfile.get({userId:$scope.profileId}, function (profile) {
                $scope.profileData = profile.data;
                $("#preloader").hide();
                $scope.profileViews.contentPanel = BY.config.profile.userType[$scope.profileType].contentPanel;
                if(BY.config.profile.userType[$scope.profileType].category==='0'){
                    $scope.isIndividualProfile = true;
                }
            },
            function (error) {
                console.log("institution profile error");
            });



        $scope.reviewContent = function(){
            $scope.profileViews.contentPanel = BY.config.profile.userType[$scope.profileType].reviewContentPanel;
        }

        $scope.displayProfile = function(){
            $scope.profileViews.contentPanel = BY.config.profile.userType[$scope.profileType].contentPanel;
        }
    }]);
