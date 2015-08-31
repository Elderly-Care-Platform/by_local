byControllers.controller('IndividualUserProfileController', ['$scope', '$rootScope', '$location', '$route', '$routeParams', 'DiscussPage',
    function ($scope, $rootScope, $location, $route, $routeParams, DiscussPage) {
	 $scope.individualProfile = $scope.$parent.profileData;
     $scope.slideIndex = 1;
     $scope.isShowPosts = true;
     $scope.userName = $scope.$parent.userName;
	 
	 $scope.slideGallery = function(dir){
         if($scope.slideIndex<1){
             $scope.slideIndex = 1;
         }
         $scope.byimageGallery = $(".by-imageGallery").outerWidth() - 60;
         $scope.bygallerycontainer = $(".by-gallery-container").outerWidth();
         $scope.w = $scope.bygallerycontainer / $scope.byimageGallery ;
         //alert($scope.w);
         if($scope.slideIndex < $scope.w  && dir==="r"){
             $('.by-gallery-container').css("-webkit-transform","translate(-"+($scope.byimageGallery)*($scope.slideIndex)+"px, 0px)");
             $scope.slideIndex++;
         }
         if($scope.slideIndex >= 1  && dir==="l"){
             $('.by-gallery-container').css("-webkit-transform","translate(-"+($scope.byimageGallery)*($scope.slideIndex-2)+"px, 0px)");
             $scope.slideIndex--;
         }
     };

     $scope.galleryImage = function(){
     	 var urlPopup = $(".by-imageGallery-item").eq(0).attr('data-popup');
          console.log(urlPopup);
     };


     $scope.galleryClickHover = function(){
         $(".by-imageGallery-item").css('cursor', 'pointer');
         $(".by-imageGallery-item").click(function(){
             var urlPopup = $(this).attr('data-popup');
             $(".by_modal_body").find('img').attr('src', urlPopup);              
             $('#imagemodal').modal('show');

         });
     };
     
     var postsByUser = function(){
    	 var params = {p:0,discussType:"P",userId:$scope.$parent.profileId};
    	 DiscussPage.get(params, function(value){
    		 var userPosts = value.data.content;
    		 $scope.postsUser = userPosts;
             if($scope.postsUser.length === 0){
                 $scope.isShowPosts = false;
             }
    	 }, function(error){
    		 console.log(error);
    	 });
     }
     
     postsByUser();
     
     var qaByUser = function(){
    	 var params = {p:0,discussType:"Q",userId:$scope.$parent.profileId};
    	 DiscussPage.get(params, function(value){
    		 var userQA = value.data.content;
    		 $scope.qaUser = userQA;
    	 }, function(error){
    		 console.log(error);
    	 });
     }
     
     qaByUser();
     
     
     $scope.go = function ($event, type, id, discussType) {
         $event.stopPropagation();
         if (type === "id") {
             $location.path('/discuss/' + id);
         } else if (type === "menu") {
             var menu = $rootScope.menuCategoryMap[id];
             if(menu.module===0){
                 $location.path("/discuss/list/"+menu.displayMenuName+"/"+menu.id+"/all/");
             }else if(menu.module===1){
                 $location.path("/services/list/"+menu.displayMenuName+"/"+menu.id+"/all/");
             }else{
                 //nothing as of now
             }
         } else if (type === "accordian") {
             $($event.target).find('a').click();
         } else if(type === "comment") {
             $location.path('/discuss/' + id).search({comment: true});
         }
     }
     
     $scope.showPosts = function(param){
    	 $scope.isShowPosts = param;
     };
     
}]);
