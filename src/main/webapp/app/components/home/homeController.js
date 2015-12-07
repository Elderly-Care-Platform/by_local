/**
 * Created by sanjukta on 02-07-2015.
 */
//home
define(['byApp', 'byUtil', 'homePromoController',
        'userTypeConfig',
        'byEditor', 'menuConfig'],
    function (byApp, byUtil, homePromoController, userTypeConfig, byEditor, menuConfig) {
        function BYHomeController($scope, $rootScope, $routeParams, $location) {
            $scope.homeViews = {};
            $scope.homeViews.contentPanel = "app/components/home/homeContentPanel.html?versionTimeStamp=%PROJECT_VERSION%";

            $scope.homeSectionConfig = BY.config.menu.home;
            $scope.homeimageConfig = BY.config.menu.homeIcon;
            $scope.moduleConfig = BY.config.menu.moduleConfig;
            $scope.menuMapConfig = $rootScope.menuCategoryMap;
            $scope.menuConfig = BY.config.menu;

            $scope.telNo = BY.config.constants.byContactNumber;
            var cntAnimDuration = 1000;

            (function () {
                var metaTagParams = {
                    title: "Home",
                    imageUrl: "",
                    description: "",
                    keywords: []
                }
                BY.byUtil.updateMetaTags(metaTagParams);
            })();



            $scope.animateCounter = function (count, target) {
                $({someValue: 0}).animate({someValue: count}, {
                    duration: cntAnimDuration,
                    easing: 'swing',
                    step: function () {
                        target.text(Math.round(this.someValue));
                    }
                });
            };

            $scope.$on('directoryCountAvailable', function (event, args) {
                $scope.animateCounter($rootScope.totalServiceCount, $(".HomeSevicesCnt"));
                $scope.animateCounter($rootScope.totalHousingCount, $(".HomeHousingCnt"));
            });

            $scope.$on('productCountAvailable', function (event, args) {
                $scope.animateCounter($rootScope.totalProductCount, $(".HomeProductCnt"));
            });


            if($rootScope.totalServiceCount){
                $scope.animateCounter($rootScope.totalServiceCount, $(".HomeSevicesCnt"));
            }

            if($rootScope.totalHousingCount){
                $scope.animateCounter($rootScope.totalHousingCount, $(".HomeHousingCnt"));
            }

            if($rootScope.totalProductCount){
                $scope.animateCounter($rootScope.totalProductCount, $(".HomeProductCnt"));
            }

            $(".by_ourExpertTop .by_ourExpertThumb").click(function(){
                var index = $(this).index();
                $(".by_ourExpertDesc").hide();
                $(".by_ourExpertThumbArrow").css('visibility', 'hidden');
                $(".by_ourExpertThumbImg").removeClass('by_ourExpertThumbImgActive');
                $(".by_ourExpertThumb").removeClass('by_ourExpertThumbColor');
                $(this).find(".by_ourExpertThumbArrow").css('visibility','visible');
                $(this).find(".by_ourExpertThumbImg").addClass('by_ourExpertThumbImgActive');
                $(this).addClass('by_ourExpertThumbColor');
                $(".by_ourExpertTop .by_ourExpertDesc").eq(index).show();
            });

             $(".by_ourExpertTop .by_ourExpertThumb").hover(function(){
                var index = $(this).index();
                $(".by_ourExpertDesc").hide();
                $(".by_ourExpertThumbArrow").css('visibility', 'hidden');
                $(".by_ourExpertThumbImg").removeClass('by_ourExpertThumbImgActive');
                $(".by_ourExpertThumb").removeClass('by_ourExpertThumbColor');
                $(this).find(".by_ourExpertThumbArrow").css('visibility','visible');
                $(this).find(".by_ourExpertThumbImg").addClass('by_ourExpertThumbImgActive');
                $(this).addClass('by_ourExpertThumbColor');
                $(".by_ourExpertTop .by_ourExpertDesc").eq(index).show();
            });

            $(".by_ourExpertTop2 .by_ourExpertThumb").click(function(){
                var index = $(this).index();
                $(".by_ourExpertDesc").hide();
                $(".by_ourExpertThumbArrow").css('visibility', 'hidden');
                $(".by_ourExpertThumbImg").removeClass('by_ourExpertThumbImgActive');
                $(".by_ourExpertThumb").removeClass('by_ourExpertThumbColor');
                $(this).find(".by_ourExpertThumbArrow").css('visibility','visible');
                $(this).find(".by_ourExpertThumbImg").addClass('by_ourExpertThumbImgActive');
                $(this).addClass('by_ourExpertThumbColor');
                $(".by_ourExpertTop2 .by_ourExpertDesc").eq(index).show();
            });
        }

        BYHomeController.$inject = ['$scope', '$rootScope', '$routeParams', '$location'];
        byApp.registerController('BYHomeController', BYHomeController);

        return BYHomeController;
    });


