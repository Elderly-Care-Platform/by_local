byControllers.controller('EditorController', ['$scope', '$rootScope','Discuss','ValidateUserCredential', '$location',
    function ($scope, $rootScope, Discuss, ValidateUserCredential, $location) {
        $scope.editor = {};
        $scope.errorMsg = "";
        $scope.editor.subject = "";
        $scope.editor.articlePhotoFilename = "";
        $scope.showCategory = false;
        $scope.isValidUser = false;


        $scope.showCategoryList = function(){
            $scope.showCategory = ($scope.showCategory === false) ? true : false;
        }


        $scope.postContent = function (discussType) {
            $(".by_btn_submit").prop("disabled", true);
            $scope.discuss = new Discuss();
            $scope.discuss.discussType = discussType;
            $scope.discuss.text = tinyMCE.activeEditor.getContent();
            $scope.discuss.title = $scope.editor.subject;
            if($scope.editor.articlePhotoFilename){
            	$scope.discuss.articlePhotoFilename = JSON.parse($scope.editor.articlePhotoFilename);
            }
            $scope.discuss.topicId = BY.editorCategoryList.getCategoryList();
            //putting the userId to discuss being created
            $scope.discuss.userId = localStorage.getItem("USER_ID");
            $scope.discuss.username = localStorage.getItem("USER_NAME");

            if($scope.discuss.discussType==="F"){
                if($scope.discuss.title.trim().length > 0 &&  $scope.discuss.text.trim().length > 0){
                    $scope.submitContent();
                }else {
                    $scope.setErrorMessage();
                }
            } else if($scope.discuss.discussType==="A"){
                if($scope.discuss.title.trim().length > 0 && $scope.discuss.text.trim().length > 0){
                    $scope.submitContent();
                }else{
                    $scope.setErrorMessage();
                }

            } else if($scope.discuss.discussType==="Q" || $scope.discuss.discussType==="P"){
                if($scope.discuss.text.trim().length > 0){
                    $scope.submitContent();
                }else{
                    $scope.setErrorMessage();
                }
            } else {
                //no more types
            }
        };

        $scope.setErrorMessage = function(){
            $(".by_btn_submit").prop("disabled", false);
            if($scope.discuss.title.trim().length <= 0 && $scope.discuss.discussType==="A"){
                $scope.errorMsg = "Please select title";
            }else if($scope.discuss.title.trim().length <= 0 && $scope.discuss.discussType==="F"){
                $scope.errorMsg = "Please select title";
            }else if($scope.discuss.text.trim().length <= 0){
                $scope.errorMsg = "Please add more details";
            }else{
                $scope.errorMsg = "";
            }
        }

        $scope.submitContent = function(){
            $scope.errorMsg = "";
            $scope.discuss.$save(function (discuss, headers) {
                $scope.editor.subject = "";
                BY.editorCategoryList.resetCategoryList();
                $scope.$parent.postSuccess();
            },
            function (errorResponse) {
                console.log(errorResponse);
                $(".by_btn_submit").prop("disabled", false);
                if(errorResponse.data && errorResponse.data.error && errorResponse.data.error.errorCode === 3002){
                    ValidateUserCredential.login();
                }
            });
        };
        
       
        
        $scope.showSubmitVideo = function(){
        	var screenWidth = $(window).width();
        	$(".by_call_submit_video").click(function(){
        		$(".by_call_submit_video_wrapper").fadeIn();
        		if(screenWidth > 960){
	        		$(".header").css('z-index','0');
	        		$(".breadcrumbs").css('z-index','0');
	        		$(".list-group-item.active").css('z-index','0');
        		}
        		$(".by_uploading_image").hide();
        	});
        	$(".by_call_submit_video_abs, .by_call_submit_video_btn button[type=button], .by_call_submit_video_head span").click(function(){
        		$(".by_call_submit_video_wrapper").fadeOut();
        		$(".by_call_submit_video_head_textarea").val('');
        		if(screenWidth > 960){
	        		$(".header").css('z-index','110');
	        		$(".breadcrumbs").css('z-index','10');
	        		$(".list-group-item.active").css('z-index','2');
        		}
        	});
        	$(".by_call_submit_video_btn button[type=submit]").click(function(){
        		$(".by_call_submit_video_wrapper").fadeOut();
        		var videoUrl = $(".by_call_submit_video_head_textarea").val();
        		if(screenWidth > 960){
	        		$(".header").css('z-index','110');
	        		$(".breadcrumbs").css('z-index','10');
	        		$(".list-group-item.active").css('z-index','2');
        		}
        		$(".by_uploading_video").show();
        		$(".by-show-three-buttons").hide();
        		var byuploadingvideoaddinside = $(".by_uploading_video_add_inside").innerWidth();
            	$(".by_uploading_video_add_inside iframe").attr('height', byuploadingvideoaddinside/2);
        	});
        	$(".by_uploading_image_add_close").click(function(){
        		$(".by-show-three-buttons").show();
        		 $(".by_uploading_image").hide();
        	});
        	
        	$(".by_call_upload_photo").click(function(){
        		$(".by-show-three-buttons").hide();
       		 	$(".by_uploading_image").show();
        	});
        	
        	$(".by_uploading_video_add_close").click(function(){
        		$(".by-show-three-buttons").show();
       		 $(".by_uploading_video").hide();
        	});
        	

        	
        	
        };

    }]);
