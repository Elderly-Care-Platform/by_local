define(['byApp'], function (byApp) {
    'use strict';

    function ProductMenuCtrl($scope, $rootScope, $window, $location, $route, $routeParams) {

        $scope.selectedMenuId = $routeParams.menuId;



        $scope.smartScroll = function(){
            var selectedNode = $rootScope.menuCategoryMap[$scope.selectedMenuId];
            $scope.selectedParent = $rootScope.menuCategoryMap[selectedNode.ancestorIds[selectedNode.ancestorIds.length -1]];
            var ul = $('.smartScroll-wrapper');
            var heightD = $(window).height()  - $(".footer-v1").height() - $(".header").height();
            var heightS = $('.smartScroll-wrapper').height() - heightD;

            //angular.element($window).bind("scroll", function() {
            //    var scroller_anchor = ul.offset().top;
            //    if ($(this).scrollTop() >= heightS){
            //        ul.css({
            //            'position': 'fixed',
            //            'marginTop': - ( heightS + 67 )
            //        });
            //    }else if($(this).scrollTop() < heightS){
            //        ul.css({
            //            'position': 'static',
            //            'marginTop': 0
            //        });
            //    }
            //}); 
console.log($scope.selectedParent);
           
        };

         $scope.subMenuTabMobileShow = function(){
           
                if($(".by_mobile_leftPanel_hide").css('left') == '0px'){
                    $(".by_mobile_leftPanel_image").animate({left: "0%"},{duration : 400});
                    $(".by_mobile_leftPanel_image").css('background', "url('assets/img/community/mobile/humburger.png?versionTimeStamp=%PROJECT_VERSION%')");
                    $(".by_mobile_leftPanel_hide").animate({left: "-90%"}, 400, function(){
                        $scope.smartScroll();
                        $scope.$apply();
                         console.log('open');
                    });
                } else{
                    $(".by_mobile_leftPanel_image").animate({left: "90%"},{duration : 400});
                    $(".by_mobile_leftPanel_image").css('background', "url('assets/img/community/mobile/humburger-min.png?versionTimeStamp=%PROJECT_VERSION%')");
                    $(".by_mobile_leftPanel_hide").animate({left: "0%"}, 400, function(){
                        $scope.smartScroll();
                        $scope.$apply();
                        console.log('close');
                    });
                }
                $scope.$apply();
                
           
        };



    }


    ProductMenuCtrl.$inject = ['$scope', '$rootScope', '$window', '$location', '$route', '$routeParams'];
    byApp.registerController('ProductMenuCtrl', ProductMenuCtrl);
    return ProductMenuCtrl;

});
