byControllers.controller('DiscussDetailController', ['$scope', '$rootScope', '$routeParams', '$location', 'DiscussDetail', '$sce','broadCastData',
    function ($scope, $rootScope, $routeParams, $location, DiscussDetail, $sce, broadCastData) {

        var discussId = $routeParams.discussId;	//discuss Id from url
        $scope.discussDetailViews = {};

        $scope.discussDetailViews.leftPanel = "app/components/discussDetail/discussDetailLeftPanel.html";
        $scope.discussDetailViews.contentPanel = "app/components/discussDetail/discussDetailContentPanel.html";

        $scope.res = DiscussDetail.get({discussId: discussId});
        $scope.trustForcefully = function (html) {
            return $sce.trustAsHtml(html);
        };

        $scope.$on('handleBroadcast', function() {
            if(discussId === broadCastData.newData.id){
                $scope.discuss = broadCastData.newData;
            }

        });
    }]);


byControllers.controller('DiscussReplyController', ['$scope', '$rootScope', '$routeParams', '$location', 'DiscussDetail', '$sce','broadCastData',
    function ($scope, $rootScope, $routeParams, $location, DiscussDetail, $sce, broadCastData) {
        $scope.showEditor = false;
        $scope.trustForcefully = function (html) {
            return $sce.trustAsHtml(html);
        };

        $scope.createNewComment = function(commentId){
            $scope.showEditor = true;
            BY.addEditor({"editorTextArea":commentId, "commentEditor" : true, "autoFocus":true});
            tinyMCE.execCommand('mceFocus', false, commentId);
        };

        $scope.disposeComment  = function(typeId){
            $scope.showEditor = false;
            tinyMCE.activeEditor.setContent('');
            if(tinyMCE.activeEditor){
                tinyMCE.activeEditor.remove();
            }
        };

        $scope.postComment = function(discussId, parentReplyId){
            $scope.discussReply = new DiscussDetail();
            $scope.discussReply.parentReplyId = parentReplyId ?  parentReplyId : "";
            $scope.discussReply.discussId = discussId;
            $scope.discussReply.text = tinyMCE.activeEditor.getContent();

            $scope.discussReply.$postComment(function (discussReply, headers) {
                broadCastData.update(discussReply);
                $scope.disposeComment();
            });
        };

        $scope.postReply = function(discussId, discussType){
            if(discussType==="Q"){
                $scope.discussReply = new DiscussDetail();
                $scope.discussReply.discussId = discussId;
                $scope.discussReply.text = tinyMCE.activeEditor.getContent();

                $scope.discussReply.$postAnswer(function (discussReply, headers) {
                    broadCastData.update(discussReply);
                    $scope.disposeComment();
                });
            }else{
                $scope.postComment(discussId);
            }
        };

    }]);

byControllers.controller('DiscussLikeController', ['$scope', '$rootScope','DiscussLike',
    function ($scope, $rootScope, DiscussLike) {
        $scope.beforePost = true;

        $scope.likeDiscuss = function(discussId){
            $scope.discussLike = new DiscussLike();
            $scope.discussLike.discussId = discussId;
            $scope.discussLike.$likeDiscuss(function(likeReply, headers){
                $scope.beforePost = false;
                $scope.aggrLikeCount = likeReply.aggrLikeCount;
            });
        }

        $scope.likeComment = function(commentId, replyType){
            $scope.discussLike = new DiscussLike();
            $scope.discussLike.replyId = commentId;

            if(replyType===6){
                $scope.discussLike.$likeAnswer(function(likeReply, headers){
                    $scope.beforePost = false;
                    $scope.aggrLikeCount = likeReply.aggrLikeCount;
                });
            }else{
                $scope.discussLike.$likeComment(function(likeReply, headers){
                    $scope.beforePost = false;
                    $scope.aggrLikeCount = likeReply.aggrLikeCount;
                });
            }

        }


    }]);