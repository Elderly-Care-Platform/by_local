define(['byApp', 'discussConfig', 'userValidation'], function(byApp, discussConfig, userValidation) {
    'use strict';
    function DiscussLikeController ($scope, $rootScope, DiscussLike, DiscussReplyLike, $location, ValidateUserCredential, UserValidationFilter) {
        $scope.beforePost        = true;

        $scope.likeDiscuss = function (discuss) {
            var discussId = discuss.id;
            $scope.discussLike = new DiscussLike();
            $scope.discussLike.discussId = discussId;
            $scope.discussLike.url = window.location.origin + "/#!/community/"+discussId;
            $scope.userSessionType   = UserValidationFilter.getUserSessionType();


            if($scope.userSessionType === null){
                var userCredentialPromise = $scope.$parent.getUserCredentialForLike(discuss);
                userCredentialPromise.then(validUser, invalidUser);
            } else {
                httpPostLike();
            }

            function validUser(){
                httpPostLike();
            }

            function invalidUser(){
                console.log("invalid user error");
            }

            function httpPostLike(){
                $scope.discussLike.$likeDiscuss(function (likeReply, headers) {
                        $scope.beforePost = false;
                        $scope.aggrLikeCount = likeReply.data.aggrLikeCount;
                        $scope.likedByUser = likeReply.data.likedByUser;
                    },
                    function (errorResponse) {
                        console.log(errorResponse);
                        if(errorResponse.data && errorResponse.data.error && errorResponse.data.error.errorCode === 3002){
                            ValidateUserCredential.login();
                        }
                    });
            }

        }

        $scope.likeComment = function (commentId, replyType) {
            $scope.discussLike = new DiscussReplyLike();
            $scope.discussLike.replyId = commentId;
            $scope.discussLike.url = window.location.href;
            $scope.userSessionType   = UserValidationFilter.getUserSessionType();

            if($scope.userSessionType === null){
                var userCredentialPromise = $scope.$parent.getUserCredential();
                userCredentialPromise.then(validUser, invalidUser);
            } else {
                httpPostLike();
            }

            function validUser(){
                httpPostLike();
            }

            function invalidUser(){
                console.log("invalid user error");
            }

            function httpPostLike(){
                if (replyType === BY.config.discuss.replyType.REPLY_TYPE_ANSWER) {
                    $scope.discussLike.$likeAnswer(function (likeReply, headers) {
                            $scope.beforePost = false;
                            $scope.aggrLikeCount = likeReply.data.likeCount;
                            $scope.likedByUser = likeReply.data.likedByUser;
                        },
                        function (errorResponse) {
                            console.log(errorResponse);
                            if(errorResponse.data && errorResponse.data.error && errorResponse.data.error.errorCode === 3002){
                                ValidateUserCredential.login();
                            }
                        }
                    );
                } else {
                    $scope.discussLike.$likeComment(function (likeReply, headers) {
                            $scope.beforePost = false;
                            $scope.aggrLikeCount = likeReply.data.likeCount;
                            $scope.likedByUser = likeReply.data.likedByUser;
                        },
                        function (errorResponse) {
                            console.log(errorResponse);
                            if(errorResponse.data && errorResponse.data.error && errorResponse.data.error.errorCode === 3002){
                                ValidateUserCredential.login();
                            }
                        });
                }
            }

        }
    }
    
    DiscussLikeController.$inject=['$scope', '$rootScope', 'DiscussLike','DiscussReplyLike', '$location','ValidateUserCredential', 'UserValidationFilter'];
    byApp.registerController('DiscussLikeController', DiscussLikeController);
    return DiscussLikeController;

});