
byControllers.controller('BYHomePromoController', ['$scope', '$rootScope', '$routeParams', '$timeout', '$location', 'DiscussPage', '$sce', '$window','FindServices',
    function ($scope, $rootScope, $routeParams, $timeout, $location, DiscussPage, $sce, $window,FindServices) {
        $scope.getPromoData = function(){
             DiscussPage.get({discussType:'P',isPromotion:true,p:0,s:$scope.$parent.contentSize,sort:"lastModifiedAt"},
                     function(value){
                         $scope.promo = value.data.content;
                         $scope.promoPageInfo = BY.byUtil.getPageInfo(value.data);
                         $scope.promoPageInfo.isQueryInProgress = false;
                     },
                     function(error){
                         console.log("DiscussPage");
                     });
        };
        $scope.getPromoData();

        $scope.showMore = function(discussType){
            $location.path($location.$$path).search({type: "promo"});
        };

        $scope.loadMore = function($event){
            if($scope.promoPageInfo && !$scope.promoPageInfo.lastPage && !$scope.promoPageInfo.isQueryInProgress ){
                $scope.promoPageInfo.isQueryInProgress = true;
                var p = $scope.promoPageInfo.number + 1,
                    s = $scope.promoPageInfo.size;

                DiscussPage.get({discussType: $scope.contentType, isPromotion:true, p:p, s:s, sort:"lastModifiedAt"},
                    function(value){
                        if(value.data.content.length > 0){
                            $scope.promoPageInfo.isQueryInProgress = false;
                            $scope.promo = $scope.posts.concat(value.data.content);
                        }
                        $scope.promoPageInfo = BY.byUtil.getPageInfo(value.data);
                        $scope.promoPageInfo.isQueryInProgress = false;
                    },
                    function(error){
                        console.log("DiscussPage");
                    });
            }
        }
    }
]);

