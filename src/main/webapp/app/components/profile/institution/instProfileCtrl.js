define(['byApp', 'byUtil', 'reviewRateController'], function(byApp, byUtil, reviewRateController) {
    function InstProfileCtrl($scope, $routeParams, ReviewRateProfile, $sce){
        $scope.institutionProfile   = $scope.$parent.profileData;
        $scope.branchId             = $routeParams.branchId ? $routeParams.branchId : null;
        $scope.slideIndex           = 1;
        $scope.showReviews          = showReviews;
        $scope.showReviewsVerified  = showReviewsVerified;

        var reviewDetails           = new ReviewRateProfile();
        var init                    = initialize();

        function initialize(){
            if($scope.branchId && $scope.institutionProfile.serviceBranches.length > 0){
                $scope.branchProfile = $scope.institutionProfile.serviceBranches[0];
                if($scope.branchId){
                    $scope.serviceMainBranch = $scope.institutionProfile.serviceBranches[0];
                    for (var i = 0; i < $scope.institutionProfile.serviceBranches.length; i++) {
                        if($scope.branchId===$scope.institutionProfile.serviceBranches[i].id){
                            $scope.branchProfile = $scope.institutionProfile.serviceBranches[i];
                        }
                    }
                }
            }else{
                $scope.branchProfile = $scope.institutionProfile;
            }
            $scope.profileData = $scope.branchProfile;

            updateMetaTag();
            showReviews();
            showReviewsVerified();
        }


        function updateMetaTag(){
            var metaTagParams = {
                title: $scope.branchProfile.basicProfileInfo.firstName ? $scope.branchProfile.basicProfileInfo.firstName : "Institution Profile - Beautiful Years",
                imageUrl: $scope.branchProfile.basicProfileInfo.profileImage? $scope.branchProfile.basicProfileInfo.profileImage.original : "",
                description: $scope.branchProfile.basicProfileInfo.description ? $scope.branchProfile.basicProfileInfo.description : "",
                keywords:['senior care services', 'old age services', 'elder care services']
            }
            BY.byUtil.updateMetaTags(metaTagParams);
        }

        function showReviews(){
            //Get reviews by all user for this professional
            $scope.reviews = reviewDetails.$get({associatedId:$scope.branchProfile.id, verified : false, reviewContentType:$scope.$parent.reviewContentType}, function(response){
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

        function showReviewsVerified(){
            //Get reviews by all user for this professional
            $scope.reviews = reviewDetails.$get({associatedId:$scope.branchProfile.id, verified : true, reviewContentType:$scope.$parent.reviewContentType}, function(response){
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
                $('.by-gallery-container').css("-moz-transform","translate(-"+($scope.byimageGallery)*($scope.slideIndex)+"px, 0px)");
                $('.by-gallery-container').css("-ms-transform","translate(-"+($scope.byimageGallery)*($scope.slideIndex)+"px, 0px)");
                $('.by-gallery-container').css("-o-transform","translate(-"+($scope.byimageGallery)*($scope.slideIndex)+"px, 0px)");
                $('.by-gallery-container').css("transform","translate(-"+($scope.byimageGallery)*($scope.slideIndex)+"px, 0px)");
                $scope.slideIndex++;
            }
            if($scope.slideIndex >= 0  && dir==="l"){
                $('.by-gallery-container').css("-webkit-transform","translate(-"+($scope.byimageGallery)*($scope.slideIndex-2)+"px, 0px)");
                $('.by-gallery-container').css("-moz-transform","translate(-"+($scope.byimageGallery)*($scope.slideIndex-2)+"px, 0px)");
                $('.by-gallery-container').css("-ms-transform","translate(-"+($scope.byimageGallery)*($scope.slideIndex-2)+"px, 0px)");
                $('.by-gallery-container').css("-o-transform","translate(-"+($scope.byimageGallery)*($scope.slideIndex-2)+"px, 0px)");
                $('.by-gallery-container').css("transform","translate(-"+($scope.byimageGallery)*($scope.slideIndex-2)+"px, 0px)");
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

        $scope.trustForcefully = function (html) {
            return $sce.trustAsHtml(html);
        };
    }

    InstProfileCtrl.$inject = ['$scope', '$routeParams','ReviewRateProfile', '$sce'];
    byApp.registerController('InstProfileCtrl', InstProfileCtrl);
    return InstProfileCtrl;
});