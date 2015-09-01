//DIscuss All
byControllers.controller('ProfileController', ['$scope', '$rootScope', '$location', '$route', '$routeParams', 'UserProfile', '$sce', 'DiscussPage',
    function ($scope, $rootScope, $location, $route, $routeParams, UserProfile, $sce, DiscussPage) {

        $scope.profileViews = {};
        $scope.profileType = $routeParams.profileType;
        $scope.profileId = $routeParams.profileId;
        $scope.userName = $routeParams.userName ? BY.validateUserName($routeParams.userName) : "Anonymous";
        $scope.isIndividualProfile = false;
        $scope.isAllowedToReview = false;
        //$scope.reviewContentType = BY.config.profile.userType[$scope.profileType].reviewContentType;
        //$scope.label = BY.config.profile.userType[$scope.profileType].label;
        $scope.isShowPosts = true;
        $scope.profileViews.leftPanel = "app/components/profile/profileLeftPanel.html?versionTimeStamp=%PROJECT_VERSION%";


        var updateMetaTags = function(){
            var metaTagParams = {
                title: "Beautiful Years | Profile",
                imageUrl: "",
                description: ""
            }
            BY.byUtil.updateMetaTags(metaTagParams);
        };

        var fetchProfileData = function(){
            $("#preloader").show();
            $scope.profileData = UserProfile.get({userId: $scope.profileId}, function (profile) {
                $scope.profileData = profile.data;
                if ($scope.profileData.userTypes.length > 0) {
                    $scope.profileType = $scope.profileData.userTypes[0];
                }

                $scope.reviewContentType = BY.config.profile.userType[$scope.profileType].reviewContentType;
                $scope.label = BY.config.profile.userType[$scope.profileType].label;


                $scope.profileViews.contentPanel = BY.config.profile.userType[$scope.profileType].contentPanel;

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
                $scope.postsUser = value.data.content;
                $scope.postsPagination = {};
                $scope.postsPagination.totalPosts = value.data.total;
                $scope.postsPagination.noOfPages = Math.ceil(value.data.total/value.data.size);
                $scope.postsPagination.currentPage = value.data.number;
                //$scope.postsPagination.loadMoreFunc = $scope.postsByUser;
                if ($scope.postsUser.length === 0) {
                    $scope.isShowPosts = false;
                }
            }, function (error) {
                console.log(error);
            });
        };

        $scope.qaByUser = function (page, size) {
            var params = {p:page, s:size, discussType: "Q", userId: $scope.profileId};
            DiscussPage.get(params, function (value) {
                $scope.qaUser = value.data.content;
                $scope.qaPagination = {};
                $scope.qaPagination.totalPosts = value.data.total;
                $scope.qaPagination.noOfPages = new Array(Math.ceil(value.data.total/value.data.size));
                $scope.qaPagination.currentPage = value.data.number;
            }, function (error) {
                console.log(error);
            });
        };


        var fetchUserPostedContent = function(){
            var pageNumber = 0, size = 3;
            $scope.postsByUser(pageNumber, size);
            $scope.qaByUser(pageNumber, size);
        };

        var initUserProfile = function(){
            updateMetaTags();
            fetchProfileData();
            fetchUserPostedContent();
        };

        initUserProfile();

        $scope.gotoHref = function (id) {
            if (id) {
                var tag = $("#" + id + ":visible");
                if (tag.length > 0) {
                    $('html,body').animate({scrollTop: tag.offset().top - $(".breadcrumbs").height() - $(".header").height()}, 'slow');
                }
            }
        };


        //$scope.reviewContent = function () {
        //    // $scope.profileViews.contentPanel = BY.config.profile.userType[$scope.profileType].reviewContentPanel;
        //}
        //
        //$scope.displayProfile = function () {
        //    $scope.profileViews.contentPanel = BY.config.profile.userType[$scope.profileType].contentPanel;
        //}

        $scope.trustForcefully = function (html) {
            return $sce.trustAsHtml(html);
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


        $scope.go = function ($event, type, id, discussType) {
            $event.stopPropagation();
            if (type === "id") {
                $location.path('/discuss/' + id);
            } else if (type === "menu") {
                var menu = $rootScope.menuCategoryMap[id];
                if (menu.module === 0) {
                    $location.path("/discuss/list/" + menu.displayMenuName + "/" + menu.id + "/all/");
                } else if (menu.module === 1) {
                    $location.path("/services/list/" + menu.displayMenuName + "/" + menu.id + "/all/");
                } else {
                    //nothing as of now
                }
            } else if (type === "accordian") {
                $($event.target).find('a').click();
            } else if (type === "comment") {
                $location.path('/discuss/' + id).search({comment: true});
            }
        }

        $scope.showPosts = function (param) {
            $scope.isShowPosts = param;
        };

    }]);
