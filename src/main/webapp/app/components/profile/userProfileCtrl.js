//DIscuss All
byControllers.controller('ProfileController', ['$scope', '$rootScope', '$location', '$route', '$routeParams','UserProfile', '$sce',
    function ($scope, $rootScope, $location, $route, $routeParams, UserProfile, $sce) {

        $scope.profileViews = {};
        $scope.profileType = $routeParams.profileType;
        $scope.profileId = $routeParams.profileId;
        $scope.userName = $routeParams.userName ? BY.validateUserName($routeParams.userName) : "Anonymous";
        $scope.isIndividualProfile = false;
        $scope.isAllowedToReview = false;
        $scope.reviewContentType = BY.config.profile.userType[$scope.profileType].reviewContentType;
        $scope.label = BY.config.profile.userType[$scope.profileType].label;

        $scope.profileViews.leftPanel = "app/components/profile/profileLeftPanel.html?versionTimeStamp=%PROJECT_VERSION%";
        
        $scope.gotoHref = function(id) {
//        	$(document).scrollTo('#'+param);
        	if (id) {
                var tag = $("#" + id + ":visible");
                if (tag.length > 0) {
                    $('html,body').animate({scrollTop: tag.offset().top - $(".breadcrumbs").height() - $(".header").height()}, 'slow');
                }

            }
        };
        
        (function(){
            var metaTagParams = {
                title:  "Beautiful Years | Profile",
                imageUrl:   "",
                description:   ""
            }
            BY.byUtil.updateMetaTags(metaTagParams);
        })();

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
           // $scope.profileViews.contentPanel = BY.config.profile.userType[$scope.profileType].reviewContentPanel;
        }

        $scope.displayProfile = function(){
            $scope.profileViews.contentPanel = BY.config.profile.userType[$scope.profileType].contentPanel;
        }

        $scope.trustForcefully = function (html) {
            return $sce.trustAsHtml(html);
        };

        $scope.showAllServices = function($event, service){
            var parentNode = $($event.target.parentElement),
                linkNode = parentNode.find(".serviceShowMoreLink"),
                iconNode = parentNode.find(".serviceShowMoreIcon");

            service.showMoreServices = (service.showMoreServices===false)? true : false;
            var linkText = (linkNode.text().trim()==="Show all") ? "Show less" : "Show all";
            linkNode.text(linkText);

            if(service.showMoreServices){
                iconNode.addClass("fa-angle-up");
                iconNode.removeClass("fa-angle-down");
            }else{
                iconNode.removeClass("fa-angle-up");
                iconNode.addClass("fa-angle-down");
            }
        }
        
        
       
    }]);
