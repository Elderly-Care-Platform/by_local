/**
 * Created by sanjukta on 22-09-2015.
 */
define(['byApp', 'byUtil', 'userValidation'], function(byApp, byUtil, userValidation) {
    function DiscussReplyController($scope, $rootScope, $routeParams, $location, DiscussDetail, $sce, broadCastData,
                                    ValidateUserCredential, UserValidationFilter, $q){
        $scope.showEditor           = false;
        $scope.userSessionType      = UserValidationFilter.getUserSessionType();
        $scope.userCredential       = {'email':'', 'pwd':''};
        $scope.likeActionCredential = {'email':'', 'pwd':''};
        $scope.discussLikeObj       = {};


        $scope.trustForcefully = function (html) {
            return $sce.trustAsHtml(html);
        };

        $scope.createNewComment = function (editorId) {
            $scope.userSessionType  = UserValidationFilter.getUserSessionType();
            if (!$scope.showEditor){
                $scope.initCommentEditor(editorId);
            }
            $scope.cancelSetCredentialForLike();
            
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

            if($scope.userSessionType === null){
                if(!$scope.userCredential.email || !BY.byUtil.validateEmailId($scope.userCredential.email)){
                    $scope.errorMsg = "Please enter valid Email Id";
                    $(".by_btn_submit").prop("disabled", false);
                } else{
                    var promise = UserValidationFilter.loginUser($scope.userCredential.email);
                    promise.then(validUser, invalidUser);
                }
            }else{
                postHttpComment();
            }

            function validUser(){
                $scope.userSessionType = UserValidationFilter.getUserSessionType();
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
                $scope.errorMsg = data;
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

            if($scope.userSessionType === null){
                if(!$scope.userCredential.email || !BY.byUtil.validateEmailId($scope.userCredential.email)){
                    $scope.errorMsg = "Please enter valid Email Id";
                    $(".by_btn_submit").prop("disabled", false);
                } else{
                    var promise = UserValidationFilter.loginUser($scope.userCredential.email);
                    promise.then(validUser, invalidUser);
                }
            }else{
                postHttpAnswer()
            }

            function validUser(){
                $scope.userSessionType = UserValidationFilter.getUserSessionType();
                postHttpAnswer();
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
                $scope.errorMsg = data;
                $(".by_btn_submit").prop("disabled", false);
                console.log("Comment not posted");
                console.log("Invalid user");
            }

        };


        //***********Discuss like user validation code start********************
        $scope.getUserCredentialForLike = function(discussLikeObj){
            if($scope.discussLikeObj){
                delete $scope.discussLikeObj.pendingUserCredential
            }
            $scope.discussLikeObj = discussLikeObj;
            $scope.discussLikeObj.pendingUserCredential = true;
            $scope.likeActionCredential.defer= $q.defer();

            return $scope.likeActionCredential.defer.promise;
        }

        $scope.setUserCredentialForLike = function(){
            if($scope.likeActionCredential.email && BY.byUtil.validateEmailId($scope.likeActionCredential.email)){
                var promise = UserValidationFilter.loginUser($scope.likeActionCredential.email);
                promise.then(validUser, invalidUser);
            }else{
                $scope.likeErrMsg = "Please enter valid email";
            }

            function validUser(){
                if($scope.likeActionCredential.defer){
                    $scope.userSessionType  = UserValidationFilter.getUserSessionType();
                    $scope.discussLikeObj.pendingUserCredential = false;
                    $scope.likeActionCredential.defer.resolve();
                    //delete $scope.likeActionCredential.promise;
                }
            }

            function invalidUser(errMsg){
                console.log("invalid user error");
                $scope.likeErrMsg = errMsg;
                if($scope.likeActionCredential.defer){
                    $scope.likeActionCredential.defer.reject();
                }
                //delete $scope.likeActionCredential.promise;
            }
        }

        $scope.cancelSetCredentialForLike = function(){
            $scope.discussLikeObj.pendingUserCredential = false;
            if($scope.likeActionCredential.defer){
                $scope.likeActionCredential.defer.reject();
            }

        }

        //***********Discuss like user validation code start********************
    }

    DiscussReplyController.$inject = ['$scope', '$rootScope', '$routeParams', '$location', 'DiscussDetail', '$sce', 'broadCastData',
        'ValidateUserCredential', 'UserValidationFilter', '$q'];
    byApp.registerController('DiscussReplyController', DiscussReplyController);
    return DiscussReplyController;
});