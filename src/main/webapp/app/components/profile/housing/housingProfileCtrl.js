define(['byApp', 'byUtil', 'reviewRateController'], function(byApp, byUtil, reviewRateController) {
    function housingProfileCtrl($scope, $rootScope, $location, $route, $routeParams, ReviewRateProfile, $http, broadCastData, $sce){
        $scope.housingProfile = $scope.$parent.profileData;
        $scope.housingFacilityId = $scope.$parent.housingFacilityId;
        $scope.slideIndex = 1;
        $scope.profileData = null;
        
       
        var metaTagParams = {
        		title: $scope.housingProfile.basicProfileInfo.firstName ? $scope.housingProfile.basicProfileInfo.firstName : "Corporation Profile - Beautiful Years",
                imageUrl: $scope.housingProfile.basicProfileInfo.profileImage? $scope.housingProfile.basicProfileInfo.profileImage.original : "",
                description: $scope.housingProfile.basicProfileInfo.description ? $scope.housingProfile.basicProfileInfo.description : "",
                keywords:['senior living', 'old age home']
            }
            BY.byUtil.updateMetaTags(metaTagParams);


        if ($scope.housingFacilityId) {
            $http.get(apiPrefix + 'api/v1/housing?id=' + $scope.housingFacilityId).success(function (response) {
                $scope.facility = response.data;
                $scope.profileData = $scope.facility;
                broadCastData.update(response.data);
                var metaTagParams = {
                		title: $scope.facility.name ? $scope.facility.name : "Housing Profile - Beautiful Years",
                        imageUrl: $scope.facility.profileImage? $scope.facility.profileImage.original : "",
                        description: $scope.facility.description ? $scope.facility.description : "",
                        keywords:['senior living', 'old age home']
                    }
                    BY.byUtil.updateMetaTags(metaTagParams);
            }).error(function (errorResponse) {
                console.log(errorResponse);
            });
        } else if ($scope.housingProfile.facilities && $scope.housingProfile.facilities.length > 0) {
            $scope.facility = $scope.housingProfile.facilities[0];
            $scope.profileData = $scope.facility;
            broadCastData.update($scope.facility);
        } else {
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
                 $('.by-gallery-container').css("-webkit-transform","translate(-"+($scope.byimageGallery)*($scope.slideIndex)+"px, 0px)");
                $('.by-gallery-container').css("-moz-transform","translate(-"+($scope.byimageGallery)*($scope.slideIndex)+"px, 0px)");
                $('.by-gallery-container').css("-ms-transform","translate(-"+($scope.byimageGallery)*($scope.slideIndex)+"px, 0px)");
                $('.by-gallery-container').css("-o-transform","translate(-"+($scope.byimageGallery)*($scope.slideIndex)+"px, 0px)");
                $('.by-gallery-container').css("transform","translate(-"+($scope.byimageGallery)*($scope.slideIndex)+"px, 0px)");
                $scope.slideIndex++;
            }
            if ($scope.slideIndex >= 1 && dir === "l") {
                $('.by-gallery-container').css("-webkit-transform","translate(-"+($scope.byimageGallery)*($scope.slideIndex-2)+"px, 0px)");
                $('.by-gallery-container').css("-moz-transform","translate(-"+($scope.byimageGallery)*($scope.slideIndex-2)+"px, 0px)");
                $('.by-gallery-container').css("-ms-transform","translate(-"+($scope.byimageGallery)*($scope.slideIndex-2)+"px, 0px)");
                $('.by-gallery-container').css("-o-transform","translate(-"+($scope.byimageGallery)*($scope.slideIndex-2)+"px, 0px)");
                $('.by-gallery-container').css("transform","translate(-"+($scope.byimageGallery)*($scope.slideIndex-2)+"px, 0px)");
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

        $scope.trustForcefully = function (html) {
            return $sce.trustAsHtml(html);
        };


        $scope.showReviews = function () {
            var reviewDetails = new ReviewRateProfile();
            //Get reviews by all user for this professional
            $scope.reviews = reviewDetails.$get({
                associatedId: $scope.housingFacilityId,
                reviewContentType: $scope.$parent.reviewContentType
            }, function (response) {
                $scope.reviews = response.data.replies;
                if($scope.reviews.length > 0){
                    require(['discussLikeController', 'shareController'], function(discussLikeCtrl, shareCtrl){
                        $scope.$apply();
                    });
                }
            }, function (error) {
                console.log(error)
            })
        };
        $scope.showReviews();
    }

    housingProfileCtrl.$inject = ['$scope', '$rootScope', '$location', '$route', '$routeParams', 'ReviewRateProfile', '$http', 'broadCastData', '$sce'];
    byApp.registerController('housingProfileCtrl', housingProfileCtrl);
    return housingProfileCtrl;
});