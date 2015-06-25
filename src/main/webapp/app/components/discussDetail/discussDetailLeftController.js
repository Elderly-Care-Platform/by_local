/**
 * Created by sanjukta on 25-06-2015.
 */
byControllers.controller('discussDetailLeftController', ['$scope', '$rootScope', '$routeParams', 'UserDiscussList','broadCastData','DiscussOneTopicOneSubTopicList',
    function ($scope, $rootScope, $routeParams, UserDiscussList, broadCastData, DiscussOneTopicOneSubTopicList) {
        var discussId = $routeParams.discussId;

        $scope.$on('handleBroadcast', function() {
            if(discussId === broadCastData.newData.id){
                $scope.discuss = broadCastData.newData;
                $scope.articlesByUser = UserDiscussList.get({'discussType':"all", 'topicId':"all", 'subTopicId': "all",
                    'userId':$scope.discuss.userId}, function(userArticles, header){

                    if(userArticles.length < 2){
                        var subTopicId = $scope.discuss.topicId[0];

                        //$scope.relatedArticles = DiscussOneTopicOneSubTopicList.get({})
                    }

                });
            }

        });
    }]);