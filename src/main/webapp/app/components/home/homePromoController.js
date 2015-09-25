define(['byApp', 'byUtil'], function(byApp, byUtil) {
    function BYHomePromoController($scope, $rootScope, $routeParams, $timeout, $location, DiscussPage){
        var contentSize = 10;
        $scope.getPromoData = function(){
            DiscussPage.get({discussType:'P',isPromotion:true,p:0,s:contentSize,sort:"lastModifiedAt"},
                function(value){
                    $scope.promo = value.data.content;
                },
                function(error){
                    console.log("DiscussPage");
                });
        };
        $scope.getPromoData();
    }

    BYHomePromoController.$inject = ['$scope', '$rootScope', '$routeParams', '$timeout', '$location', 'DiscussPage'];
    byApp.registerController('BYHomePromoController', BYHomePromoController);
    return BYHomePromoController;
});


