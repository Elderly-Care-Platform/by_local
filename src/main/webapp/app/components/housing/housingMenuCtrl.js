define(['byApp'], function (byApp) {
    'use strict';

    function HousingMenuCtrl($scope, $rootScope, $window, $location, $route, $routeParams) {

        $scope.selectedMenuId = $routeParams.menuId;
        $scope.menuUrl= BY.config.menu.menuUrl;
        
        $scope.expandParentMenu = function(){
            var selectedNode = $rootScope.menuCategoryMap[$scope.selectedMenuId];
            $scope.selectedParent = $rootScope.menuCategoryMap[selectedNode.ancestorIds[selectedNode.ancestorIds.length -1]];
        }


        $scope.smartScroll = function(){
            angular.element($window).bind("scroll", function() {
                var winTop = $(this).scrollTop(),
                    winBottom = winTop + $(this).height(),
                    left = $('.by_subMenuPlus'),
                    leftBottom = left.height() + 261;
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

        $scope.subMenuTabMobileShow = function(){
            if($(".by_mobile_leftPanel_hide").css('left') == '0px'){
                $(".by_mobile_leftPanel_image").animate({left: "0%"},{duration : 400});
                $(".by_mobile_leftPanel_image").css('background', "url('assets/img/community/mobile/humburger.png?versionTimeStamp=%PROJECT_VERSION%')");
                $(".by_mobile_leftPanel_hide").animate({left: "-90%"}, 400, function(){
                    $scope.$apply();
                });
            } else{
                $(".by_mobile_leftPanel_image").animate({left: "90%"},{duration : 400});
                $(".by_mobile_leftPanel_image").css('background', "url('assets/img/community/mobile/humburger-min.png?versionTimeStamp=%PROJECT_VERSION%')");
                $(".by_mobile_leftPanel_hide").animate({left: "0%"}, 400, function(){
                    //$scope.smartScroll();
                    $scope.$apply();
                });
            }
            $scope.$apply();
        };

    }


    HousingMenuCtrl.$inject = ['$scope', '$rootScope', '$window', '$location', '$route', '$routeParams'];
    byApp.registerController('HousingMenuCtrl', HousingMenuCtrl);
    return HousingMenuCtrl;

});
