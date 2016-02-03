define(['byApp', 'byUtil', 'byEditor', 'userValidation'], function(byApp, byUtil, byEditor, userValidation) {
    function EditorController($scope, $rootScope, Discuss, UserValidationFilter,
                              $http, $location, $route, $routeParams, UserValidationFilter){
        $scope.editor                           = {};
        $scope.errorMsg                         = "";
        $scope.editor.subject                   = "";
        $scope.editor.articlePhotoFilename      = "";
        $scope.showCategory                     = false;
        $scope.selectedMenuList                 = {};
        $scope.selectedMenuCount                = 0;
        $scope.showLinkView                     = false;
        $scope.sharedLinkUrl                    = "";
        $scope.linkImages                       = [];
        $scope.linkImagesIdx                    = 0;
        $scope.categoryLists                    = null;
        var init                                = initialize();
        var systemTagList                       = {};

        $scope.userCredential                   = {'email':'', 'pwd':''};
        $scope.userSessionType                  = UserValidationFilter.getUserSessionType();

        function initialize(){
            //set accordion category list
            if($scope.$parent.categoryLists){
                $scope.categoryLists = $scope.$parent.categoryLists;
            }

            if($scope.$parent.editorPostCategories && $scope.$parent.editorPostCategories.length > 0){
                for(var i=0; i<$scope.$parent.editorPostCategories.length; i++){
                    var editorPostCategory = $scope.$parent.editorPostCategories[i];
                    $scope.selectedMenuList[editorPostCategory.id] = editorPostCategory;
                }
            } else {
                $scope.selectedMenuId   = $routeParams.menuId;
                $scope.postCategoryTag  = $routeParams.postCategoryTag ? JSON.parse($routeParams.postCategoryTag) : null;
                $scope.selectedMenu     =   $rootScope.menuCategoryMap[$scope.selectedMenuId];

                if(!$scope.selectedMenu && $scope.$parent.selectedMenu){
                    $scope.selectedMenu = $scope.$parent.selectedMenu;
                }

                if($scope.selectedMenu){
                    $scope.selectedMenuId = $scope.selectedMenu.id;
                    $scope.selectedMenuList[$scope.selectedMenuId] = $scope.selectedMenu;
                    $scope.selectedMenuCount++;
                }
            }

        }

        //Toggle category accordion
        $scope.showCategoryList = function(){
           $scope.showCategory = ($scope.showCategory === false) ? true : false;
        }


        //select category from accordion
        $scope.selectTag = function(event, category){
           if(event.target.checked){
               $scope.selectedMenuList[category.id] = category;
               $scope.selectedMenuCount++;
           }else{
               $scope.selectedMenuCount--;
               delete $scope.selectedMenuList[category.id];
           }
        };


        function selectParentHierArchy(category) {
            if (category.ancestorIds.length > 0) {
                for (var i = 0; i < category.ancestorIds.length; i++) {
                    if (!$scope.selectedMenuList[category.ancestorIds[i]]) {
                        var selectedParentMenu = $rootScope.menuCategoryMap[category.ancestorIds[i]];
                        if(!selectedParentMenu){
                            selectedParentMenu = $rootScope.hiddenMenu[category.ancestorIds[i]];
                        }

                        if(selectedParentMenu){
                            $scope.selectedMenuList[selectedParentMenu.id] = selectedParentMenu;
                            $scope.selectedMenuCount++;
                        }
                    }
                }
            }
        };

        function getSystemTagList(data){
            //function to include all parent tags into discuss system tags
            function selectAllParentTags(data){
                angular.forEach(data, function(menu, index){
                    systemTagList[menu.id] = menu.tags;
                    if(menu.ancestorIds.length > 0){
                        for(var j=0; j < menu.ancestorIds.length; j++){
                            var ancestordata = {};
                            ancestordata[menu.ancestorIds[j]] =  $rootScope.menuCategoryMap[menu.ancestorIds[j]];
                            selectAllParentTags(ancestordata);
                        }
                    }
                })
            }

            //function to include selected menu tags into discuss system tags
            function selectMenuTags(data){
                angular.forEach(data, function (menu, index) {
                    systemTagList[menu.id] = menu.tags;
                })
            }

            //If selectedMenuList does not include parent hierarchy then add all parent tags
            //selectAllParentTags(data);

            //If selectedMenuList already included parent hierarchy then add selected menu tags
            selectMenuTags(data);

            return  $.map(systemTagList, function(value, key){
                return value;
            });
        };


        function formatContent(){
            //putting the userId to discuss being created
            $scope.discuss.userId = localStorage.getItem("USER_ID");
            $scope.discuss.username = localStorage.getItem("USER_NAME");

            //article photo
            if($scope.editor.articlePhotoFilename){
                $scope.discuss.articlePhotoFilename = JSON.parse($scope.editor.articlePhotoFilename);
            } else{
                if($("#articleTitleImage") && $("#articleTitleImage").val()){
                    $scope.discuss.articlePhotoFilename = JSON.parse($("#articleTitleImage").val());
                }
            }

            //Add parent hierarchy of the selected menu
            angular.forEach($scope.selectedMenuList, function (menu, index) {
                selectParentHierArchy(menu);
            })

            if($scope.postCategoryTag){
                $scope.discuss.systemTags = [$scope.postCategoryTag];
            }else{
                $scope.discuss.systemTags = getSystemTagList($scope.selectedMenuList);
            }

            $scope.discuss.topicId = $.map($scope.selectedMenuList, function(value, key){
                return value.id;
            });



            if($scope.showLinkView){
                $scope.discuss.contentType = 2;
                $scope.discuss.linkInfo = $scope.linkInfo;
            }else{
                $scope.discuss.contentType = 0;
            }
        };

        function validateContent(){
            if($scope.discuss.topicId.length === 0 && $scope.discuss.discussType!=="F"){
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


            //If all other validation error are cleared then show email id error
            if($scope.errorMsg.trim().length === 0){
                if($scope.userSessionType === null && (!$scope.userCredential.email || !BY.byUtil.validateEmailId($scope.userCredential.email))){
                    $scope.errorMsg = "Please enter valid Email Id";
                }
            }
        };


        $scope.postContent = function (discussType) {
            $(".by_btn_submit").prop("disabled", true);
            $scope.discuss              = new Discuss();
            $scope.discuss.discussType  = discussType;
            $scope.discuss.text         = tinyMCE.activeEditor.getContent();
            $scope.discuss.title        = $scope.editor.subject;

            formatContent();
            validateContent();

            if($scope.errorMsg.trim().length === 0){
                if($scope.userSessionType){

                    window.setTimeout(function(){
                        $scope.submitContent();
                        $scope.$apply();
                    }, 1000)
                } else if($scope.userSessionType === null){
                    var promise = UserValidationFilter.loginUser($scope.userCredential.email);
                    promise.then(validUser, invalidUser);
                }
            }else{
                $(".by_btn_submit").prop("disabled", false);
            }


            //if($scope.userSessionType && $scope.errorMsg.trim().length === 0){
            //    $scope.submitContent();
            //} else if($scope.userSessionType === null){
            //    var promise = UserValidationFilter.loginUser($scope.userCredential.email);
            //    promise.then(validUser, invalidUser);
            //} else{
            //    $(".by_btn_submit").prop("disabled", false);
            //}

        };

        function validUser(data){
            $scope.userSessionType = UserValidationFilter.getUserSessionType();
            $scope.submitContent();
        }

        function invalidUser(data){
            $scope.errorMsg = data;
            $(".by_btn_submit").prop("disabled", false);
            console.log("content not submitted");
        }

        $scope.submitContent = function(){
            $scope.errorMsg = "";
            $scope.discuss.$save(function (discuss, headers) {
                $scope.editor.subject = "";
                $location.search('showEditor', null);
                $location.search('showEditorType', null);
                $location.search('postCategoryTag', null);
                $route.reload();
            },
            function (errorResponse) {
                console.log(errorResponse);
                $(".by_btn_submit").prop("disabled", false);
                //if(errorResponse.data && errorResponse.data.error && errorResponse.data.error.errorCode === 3002){
                //    ValidateUserCredential.login();
                //    $scope.dataSubmissionPending = true;
                //}
            });
        };

        $scope.$on('byUserLogin', function (event, args) {
            if( $scope.dataSubmissionPending == true){
                $scope.submitContent();
                $scope.dataSubmissionPending = false;
            }

        });

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
                $http.get(apiPrefix + 'api/v1/discuss/getLinkInfo?url='+encodeURIComponent($scope.sharedLinkUrl)).
                    then(function(response) {
                    	$scope.linkImages = [];
                    	$scope.linkImagesIdx = 0;

                        $scope.linkInfo = response.data.data;
                        if($scope.linkInfo.mainImage){
                        	$scope.linkImages.push($scope.linkInfo.mainImage);
                        }
                        if($scope.linkInfo.otherImages && $scope.linkInfo.otherImages.length > 0){
                        	$scope.linkImages = $scope.linkImages.concat($scope.linkInfo.otherImages);
                        }
                        if($scope.linkImages.length > 1){
                        	$scope.linkInfo.mainImage = $scope.linkImages[$scope.linkImagesIdx];
                        }

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

        $scope.selectPrevLinkImage = function(){
        	$scope.linkImagesIdx--;
        	$scope.linkInfo.mainImage = $scope.linkImages[$scope.linkImagesIdx];
        }

        $scope.selectNextLinkImage = function(){
        	$scope.linkImagesIdx++;
        	$scope.linkInfo.mainImage = $scope.linkImages[$scope.linkImagesIdx];
        }

        $scope.exitEditor = function(){
            $scope.editor.subject = "";
            $location.search('showEditor', null);
            $location.search('showEditorType', null);
            $location.search('postCategoryTag', null);
            $route.reload();
        }



    }
    EditorController.$inject = ['$scope', '$rootScope','Discuss', 'ValidateUserCredential',
        '$http', '$location', '$route', '$routeParams', 'UserValidationFilter'];
    byApp.registerController('EditorController', EditorController);

    return EditorController;
});