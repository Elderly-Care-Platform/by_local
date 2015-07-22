//DIscuss All
byControllers.controller('InstitutionProfileController', ['$scope', '$rootScope', '$location', '$route', '$routeParams',
    function ($scope, $rootScope, $location, $route, $routeParams, $sce) {
        $scope.institutionProfile = $scope.$parent.profileData;
        $scope.slideIndex = 1;


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

        }

        $scope.galleryClickHover = function(){
            $(".by-imageGallery-item").css('cursor', 'pointer');
            $(".by-imageGallery-item").click(function(event){
                event.stopPropagation();
                var urlPopup = $(this).attr('data-popup');
                $(".profilePopupImagesWrapperImage").find('img').attr('src', urlPopup);
                $(".profilePopupImages").fadeIn();

                setTimeout(function(){
                    var windowHeight = $(window).height();
                    var windowWidth = $(window).width();
                    var profilePopupImagesWrapperWidth = $(".profilePopupImagesWrapperImage").find('img').outerWidth(true);
                    var profilePopupImagesWrapperHeight = $(".profilePopupImagesWrapperImage").find('img').outerHeight(true);
                    $(".profilePopupImagesWrapper").width(profilePopupImagesWrapperWidth);
                    $(".profilePopupImagesWrapper").height(profilePopupImagesWrapperHeight);
                    var windowHeightTop = ( windowHeight - profilePopupImagesWrapperHeight - 6 )/2;
                    if(windowHeightTop<0){
                        var windowHeightTop = 10;
                    }
                    if(profilePopupImagesWrapperWidth > windowWidth){
                        var windowHeight = windowHeight/1.1;
                        var windowWidth = windowWidth/1.1;
                        $(".profilePopupImagesWrapper").width(windowWidth);
                        $(".profilePopupImagesWrapper").height(windowHeight);
                        $(".profilePopupImagesWrapperImage img").width(windowWidth);
                        $(".profilePopupImagesWrapperImage img").height(windowHeight);
                    }
                    if(windowHeight < profilePopupImagesWrapperHeight){
                        $(".profilePopupImagesOpacity").css('height', profilePopupImagesWrapperHeight + 20 + "px");
                    }
                    $(".profilePopupImagesWrapper").css('margin-top', windowHeightTop +"px");


                }, 100);
            });

            $(".profilePopupImagesWrapperClose").click(function(event){
                $(".profilePopupImages").fadeOut();
                $(".profilePopupImagesWrapperImage img").width('auto');
                $(".profilePopupImagesWrapperImage img").height('auto');
            });


            var byimageGallerywidth = $(".by-imageGallery").width();




            $(".by-imageGallery-item, .profileHoverImages").hover(function(event){
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
            });


        }

    }]);
