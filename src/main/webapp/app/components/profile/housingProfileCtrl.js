byControllers.controller('housingProfileController', ['$scope', '$rootScope', '$location', '$route', '$routeParams', 
    function ($scope, $rootScope, $location, $route, $routeParams) {
	 $scope.individualProfile = $scope.$parent.profileData;
     $scope.slideIndex = 1;
     //$scope.userName = $scope.$parent.userName;
	 
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
     
     
     

     
}]);