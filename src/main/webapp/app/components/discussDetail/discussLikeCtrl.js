define(['byApp', 'discussConfig', 'userValidation', 'discussService'], function(byApp, discussConfig, userValidation, discussService) {
    'use strict';
    function DiscussLikeController ($scope, DiscussLike, DiscussReplyLike, UserValidationFilter, DisServiceFilter) {
        $scope.beforePost        = true;

        $scope.likeDiscuss = function (discuss) {
            var discussId = discuss.id;
            $scope.discussLike = new DiscussLike();
            $scope.discussLike.discussId = discussId;
            $scope.discussLike.url = DisServiceFilter.getDiscussAbsUrl(discuss);
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
                        //if(errorResponse.data && errorResponse.data.error && errorResponse.data.error.errorCode === 3002){
                        //    ValidateUserCredential.login();
                        //}
                    });
            }

        }

        $scope.likeComment = function (replyObj) {
            $scope.discussLike = new DiscussReplyLike();
            $scope.discussLike.replyId = replyObj.id;
            $scope.discussLike.url = window.location.href;
            $scope.userSessionType   = UserValidationFilter.getUserSessionType();

            if($scope.userSessionType === null){
                var userCredentialPromise = $scope.$parent.getUserCredentialForLike(replyObj);
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
                if (replyObj.replyType === BY.config.discuss.replyType.REPLY_TYPE_ANSWER) {
                    $scope.discussLike.$likeAnswer(function (likeReply, headers) {
                            $scope.beforePost = false;
                            $scope.aggrLikeCount = likeReply.data.likeCount;
                            $scope.likedByUser = likeReply.data.likedByUser;
                        },
                        function (errorResponse) {
                            console.log(errorResponse);
                            if(errorResponse.data && errorResponse.data.error && errorResponse.data.error.errorCode === 3002){
                                //ValidateUserCredential.login();
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
                                //ValidateUserCredential.login();
                            }
                        });
                }
            }

        }

    }
    
    DiscussLikeController.$inject=['$scope', 'DiscussLike', 'DiscussReplyLike', 'UserValidationFilter', 'DisServiceFilter'];
    byApp.registerController('DiscussLikeController', DiscussLikeController);
    return DiscussLikeController;

});