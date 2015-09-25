/**
 * Created by sanjukta on 02-07-2015.
 */
//home
define(['byApp', 'byUtil', 'homePromoController',
    'discussLikeController',
    'shareController',
    'userTypeConfig',
    'byEditor',
    'homeContentController', 'homeConfig'],
    function(byApp, byUtil, homePromoController, discussLikeController,
             shareController, userTypeConfig, byEditor,
             homeContentController, homeConfig) {
    function BYHomeController($scope, $rootScope, $routeParams, $location) {
        $scope.carousalType = "carousel";
        $('.carousel').carousel({
            interval: 8000
        });
        $('.carousel').carousel('cycle');
        $scope.currentAcceleratorSelected = "";
        $scope.showFeaturedTag = false;

        $scope.homeViews = {};
        $scope.homeViews.contentPanel = "app/components/home/homeContentPanel.html?versionTimeStamp=%PROJECT_VERSION%";

        if ($routeParams.type === "P" || $routeParams.type === "Q" || $routeParams.type === "S" || $routeParams.type === "promo") {
            $scope.contentType = $routeParams.type;
            $("#homeContainer").hide();
        } else {
            $scope.contentType = "all";
        }

        $scope.add = function (type) {
            require(['editorController']);
            $("#homeContainer").hide();
            $scope.currentView = "editor";
            $scope.homeViews.contentPanel = "app/shared/editor/" + type + "EditorPanel.html?versionTimeStamp=%PROJECT_VERSION%";
            window.scrollTo(0, 0);
        }

        $scope.postSuccess = function () {
            window.scrollTo(0, 0);
            $("#homeContainer").show();
            $(".homeSlider").show();
            $scope.homeViews.contentPanel = "app/components/home/homeContentPanel.html?versionTimeStamp=%PROJECT_VERSION%";
        };

        (function(){
            var metaTagParams = {
                title:  "Home",
                imageUrl:   "",
                description:   "",
                keywords:[]
            }
            BY.byUtil.updateMetaTags(metaTagParams);
        })();

        $scope.scrollToId = function (id) {
            $scope.currentAcceleratorSelected = "";
            if (id) {
                var tag = $("#" + id + ":visible");
                if (tag.length > 0) {
                    $('html,body').animate({scrollTop: tag.offset().top - $(".breadcrumbs").height() - $(".header").height()}, 'slow');
                }

            } else {
                window.scrollTo(0, 0);
            }
        }



        $scope.go = function ($event, type, id, discussType) {
            $event.stopPropagation();
            if (type === "id") {
                $location.path('/discuss/' + id);
            } else if (type === "menu") {
                var menu = $rootScope.menuCategoryMap[id];
                if(menu.module===0){
                    $location.path("/discuss/list/"+menu.displayMenuName+"/"+menu.id+"/all/");
                }else if(menu.module===1){
                    $location.path("/services/list/"+menu.displayMenuName+"/"+menu.id+"/all/");
                }else{
                    //nothing as of now
                }
            } else if (type === "accordian") {
                $($event.target).find('a').click();
            } else if(type === "comment") {
                $location.path('/discuss/' + id).search({comment: true});
            }
        }

        //for featured services
        $scope.location = function ($event, userId, userType) {
            $event.stopPropagation();
            if (userId && userType.length > 0) {
                $location.path('/profile/' + userType[0] + '/' + userId);
            }
        };
        //for featured services
        $scope.profileImage = function (service) {
            service.profileImage = BY.config.profile.userType[service.userTypes[0]].profileImage;
        };

        $scope.showMore = function(discussType){
            $location.path($location.$$path).search({type: discussType});
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

        $scope.homeSection = BY.config.home;
    }

    BYHomeController.$inject = ['$scope', '$rootScope', '$routeParams', '$location'];
    byApp.registerController('BYHomeController', BYHomeController);

    return BYHomeController;
});


