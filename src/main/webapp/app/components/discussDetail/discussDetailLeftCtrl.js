/**
 * Created by sanjukta on 25-06-2015.
 */

define(['byApp', 'byUtil'], function(byApp, byUtil) {
	function discussDetailLeftController($scope, $rootScope, $window, $routeParams, broadCastData, DiscussPage, $sce){
		var discussId = $routeParams.discussId;

		$scope.$on('handleBroadcast', function() {
			if(discussId === broadCastData.newData.id){
				$scope.discuss = broadCastData.newData;
				var params = {p:0,s:6,discussType:"P",userId:$scope.discuss.userId};
				DiscussPage.get(params,
					function(value){
						var userArticles = value.data.content;
						$scope.articlesByUser = userArticles;
						if($scope.articlesByUser.length<=0){
							$scope.getTagBasedArticle();
						} else {
							if($scope.articlesByUser.length === 1 && $scope.articlesByUser[0].id===$scope.discuss.id){
								$scope.getTagBasedArticle();
							}
						}
						$scope.header1 = "Also by";
						$scope.header2 = BY.byUtil.validateUserName($scope.discuss.username);
					},
					function(error){
						console.log(error);
					});
			}

		});

		$scope.smartScroll = function () {
            var clientHeight = $( window ).height();
            $(".by_subMenuPlus").css('min-height', (clientHeight - 57)+"px");
            angular.element($window).bind("scroll", function () {
                var winTop = $(this).scrollTop(),
                    winBottom = winTop + $(this).height(),
                    left = $('.by_subMenuPlus'),
                    leftBottom = left.height() + 50;

                //when the user reached the bottom of '#leftShort' set its position to fixed to prevent it from moving on scroll
                if (winBottom >= leftBottom) {

                    left.css({
                        'position': 'fixed',
                        'bottom': '0px'
                    });
                } else {
                    //when the user scrolls back up revert its position to relative
                    left.css({
                        'position': 'relative',
                        'bottom': 'auto'
                    });
                }
            });
        };

        $scope.setContentHeight = function(cH, cW){
            $(".contentPanel").css('min-height', cH);  
        }

		$scope.getTagBasedArticle = function(){
			var systemTags = [];
			if($scope.discuss.topicId && $scope.discuss.topicId.length > 0){
				for(var i=0; i < $scope.discuss.topicId.length; i++){
					var topicId = $scope.discuss.topicId[i];
					var menu = $rootScope.menuCategoryMap[topicId];

					for(var j=0; j < menu.tags.length; j++){
						systemTags.push(menu.tags[j].id);
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
						$scope.header1 = "Related Post";
						$scope.header2 = "";
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

	discussDetailLeftController.$inject = ['$scope', '$rootScope', '$window', '$routeParams','broadCastData','DiscussPage','$sce'];
	byApp.registerController('discussDetailLeftController', discussDetailLeftController);
	return discussDetailLeftController;
});

