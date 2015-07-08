//DIscuss All
byControllers.controller('FindAllController', ['$scope', '$rootScope', '$location','$route', '$routeParams',
                                                                       'DiscussAllForDiscussType', 'DiscussOneTopicOneSubTopicListCount','$sce','$timeout',
                                                                       function ($scope, $rootScope, $location ,$route, $routeParams, DiscussAllForDiscussType,
                                                                                 DiscussOneTopicOneSubTopicListCount,$sce, $timeout) {
   	var a = $(".header .navbar-nav > li.dropdown");a.removeClass("dropdown"); setTimeout(function(){a.addClass("dropdown")},200);
   		$scope.preSelected = {};
           $scope.article_story = "";
   		$scope.showme = true;
//       DiscussList.query(function( value ){
//      				       	 $scope.discuss = value.data;
//      			     	},
//      				     //error
//      				     function( error ){
//      				     		console.log("QUErY ERROR");
//      				     		alert("error2");
//      			     	});
           $scope.discussionViews = {};
        $scope.discussionViews.leftPanel = "app/components/find/findLeftPanel.html?versionTimeStamp=%PROJECT_VERSION%";
        $scope.discussionViews.contentPanel = "app/components/find/findContentPanel.html?versionTimeStamp=%PROJECT_VERSION%";


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
        DiscussAllForDiscussType.query({discussType: "A"},function(value){
        	 $scope.discuss = value.data;
        	$("#preloader").hide();
        },
        function(error){
        	console.log("DiscussAllForDiscussType");
        	alert("error");
        });

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
                $location.path('/find/institution/detail');
            }

        }


 	}]);
