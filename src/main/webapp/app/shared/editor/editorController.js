byControllers.controller('EditorController', ['$scope', '$rootScope','Discuss','ValidateUserCredential',
    function ($scope, $rootScope, Discuss, ValidateUserCredential) {
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
            if($scope.discuss.title.trim().length <= 0 && $scope.discuss.discussType==="A"){
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
                if(errorResponse.data && errorResponse.data.error && errorResponse.data.error.errorCode === 3002){
                    ValidateUserCredential.login();
                }
            });
        };

    }]);
