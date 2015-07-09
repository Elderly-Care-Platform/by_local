//DIscuss All
byControllers.controller('DiscussAllController', ['$scope', '$rootScope', '$location','$route', '$routeParams'
    ,'DiscussPage', 'DiscussOneTopicOneSubTopicListCount','$sce','$timeout',
    function ($scope, $rootScope, $location ,$route, $routeParams,DiscussPage,
              DiscussOneTopicOneSubTopicListCount,$sce, $timeout) {
	var a = $(".header .navbar-nav > li.dropdown");a.removeClass("dropdown"); setTimeout(function(){a.addClass("dropdown")},200);
		$scope.preSelected = {};
        $scope.article_story = "";
		$scope.showme = true;
//        DiscussList.query(function( value ){
//						       	 $scope.discuss = value.data;
//					     	},
//						     //error
//						     function( error ){
//						     		console.log("QUErY ERROR");
//						     		alert("error2");
//					     	});
        $scope.discussionViews = {};
        $scope.discussionViews.leftPanel = "app/components/discuss/discussLeftPanel.html?versionTimeStamp=%PROJECT_VERSION%";
        $scope.discussionViews.contentPanel = "app/components/discuss/discussContentPanel.html?versionTimeStamp=%PROJECT_VERSION%";

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

        //query to get the numbers
        DiscussOneTopicOneSubTopicListCount.get({
            discussType: "All",
            topicId: "list",
            subTopicId: "all"
        }).then(function (counts) {
            $scope.discuss_counts = counts.data;
        },
        function(error){
        	console.log("DiscussOneTopicOneSubTopicListCount");
        	alert("error");
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





byControllers.controller('DiscussSubCategoryController', ['$scope', '$route', '$rootScope', '$location', '$routeParams', 'DiscussPage',
    'DiscussOneTopicOneSubTopicListCount','$sce',
    function ($scope, $route, $rootScope, $location, $routeParams, DiscussPage, DiscussOneTopicOneSubTopicListCount, $sce) {
	var a = $(".header .navbar-nav > li.dropdown");a.removeClass("dropdown"); setTimeout(function(){a.addClass("dropdown")},200);
		$scope.preSelected = {};

        $scope.showme = true;
        $scope.discussionViews = {};
        $scope.discussionViews.leftPanel = "app/components/discuss/discussLeftPanel.html?versionTimeStamp=%PROJECT_VERSION%";
        $scope.discussionViews.contentPanel = "app/components/discuss/discussContentPanel.html?versionTimeStamp=%PROJECT_VERSION%";
        $scope.editor = {};
        $scope.editor.articlePhotoFilename = "";
        $scope.error = "";
        $scope.editor.subject = "";
        var discussType = $routeParams.discussType;
        
        
        var topicId = $routeParams.topicId;
        var subTopicId = $routeParams.subTopicId;

        var topicQueryId = $rootScope.discussCategoryNameIdMap[topicId.toLowerCase()];
        var subTopicQueryId = $rootScope.discussCategoryNameIdMap[subTopicId.toLowerCase()] ? $rootScope.discussCategoryNameIdMap[subTopicId.toLowerCase()] : "all";

        if(topicQueryId){
            var parentCategory = $rootScope.discussCategoryListMap[topicQueryId];
            if(parentCategory.childCount <= 0) {
                $scope.preSelected[topicQueryId] = true;
                BY.editorCategoryList.addCategory(topicQueryId);
            }
        }

        if($rootScope.discussCategoryNameIdMap[$routeParams.subTopicId.toLowerCase()]){
            var subTopicCategory = $rootScope.discussCategoryNameIdMap[$routeParams.subTopicId.toLowerCase()];
        	$scope.preSelected[subTopicCategory] = true;
            BY.editorCategoryList.addCategory(subTopicCategory);
        }
        


        
        if (discussType == '' || discussType == 'undefined' || !discussType || discussType == null) {
            discussType = 'All';
        }

        //code to prevent users from creating posts and questions when sub topic = all
        if ($location.path().endsWith('/all') && subTopicId=== "all") {
            $scope.showme = true;
        }

        $rootScope.bc_topic = topicId;
        $rootScope.bc_subTopic = subTopicId;
        
        
        
        $rootScope.bc_discussType = discussType === '' ? 'A' : discussType;

        //query to get the numbers
        
        DiscussOneTopicOneSubTopicListCount.get({
            discussType: "All",
            topicId: topicQueryId,
            subTopicId: subTopicQueryId
        }).then(function (counts) {
            $scope.discuss_counts = counts.data;
        },
        function (error) {
        	console.log("DiscussOneTopicOneSubTopicListCount");
            alert("error");
        });


        ///alert("one topic one sub topic :: " + $scope.discuss_counts);

        $("#preloader").show();
//        DiscussOneTopicOneSubTopicList.query({
//            discussType: discussType,
//            topicId: topicQueryId,
//            subTopicId: subTopicQueryId
//        },function(value){
//        	$scope.discuss = value.data;
//        	$("#preloader").hide();
//        },function(error){
//        	console.log("DiscussOneTopicOneSubTopicList");
//        	alert("error");
//        })
        var params = {p:0,s:10};
        if(discussType !=null && discussType != "" && discussType.toLowerCase() != "all"){
        	params.discussType = discussType;
        }
        if(topicQueryId !=null && topicQueryId != "" && topicQueryId.toLowerCase() != "all"){
        	params.topicId = topicQueryId;
        }
        if(subTopicQueryId !=null && subTopicQueryId != "" && subTopicQueryId.toLowerCase() != "all"){
        	params.subTopicId = subTopicQueryId;
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
                	params.discussType = discussType;
                }
                if(topicQueryId !=null && topicQueryId != "" && topicQueryId.toLowerCase() != "all"){
                	params.topicId = topicQueryId;
                }
                if(subTopicQueryId !=null && subTopicQueryId != "" && subTopicQueryId.toLowerCase() != "all"){
                	params.subTopicId = subTopicQueryId;
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
        
        


//        //User Discuss Like method
//        $scope.UserLike = function (userId, discussId, index) {
//
//        	//only read-only allowed without login
//    		if(localStorage.getItem('SessionId') == '' || localStorage.getItem('SessionId') == undefined)
//    		{
//    			$rootScope.nextLocation = $location.path();
//    			$location.path('/users/login');
//    		}
//    		else
//    		{
//    			//Create the new discuss user like
//    			$scope.discuss[index] = DiscussUserLikes.get({userId:userId, discussId: discussId});
//    		}
//        }

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


        $scope.go = function($event, type, id, discussType){
            $event.stopPropagation();
            if(type === "id"){
                $location.path('/discuss/'+id);
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

        $scope.trustForcefully = function(html) {
            return $sce.trustAsHtml(html);
        };

        $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
            $('p').each(function() {
                var $this = $(this);
                if($this.html().replace(/\s|&nbsp;/g, '').length == 0)
                    $this.remove(); });
            $('.by_story').dotdotdot();
        });

    }]);

