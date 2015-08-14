//DIscuss All
byControllers.controller('IndividualProfileController', ['$scope', '$rootScope', '$location', '$route', '$routeParams', 'ReviewRateProfile',
    function ($scope, $rootScope, $location, $route, $routeParams, ReviewRateProfile) {
        $scope.individualProfile = $scope.$parent.profileData;
        $scope.gender =  BY.config.profile.userGender[$scope.individualProfile.individualInfo.sex];
        $scope.slideIndex = 1;
<<<<<<< HEAD

        var reviewDetails = new ReviewRateProfile();
        $scope.reviews = reviewDetails.$get({associatedId:$scope.individualProfile.id, reviewContentType:$scope.$parent.reviewContentType}, function(response){
            $scope.reviews = response.data.replies;
        }, function(error){
            console.log(error)
        })

=======
        var reviewDetails = new ReviewRateProfile();
>>>>>>> remotes/origin/profileChanges

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
<<<<<<< HEAD

        }
=======
        };
>>>>>>> remotes/origin/profileChanges

        $scope.galleryImage = function(){
        	 var urlPopup = $(".by-imageGallery-item").eq(0).attr('data-popup');
             console.log(urlPopup);
<<<<<<< HEAD
        }
=======
        };
>>>>>>> remotes/origin/profileChanges


        $scope.galleryClickHover = function(){
            $(".by-imageGallery-item").css('cursor', 'pointer');
            $(".by-imageGallery-item").click(function(){
                var urlPopup = $(this).attr('data-popup');
                $(".by_modal_body").find('img').attr('src', urlPopup);              
                $('#imagemodal').modal('show');

            });
<<<<<<< HEAD



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


=======
        };
        
        $scope.showMore = function(){
            document.getElementById("profile-desc").style.display = "block";
            document.getElementById("profile-shortDesc").style.display = "none";
        };
        

        $scope.showReviews = function(){
            $scope.reviews = reviewDetails.$get({associatedId:$scope.individualProfile.id, reviewContentType:$scope.$parent.reviewContentType}, function(response){
                $scope.reviews = response.data.replies;
            }, function(error){
                console.log(error)
            })
        };

        $scope.showReviews();
>>>>>>> remotes/origin/profileChanges
    }]);


