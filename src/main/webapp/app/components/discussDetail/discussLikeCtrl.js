define(['byApp', 'discussConfig', 'userValidation'], function(byApp, discussConfig, userValidation) {
    'use strict';
    function DiscussLikeController ($scope, $rootScope, $q, DiscussLike, DiscussReplyLike, $location, ValidateUserCredential, UserValidationFilter) {
        $scope.beforePost        = true;

        $scope.likeDiscuss = function (discuss) {
            var discussId = discuss.id;
            $scope.discussLike = new DiscussLike();
            $scope.discussLike.discussId = discussId;
            $scope.discussLike.url = window.location.origin + "/#!/community/"+discussId;
            $scope.userSessionType   = UserValidationFilter.getUserSessionType();


            if($scope.userSessionType === null){
                var userCredentialPromise = $scope.getUserCredentialForLike(discuss);
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

        $scope.getUserCredentialForLike = function(discussLikeObj){
            if($scope.discussLikeObj){
                delete $scope.discussLikeObj.pendingUserCredential
            }
            $scope.discussLikeObj = discussLikeObj;
            $scope.discussLikeObj.pendingUserCredential = true;
            $scope.userCredential.defer= $q.defer();
            window.setTimeout(function(){
                $(".masonry").masonry("reload");
            }, 100);

            return $scope.userCredential.defer.promise;
        }

        $scope.setUserCredentialForLike = function(){
            if($scope.userCredential.email && BY.byUtil.validateEmailId($scope.userCredential.email)){
                var promise = UserValidationFilter.loginUser($scope.userCredential.email);
                promise.then(validUser, invalidUser);
            }else{
                $scope.likeErrMsg = "Please enter valid email";
            }

            function validUser(){
                if($scope.userCredential.defer){
                    $scope.discussLikeObj.pendingUserCredential = false;
                    $scope.userCredential.defer.resolve();
                    //delete $scope.userCredential.promise;
                }
                window.setTimeout(function(){
                    $(".masonry").masonry("reload");
                }, 100);
            }

            function invalidUser(){
                console.log("invalid user error");
                if($scope.userCredential.defer){
                    $scope.userCredential.defer.reject();
                }
                window.setTimeout(function(){
                    $(".masonry").masonry("reload");
                }, 100);
                //delete $scope.userCredential.promise;
            }
        }

        $scope.cancelSetCredentialForLike = function(){
            $scope.discussLikeObj.pendingUserCredential = false;
            if($scope.userCredential.defer){
                $scope.userCredential.defer.reject();
            }
            window.setTimeout(function(){
                $(".masonry").masonry("reload");
            }, 100);
        }
    }
    
    DiscussLikeController.$inject=['$scope', '$rootScope', '$q', 'DiscussLike','DiscussReplyLike', '$location','ValidateUserCredential', 'UserValidationFilter'];
    byApp.registerController('DiscussLikeController', DiscussLikeController);
    return DiscussLikeController;

});