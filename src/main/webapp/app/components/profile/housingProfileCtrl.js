byControllers.controller('housingProfileController', ['$scope', '$rootScope', '$location', '$route', '$routeParams', 'ReviewRateProfile','$http',
    function ($scope, $rootScope, $location, $route, $routeParams, ReviewRateProfile, $http) {
        $scope.housingProfile = $scope.$parent.profileData;
        $scope.housingFacilityId = $scope.$parent.housingFacilityId;
        $scope.slideIndex = 1;
        $scope.profileData = null ;
        
        
        if($scope.housingFacilityId){
            $http.get('api/v1/housing?id=' + $scope.housingFacilityId).success(function(response){
                $scope.facility = response.data;
                $scope.profileData = $scope.facility;
            }).error(function(errorResponse){
                console.log(errorResponse);
            });
        }else if($scope.housingProfile.facilities && $scope.housingProfile.facilities.length > 0) {
            $scope.facility = $scope.housingProfile.facilities[0];
            $scope.profileData = $scope.facility;
        }else{
            $scope.facility = null;
        };
        
        

        $scope.slideGallery = function (dir) {
            if ($scope.slideIndex < 1) {
                $scope.slideIndex = 1;
            }
            $scope.byimageGallery = $(".by-imageGallery").outerWidth() - 60;
            $scope.bygallerycontainer = $(".by-gallery-container").outerWidth();
            $scope.w = $scope.bygallerycontainer / $scope.byimageGallery;
            //alert($scope.w);
            if ($scope.slideIndex < $scope.w && dir === "r") {
                $('.by-gallery-container').css("-webkit-transform", "translate(-" + ($scope.byimageGallery) * ($scope.slideIndex) + "px, 0px)");
                $scope.slideIndex++;
            }
            if ($scope.slideIndex >= 1 && dir === "l") {
                $('.by-gallery-container').css("-webkit-transform", "translate(-" + ($scope.byimageGallery) * ($scope.slideIndex - 2) + "px, 0px)");
                $scope.slideIndex--;
            }
        };

        $scope.galleryImage = function () {
            var urlPopup = $(".by-imageGallery-item").eq(0).attr('data-popup');
            console.log(urlPopup);
        };


        $scope.galleryClickHover = function () {
            $(".by-imageGallery-item").css('cursor', 'pointer');
            $(".by-imageGallery-item").click(function () {
                var urlPopup = $(this).attr('data-popup');
                $(".by_modal_body").find('img').attr('src', urlPopup);
                $('#imagemodal').modal('show');

            });
        };


        $scope.showMore = function () {
            document.getElementById("profile-desc").style.display = "block";
            document.getElementById("profile-shortDesc").style.display = "none";
        };


        $scope.showReviews = function () {
        	var reviewDetails = new ReviewRateProfile();
            //Get reviews by all user for this professional
        	 $scope.reviews = reviewDetails.$get({associatedId:$scope.housingFacilityId, reviewContentType:$scope.$parent.reviewContentType}, function(response){
                 $scope.reviews = response.data.replies;
             }, function(error){
                 console.log(error)
             })
        };

         $scope.showReviews();


    }]);
