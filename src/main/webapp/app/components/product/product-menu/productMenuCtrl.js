define(['byApp'], function (byApp) {
    'use strict';

    function ProductMenuCtrl($scope, $rootScope, $window, $location, $route, $routeParams) {

        $scope.selectedMenuId = $routeParams.menuId;



        $scope.smartScroll = function(){
            var selectedNode = $rootScope.menuCategoryMap[$scope.selectedMenuId],selectedParent, selectedParentNode;
            selectedParent = $rootScope.menuCategoryMap[selectedNode.ancestorIds[selectedNode.ancestorIds.length -1]];
            selectedParentNode = $("#"+selectedParent.id);
            console.log(selectedParentNode);
            if(selectedParentNode){
                selectedParentNode.addClass("open");
            }



            var ul = $('.smartScroll-wrapper');
            var heightD = $(window).height()  - $(".footer-v1").height() - $(".header").height();
            var heightS = $('.smartScroll-wrapper').height() - heightD;

            angular.element($window).bind("scroll", function() {
                var scroller_anchor = ul.offset().top;
                if ($(this).scrollTop() >= heightS){
                    ul.css({
                        'position': 'fixed',
                        'marginTop': - ( heightS + 67 )
                    });
                }else if($(this).scrollTop() < heightS){
                    ul.css({
                        'position': 'static',
                        'marginTop': 0
                    });
                }
            });
        };

    }


    ProductMenuCtrl.$inject = ['$scope', '$rootScope', '$window', '$location', '$route', '$routeParams'];
    byApp.registerController('ProductMenuCtrl', ProductMenuCtrl);
    return ProductMenuCtrl;

});
