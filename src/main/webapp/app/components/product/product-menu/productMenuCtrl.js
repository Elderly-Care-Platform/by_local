define(['byApp', 'productReviewsCtrl', 'editorController'], function (byApp, productReviewsCtrl, editorController) {
    'use strict';

    function ProductMenuCtrl($scope, $rootScope, $window, $location, $route, $routeParams) {
        $scope.selectedMenuId       = $routeParams.menuId;
        $scope.selectedMenu         = $rootScope.menuCategoryMap[$scope.selectedMenuId];
        $scope.selectedParent       = $rootScope.menuCategoryMap[$scope.selectedMenu.ancestorIds[$scope.selectedMenu.ancestorIds.length - 1]];
        $scope.menuConfig           = BY.config.menu;

        $scope.expandParent = function (menuId) {
            if (menuId && menuId.toString() == $scope.selectedMenuId) {
                var expandNodeId;
                if($scope.selectedParent && $scope.selectedParent.displayMenuName && $scope.selectedParent.displayMenuName.toLowerCase() === "shop"){
                    expandNodeId = $scope.selectedMenuId;
                }else{
                    expandNodeId = $scope.selectedParent.id;
                }
                //$scope.selectedParent = $rootScope.menuCategoryMap[$scope.selectedMenu.ancestorIds[$scope.selectedMenu.ancestorIds.length - 1]];
                var target = $("#" + expandNodeId).children('ul.tree');
                target.toggle(200, function () {
                    if (target.is(':visible')) {
                        $("#" + expandNodeId).children('.by_treeMenuIcon').addClass('by_treeMenuIconMinus');
                    } else {
                        $("#" + expandNodeId).children('.by_treeMenuIcon').removeClass('by_treeMenuIconMinus');
                    }
                });
            }
        };

        $scope.setContentHeight = function(cH, cW){
            $(".contentPanel").css('min-height', cH);  
        }

        $scope.smartScroll = function(){
            var clientHeight = $( window ).height();
             $(".by_subMenuPlus").css('min-height', (clientHeight - 57)+"px");
            angular.element($window).bind("scroll", function() {
                var winTop = $(this).scrollTop(),
                    winBottom = winTop + $(this).height(),
                    left = $('.by_subMenuPlus'),
                    leftBottom = left.height() + 100;

                //when the user reached the bottom of '#leftShort' set its position to fixed to prevent it from moving on scroll
                if (winBottom >= leftBottom) {

                    left.css({
                        'position': 'fixed',
                        'bottom': '0px'
                    });
                } else {
                    //when the user scrolls back up revert its position to relative
                    left.css({
                        'position': 'relative',
                        'bottom': 'auto'
                    });
                }
            });
        };

        $scope.toggleMenu = function ($event) {
            //console.log($($event.target).parent().children('ul.tree'));
            var target = $($event.target).parent().children('ul.tree');
            target.toggle(200, function () {
                if (target.is(':visible')) {
                    $($event.target).parent().children('.by_treeMenuIcon').addClass('by_treeMenuIconMinus');
                } else {
                    $($event.target).parent().children('.by_treeMenuIcon').removeClass('by_treeMenuIconMinus');
                }
            });


        }

        $scope.subMenuTabMobileShow = function () {

            if ($(".by_mobile_leftPanel_hide").css('left') == '0px') {
                $(".by_mobile_leftPanel_image").animate({left: "0%"}, {duration: 400});
                $(".by_mobile_leftPanel_image").css('background', "url('assets/img/community/mobile/humburgerG.png?versionTimeStamp=%PROJECT_VERSION%')");
                $(".by_mobile_leftPanel_hide").animate({left: "-90%"}, 400, function () {
                    $scope.expandParent();
                });
            } else {
                $(".by_mobile_leftPanel_image").animate({left: "90%"}, {duration: 400});
                $(".by_mobile_leftPanel_image").css('background', "url('assets/img/community/mobile/humburger-minG.png?versionTimeStamp=%PROJECT_VERSION%')");
                $(".by_mobile_leftPanel_hide").animate({left: "0%"}, 400, function () {
                    $scope.expandParent();
                });
            }


        };

        if($scope.showEditor == false){
            $scope.showEditorPage = function(){
                $location.search('showEditor', 'true');
                BY.byEditor.removeEditor();
                var menuId = $scope.menuConfig.reveiwsMenuConfig['product_review'].id;
                $location.path("/shop/reviews/"+menuId);
            }
        }

        $scope.getSlug = function(slug){
            //var newSlug = slug.replace(/\s+/g, '-').toLowerCase();
            var newSlug = slug.replace(/[,/\s]+/g, '-').toLowerCase();
            newSlug = newSlug.replace(/[-]+/g, '-');
            return newSlug;
        }

    }


    ProductMenuCtrl.$inject = ['$scope', '$rootScope', '$window', '$location', '$route', '$routeParams'];
    byApp.registerController('ProductMenuCtrl', ProductMenuCtrl);
    return ProductMenuCtrl;

});
