//DIscuss All
byControllers.controller('DiscussAllController', ['$scope', '$rootScope', '$location','$route', '$routeParams', 'DiscussList',
    'DiscussAllForDiscussType', 'DiscussOneTopicOneSubTopicListCount', 'DiscussUserLikes','Discuss','$sce','$timeout',
    function ($scope, $rootScope, $location ,$route, $routeParams, DiscussList, DiscussAllForDiscussType,
              DiscussOneTopicOneSubTopicListCount, DiscussUserLikes, Discuss,$sce, $timeout) {
	var a = $(".header .navbar-nav > li.dropdown");a.removeClass("dropdown"); setTimeout(function(){a.addClass("dropdown")},200);
		$scope.preSelected = {};
        $scope.article_story = "";
		$scope.showme = true;
        $scope.discuss = DiscussList.query();
        $scope.discussionViews = {};
        $scope.discussionViews.leftPanel = "views/discuss/discussLeftPanel.html";
        $scope.discussionViews.contentPanel = "views/discuss/discussContentPanel.html";

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
            $scope.discuss_counts = counts;
        });


        $scope.discuss = DiscussAllForDiscussType.query({discussType: discussType});

        $rootScope.bc_topic = 'list';
        $rootScope.bc_subTopic = 'all';
        $rootScope.bc_discussType = discussType;

        //User Discuss Like method
        $scope.UserLike = function(userId, discussId, index) {

			//only read-only allowed without login
			if(localStorage.getItem('SessionId') == '' || localStorage.getItem('SessionId') == undefined)
			{
				$rootScope.nextLocation = $location.path();
				$location.path('/users/login');
			}
			else
			{
	 			//Create the new discuss user like
	 			$scope.discuss[index] = DiscussUserLikes.get({userId:userId, discussId: discussId});
			}
		}
        
        $scope.add = function (type) {
        	if(localStorage.getItem('SessionId') == '' || localStorage.getItem('SessionId') == undefined)
			{
				$rootScope.nextLocation = $location.path();
				$location.path('/users/login');
			}
			else
			{
				$scope.error = "";
	            $scope.discussionViews.contentPanel = "views/home/home" + type + "EditorPanel.html";
	            window.scrollTo(0, 0);
			}
            
        }
        
        $scope.register = function (discussType) {
            $scope.discuss = new Discuss();
            $scope.discuss.discussType = discussType;
            $scope.discuss.text = tinyMCE.activeEditor.getContent();
            $scope.discuss.title = $scope.editor.subject;
            $scope.discuss.articlePhotoFilename = $scope.editor.articlePhotoFilename;
            $scope.discuss.topicId = $.map(BY.selectedCategoryList, function(value, index) {
                return [value];
            });
            //putting the userId to discuss being created
            $scope.discuss.userId = localStorage.getItem("USER_ID");
            $scope.discuss.username = localStorage.getItem("USER_NAME");
            if($scope.discuss.topicId.length >0 && $scope.discuss.text.trim().length > 0){
                $scope.error = "";
                $scope.discuss.$save(function (discuss, headers) {

                    BY.selectedCategoryList = {};
                    $route.reload();
                });

            }else{
            	if($scope.discuss.text.trim().length <= 0){
					$scope.error = "Please add details";
				}else{
					$scope.error = "Please select atleast 1 category";
				}
            }
            //save the discuss


        };

        $scope.trustForcefully = function(html) {
            return $sce.trustAsHtml(html);
        };

        $scope.go = function($event, type, id, discussType){
            $event.stopPropagation();
            if(type === "id"){
                if(discussType === "A"){
                    $location.path('/discuss/'+id);
                }else{
                    $location.path('/comment/'+id);
                }

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
            $('.by_story').dotdotdot();
        });
 	}]);


byControllers.controller('DiscussCategoryController', ['$scope', '$rootScope', '$location', '$routeParams', 'DiscussOneTopicAllSubTopicList', 'DiscussOneTopicAllSubTopicListCount', 'DiscussUserLikes',
    function ($scope, $rootScope, $location, $routeParams, DiscussOneTopicAllSubTopicList, DiscussOneTopicAllSubTopicListCount, DiscussUserLikes, Discuss) {
        //alert("Discuss ALl = " + $location.path());
		$scope.showme = true;
        $scope.discussionViews = {};
        $scope.discussionViews.leftPanel = "views/discuss/discussLeftPanel.html";
        $scope.discussionViews.contentPanel = "views/discuss/discussContentPanel.html";

        var topicId = $routeParams.topicId;
        var discussType = $routeParams.discussType;

        if (discussType == '' || discussType == 'undefined' || !discussType || discussType == null) {
            discussType = 'All';
        }

        //Query to get te counts
        //?????$scope.discuss_counts = DiscussOneTopicAllSubTopicListCount.query({discussType: "All", topicId: topicId});
        DiscussOneTopicOneSubTopicListCount.get({discussType: "All", topicId: topicId}).then(function (counts) {
            $scope.discuss_counts = counts;
        });

        $scope.discuss = DiscussOneTopicAllSubTopicList.query({topicId: topicId});
        $rootScope.bc_topic = topicId;
        $rootScope.bc_subTopic = null;

        $rootScope.bc_discussType = discussType;

        //User Discuss Like method
        $scope.UserLike = function (userId, discussId, index) {

        	//only read-only allowed without login
    		if(localStorage.getItem('SessionId') == '' || localStorage.getItem('SessionId') == undefined)
    		{
    			$rootScope.nextLocation = $location.path();
    			$location.path('/users/login');
    		}
    		else
    		{
    			//Create the new discuss user like
    			$scope.discuss[index] = DiscussUserLikes.get({userId:userId, discussId: discussId});
    		}
        }
    }]);


