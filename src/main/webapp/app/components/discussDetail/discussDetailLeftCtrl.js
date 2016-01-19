/**
 * Created by sanjukta on 25-06-2015.
 */

define(['byApp', 'byUtil', 'discussService'], function(byApp, byUtil, discussService) {
	function discussDetailLeftController($scope, $rootScope, $window, $routeParams, broadCastData, DiscussPage, $sce, discussServiceFilter){
		var discussId = $routeParams.id;
		$scope.removeSpecialChars = BY.byUtil.removeSpecialChars;
		$scope.authorName = null;

		$scope.$on('discussDetailReceived', function(event, discussDetail) {
			if(discussId === discussDetail.id){
				$scope.discuss = discussDetail;
				var params = {p:0,s:6,discussType:"P",userId:$scope.discuss.userId};
				DiscussPage.get(params,
					function(value){
						var userArticles = value.data.content;
						$scope.articlesByUser = userArticles;
						$scope.articlesByUserFormat = discussServiceFilter.formatData($scope.articlesByUser);
						if($scope.articlesByUser.length<=0){
							$scope.getTagBasedArticle();
						} else {
							if($scope.articlesByUser.length === 1 && $scope.articlesByUser[0].id===$scope.discuss.id){
								$scope.getTagBasedArticle();
							}
						}
						$scope.header1 = "Also by ";
						$scope.authorName = BY.byUtil.validateUserName($scope.discuss.username);
					},
					function(error){
						console.log(error);
					});
			}

		});




		/*$scope.smartScroll = function () {
            var clientHeight = $( window ).height();
            $(".by_subMenuPlus").css('min-height', (clientHeight - 40)+"px");
            angular.element($window).bind("scroll", function () {
                 var winTop = $(this).scrollTop(),
                    winBottom = winTop + $(this).height(),
                    left = $('.by_subMenuPlus'),
                    leftBottom = left.outerHeight() + 43;

                if (winBottom >= leftBottom) {

                    left.css({
                        'position': 'fixed',
                        'bottom': '0px'
                    });
                } else {
                    left.css({
                        'position': 'relative',
                        'bottom': 'auto'
                    });
                }
                
            });
        };

        $scope.setContentHeight = function(cH, cW){
            $(".contentPanel").css('min-height', cH);  
        }*/

        $scope.leftPanelHeight = function(){            
            var clientHeight = $( window ).height() - 57;
            $(".by_menuDetailed").css('height', clientHeight+"px");
        }

		$scope.getTagBasedArticle = function(){
			var systemTags = [];
			if($scope.discuss.topicId && $scope.discuss.topicId.length > 0){
				for(var i=0; i < $scope.discuss.topicId.length; i++){
					var topicId = $scope.discuss.topicId[i], menu = $rootScope.menuCategoryMap[topicId];

					if(!menu){
						menu = $rootScope.hiddenMenu[topicId];
					}

					if(menu){
						for(var j=0; j < menu.tags.length; j++){
							systemTags.push(menu.tags[j].id);
						}
					}

				}
			}

			if(systemTags && systemTags.length > 0){
				var params = {p:0,s:6,discussType:"P"};
				//params.tags = $.map($scope.discuss.systemTags, function(value, key){
				//	return value.id;
				//})

				params.tags = systemTags.toString();
				DiscussPage.get(params,
					function(response){
						$scope.articlesByUser = response.data.content;
						$scope.articlesByUserFormat = discussServiceFilter.formatData($scope.articlesByUser);
						$scope.header1 = "Related Post";
						$scope.authorName = null;
					},
					function(error){
						console.log(error);
					});
			}

		}

		$scope.trustForcefully = function(html) {
			return $sce.trustAsHtml(html);
		};

	}

	discussDetailLeftController.$inject = ['$scope', '$rootScope', '$window', '$routeParams','broadCastData','DiscussPage','$sce', 'DisServiceFilter'];
	byApp.registerController('discussDetailLeftController', discussDetailLeftController);
	return discussDetailLeftController;
});

