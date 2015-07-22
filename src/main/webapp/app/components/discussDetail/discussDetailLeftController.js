/**
 * Created by sanjukta on 25-06-2015.
 */
byControllers.controller('discussDetailLeftController', ['$scope', '$rootScope', '$routeParams','broadCastData','DiscussPage','$sce',
    function ($scope, $rootScope, $routeParams, broadCastData, DiscussPage, $sce) {
        var discussId = $routeParams.discussId;

        $scope.$on('handleBroadcast', function() {
            if(discussId === broadCastData.newData.id){
                $scope.discuss = broadCastData.newData;
                var params = {p:0,s:6,discussType:"A",userId:$scope.discuss.userId};
                DiscussPage.get(params,
                		function(value){
			                	var userArticles = value.data.content;
			        			$scope.articlesByUser = userArticles;
			                    if($scope.articlesByUser.length<=0){
			                        $scope.getRelatedArticle();
			                    } else {
			                        if($scope.articlesByUser.length === 1 && $scope.articlesByUser[0].id===$scope.discuss.id){
			                            $scope.getRelatedArticle();
			                        }
			                    }
			                    $scope.header1 = "Also by";
			                    $scope.header2 = BY.validateUserName($scope.discuss.username);
                		},
                		function(error){
        			       	console.log(error);
                		});
                }

        });


        $scope.getRelatedArticle = function(){
        var subTopicId = $scope.discuss.topicId[0];
        var params = {p:0,s:6,discussType:"A"};
        if(subTopicId && subTopicId != "" && subTopicId.toLowerCase() != "all"){
        	params.topicId = subTopicId;
        }
        DiscussPage.get(params,
        		function(value){
		        	$scope.articlesByUser = value.data.content;
		            $scope.header1 = "Also in";
					if(subTopicId && subTopicId != "" && subTopicId.toLowerCase() != "all"){
						$scope.header2 = $rootScope.discussCategoryListMap ? $rootScope.discussCategoryListMap[subTopicId].name : "";
					}else{
						$scope.header2 = "DISCUSS";
					}

        		},
        		function(error){
			       	console.log(error);
        		});
        }
        
        

        $scope.trustForcefully = function(html) {
            return $sce.trustAsHtml(html);
        };
    }]);