
byControllers.controller('BYHomePromoController', ['$scope', '$rootScope', '$routeParams', '$timeout', '$location', 'DiscussPage', '$sce', '$window','FindServices',
    function ($scope, $rootScope, $routeParams, $timeout, $location, DiscussPage, $sce, $window,FindServices) {
		
	$scope.getPromoDate = function(){
		 DiscussPage.get({discussType: 'P',isFeatured:false,p:0,s:$scope.contentSize,sort:"lastModifiedAt"},
                 function(value){
                     $scope.promo = value.data.content;
                     $scope.promoPageInfo = BY.byUtil.getPageInfo(value.data);
                     $scope.promoPageInfo.isQueryInProgress = false;
                 },
                 function(error){
                     console.log("DiscussPage");
                 });
	};
	$scope.getPromoDate();
        
    }]);

