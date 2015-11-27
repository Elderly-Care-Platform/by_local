define(['byApp', 'byUtil', 'userTypeConfig', 'reviewRateController'],
    function(byApp, byUtil, userTypeConfig, reviewRateController) {
    function ProfileController($scope, $rootScope, $window, $location, $routeParams, ReviewRateProfile, UserProfile, $sce, DiscussPage){
        $scope.profileViews = {};
        $scope.profileType = $routeParams.profileType;
        $scope.profileId = $routeParams.profileId;
        $scope.userName = $routeParams.userName ? BY.byUtil.validateUserName($routeParams.userName) : "Anonymous";
        $scope.housingFacilityId = $routeParams.housingFacilityId ? $routeParams.housingFacilityId : null;

        $scope.isIndividualProfile = false;
        $scope.isAllowedToReview = false;
        $scope.flags = {};
        $scope.flags.isByAdminVerified = false;
        var pageSize = 10;
        var reviewDetails = new ReviewRateProfile();

        /*var updateMetaTags = function(){
            var metaTagParams = {
                title: "Beautiful Years | Profile",
                imageUrl: "",
                description: "",
                keywords:[]
            }
            BY.byUtil.updateMetaTags(metaTagParams);
        };*/
        
        $scope.tooltipText = function(){        	
        	$('[data-toggle="tooltip"]').tooltip(); 
        }

        var fetchProfileData = function(){
            $("#preloader").show();
            $scope.profileData = UserProfile.get({userId: $scope.profileId}, function (profile) {
                    $scope.profileData = profile.data;
                    if ($scope.profileData.userTypes.length > 0) {
                        $scope.profileType = $scope.profileData.userTypes[0];
                    }

                    $scope.reviewContentType = BY.config.profile.userType[$scope.profileType].reviewContentType;
                    $scope.label = BY.config.profile.userType[$scope.profileType].label;

                    if(BY.config.profile.userType[$scope.profileType].leftPanelCtrl){
                        require([BY.config.profile.userType[$scope.profileType].leftPanelCtrl], function(leftPanelCtrl) {
                            $scope.profileViews.leftPanel = BY.config.profile.userType[$scope.profileType].leftPanel;
                            $scope.$apply();
                        });
                    }else{
                        $scope.profileViews.leftPanel = BY.config.profile.userType[$scope.profileType].leftPanel;
                    }


                    require([BY.config.profile.userType[$scope.profileType].controller], function(profileCtrl) {
                        $scope.profileViews.contentPanel = BY.config.profile.userType[$scope.profileType].contentPanel;
                        $scope.$apply();
                    });

                    if (BY.config.profile.userType[$scope.profileType].category === '0') {
                        $scope.isIndividualProfile = true;
                    }

                    if (localStorage.getItem("USER_ID") !== $scope.profileData.userId) {
                        $scope.isAllowedToReview = true;
                    }
                    $("#preloader").hide();
                },
                function (error) {
                    console.log("institution profile error");
                    $("#preloader").hide();
                });
        };


        $scope.postsByUser = function (page, size) {
            var params = {p:page, s:size, discussType: "P", userId: $scope.profileId};
            DiscussPage.get(params, function (value) {
                if(value.data.content.length > 0){
                    require(['discussLikeController', 'shareController'], function(discussLikeCtrl, shareCtrl){
                        $scope.$apply();
                    });
                    $scope.postsUser = value.data.content;
                    $scope.postsPagination = {};
                    $scope.postsPagination.totalPosts = value.data.total;
                    $scope.postsPagination.noOfPages = Math.ceil(value.data.total/value.data.size);
                    $scope.postsPagination.currentPage = value.data.number;
                    $scope.postsPagination.pageSize = pageSize;
                    $scope.gotoHref("userPosts");

                }


                //$scope.postsPagination.loadMoreFunc = $scope.postsByUser;
                //if ($scope.postsUser.length === 0) {
                //    $scope.isShowPosts = false;
                //}
            }, function (error) {
                console.log(error);
            });
        };

        $scope.qaByUser = function (page, size) {
            var params = {p:page, s:size, discussType: "Q", userId: $scope.profileId};
            DiscussPage.get(params, function (value) {
                if(value.data.content.length > 0){
                    require(['discussLikeController', 'shareController'], function(discussLikeCtrl, shareCtrl){
                        $scope.$apply();
                    });
                    $scope.qaUser = value.data.content;
                    $scope.qaPagination = {};
                    $scope.qaPagination.totalPosts = value.data.total;
                    $scope.qaPagination.noOfPages = Math.ceil(value.data.total/value.data.size);
                    $scope.qaPagination.currentPage = value.data.number;
                    $scope.qaPagination.pageSize = pageSize;
                    $scope.gotoHref("userQA");
                }

            }, function (error) {
                console.log(error);
            });
        };
        
       


        


        var fetchUserPostedContent = function(){
            var pageNumber = 0;
            $scope.postsByUser(pageNumber, pageSize);
            $scope.qaByUser(pageNumber, pageSize);
        };

        $scope.initUserProfile = function(){
           // updateMetaTags();
            fetchProfileData();
            fetchUserPostedContent();
        };

        $scope.leftPanelHeight = function(){            
            var clientHeight = $( window ).height() - 57;
            $(".by_menuDetailed").css('min-height', clientHeight+"px");
        }

        $scope.gotoHref = function (id) {
            if (id) {
                if($rootScope.windowWidth < 720){
                    $(".by_mobile_leftPanel_image").animate({left: "0%"}, {duration: 400});
                    $(".by_mobile_leftPanel_image").css('background', "url('assets/img/community/mobile/humburgerG.png?versionTimeStamp=%PROJECT_VERSION%')");
                    $(".by_mobile_leftPanel_hide").animate({left: "-90%"}, {duration: 400});
                }                
                var tag = $("#" + id + ":visible");
                if (tag.length > 0) {
                    $('html,body').animate({scrollTop: tag.offset().top - 57}, 'slow');
                }
            }
        };

        $scope.trustForcefully = function (html) {
            return $sce.trustAsHtml(html);
        };
        
        $scope.trustAsResourceUrl = function(url) {
            return $sce.trustAsResourceUrl(url);
        };

        $scope.showAllServices = function ($event, service) {
            var parentNode = $($event.target.parentElement),
                linkNode = parentNode.find(".serviceShowMoreLink"),
                iconNode = parentNode.find(".serviceShowMoreIcon");

            service.showMoreServices = (service.showMoreServices === false) ? true : false;
            var linkText = (linkNode.text().trim() === "Show all") ? "Show less" : "Show all";
            linkNode.text(linkText);

            if (service.showMoreServices) {
                iconNode.addClass("fa-angle-up");
                iconNode.removeClass("fa-angle-down");
            } else {
                iconNode.removeClass("fa-angle-up");
                iconNode.addClass("fa-angle-down");
            }
        };


        $scope.location = function ($event, url, params) {
            $event.stopPropagation();
            if(url){
                if(params && params.length > 0){
                    for(var i=0; i < params.length; i++){
                        url = url + "/" + params[i];
                    }
                }
                $location.path(url);
            }
        }

        $scope.go = function($event, type, id, discussType){
            $event.stopPropagation();
            if(type === "detail"){
                $location.path('/discuss/'+id);
            } else if(type === "menu" && $rootScope.menuCategoryMap){
                var menu = $rootScope.menuCategoryMap[id];
                //$(".selected-dropdown").removeClass("selected-dropdown");
                //$("#" + menu.id).parents(".dropdown").addClass("selected-dropdown");
                if(menu.module===0){
                    $location.path("/discuss/list/"+menu.displayMenuName+"/"+menu.id+"/all");
                }else if(menu.module===1){
                    $location.path("/services/list/"+menu.displayMenuName+"/"+menu.id+"/all/");
                }else{
                    //nothing as of now
                }
            }else if(type === "accordian"){
                $($event.target).find('a').click();
            }else if(type === "comment") {
                $location.path('/discuss/' + id).search({comment: true});
            }
        }

         $scope.subMenuTabMobileShow = function () {
            $(".by_mobile_leftPanel_image").click(function () {
                if ($(".by_mobile_leftPanel_hide").css('left') == '0px') {
                    $(".by_mobile_leftPanel_image").animate({left: "0%"}, {duration: 400});
                    $(".by_mobile_leftPanel_image").css('background', "url('assets/img/community/mobile/humburgerG.png?versionTimeStamp=%PROJECT_VERSION%')");
                    $(".by_mobile_leftPanel_hide").animate({left: "-90%"}, {duration: 400});
                } else {
                    $(".by_mobile_leftPanel_image").animate({left: "90%"}, {duration: 400});
                    $(".by_mobile_leftPanel_image").css('background', "url('assets/img/community/mobile/humburger-minG.png?versionTimeStamp=%PROJECT_VERSION%')");
                    $(".by_mobile_leftPanel_hide").animate({left: "0%"}, {duration: 400});
                }
            });
        };

       
      

       

    }

    ProfileController.$inject = ['$scope', '$rootScope', '$window', '$location', '$routeParams', 'ReviewRateProfile', 'UserProfile', '$sce', 'DiscussPage'];
    byApp.registerController('ProfileController', ProfileController);
    return ProfileController;
});