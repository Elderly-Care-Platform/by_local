//DIscuss All
byControllers.controller('ProductAllController', ['$scope', '$rootScope', '$location','$route', '$routeParams'
                                                  ,'DiscussPage', 'DiscussCount','$sce','$timeout',
                                                  function ($scope, $rootScope, $location ,$route, $routeParams,DiscussPage,
                                                  		DiscussCount,$sce, $timeout) {
	var a = $(".header .navbar-nav > li.dropdown");a.removeClass("dropdown"); setTimeout(function(){a.addClass("dropdown")},200);
	$scope.preSelected = {};
    $scope.article_story = "";

    $scope.discussionViews = {};
        $scope.discussionViews = {};
        $scope.discussionViews.leftPanel = "app/components/product/productLeftPanel.html?versionTimeStamp=%PROJECT_VERSION%";
        $scope.discussionViews.contentPanel = "app/components/product/productContentPanel.html?versionTimeStamp=%PROJECT_VERSION%";

       $scope.editor = {};
        $scope.editor.articlePhotoFilename = "";
        $scope.error = "";
        $scope.editor.subject = "";
        var discussType = $routeParams.discussType;
        
        
        var topicId = $routeParams.topicId;
        var subTopicId = $routeParams.subTopicId;

        if (discussType == '' || discussType == 'undefined' || !discussType || discussType == null) {
            discussType = 'All';
        }

//        //query to get the numbers
//        DiscussOneTopicOneSubTopicListCount.get({
//            discussType: "All",
//            topicId: "list",
//            subTopicId: "all"
//        }).then(function (counts) {
//            $scope.discuss_counts = counts.data;
//        },
//        function(error){
//        	console.log("DiscussOneTopicOneSubTopicListCount");
//        	alert("error");
//        });
        
        
        DiscussCount.get({},function (counts) {
            $scope.discuss_counts = counts.data;
        },
        function(error){
        	console.log("DiscussOneTopicOneSubTopicListCount");
//        	alert("error");
        });

        $("#preloader").show();
        
        var params = {p:0,s:10};
        if(discussType !=null && discussType != "" && discussType.toLowerCase() != "all"){
        	params.discussType = discussType;;
        }
        
        DiscussPage.get(params,
        		function(value){
			       	 $scope.discuss = value.data.content;
			       	 $scope.pageInfo = BY.byUtil.getPageInfo(value.data);
			       	$scope.pageInfo.isQueryInProgress = false;
			       	$("#preloader").hide();
        		},
        		function(error){
			       	console.log("DiscussAllForDiscussType");
			       	alert("error");
        		});
        $scope.loadMore = function($event){
        	if($scope.pageInfo && !$scope.pageInfo.lastPage && !$scope.pageInfo.isQueryInProgress ){
        		$scope.pageInfo.isQueryInProgress = true;
        		var params = {p:$scope.pageInfo.number + 1,s:$scope.pageInfo.size};
                if(discussType !=null && discussType != "" && discussType.toLowerCase() != "all"){
                	params.discussType = discussType;;
                }
            	DiscussPage.get(params,
                		function(value){
	            			if(value.data.content.length > 0){
	        					$scope.pageInfo.isQueryInProgress = false;
	        					$scope.discuss = $scope.discuss.concat(value.data.content);
	        				}
	    			       	 $scope.pageInfo = BY.byUtil.getPageInfo(value.data);
	    			       	$scope.pageInfo.isQueryInProgress = false;
                		},
                		function(error){
        			       	console.log("DiscussAllForDiscussType");
                		});
        	}
        }
        $rootScope.bc_topic = 'list';
        $rootScope.bc_subTopic = 'all';
        $rootScope.bc_discussType = discussType;

//        //User Discuss Like method
//        $scope.UserLike = function(userId, discussId, index) {
//
//			//only read-only allowed without login
//			if(localStorage.getItem('SessionId') == '' || localStorage.getItem('SessionId') == undefined)
//			{
//				$rootScope.nextLocation = $location.path();
//				$location.path('/users/login');
//			}
//			else
//			{
//	 			//Create the new discuss user like
//	 			$scope.discuss[index] = DiscussUserLikes.get({userId:userId, discussId: discussId});
//			}
//		}
        
        $scope.add = function (type) {
            BY.removeEditor();
        	if(localStorage.getItem('SessionId') == '' || localStorage.getItem('SessionId') == undefined)
			{
				$rootScope.nextLocation = $location.path();
				$location.path('/users/login');
			}
			else
			{
				$scope.error = "";
	            $scope.discussionViews.contentPanel = "app/shared/editor/" + type + "EditorPanel.html?versionTimeStamp=%PROJECT_VERSION%";
	            window.scrollTo(0, 0);
			}
            
        };

        $scope.postSuccess = function () {
            $route.reload();
        };
        
        $scope.trustForcefully = function(html) {
            return $sce.trustAsHtml(html);
        };

        $scope.go = function($event, type, id, discussType){
            $event.stopPropagation();
            if(type === "id"){
                $location.path('/discuss/'+id);
                //if(discussType === "A"){
                //
                //}else{
                //    $location.path('/comment/'+id);
                //}

            } else if(type === "name"){
                var parentCategoryId = $rootScope.discussCategoryListMap[id].parentId;
                parentCategoryName = parentCategoryId ? $rootScope.discussCategoryListMap[parentCategoryId].name : null;

                if(parentCategoryName){
                    $location.path('/discuss/All/'+ parentCategoryName + '/' + $rootScope.discussCategoryListMap[id].name);
                }else{
                    $location.path('/discuss/All/'+ $rootScope.discussCategoryListMap[id].name + '/all');
                }
            }else if(type = "accordian"){
                $($event.target).find('a').click();
            }

        }

        $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
            $('p').each(function() {
                var $this = $(this);
                if($this.html().replace(/\s|&nbsp;/g, '').length == 0)
                    $this.remove(); });
            $('.by_story').dotdotdot();
        });
 	}]);

