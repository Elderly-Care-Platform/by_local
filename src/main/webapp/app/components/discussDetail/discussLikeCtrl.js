define(["byApp"], function(byApp) {
    'use strict';
    function DiscussLikeController ($scope, $rootScope, DiscussLike, DiscussReplyLike, $location, ValidateUserCredential) {
        $scope.beforePost = true;

        $scope.likeDiscuss = function (discussId) {
            $scope.discussLike = new DiscussLike();
            $scope.discussLike.discussId = discussId;
            $scope.discussLike.url = window.location.origin + "/#!/discuss/"+discussId;
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

        $scope.likeComment = function (commentId, replyType) {
            $scope.discussLike = new DiscussReplyLike();
            $scope.discussLike.replyId = commentId;
            $scope.discussLike.url = window.location.href;

            if (replyType === 6) {
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
    
    DiscussLikeController.$inject=['$scope', '$rootScope', 'DiscussLike','DiscussReplyLike', '$location','ValidateUserCredential'];
    byApp.registerController('DiscussLikeController', DiscussLikeController);
    return DiscussLikeController;

});