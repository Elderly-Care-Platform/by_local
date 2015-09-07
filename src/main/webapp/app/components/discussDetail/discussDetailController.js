byControllers.controller('DiscussDetailController', ['$scope', '$rootScope', '$routeParams', '$location', 'DiscussDetail', '$sce', 'broadCastData', '$timeout',
    function ($scope, $rootScope, $routeParams, $location, DiscussDetail, $sce, broadCastData, $timeout) {

        var discussId = $routeParams.discussId;	//discuss Id from url
        var isComment = $routeParams.comment;


        $scope.discussDetailViews = {};
        $scope.discussDetailViews.leftPanel = "app/components/discussDetail/discussDetailLeftPanel.html?versionTimeStamp=%PROJECT_VERSION%";
        $scope.discussDetailViews.contentPanel = "app/components/discussDetail/discussDetailContentPanel.html?versionTimeStamp=%PROJECT_VERSION%";
        $("#preloader").show();


        var scrollToEditor = function(){
            if(isComment){
                $timeout(
                    function () {
                        var tag = $("#replyEditor:visible");
                        if (tag.length > 0) {
                            $('html,body').animate({scrollTop: tag.offset().top - $(".breadcrumbs").height() - $(".header").height()}, 'slow');
                        }
                    }, 100);
            }

        };

        DiscussDetail.get({discussId: discussId}, function (discussDetail, header) {
                //broadcast data to left panel, to avoid another query from left panel of detail page
                $scope.detailResponse = discussDetail.data;
                broadCastData.update(discussDetail.data.discuss);
                $scope.detailResponse.discuss.createdAt = discussDetail.data.discuss.createdAt;
                $("#preloader").hide();

                var metaTagParams = {
                    title:  $scope.detailResponse.discuss.title,
                    imageUrl:   $scope.detailResponse.discuss.articlePhotoFilename ? $scope.detailResponse.discuss.articlePhotoFilename.titleImage : "",
                    description:    $scope.detailResponse.discuss.text
                }
                BY.byUtil.updateMetaTags(metaTagParams);
                scrollToEditor();
            },
            function (error) {
                console.log("error");
            });



        $scope.trustForcefully = function (html) {
            return $sce.trustAsHtml(html);
        };
        $scope.trustAsResourceUrl = function(url) {
            return $sce.trustAsResourceUrl(url);
        };

        //update data in view after comments/answers are posted from child controller
        $scope.$on('handleBroadcast', function () {
            if (broadCastData.newData.discuss && discussId === broadCastData.newData.discuss.id) {
                $scope.detailResponse = broadCastData.newData;
            }
        });
        
        $scope.updateShareCount = function(count){
        	$scope.detailResponse.discuss.shareCount = count;
        }
    }]);


byControllers.controller('DiscussReplyController', ['$scope', '$rootScope', '$routeParams', '$location', 'DiscussDetail', '$sce', 'broadCastData','ValidateUserCredential',
    function ($scope, $rootScope, $routeParams, $location, DiscussDetail, $sce, broadCastData, ValidateUserCredential) {
        $scope.showEditor = false;
        $scope.trustForcefully = function (html) {
            return $sce.trustAsHtml(html);
        };

        $scope.createNewComment = function (editorId) {
            if (!$scope.showEditor)
                $scope.initCommentEditor(editorId);
        };

        $scope.initCommentEditor = function (editorId) {
            $scope.showEditor = true;
            BY.addEditor({"editorTextArea": editorId, "commentEditor": true, "autoFocus": true});
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
            $scope.discussReply = new DiscussDetail();
            $scope.discussReply.parentReplyId = parentReplyId ? parentReplyId : "";
            $scope.discussReply.discussId = discussId;
            $scope.discussReply.text = tinymce.get(parentReplyId).getContent();
            $scope.discussReply.url = window.location.href;
            $scope.discussReply.$postComment(
                function (discussReply) {
                    broadCastData.update(discussReply.data); //broadcast data for parent controller to update the view with latest comment/answer
                    $scope.disposeComment(parentReplyId);           //dispose comment editor and remove tinymce after successful post of comment/answer
                },
                function (errorResponse) {
                    console.log(errorResponse);
                    $(".by_btn_submit").prop("disabled", false);
                    if(errorResponse.data && errorResponse.data.error && errorResponse.data.error.errorCode === 3002){
                        ValidateUserCredential.login();
                    }
                });
        };


        //Post method called from main detail discuss
        $scope.postMainReply = function (discussId, discussType) {
            $(".by_btn_submit").prop("disabled", true);
            $scope.discussReply = new DiscussDetail();
            $scope.discussReply.discussId = discussId;
            $scope.discussReply.text = tinymce.get(discussId).getContent();
            $scope.discussReply.url = window.location.href;
            if (discussType === "Q") {
                $scope.discussReply.$postAnswer(function (discussReply, headers) {
                        broadCastData.update(discussReply.data); //broadcast data for parent controller to update the view with latest comment/answer
                        $scope.disposeComment(discussId); //dispose comment editor and remove tinymce after successful post of comment/answer
                    },
                    function (errorResponse) {
                        console.log(errorResponse);
                        $(".by_btn_submit").prop("disabled", false);
                        if(errorResponse.data && errorResponse.data.error && errorResponse.data.error.errorCode === 3002){
                            ValidateUserCredential.login();
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
                            ValidateUserCredential.login();
                        }
                    });
            }
        };
    }]);

byControllers.controller('DiscussLikeController', ['$scope', '$rootScope', 'DiscussLike','DiscussReplyLike', '$location','ValidateUserCredential',
    function ($scope, $rootScope, DiscussLike,DiscussReplyLike, $location, ValidateUserCredential) {
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

    }]);