
byControllers.controller('BYHomePromoController', ['$scope', '$rootScope', '$routeParams', '$timeout', '$location', 'DiscussPage', '$sce', '$window','FindServices',
    function ($scope, $rootScope, $routeParams, $timeout, $location, DiscussPage, $sce, $window,FindServices) {
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
]);

