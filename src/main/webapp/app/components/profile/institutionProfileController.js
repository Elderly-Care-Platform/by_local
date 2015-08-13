//DIscuss All
byControllers.controller('InstitutionProfileController', ['$scope', '$rootScope', '$location', '$route', '$routeParams','ReviewRateProfile',
    function ($scope, $rootScope, $location, $route, $routeParams, ReviewRateProfile) {
        $scope.institutionProfile = $scope.$parent.profileData;
        $scope.slideIndex = 1;

        var reviewDetails = new ReviewRateProfile();
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
            if($scope.slideIndex >= 0  && dir==="l"){
                $('.by-gallery-container').css("-webkit-transform","translate(-"+($scope.byimageGallery)*($scope.slideIndex-2)+"px, 0px)");
                $scope.slideIndex--;
            }

        };

        $scope.galleryClickHover = function(){
            $(".by-imageGallery-item").css('cursor', 'pointer');
            $(".by-imageGallery-item").click(function(){
                var urlPopup = $(this).attr('data-popup');
                $(".by_modal_body").find('img').attr('src', urlPopup);              
                $('#imagemodal').modal('show');

            });
        };
        
        $scope.showMore = function(){
            document.getElementById("profile-desc").style.display = "block";
            document.getElementById("profile-shortDesc").style.display = "none";
        };
        

        $scope.showReviews = function(){
            $scope.reviews = reviewDetails.$get({associatedId:$scope.institutionProfile.id, reviewContentType:$scope.$parent.reviewContentType}, function(response){
                $scope.reviews = response.data.replies;
            }, function(error){
                console.log(error)
            })
        };

        $scope.showReviews();

    }]);
