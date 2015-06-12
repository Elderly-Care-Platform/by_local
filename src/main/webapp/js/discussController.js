//DIscuss All
byControllers.controller('DiscussAllController', ['$scope', '$rootScope', '$routeParams', 'DiscussList', 'DiscussAllForDiscussType', 'DiscussOneTopicOneSubTopicListCount', 'DiscussUserLikes',
    function ($scope, $rootScope, $routeParams, DiscussList, DiscussAllForDiscussType, DiscussOneTopicOneSubTopicListCount, DiscussUserLikes) {
        $scope.discuss = DiscussList.query();
        $scope.discussionViews = {};
        $scope.discussionViews.leftPanel = "views/discuss/discussLeftPanel.html";
        $scope.discussionViews.contentPanel = "views/discuss/discussContentPanel.html";

        var discussType = $routeParams.discussType;

        if (discussType == '' || discussType == 'undefined' || !discussType || discussType == null) {
            discussType = 'All';
        }

        //query to get the numbers
        //???????$scope.discuss_counts = DiscussOneTopicOneSubTopicListCount.query({discussType: "All", topicId: "list", subTopicId: "all"});
        DiscussOneTopicOneSubTopicListCount.get({
            discussType: "All",
            topicId: "list",
            subTopicId: "all"
        }).then(function (counts) {
            $scope.discuss_counts = counts;
        });

        //alert("discuss all :: " + $scope.discuss_counts);

        $scope.discuss = DiscussAllForDiscussType.query({discussType: discussType});

        $rootScope.bc_topic = 'list';
        $rootScope.bc_subTopic = 'all';
        $rootScope.bc_discussType = discussType;

        //User Discuss Like method
        $scope.UserLike = function (userId, discussId, index) {

            /*
             if(localStorage.getItem('sessionId') == '' || localStorage.getItem('sessionId') == null)
             {
             $location.path('/users/login');
             }
             */
            //Create the new discuss user like
            $scope.discuss[index] = DiscussUserLikes.get({userId: userId, discussId: discussId});
        }
    }]);


byControllers.controller('DiscussCategoryController', ['$scope', '$rootScope', '$location', '$routeParams', 'DiscussOneTopicAllSubTopicList', 'DiscussOneTopicAllSubTopicListCount', 'DiscussUserLikes',
    function ($scope, $rootScope, $location, $routeParams, DiscussOneTopicAllSubTopicList, DiscussOneTopicAllSubTopicListCount, DiscussUserLikes) {
        //alert("Discuss ALl = " + $location.path());
        $scope.showme = false;
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

            /*
             if(localStorage.getItem('sessionId') == '' || localStorage.getItem('sessionId') == null)
             {
             $location.path('/users/login');
             }
             */
            //Create the new discuss user like
            $scope.discuss[index] = DiscussUserLikes.get({userId: userId, discussId: discussId});

        }
        //??????????????????????$location.path('/discuss/' + discussType + '/' + topicId + '/all');
    }]);


byControllers.controller('DiscussSubCategoryController', ['$scope', '$route', '$rootScope', '$location', '$routeParams', 'DiscussOneTopicOneSubTopicList',
    'DiscussOneTopicOneSubTopicListCount', 'DiscussUserLikes', 'Discuss',
    function ($scope, $route, $rootScope, $location, $routeParams, DiscussOneTopicOneSubTopicList, DiscussOneTopicOneSubTopicListCount, DiscussUserLikes, Discuss) {

        $scope.showme = true;
        $scope.discussionViews = {};
        $scope.discussionViews.leftPanel = "views/discuss/discussLeftPanel.html";
        $scope.discussionViews.contentPanel = "views/discuss/discussContentPanel.html";
        $scope.editor = {};
        $scope.error = "";
        $scope.editor.subject = "";
        var discussType = $routeParams.discussType;
        
        
        var topicId = $routeParams.topicId;
        var subTopicId = $routeParams.subTopicId;
        
        var topicQueryId = $rootScope.discussCategoryNameIdMap[topicId];
        var subTopicQueryId = (subTopicId=== "all") ? "all" : $rootScope.discussCategoryNameIdMap[subTopicId];
        
        console.log(topicQueryId);

        if (discussType == '' || discussType == 'undefined' || !discussType || discussType == null) {
            discussType = 'All';
        }

        //code to prevent users from creating posts and questions when sub topic = all
        if ($location.path().endsWith('/all')) {
            $scope.showme = false;
        }

        $rootScope.bc_topic = topicId;
        $rootScope.bc_subTopic = subTopicId;
        $rootScope.bc_discussType = discussType === '' ? 'A' : discussType;

        //query to get the numbers
        //???????$scope.discuss_counts = DiscussOneTopicOneSubTopicListCount.query({discussType: "All", topicId: topicId, subTopicId:subTopicId});
        
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

            /*
             if(localStorage.getItem('sessionId') == '' || localStorage.getItem('sessionId') == null)
             {
             $location.path('/users/login');
             }
             */

            //Create the new discuss user like
            $scope.discuss[index] = DiscussUserLikes.get({userId: userId, discussId: discussId});
        }

        $scope.add = function (type) {
            $scope.error = "";
            $scope.discussionViews.contentPanel = "views/home/home" + type + "EditorPanel.html";
            window.scrollTo(0, 0);
        }

        $scope.register = function (discussType) {
            $scope.discuss = new Discuss();
            $scope.discuss.discussType = discussType;
            $scope.discuss.text = tinyMCE.activeEditor.getContent();
            $scope.discuss.title = $scope.editor.subject;
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

    }]);

