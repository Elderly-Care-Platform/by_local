byControllers.controller('EditorController', ['$scope', '$rootScope','Discuss',
    function ($scope, $rootScope, Discuss) {
        $scope.editor = {};
        $scope.errorMsg = "";
        $scope.editor.subject = "";
        $scope.editor.articlePhotoFilename = "";

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
                if($scope.discuss.topicId.length > 0 && $scope.discuss.title.trim().length > 0 && $scope.discuss.text.trim().length > 0){
                    $scope.submitContent();
                }else{
                    $scope.setErrorMessage();
                }

            } else if($scope.discuss.discussType==="Q" || $scope.discuss.discussType==="P"){
                if($scope.discuss.topicId.length > 0 && $scope.discuss.text.trim().length > 0){
                    $scope.submitContent();
                }else{
                    $scope.setErrorMessage();
                }
            } else {
                //no more type
            }
        };

        $scope.setErrorMessage = function(){
            if($scope.discuss.title.trim().length <= 0 && $scope.discuss.discussType==="A"){
                $scope.errorMsg = "Please select title";
            }else if($scope.discuss.text.trim().length <= 0){
                $scope.errorMsg = "Please add more details";
            }else if($scope.discuss.topicId.length <= 0){
                if($scope.discuss.discussType==="Q"){
                    $scope.errorMsg = "Please select at least one category where your question would appear";
                }else if($scope.discuss.discussType==="A"){
                    $scope.errorMsg = "Please select at least one category where your story would appear";
                }else if($scope.discuss.discussType==="P"){
                    $scope.errorMsg = "Please select at least one category where your tips would appear";
                }else{
                    $scope.errorMsg = "";
                }
            }
        }

        $scope.submitContent = function(){
            $scope.errorMsg = "";
            $scope.discuss.$save(function (discuss, headers) {
                $scope.editor.subject = "";
                BY.editorCategoryList.resetCategoryList();
                $scope.$parent.postSuccess();
            });
        };

    }]);
