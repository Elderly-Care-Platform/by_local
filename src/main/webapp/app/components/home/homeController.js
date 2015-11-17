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
            $scope.menuUrlConfig = BY.config.menu.menuUrl;
            $scope.menuMapConfig = $rootScope.menuCategoryMap;

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
                        $('#'+target).text(Math.round(this.someValue));
                    }
                });
            };
        }

        BYHomeController.$inject = ['$scope', '$rootScope', '$routeParams', '$location'];
        byApp.registerController('BYHomeController', BYHomeController);

        return BYHomeController;
    });


