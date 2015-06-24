byControllers.controller('DiscussDetailController', ['$scope', '$rootScope', '$routeParams', '$location', 'DiscussDetail', '$sce',
    function ($scope, $rootScope, $routeParams, $location, DiscussDetail, $sce) {

        var discussId = $routeParams.discussId;	//discuss Id from url
        $scope.discussDetailViews = {};

        $scope.discussDetailViews.leftPanel = "app/components/discussDetail/discussDetailLeftPanel.html";
        $scope.discussDetailViews.contentPanel = "app/components/discussDetail/discussDetailContentPanel.html";

        $scope.discuss = DiscussDetail.get({discussId: discussId});
        $scope.discussReplies = $scope.discuss.replies;
        $scope.trustForcefully = function (html) {
            return $sce.trustAsHtml(html);
        };


    }]);


byControllers.controller('DiscussReplyController', ['$scope', '$rootScope', '$routeParams', '$location', 'DiscussDetail', '$sce',
    function ($scope, $rootScope, $routeParams, $location, DiscussDetail, $sce) {
        $scope.showEditor = false;
        $scope.trustForcefully = function (html) {
            return $sce.trustAsHtml(html);
        };



        $scope.createNewReply = function(){
            document.getElementById("replyEditor").style.display = "block";
            tinyMCE.execCommand('mceFocus', false, "replyEditor_textArea");

        }

        $scope.disposeReply  = function(typeId){
            document.getElementById("replyEditor").style.display = "none";
            if(tinyMCE.activeEditor){
                tinyMCE.activeEditor.remove();
            }

        }


        $scope.postReply = function(discussId){
            $scope.discussReply = new DiscussDetail();
            $scope.discussReply.discussId = discussId;
            $scope.discussReply.text = tinyMCE.activeEditor.getContent();
            $scope.discussReply.$postReply(function (discussReply, headers) {
                $scope.$parent.discuss = DiscussDetail.get({discussId: discussId});
                $scope.disposeReply();
            });
        }

        $scope.disposeComment  = function(typeId){
            $scope.showEditor = false;
            if(tinyMCE.activeEditor){
                tinyMCE.activeEditor.remove();
            }

        }

        $scope.createNewComment = function(commentId){
            $scope.showEditor = true;
            console.log(document.getElementById(commentId));
            BY.addEditor({"editorTextArea":commentId, "commentEditor" : true});
        }

        $scope.postComment = function(parentReplyId, discussId){
            $scope.discussReply = new DiscussDetail();
            $scope.discussReply.parentReplyId = parentReplyId;
            $scope.discussReply.discussId = discussId;
            $scope.discussReply.text = tinyMCE.activeEditor.getContent();
            $scope.discussReply.$postComment(function (discussReply, headers) {
                $scope.$parent.discuss = DiscussDetail.get({discussId: discussId});
                $scope.disposeComment();
            });

        }


    }]);
//var discussType = $rootScope.bc_discussType;
//var topicId = $scope.discuss.topicId;
//var subTopicId = $scope.discuss.subTopicId;
//var userId = $scope.discuss.userId;
//
//
//$scope.discuss2 = UserDiscussList.get({discussType:discussType, topicId: topicId, subTopicId: subTopicId, userId: $scope.discuss.userId});
//$scope.comments  = DiscussComment.get({parentId:discussId,ancestorId:discussId});
//$scope.date = new Date();

