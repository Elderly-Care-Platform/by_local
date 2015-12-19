define(['byApp', 'byUtil'], function(byApp, byUtil) {
    function BYAboutUsController($scope, $rootScope, $routeParams, $timeout, $location, $sce) {
        $scope.currentAcceleratorSelected = "";
        $scope.currentView = "aboutUs";



        (function(){
            var metaTagParams = {
                title:  "About Us",
                imageUrl:   "",
                description:   "",
                keywords:[]
            }
            BY.byUtil.updateMetaTags(metaTagParams);
        })();


        $scope.getHref = function(module, menuId, type, queryParams){
            var menu = $rootScope.menuCategoryMap[menuId], newHref;
            var slug = menu.ancestorIds.length > 0 ? BY.byUtil.removeSpecialChars($rootScope.menuCategoryMap[menuId].displayMenuName) : null;

            if(slug){
                newHref = BY.config.menu.modules[module].baseUrl + "/"+ BY.byUtil.removeSpecialChars($rootScope.menuCategoryMap[menuId].displayMenuName) +
                    "/"+ $rootScope.menuCategoryMap[menuId].id + "/";
            }else{
                newHref = BY.config.menu.modules[module].baseUrl + "/"+ $rootScope.menuCategoryMap[menuId].id + "/";
            }


            if(type){
                newHref = newHref + type + "/";
            }

            if(queryParams && Object.keys(queryParams).length > 0){
                newHref = newHref + "?"
                angular.forEach(queryParams, function (value, key) {
                    newHref = newHref + key + "=" + value + "&";
                });
            }


            return newHref;

        };

        $scope.leftPanelHeight = function(){
            var clientHeight = $( window ).height() - 57;
            $(".by_menuDetailed").css('height', clientHeight+"px");
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

        $scope.$watch("articles", function (value) {
            $timeout(
                function () {
                    $scope.scroll($scope.currentAcceleratorSelected)
                }, 100);
        });
        $scope.aboutUsViews = {};
        $scope.aboutUsViews.contentPanel = "app/components/aboutUs/aboutUsContentPanel.html?versionTimeStamp=%PROJECT_VERSION%";


        $scope.add = function (type) {
            require(['editorController'], function(editorController){
                BY.byEditor.removeEditor();
                $scope.error = "";
                $scope.currentView = "editor";
                $scope.aboutUsViews.contentPanel = "app/shared/editor/" + type + "EditorPanel.html?versionTimeStamp=%PROJECT_VERSION%";
                window.scrollTo(0, 0);
                $scope.$apply();
            });
        };


        $scope.postSuccess = function () {
            $scope.aboutUsViews.contentPanel = "app/components/aboutUs/aboutUsContentPanel.html?versionTimeStamp=%PROJECT_VERSION%";
        };


        $scope.accelerate = function (id) {
            $scope.currentAcceleratorSelected = id;
            if ($scope.currentView === "editor") {
                $scope.aboutUsViews.contentPanel = "app/components/aboutUs/aboutUsContentPanel.html?versionTimeStamp=%PROJECT_VERSION%";
                $timeout(
                    function () {
                        $scope.scroll($scope.currentAcceleratorSelected);
                    }, 100);
            } else {
                $scope.scroll($scope.currentAcceleratorSelected);
                $(".by_mobile_leftPanel_image").animate({left: "0%"}, {duration: 400});
                    $(".by_mobile_leftPanel_image").css('background', "url('assets/img/community/mobile/humburgerG.png?versionTimeStamp=%PROJECT_VERSION%')");
                    $(".by_mobile_leftPanel_hide").animate({left: "-90%"}, {duration: 400});
            }

        }

        $scope.scroll = function (id) {
            if (id) {
                var tag = $("#" + id + ":visible");
                if (tag.length > 0) {
                    $('html,body').animate({scrollTop: tag.offset().top - $(".breadcrumbs").height() - $(".header").height()}, 'slow');
                }
            } else {
                window.scrollTo(0, 0);
            }
        }

        $scope.showMore = function(){
            document.getElementById("more_para").style.display = "block";
            document.getElementById("more").style.display = "none";

        }
    }

    BYAboutUsController.$inject = ['$scope', '$rootScope', '$routeParams', '$timeout', '$location', '$sce'];
    byApp.registerController('BYAboutUsController', BYAboutUsController);

    return BYAboutUsController;
});