//DIscuss All
byControllers.controller('ProfileController', ['$scope', '$rootScope', '$location', '$route', '$routeParams','UserProfile', '$sce', '$window',
    function ($scope, $rootScope, $location, $route, $routeParams, UserProfile, $sce, $window) {

        $scope.profileViews = {};
        $scope.profileType = $routeParams.profileType;
        $scope.profileId = $routeParams.profileId;
        $scope.isIndividualProfile = false;
        $scope.isAllowedToReview = false;
        $scope.reviewContentType = BY.config.profile.userType[$scope.profileType].reviewContentType;

        $scope.profileViews.leftPanel = "app/components/profile/profileLeftPanel.html?versionTimeStamp=%PROJECT_VERSION%";

        $scope.showProfile = function(){
            $("#preloader").show();
            $scope.profileData = UserProfile.get({userId:$scope.profileId}, function (profile) {
                    $scope.profileData = profile.data;
                    $("#preloader").hide();
                    $scope.profileViews.contentPanel = BY.config.profile.userType[$scope.profileType].contentPanel;
                    if(BY.config.profile.userType[$scope.profileType].category==='0'){
                        $scope.isIndividualProfile = true;
                    }

                    if(localStorage.getItem("USER_ID") !== $scope.profileData.userId){
                        $scope.isAllowedToReview = true;
                    }
                },
                function (error) {
                    console.log("institution profile error");
                });
        }


        $scope.showProfile();

        $scope.reviewContent = function(){
            $scope.profileViews.contentPanel = BY.config.profile.userType[$scope.profileType].reviewContentPanel;
        }

        $scope.displayProfile = function(){
            $scope.profileViews.contentPanel = BY.config.profile.userType[$scope.profileType].contentPanel;
        }

        $scope.trustForcefully = function (html) {
            return $sce.trustAsHtml(html);
        };
        
        angular.element($window).bind("scroll", function() {
        	$scope.sliderHeight = $(".by_section_header").height();
        	if((document.body.scrollTop || document.documentElement.scrollTop || window.pageYOffset) >= $scope.sliderHeight){
        		$(".by_left_panel_homeSlider_position").removeClass('by_left_panel_homeSlider');
        		$(".by_left_panel_homeSlider_position").css('margin-top', -$scope.sliderHeight+'px');
        	}else{
        		$(".by_left_panel_homeSlider_position").addClass('by_left_panel_homeSlider');
        		$(".by_left_panel_homeSlider_position").css('margin-top', '0px');
        	}
        });

    }]);
