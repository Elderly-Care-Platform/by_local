byControllers.controller('EditorController', ['$scope', '$rootScope','Discuss','ValidateUserCredential', '$window', '$http','broadCastMenuDetail',
    function ($scope, $rootScope, Discuss, ValidateUserCredential, $window, $http, broadCastMenuDetail) {
        $scope.editor = {};
        $scope.errorMsg = "";
        $scope.editor.subject = "";
        $scope.editor.articlePhotoFilename = "";
        $scope.showCategory = false;
        $scope.selectedMenuId = "";
        $scope.selectedMenuList = {};
        $scope.showLinkView = false;
        $scope.sharedLinkUrl = "";

        broadCastMenuDetail.setMenuId(0);
        $scope.showCategoryList = function(){
            $scope.showCategory = ($scope.showCategory === false) ? true : false;
        }
        $(".by_section_header").hide();
        $(".homeSlider").hide();     
        //$(".by_left_panel_fixed").css('margin-top', '0px');
        $(".by_left_panel_fixed .scrollableLeftPanelDiv").css('height', screen.height - $(".header").height());
        //angular.element($window).bind("scroll", function() {
        //$(".by_left_panel_homeSlider_position").removeClass('by_left_panel_homeSlider');
    		//$(".by_left_panel_homeSlider_position").css('margin-top', '0px');
        //});
        

        if($scope.$parent.selectedMenu){
            $scope.selectedMenuId = $scope.$parent.selectedMenu.id;
            $scope.selectedMenuList[$scope.selectedMenuId] = $scope.$parent.selectedMenu;
        }else{
            $scope.showCategory = true;
        }

        $scope.selectTag = function(event, category){
            if(event.target.checked){
                $scope.selectedMenuList[category.id] = category;
                //Add only Leaf category and not any parent category
                if(category.parentMenuId && $scope.selectedMenuList[category.parentMenuId]){
                    delete $scope.selectedMenuList[category.parentMenuId];
                }
            }else{
                delete $scope.selectedMenuList[category.id];
            }
        }

        var systemTagList = {};
        var getSystemTagList = function(data){
            function rec(data){
                angular.forEach(data, function(menu, index){
                    systemTagList[menu.id] = menu.tags;
                    if(menu.ancestorIds.length > 0){
                        for(var j=0; j < menu.ancestorIds.length; j++){
                            var ancestordata = {};
                            ancestordata[menu.ancestorIds[j]] =  $rootScope.menuCategoryMap[menu.ancestorIds[j]];
                            rec(ancestordata);
                        }
                    }
                })
            }

            rec(data);

            return  $.map(systemTagList, function(value, key){
                return value;
            });
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

            $scope.discuss.systemTags = getSystemTagList($scope.selectedMenuList);

            $scope.discuss.topicId = $.map($scope.selectedMenuList, function(value, key){
                return value.id;
            });
            //putting the userId to discuss being created
            $scope.discuss.userId = localStorage.getItem("USER_ID");
            $scope.discuss.username = localStorage.getItem("USER_NAME");

            if($scope.showLinkView){
                $scope.discuss.contentType = 2;
                $scope.discuss.linkInfo = $scope.linkInfo;
            }else{
                $scope.discuss.contentType = 0;
            }

            $scope.setErrorMessage();

            if($scope.errorMsg.trim().length === 0){
                $scope.submitContent();
            }
        };

        $scope.setErrorMessage = function(){
            $(".by_btn_submit").prop("disabled", false);

            if($scope.discuss.topicId.length === 0){
                $scope.errorMsg = "Please select atleast one category";
            } else if($scope.showLinkView){
                if(!$scope.linkInfo){
                    $scope.errorMsg = "Invalid shared info";
                }else{
                    $scope.errorMsg = "";
                }
            } else if($scope.editor.articlePhotoFilename){
                $scope.errorMsg = "";
            } else if($scope.discuss.title.trim().length <= 0 && $scope.discuss.discussType==="P"){
                $scope.errorMsg = "Please select title";
            } else if($scope.discuss.text.trim().length <= 0){
                $scope.errorMsg = "Please add more details";
            } else{
                $scope.errorMsg = "";
            }
        }

        $scope.submitContent = function(){
            $scope.errorMsg = "";
            $scope.discuss.$save(function (discuss, headers) {
                $scope.editor.subject = "";
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
        
       
        
        //$scope.showSubmitVideo = function(){
        //	var screenWidth = $(window).width();
        //	$(".by_call_submit_video").click(function(){
        //		$(".by_call_submit_video_wrapper").fadeIn();
        //		if(screenWidth > 960){
	     //   		$(".header").css('z-index','0');
	     //   		$(".breadcrumbs").css('z-index','0');
	     //   		$(".list-group-item.active").css('z-index','0');
        //		}
        //		$(".by_uploading_image").hide();
        //	});
        //	$(".by_call_submit_video_abs, .by_call_submit_video_btn button[type=button], .by_call_submit_video_head span").click(function(){
        //		$(".by_call_submit_video_wrapper").fadeOut();
        //		$(".by_call_submit_video_head_textarea").val('');
        //		if(screenWidth > 960){
	     //   		$(".header").css('z-index','110');
	     //   		$(".breadcrumbs").css('z-index','10');
	     //   		$(".list-group-item.active").css('z-index','2');
        //		}
        //	});
        //	$(".by_call_submit_video_btn button[type=submit]").click(function(){
        //		$(".by_call_submit_video_wrapper").fadeOut();
        //		var videoUrl = $(".by_call_submit_video_head_textarea").val();
        //		if(screenWidth > 960){
	     //   		$(".header").css('z-index','110');
	     //   		$(".breadcrumbs").css('z-index','10');
	     //   		$(".list-group-item.active").css('z-index','2');
        //		}
        //		$(".by_uploading_video").show();
        //		$(".by-show-three-buttons").hide();
        //		var byuploadingvideoaddinside = $(".by_uploading_video_add_inside").innerWidth();
        //    	$(".by_uploading_video_add_inside iframe").attr('height', byuploadingvideoaddinside/2);
        //	});
        //	$(".by_uploading_image_add_close").click(function(){
        //		$(".by-show-three-buttons").show();
        //		 $(".by_uploading_image").hide();
        //	});
        //
        //	$(".by_call_upload_photo").click(function(){
        //		$(".by-show-three-buttons").hide();
       	//	 	$(".by_uploading_image").show();
        //	});
        //
        //	$(".by_uploading_video_add_close").click(function(){
        //		$(".by-show-three-buttons").show();
       	//	 $(".by_uploading_video").hide();
        //	});
        //
        //
        //
        //
        //};
        $scope.resetEditorView = function(){
            $scope.showLinkView = false;
            $scope.editor.articlePhotoFilename = "";
            $(".by_uploading_image").hide();
            $(".by-editor-view-buttons").show();
        };


        $scope.postLink = function(){
            if($scope.sharedLinkUrl && $scope.sharedLinkUrl.trim().length > 0){
                $(".by-editor-view-buttons").hide();
                //$(".by_share_btn_submit").prop("disabled", true);
                $scope.showLinkView = true;
                $scope.linkInfoLoading = true;
                $http.get('api/v1/discuss/getLinkInfo?url='+encodeURIComponent($scope.sharedLinkUrl)).
                    then(function(response) {
                        $scope.linkInfo = response.data.data;
                        $scope.linkInfoLoading = false;
                        $scope.sharedLinkUrl = "";
                        $(".by_btn_submit").prop("disabled", false);
                    }, function(error) {
                        $scope.linkInfoLoading = false;
                        console.log(error);
                        $scope.sharedLinkUrl = "";
                        $(".by_btn_submit").prop("disabled", false);
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    });
            }
        }

        $scope.exitEditor = function(){
            $scope.$parent.postSuccess();
        }

    }]);