byControllers.controller('DiscussSubCategoryController', ['$scope', '$route', '$rootScope', '$location', '$routeParams', 'DiscussOneTopicOneSubTopicList',
    'DiscussOneTopicOneSubTopicListCount', 'DiscussUserLikes', 'Discuss','$sce',
    function ($scope, $route, $rootScope, $location, $routeParams, DiscussOneTopicOneSubTopicList, DiscussOneTopicOneSubTopicListCount, DiscussUserLikes, Discuss, $sce) {
	var a = $(".header .navbar-nav > li.dropdown");a.removeClass("dropdown"); setTimeout(function(){a.addClass("dropdown")},200);
		$scope.preSelected = {};

        $scope.showme = true;
        $scope.discussionViews = {};
        $scope.discussionViews.leftPanel = "views/discuss/discussLeftPanel.html";
        $scope.discussionViews.contentPanel = "views/discuss/discussContentPanel.html";
        $scope.editor = {};
        $scope.editor.articlePhotoFilename = "";
        $scope.error = "";
        $scope.editor.subject = "";
        var discussType = $routeParams.discussType;
        
        
        var topicId = $routeParams.topicId;
        var subTopicId = $routeParams.subTopicId;
        if($rootScope.discussCategoryNameIdMap[$routeParams.topicId.toLowerCase()]){
        	$scope.preSelected[$rootScope.discussCategoryNameIdMap[$routeParams.topicId.toLowerCase()]] = true;
        	BY.selectedCategoryList[$rootScope.discussCategoryNameIdMap[$routeParams.topicId.toLowerCase()]] = $rootScope.discussCategoryNameIdMap[$routeParams.topicId.toLowerCase()] ;
        }
        if($rootScope.discussCategoryNameIdMap[$routeParams.subTopicId.toLowerCase()]){
        	$scope.preSelected[$rootScope.discussCategoryNameIdMap[$routeParams.subTopicId.toLowerCase()]] = true;
        	BY.selectedCategoryList[$rootScope.discussCategoryNameIdMap[$routeParams.subTopicId.toLowerCase()]] = $rootScope.discussCategoryNameIdMap[$routeParams.subTopicId.toLowerCase()] ;
        }
        
        var topicQueryId = $rootScope.discussCategoryNameIdMap[topicId.toLowerCase()];
        var subTopicQueryId = (subTopicId=== "all") ? "all" : $rootScope.discussCategoryNameIdMap[subTopicId.toLowerCase()];
        
        console.log(topicQueryId);

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
            $scope.discuss_counts = counts;
        });


        ///alert("one topic one sub topic :: " + $scope.discuss_counts);


        $scope.discuss = DiscussOneTopicOneSubTopicList.query({
            discussType: discussType,
            topicId: topicQueryId,
            subTopicId: subTopicQueryId
        });


        //User Discuss Like method
        $scope.UserLike = function (userId, discussId, index) {

        	//only read-only allowed without login
    		if(localStorage.getItem('SessionId') == '' || localStorage.getItem('SessionId') == undefined)
    		{
    			$rootScope.nextLocation = $location.path();
    			$location.path('/users/login');
    		}
    		else
    		{
    			//Create the new discuss user like
    			$scope.discuss[index] = DiscussUserLikes.get({userId:userId, discussId: discussId});
    		}
        }

        $scope.add = function (type) {
        	if(localStorage.getItem('SessionId') == '' || localStorage.getItem('SessionId') == undefined)
			{
				$rootScope.nextLocation = $location.path();
				$location.path('/users/login');
			}
			else
			{
				$scope.error = "";
	            $scope.discussionViews.contentPanel = "views/home/home" + type + "EditorPanel.html";
	            window.scrollTo(0, 0);
			}
            
        }

        $scope.register = function (discussType) {
            $scope.discuss = new Discuss();
            $scope.discuss.discussType = discussType;
            $scope.discuss.text = tinyMCE.activeEditor.getContent();
            $scope.discuss.title = $scope.editor.subject;
            $scope.discuss.articlePhotoFilename = $scope.editor.articlePhotoFilename;
            $scope.discuss.topicId = $.map(BY.selectedCategoryList, function(value, index) {
                return [value];
            });
            //putting the userId to discuss being created
            $scope.discuss.userId = localStorage.getItem("USER_ID");
            $scope.discuss.username = localStorage.getItem("USER_NAME");
            if($scope.discuss.topicId.length >0){
                $scope.error = "";
                $scope.discuss.$save(function (discuss, headers) {

                    BY.selectedCategoryList = {};
                    $route.reload();
                });

            }else{
                $scope.error = "Please select atleast 1 category";
            }
            //save the discuss


        };

        $scope.go = function($event, type, id, discussType){
            $event.stopPropagation();
            if(type === "id"){
                if(discussType === "A"){
                    $location.path('/discuss/'+id);
                }else{
                    $location.path('/comment/'+id);
                }
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
            $('.by_story').dotdotdot();
        });

    }]);

