define(['byApp', 'byUtil', 'reviewRateController'], function(byApp, byUtil, reviewRateController) {
    function ProfUserProfileCtrl($scope, $rootScope, $location, $route, $routeParams, ReviewRateProfile, $sce){
        $scope.individualProfile = $scope.$parent.profileData;
        $scope.gender =  BY.config.profile.userGender[$scope.individualProfile.individualInfo.sex];
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

        $scope.showMore = function(){
            document.getElementById("profile-desc").style.display = "block";
            document.getElementById("profile-shortDesc").style.display = "none";
        };

        $scope.trustForcefully = function (html) {
            return $sce.trustAsHtml(html);
        };



        $scope.showReviews = function(){
            //Get reviews by all user for this professional
            $scope.reviews = reviewDetails.$get({associatedId:$scope.individualProfile.id, verified : false, reviewContentType:$scope.$parent.reviewContentType}, function(response){
                $scope.reviews = response.data.replies;
                if($scope.reviews.length > 0){
                    require(['discussLikeController', 'shareController'], function(discussLikeCtrl, shareCtrl){
                        $scope.$apply();
                    });
                }
            }, function(error){
                console.log(error)
            })
        };

        $scope.showReviews();

        $scope.showReviewsVerified = function(){
            //Get reviews by all user for this professional
            $scope.reviews = reviewDetails.$get({associatedId:$scope.individualProfile.id, verified : true, reviewContentType:$scope.$parent.reviewContentType}, function(response){
                $scope.reviewsVerify = response.data.replies;
                if($scope.reviewsVerify.length > 0){
                	$scope.flags.isByAdminVerified = true;
                    require(['discussLikeController', 'shareController'], function(discussLikeCtrl, shareCtrl){
                        $scope.$apply();
                    });
                }
            }, function(error){
                console.log(error)
            })
        };

        $scope.showReviewsVerified();
    }

    ProfUserProfileCtrl.$inject = ['$scope', '$rootScope', '$location', '$route', '$routeParams', 'ReviewRateProfile', '$sce'];
    byApp.registerController('ProfUserProfileCtrl', ProfUserProfileCtrl);
    return ProfUserProfileCtrl;
});