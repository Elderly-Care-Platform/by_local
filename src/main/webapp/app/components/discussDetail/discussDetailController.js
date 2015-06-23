byControllers.controller('DiscussDetailController', ['$scope', '$rootScope', '$routeParams', '$location', 'DiscussDetail', '$sce',
    function ($scope, $rootScope, $routeParams, $location, DiscussDetail, $sce) {

        var discussId = $routeParams.discussId;	//discuss Id from url
        $scope.discussDetailViews = {};

        $scope.discussDetailViews.leftPanel = "app/components/discussDetail/discussDetailLeftPanel.html";
        $scope.discussDetailViews.contentPanel = "app/components/discussDetail/discussDetailContentPanel.html";

        $scope.discuss = DiscussDetail.get({discussId: discussId});

        $scope.trustForcefully = function (html) {
            return $sce.trustAsHtml(html);
        };


    }]);


byControllers.controller('DiscussReplyController', ['$scope', '$rootScope', '$routeParams', '$location', 'DiscussDetail', '$sce',
    function ($scope, $rootScope, $routeParams, $location, DiscussDetail, $sce) {

        $scope.trustForcefully = function (html) {
            return $sce.trustAsHtml(html);
        };

        $scope.createNewComment = function(discussType, discussId){
            document.getElementById("replyEditor").style.display = "block";
        }

        $scope.createNewReply = function(){
            document.getElementById("replyEditor").style.display = "block";

        }

        $scope.dispose  = function(typeId){
            document.getElementById("replyEditor").style.display = "none";

        }


        $scope.postReply = function(discussId){
            $scope.discussReply = new DiscussDetail();
            $scope.discussReply.discussId = discussId;
            $scope.discussReply.text = "njnkjnkjn";
            $scope.discussReply.$postReply(function (discussReply, headers) {
                console.log("success")
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

