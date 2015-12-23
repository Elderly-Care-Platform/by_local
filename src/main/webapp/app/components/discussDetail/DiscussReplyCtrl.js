/**
 * Created by sanjukta on 22-09-2015.
 */
define(['byApp', 'byUtil', 'userValidation'], function(byApp, byUtil, userValidation) {
    function DiscussReplyController($scope, $rootScope, $routeParams, $location, DiscussDetail, $sce, broadCastData, ValidateUserCredential, UserValidationFilter){
        $scope.showEditor           = false;
        $scope.userSessionType      = UserValidationFilter.getUserSessionType();
        $scope.userCredential       = {'email':'', 'pwd':''};


        $scope.trustForcefully = function (html) {
            return $sce.trustAsHtml(html);
        };

        $scope.createNewComment = function (editorId) {
            if (!$scope.showEditor)
                $scope.initCommentEditor(editorId);
        };

        $scope.initCommentEditor = function (editorId) {
            $scope.showEditor = true;
            BY.byEditor.addEditor({"editorTextArea": editorId, "commentEditor": true, "autoFocus": true});
            tinyMCE.execCommand('mceFocus', false, editorId);
        };

        //dispose the tinymce editor after successful post or on pressing of cancel button from editor
        $scope.disposeComment = function (editorId) {
            $scope.showEditor = false;

            if (tinymce.get(editorId))
                tinyMCE.execCommand("mceRemoveEditor", false, editorId);
        };

        //Post method called from comments or answers of main detail discuss
        $scope.postComment = function (discussId, parentReplyId) {
            $(".by_btn_submit").prop("disabled", true);
            $scope.userSessionType = UserValidationFilter.getUserSessionType();
            $scope.discussReply = new DiscussDetail();
            $scope.discussReply.parentReplyId = parentReplyId ? parentReplyId : "";
            $scope.discussReply.discussId = discussId;
            $scope.discussReply.text = tinymce.get(parentReplyId).getContent();
            $scope.discussReply.url = window.location.href;

            if(!$scope.userSessionType){
                if(!$scope.userCredential.email || !BY.byUtil.validateEmailId($scope.userCredential.email)){
                    $scope.errorMsg = "Please enter valid Email Id";
                    $(".by_btn_submit").prop("disabled", false);
                } else{
                    var promise = UserValidationFilter.loginUser($scope.userCredential.email);
                    promise.then(postHttpComment, invalidUser);
                }
            }else{
                postHttpComment();
            }


            function postHttpComment(data){
                $scope.discussReply.$postComment(
                    function (discussReply) {
                        broadCastData.update(discussReply.data); //broadcast data for parent controller to update the view with latest comment/answer
                        $scope.disposeComment(parentReplyId);           //dispose comment editor and remove tinymce after successful post of comment/answer
                    },
                    function (errorResponse) {
                        console.log(errorResponse);
                        $(".by_btn_submit").prop("disabled", false);
                        if(errorResponse.data && errorResponse.data.error && errorResponse.data.error.errorCode === 3002){
                            console.log("Invalid user");
                        }
                    });
            }

            function invalidUser(data){
                $(".by_btn_submit").prop("disabled", false);
                console.log("Comment not posted");
                console.log("Invalid user");
            }
        };


        //Post method called from main detail discuss
        $scope.postMainReply = function (discussId, discussType) {
            $(".by_btn_submit").prop("disabled", true);
            $scope.userSessionType = UserValidationFilter.getUserSessionType();
            $scope.discussReply = new DiscussDetail();
            $scope.discussReply.discussId = discussId;
            $scope.discussReply.text = tinymce.get(discussId).getContent();
            $scope.discussReply.url = window.location.href;

            if(!$scope.userSessionType){
                if(!$scope.userCredential.email || !BY.byUtil.validateEmailId($scope.userCredential.email)){
                    $scope.errorMsg = "Please enter valid Email Id";
                    $(".by_btn_submit").prop("disabled", false);
                } else{
                    var promise = UserValidationFilter.loginUser($scope.userCredential.email);
                    promise.then(postHttpAnswer, invalidUser);
                }
            }else{
                postHttpAnswer()
            }


            function postHttpAnswer(data){
                console.log(data);
                if (discussType === "Q") {
                    $scope.discussReply.$postAnswer(function (discussReply, headers) {
                            broadCastData.update(discussReply.data); //broadcast data for parent controller to update the view with latest comment/answer
                            $scope.disposeComment(discussId); //dispose comment editor and remove tinymce after successful post of comment/answer
                        },
                        function (errorResponse) {
                            console.log(errorResponse);
                            $(".by_btn_submit").prop("disabled", false);
                            if(errorResponse.data && errorResponse.data.error && errorResponse.data.error.errorCode === 3002){
                                console.log("Invalid user");
                            }
                        });
                } else {
                    $scope.discussReply.$postComment(function (discussReply, headers) {
                            broadCastData.update(discussReply.data); //broadcast data for parent controller to update the view with latest comment/answer
                            $scope.disposeComment(discussId); //dispose comment editor and remove tinymce after successful post of comment/answer
                        },
                        function (errorResponse) {
                            console.log(errorResponse);
                            $(".by_btn_submit").prop("disabled", false);
                            if(errorResponse.data && errorResponse.data.error && errorResponse.data.error.errorCode === 3002){
                                console.log("Invalid user");
                            }
                        });
                }
            }

            function invalidUser(data){
                $(".by_btn_submit").prop("disabled", false);
                console.log("Comment not posted");
                console.log("Invalid user");
            }

        };
    }

    DiscussReplyController.$inject = ['$scope', '$rootScope', '$routeParams', '$location', 'DiscussDetail', '$sce', 'broadCastData',
        'ValidateUserCredential', 'UserValidationFilter'];
    byApp.registerController('DiscussReplyController', DiscussReplyController);
    return DiscussReplyController;
});