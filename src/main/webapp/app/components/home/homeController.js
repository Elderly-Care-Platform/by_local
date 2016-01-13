/**
 * Created by sanjukta on 02-07-2015.
 */
//home
define(['byApp', 'byUtil', 'homePromoController',
        'userTypeConfig',
        'byEditor', 'menuConfig', 'editorController', 'userValidation'],
    function (byApp, byUtil, homePromoController, userTypeConfig, byEditor, menuConfig, editorController, userValidation) {
        function BYHomeController($scope, $rootScope, $routeParams, $location, UserValidationFilter, SessionIdService) {
            $scope.homeSectionConfig = BY.config.menu.home;
            $scope.homeimageConfig = BY.config.menu.homeIcon;
            $scope.moduleConfig = BY.config.menu.moduleConfig;
            $scope.menuMapConfig = $rootScope.menuCategoryMap;
            $scope.menuConfig = BY.config.menu;
            $scope.removeSpecialChars = BY.byUtil.removeSpecialChars;
            $scope.telNo = BY.config.constants.byContactNumber;
            $scope.selectedMenu = $rootScope.menuCategoryMap['564071623e60f5b66f62df27'];
            $scope.loginDetails = {
                "text": "",
                "link": ""
            }

            var cntAnimDuration = 1000,
                init = initialize();


            function updateMetaTags() {
                var metaTagParams = BY.config.seo.home;
                BY.byUtil.updateMetaTags(metaTagParams);
            }

            function initialize() {
                var isLoggedinUser = UserValidationFilter.getUserSessionType();
                if ($rootScope.totalServiceCount) {
                    animateCounter($rootScope.totalServiceCount, $(".HomeSevicesCnt"));
                }

                if ($rootScope.totalHousingCount) {
                    animateCounter($rootScope.totalHousingCount, $(".HomeHousingCnt"));
                }

                if ($rootScope.totalProductCount) {
                    animateCounter($rootScope.totalProductCount, $(".HomeProductCnt"));
                }


                if(isLoggedinUser){
                    $scope.loginDetails.text = "Logout";
                    $scope.loginDetails.link = apiPrefix + "#!/users/logout/" + SessionIdService.getSessionId();
                }else{
                    $scope.loginDetails.text = "Join us";
                    $scope.loginDetails.link = apiPrefix + "#!/users/login";
                }
                updateMetaTags();
            }


            function animateCounter(count, target) {
                $({someValue: 0}).animate({someValue: count}, {
                    duration: cntAnimDuration,
                    easing: 'swing',
                    step: function () {
                        target.text(Math.round(this.someValue));
                    }
                });
            };

            $scope.$on('directoryCountAvailable', function (event, args) {
                animateCounter($rootScope.totalServiceCount, $(".HomeSevicesCnt"));
                animateCounter($rootScope.totalHousingCount, $(".HomeHousingCnt"));
            });

            $scope.$on('productCountAvailable', function (event, args) {
                animateCounter($rootScope.totalProductCount, $(".HomeProductCnt"));
            });

            $scope.exitEditorDiscuss = function (type, event) {
                event.stopPropagation();
                $(".by_homeEditor").animate({width: '50%', height: '171px', marginBottom: '20px'}, "500");
                $(".by_homeEditorShow").hide();
                $(".by_homeTextareaShow").show();
                $(".by_homeTalk").animate({width: '49%'}, "500");
                $(".by_homeEditorShow").slideUp("100", function () {
                    BY.byEditor.removeEditor();
                    //$route.reload();
                });




            }
        }

        BYHomeController.$inject = ['$scope', '$rootScope', '$routeParams', '$location', 'UserValidationFilter', 'SessionIdService'];
        byApp.registerController('BYHomeController', BYHomeController);

        return BYHomeController;
    });


