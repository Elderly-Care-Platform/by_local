define(['byApp', 'menuConfig', 'discussCtrl', 'discussLeftCtrl'], function (byApp, menuConfig, discussCtrl, discussLeftCtrl) {
    'use strict';

    function DiscussMenuCtrl($scope, $rootScope, $location, $route, $routeParams) {

        $scope.selectedMenuId = $routeParams.menuId;
        $scope.moduleConfig = BY.config.menu.moduleConfig;
        $scope.menuConfig = BY.config.menu;
        $scope.isLeafMenuSelected = false;

        var initialize = getMenuLevels();
        
        $scope.removeSpecialChars = BY.byUtil.removeSpecialChars;
        
        $scope.telNo = BY.config.constants.byContactNumber;
        $scope.showMoreMenu =  false;

        $scope.subMenuTabMobileShow = function () {
            /*if($scope.isLeafMenuSelected == false){
                $(".by_mobile_leftPanel_image").animate({left: "90%"}, {duration: 400});
                $(".by_mobile_leftPanel_image").css('background', "url('assets/img/community/mobile/humburger-min.png?versionTimeStamp=%PROJECT_VERSION%')");
                $(".by_mobile_leftPanel_hide").animate({left: "0%"}, {duration: 400});
            } */
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

        $scope.setActiveLink = function () {
            /*$("#" + $scope.setTabId).addClass('by_subMenu_contentItem_active');
             var index = $("#" + $scope.setTabId).parents().parents().index();*/
        };

        function getLeafMenu(menu) {
            var ret = null;
            if (menu.children.length > 0) {
                ret = getLeafMenu(menu.children[0]);
            } else {
                ret = menu;
            }
            return ret;
        }

        function getTabMenu(menu) {
            var ret = null;
            if (menu.ancestorIds.length === 1) {
                ret = menu;

            } else {
                ret = getTabMenu($rootScope.menuCategoryMap[menu.ancestorIds[menu.ancestorIds.length - 1]]);
            }
            return ret;
        }


        function getMenuLevels() {
            var selectedMenu = $rootScope.menuCategoryMap[$scope.selectedMenuId];
            //console.log(selectedMenu);

            if (selectedMenu.ancestorIds.length == 0) {
                $scope.menuLevel1 = selectedMenu.children[0];
                //$scope.menuLevel2 = getLeafMenu($scope.menuLevel1);
                $scope.menuLevel2 = selectedMenu;
            } else if (selectedMenu.ancestorIds.length == 1) {
                $scope.menuLevel1 = selectedMenu;
               // $scope.menuLevel2 = getLeafMenu($scope.menuLevel1);
                $scope.menuLevel2 = selectedMenu;
            } else if (selectedMenu.children.length == 0) {
                $scope.isLeafMenuSelected = true;
                $scope.menuLevel2 = selectedMenu;
                $scope.menuLevel1 = getTabMenu($scope.menuLevel2);
            }

            //console.log($scope.menuLevel1);
            //console.log($scope.menuLevel2);    
            $scope.categoryLists = [];
            var array = $scope.menuLevel1.children;            
            for (var i = 0; i < array.length; i++) {                   
                if(array[i].children == null || array[i].children.length == 0){
                    $scope.categoryLists.push(array[i]);
                }else{
                    $scope.categoryLists = $scope.categoryLists.concat(array[i].children);
                }              
            } 
        };

        
        $scope.showAllMenu = function ($event, menu) {               
            $scope.showMoreMenu = ($scope.showMoreMenu === false) ? true : false;
            setTimeout(function(){
                $scope.smartHeight = $(".by_subMenu").height() + 80 + 57;
                BY.byUtil.smartScroll($scope.smartHeight);
            }, 100);
        }


    }


    DiscussMenuCtrl.$inject = ['$scope', '$rootScope', '$location', '$route', '$routeParams'];
    byApp.registerController('DiscussMenuCtrl', DiscussMenuCtrl);
    return DiscussMenuCtrl;

});
