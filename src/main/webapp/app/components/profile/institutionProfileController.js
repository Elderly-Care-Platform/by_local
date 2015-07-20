//DIscuss All
byControllers.controller('InstitutionProfileController', ['$scope', '$rootScope', '$location', '$route', '$routeParams',
    'UserProfile', '$sce',
    function ($scope, $rootScope, $location, $route, $routeParams, UserProfile, $sce) {
        console.log($routeParams);
        $("#preloader").show();
        $scope.userId = $routeParams.profileId;

        $scope.institutionProfile = UserProfile.get({userId:$scope.userId}, function (profile) {
                $scope.institutionProfile = profile.data;
                $("#preloader").hide();
            },
            function (error) {
                console.log("institution profile error");
            });


        $scope.slideGallery = function(dir){
            if(dir==="r"){
                $('.by-gallery-container').addClass('by-gallery-animate-right');
            }else{
                $('.by-gallery-container').removeClass('by-gallery-animate-right');
            }

        }
        
        $scope.galleryClickHover = function(){
        	$(".personalStoryGalleryItem").css('cursor', 'pointer');
        	$(".personalStoryGalleryItem").click(function(event){
        		event.stopPropagation();
        		var urlPopup = $(this).attr('data-popup');
        		console.log(urlPopup);
        		$(".profilePopupImagesWrapperImage").find('img').attr('src', urlPopup);
        		$(".profilePopupImages").fadeIn();

        		setTimeout(function(){ 
            		var windowHeight = $(window).height();
            		var profilePopupImagesWrapperWidth = $(".profilePopupImagesWrapperImage").find('img').outerWidth(true);
            		var profilePopupImagesWrapperHeight = $(".profilePopupImagesWrapperImage").find('img').outerHeight(true);
            		$(".profilePopupImagesWrapper").width(profilePopupImagesWrapperWidth);
            		$(".profilePopupImagesWrapper").height(profilePopupImagesWrapperHeight);
            		var windowHeightTop = ( windowHeight - profilePopupImagesWrapperHeight - 6 )/2;
            		if(windowHeightTop<0){
            			var windowHeightTop = 10;
            		}
            		if(windowHeight < profilePopupImagesWrapperHeight){
            			$(".profilePopupImagesOpacity").css('height', profilePopupImagesWrapperHeight + 20 + "px");
            		}
            		$(".profilePopupImagesWrapper").css('margin-top', windowHeightTop +"px");
        		}, 100);
        	});
        	
        	$(".profilePopupImagesWrapperClose").click(function(event){
        		$(".profilePopupImages").fadeOut();
        	});

        	
        	

        	$(".personalStoryGalleryItem, .profileHoverImages").hover(function(event){
        		event.stopPropagation();
        		var urlHover = $(this).attr('data-hover');
        		var hoverHeight = $(this).height();
        		var hoverOffTop = $(this).offset().top + hoverHeight + 5;
        		var hoverOffLeft = $(this).offset().left - 32;
        		$(".profileHoverImages").find('img').attr('src', urlHover);
        		$(".profileHoverImages").css('left', hoverOffLeft +"px");
        		$(".profileHoverImages").css('top', hoverOffTop +"px");		
        		$(".profileHoverImages").show();
        	}, function(event){
        		$(".profileHoverImages").hide();
        	});
        }

    }]);
