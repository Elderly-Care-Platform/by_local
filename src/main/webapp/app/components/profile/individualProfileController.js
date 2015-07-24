//DIscuss All
byControllers.controller('IndividualProfileController', ['$scope', '$rootScope', '$location', '$route', '$routeParams', 'ReviewRateProfile',
    function ($scope, $rootScope, $location, $route, $routeParams, ReviewRateProfile) {
        $scope.individualProfile = $scope.$parent.profileData;
        $scope.gender =  BY.config.profile.userGender[$scope.individualProfile.individualInfo.sex];
        $scope.slideIndex = 1;

        var reviewDetails = new ReviewRateProfile();
        $scope.reviews = reviewDetails.$get({associatedId:$scope.individualProfile.id, reviewContentType:$scope.$parent.reviewContentType}, function(response){
            $scope.reviews = response.data.replies;
        }, function(error){
            console.log(error)
        })


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

        }

        $scope.galleryImage = function(){
        	 var urlPopup = $(".by-imageGallery-item").eq(0).attr('data-popup');
             console.log(urlPopup);
        }


        $scope.galleryClickHover = function(){
            $(".by-imageGallery-item").css('cursor', 'pointer');
            $(".by-imageGallery-item").click(function(event){
                event.stopPropagation();
                var urlPopup = $(this).index();

                setTimeout(function(){
                    var windowHeight = $(window).height();
                    var windowWidth = $(window).width();
                    var profilePopupImagesWrapperWidth = $(".profilePopupImagesWrapperImage").find('img').eq(urlPopup).outerWidth(true);
                    var profilePopupImagesWrapperHeight = $(".profilePopupImagesWrapperImage").find('img').eq(urlPopup).outerHeight(true);
                    $(".profilePopupImagesWrapper").width(profilePopupImagesWrapperWidth);
                    //$(".profilePopupImagesWrapper").height(profilePopupImagesWrapperHeight);
                    var windowHeightTop = ( windowHeight - profilePopupImagesWrapperHeight - 6 ) / 2;
                    if (windowHeightTop < 0) {
                        var windowHeightTop = 10;
                    }

                    if (profilePopupImagesWrapperWidth > windowWidth) {
                        var windowHeight = windowHeight / 1.1;
                        var windowWidth = windowWidth / 1.1;
                        $(".profilePopupImagesWrapper").width(windowWidth);
                        $(".profilePopupImagesWrapper").height(windowHeight);
                        $(".profilePopupImagesWrapperImage img").width(windowWidth);
                        //$(".profilePopupImagesWrapperImage img").height(windowHeight);
                    }
                    if (windowWidth < 981) {
                        $(".profilePopupImagesWrapper").height('auto');
                        $('.breadcrumbs').css('z-index', '0');
                        $('.header').css('z-index', '0');
                    }
                    $(".profilePopupImagesWrapper").css('margin-top', windowHeightTop + "px");

                }, 100);

                $(".profilePopupImages").fadeIn();

                $(".profilePopupImagesWrapperImage").find('img').hide();
                $(".profilePopupImagesWrapperImage").find('img').eq(urlPopup).show();
                $(".profileHoverImages").hide();

            });

            $(".profilePopupImagesWrapperClose").click(function (event) {
                $(".profilePopupImages").fadeOut();
                $(".profilePopupImagesWrapperImage img").width('auto');
                $(".profilePopupImagesWrapperImage img").height('auto');
                $(".profilePopupImagesWrapper").height('auto');
                $('.breadcrumbs').css('z-index', '10');
                $('.header').css('z-index', '110');
            });


            var byimageGallerywidth = $(".by-imageGallery").width();


            /*$(".by-imageGallery-item, .profileHoverImages").hover(function(event){
             event.stopPropagation();
             var urlHover = $(this).attr('data-hover');
             $(".profileHoverImages").find('img').attr('src', urlHover);
             $(".profileHoverImages").show();
             setTimeout(function(){
             var hoverHeight = $(".main-image").height() + 106;
             var hoverOffLeft =  28;
             $(".profileHoverImages").css('left', hoverOffLeft +"px");
             $(".profileHoverImages").css('top', hoverHeight +"px");
             $(".profileHoverImages").css('width', byimageGallerywidth +"px");
             }, 100);

             }, function(event){
             $(".profileHoverImages").hide();
             });*/


        }


    }]);


