/**
 * Created by sanjukta on 25-06-2015.
 */
byControllers.controller('discussDetailLeftController', ['$scope', '$rootScope', '$routeParams', 'UserDiscussList','broadCastData','DiscussOneTopicOneSubTopicList','$sce',
    function ($scope, $rootScope, $routeParams, UserDiscussList, broadCastData, DiscussOneTopicOneSubTopicList, $sce) {
        var discussId = $routeParams.discussId;

        $scope.$on('handleBroadcast', function() {
            if(discussId === broadCastData.newData.id){
                $scope.discuss = broadCastData.newData;
                $scope.articlesByUser = UserDiscussList.get({'discussType':"A", 'topicId':"all", 'subTopicId': "all",
                    'userId':$scope.discuss.userId}, function(userArticles, header){
                    if($scope.articlesByUser.length<=0){
                        $scope.getRelatedArticle();
                    } else {
                        $scope.articlesByUser = userArticles.splice(0,6);
                        if($scope.articlesByUser.length === 1 && $scope.articlesByUser[0].id===$scope.discuss.id){
                            $scope.getRelatedArticle();
                        }
                    }
                    $scope.header1 = "Also by";
                    $scope.header2 = BY.validateUserName($scope.discuss.username);
                });
            }

        });

        $scope.getRelatedArticle = function(){
            var subTopicId = $scope.discuss.topicId[0];
            $scope.articlesByUser = DiscussOneTopicOneSubTopicList.get({
                discussType: "A",
                topicId: subTopicId,
                subTopicId:"all"
            }, function(topicRelatedArticle, header){
                $scope.articlesByUser = topicRelatedArticle.splice(0,6);
                $scope.header1 = "Also in";
                $scope.header2 = $rootScope.discussCategoryListMap[subTopicId].name;
            });
        }

        $scope.trustForcefully = function(html) {
            return $sce.trustAsHtml(html);
        };
    }]);