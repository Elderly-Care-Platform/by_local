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
        			       	console.log("DiscussAllForDiscussType");
//        			       	alert("error");
                		});
                }
                
                
//                $scope.articlesByUser = UserDiscussList.get({'discussType':"A", 'topicId':"all", 'subTopicId': "all",
//                    'userId':$scope.discuss.userId}).$promise.then(
//                        //success
//                    		function(value){
//                    			var userArticles = value.data;
//                    			$scope.articlesByUser = userArticles;
//                                if($scope.articlesByUser.length<=0){
//                                    $scope.getRelatedArticle();
//                                } else {
//                                    $scope.articlesByUser = userArticles.splice(0,6);
//                                    if($scope.articlesByUser.length === 1 && $scope.articlesByUser[0].id===$scope.discuss.id){
//                                        $scope.getRelatedArticle();
//                                    }
//                                }
//                                $scope.header1 = "Also by";
//                                $scope.header2 = BY.validateUserName($scope.discuss.username);
//                            },
//                        //error
//	                        function( error ){
//                            	console.log("QUErY ERROR");
//	                        		alert("error2");
//	                        		}
//                      );
//            }

        });

//        $scope.getRelatedArticle = function(){
//            var subTopicId = $scope.discuss.topicId[0];
//            DiscussOneTopicOneSubTopicList.get({
//                discussType: "A",
//                topicId: subTopicId,
//                subTopicId:"all"
//            }, function(topicRelatedArticle, header){
//                $scope.articlesByUser = topicRelatedArticle.data.splice(0,6);
//                $scope.header1 = "Also in";
//                $scope.header2 = $rootScope.discussCategoryListMap[subTopicId].name;
//            },
//            //error
//            function( error ){
//            	console.log("QUErY ERROR");
//            		alert("error2");
//            		});
//        }
//        
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
		            $scope.header2 = $rootScope.discussCategoryListMap[subTopicId].name;
        		},
        		function(error){
			       	console.log("DiscussAllForDiscussType");
//			       	alert("error");
        		});
        }
        
        

        $scope.trustForcefully = function(html) {
            return $sce.trustAsHtml(html);
        };
    }]);