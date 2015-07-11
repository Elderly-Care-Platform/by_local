var reloadDone = false;
var apiPrefix = "";

var byServices = angular.module("byServices", ["ngResource"]);
var byControllers = angular.module("byControllers", []);


var byApp = angular.module('byApp', [
 	"byControllers",
 	"byServices",
 	"ngRoute",
 	'ngSanitize',
 	'ngAutocomplete',
 	'infinite-scroll'
 ]);



//Routing and Session Check for Login
byApp.run(function($rootScope, $location, SessionIdService, discussCategoryList,$http) {
	if(window.localStorage){
		$http.defaults.headers.common.sess = localStorage.getItem("SessionId");
	}

    // register listener to watch route changes
    $rootScope.$on("$routeChangeStart", function(event, next, current) {
    	
    	window.scrollTo(0, 0);
        BY.removeEditor();
        BY.editorCategoryList.resetCategoryList();
		//For any location other than search, wipe out the search term
		if($location.path().indexOf('/search/') == -1)
        	$rootScope.term = '';


       	var session = SessionIdService.getSessionId();
       	if (session == '' || session == null) {
//       		console.log(next.templateUrl);
       		$rootScope.bc_discussType = $rootScope.bc_discussType? $rootScope.bc_discussType : 'All';
            // no logged user, we should be going to #login
            //Code to allow non-logged in users to visit read only pages
            if (next.templateUrl == "app/components/login/login.html" || next.templateUrl == 'app/components/aboutUs/aboutUs.html' ||
            		next.templateUrl == 'app/components/home/home.html' || next.templateUrl == 'app/components/users/create.html' ||
            		next.templateUrl == 'app/components/search/search.html' || next.templateUrl == 'app/components/discuss/discussion.html' ||
            		next.templateUrl == 'app/components/discussDetail/discussDetail.html' ||
            		next.templateUrl == 'app/shared/footer/privacyPolicy.html' || next.templateUrl == 'app/shared/footer/termsConditions.html' ||
            		next.templateUrl == 'app/shared/footer/contactUs.html') {
            // already going to #login, no redirect needed
            	
            } else {
                // not going to #login, we should redirect now
            	
            	$location.path("/users/login");
            }
        }else{
        	$rootScope.bc_discussType = $rootScope.bc_discussType? $rootScope.bc_discussType : 'All';
        }
    });

    discussCategoryList.query().$promise.then(
    	    function(categories){
    	    	$rootScope.discussCategoryList = categories;
    	    	$rootScope.discussCategoryListMap = {};
    	    	$rootScope.discussCategoryNameIdMap = {};
    	        angular.forEach(categories, function(category, index){
    	        	$rootScope.discussCategoryListMap[category.id] = category;
    	        	$rootScope.discussCategoryNameIdMap[category.name.toLowerCase()] = category.id;
    	        	angular.forEach(category.children, function(subCategory, index){
	    				$rootScope.discussCategoryListMap[subCategory.id] = subCategory;
	    				$rootScope.discussCategoryNameIdMap[subCategory.name.toLowerCase()] = subCategory.id;
	    			});
    	        });
    	    }
    	);
    
});


byControllers.controller('UserCreateController', ['$scope', '$routeParams', '$location', 'User',
  function($scope, $routeParams, $location, User) {
	  	$scope.message = ""
	  	$scope.error = "";

     	if(localStorage.getItem("SessionId") && localStorage.getItem("USER_ID") && localStorage.getItem("USER_ID") != '' && localStorage.getItem("SessionId") != '' )
	 	{
			$scope.loggedIn = true;
			document.getElementById('email').disabled = true;
	 		$scope.user = User.get({userId: localStorage.getItem("USER_ID")});
	 		$scope.edituser = function () {
	 			$scope.user.$save(function (user, headers) {
	 				$scope.message = "User updated successfully";
					$scope.error = '';
	 				$location.path('/users/new');
	 			}, function (error) {
					// failure
					console.log(error);
					$scope.error = error.data.error.errorMsg;
					$scope.message = '';

				});
	 		};
	 	}
	 	else
	 	{
			$scope.loggedIn = false;
	 		$scope.user = new User();

			$scope.register = function () {

				$scope.user.$save(function (user, headers)
				{


					$scope.message = "User registered successfully";
					$scope.error = '';
					$location.path('/users/new');
				}, function (error) {
                    	// failure
                    	console.log("$save failed " + JSON.stringify(error));
                    	$scope.error = error.data.error.errorMsg;
                    	$scope.message = '';

                });

			};

		}
  }]);

//
//
////register_2.html
//byControllers.controller('UserCreate2Controller', ['$scope', '$routeParams', '$location', 'UserProfile',
//  function($scope, $routeParams, $location, UserProfile) {
//	  	$scope.message = ""
//	  	$scope.error = "";
//     	var userId = localStorage.getItem('USER_ID');
//
//
//     	if(userId != null && userId != 'undefined' && userId != '')
//	 	{
//	 		$scope.userProfile = UserProfile.get({userId: localStorage.getItem('USER_ID')});
//
//
//	 		if($scope.userProfile != '' && $scope.userProfile != 'undefined' && $scope.userProfile != null && $scope.userProfile.userId != 'undefined' && $scope.userProfile.userId != '')
//	 		{
//
//				$scope.editprofile = function () {
//					$scope.userProfile.$save(function (userProfile, headers) {
//						$scope.message = 'Successfully edited user profile';
//						$scope.error = '';
//						$location.path('/userprofile');
//					}, function (error) {
//							// failure
//							$scope.error = 'Error in editing user profile';
//							$scope.message = '';
//
//					});
//				};
//			}
//			else
//			{
//				$scope.userProfile = new UserProfile();
//
//				$scope.createprofile = function () {
//					$scope.userProfile.userId = localStorage.getItem('USER_ID');
//					$scope.userProfile.$save(function (userProfile, headers)
//					{
//						$scope.message = "User profile inserted successfully";
//						$scope.error = '';
//						$location.path('/userprofile');
//					}, function (error) {
//							// failure
//							$scope.error = 'Error in saving user profile';
//							$scope.message = '';
//
//					});
//
//				};
//			}
//	 	}
//	 	else
//	 	{
//
//
//		}
//  }]);
//


//
////dependents.html - clicking on one dependent for editing
////User Listing
//byControllers.controller('DependentShowEditController', ['$scope', '$rootScope', '$routeParams', '$location', 'ShowDependent', 'UserDependent',
//	function($scope, $rootScope, $routeParams, $location, ShowDependent, UserDependent) {
//	   var dependentId = $location.path().substring($location.path().lastIndexOf("/")+1);
//	   var userId = $rootScope.bc_userId;
//	   $scope.userDependent = ShowDependent.get({userId:$rootScope.bc_userId, id:dependentId});
//
//	   //languages
//	   //?????var langs = $scope.userDependent.speaksLang;
//	   $scope.managedependent = function () {
//
//
//			$scope.userDependent.userId = localStorage.getItem('USER_ID');
//
//			if($scope.userDependent.userId == '' || $scope.userDependent.userId == null)
//			{
//				$location.path('/users/login');
//				return;
//			}
//
//
//			$scope.userDependent.$save(function (userDependent, headers)
//			{
//				$scope.message = "Dependent edited successfully";
//				$scope.error = '';
//
//				$location.path('/dependent/list/'+ localStorage.getItem('USER_ID'));
//			}, function (error) {
//					// failure
//					$scope.error = 'Error in editing dependent information';
//					$scope.message = '';
//
//			});
//
//		};
//
//
//}]);
//
//
//
////dependents.html - showing the list of dependents for thsi user
////User Listing
//byControllers.controller('DependentListController', ['$scope', '$rootScope', '$location', 'DependentList',
//	function($scope, $rootScope, $location, DependentList) {
//		$scope.dependents = DependentList.query({userId:$rootScope.bc_userId});//query nnot working!
//		if(!$scope.dependents)
//		{
//			$location.path('/dependent');
//		}
//}]);
//
//
////register_3.html
//byControllers.controller('UserCreate3Controller', ['$scope', '$rootScope', '$routeParams', '$location', 'UserDependent',
//  function($scope, $rootScope, $routeParams, $location, UserDependent) {
//	  	$scope.message = ""
//	  	$scope.error = "";
//     	var userId = localStorage.getItem('USER_ID');
//
//
//		$scope.userDependent = new UserDependent();
//		$scope.managedependent = function () {
//
//
//			$scope.userDependent.userId = localStorage.getItem('USER_ID');
//
//			if($scope.userDependent.userId == '' || $scope.userDependent.userId == null)
//			{
//				$location.path('/users/login');
//				return;
//			}
//
//
//			$scope.userDependent.$save(function (userDependent, headers)
//			{
//				$scope.message = "New Dependent added successfully";
//				$scope.error = '';
//				$location.path('/dependent/list/'+ localStorage.getItem('USER_ID'));
//			}, function (error) {
//					// failure
//					$scope.error = 'Error in saving dependent information';
//					$scope.message = '';
//
//			});
//
//		};
//
//
//		//On clicking add new deendent in dependent list page
//		$scope.newdependentform = function () {
//			$location.path('/dependent');
//		}
//  }]);
//
//
//


// Logout Controller
byControllers.controller('LogoutController', ['$scope', '$location', '$rootScope' ,'$http',
function ($scope,$location, $rootScope, $http) {

	if($rootScope.sessionId != '') {
			   $location.path("/users/login");
	}
	$http.get(apiPrefix + "api/v1/users/logout");
	$rootScope.sessionId = undefined;
	$rootScope.bc_discussType = '';
	$rootScope.bc_username = '';
	$rootScope.bc_userId = '';

	localStorage.setItem("SessionId", "");
	localStorage.setItem("USER_ID", "");
	localStorage.setItem("USER_NAME", "");
	$http.defaults.headers.common.sess = "";

	localStorage.removeItem(0);
	localStorage.removeItem(1);
	localStorage.removeItem(2);

	var element = document.getElementById("login_placeholder");
	element.innerHTML = "";
	element.href = "";
	document.getElementById("login_placeHolder_li").style.opacity = "0";

	var pro = document.getElementById('profile_placeholder');
	pro.innerHTML = "JOIN US";
	pro.href = apiPrefix+"#/users/login";


	$location.path("/users/login");
	}

]);

byControllers.controller('DiscussCreateController', ['$scope', '$route', '$routeParams', '$location', 'Discuss', 'DiscussPage','$sce',
 function($scope, $route, $routeParams, $location, Discuss, DiscussPage, $sce) {
    	$scope.discuss = new Discuss();
	var segment = $location.path().substring(1);
	segment = segment.substring(segment.indexOf("/")+1);
	segment = segment.substring(segment.indexOf("/")+1);
	$scope.discuss.topicId = segment.substring(0,segment.indexOf("/"));
	$scope.discuss.subTopicId = $location.path().substring($location.path().lastIndexOf("/")+1);


	$scope.register = function (discussType) {

		/*
		if(localStorage.getItem('sessionId') == '' || localStorage.getItem('sessionId') == null)
		{
			$location.path('/users/login');
		}
		*/
		//alert();
		$scope.discuss.articlePhotoFilename = document.getElementById('articlePhotoFilename').value;
		var element_id = discussType;
		var topicId = $scope.discuss.topicId;
		var subTopicId = $scope.discuss.subTopicId;
		var htmlval = tinyMCE.activeEditor.getContent();
		$scope.discuss.discussType = discussType;
		$scope.discuss.text=htmlval;

		//putting the userId to discuss being created
		$scope.discuss.userId = localStorage.getItem("USER_ID");
		$scope.discuss.username = localStorage.getItem("USER_NAME");


		//save the discuss
//		$scope.discuss.$save(function (discuss, headers) {
//
//			var location = $scope.discuss.discussType;
//			var mode = discussType;
//
////			DiscussOneTopicOneSubTopicList.query({discussType: discussType, topicId: topicId, subTopicId:subTopicId}).$promise.then(
////		             //success
////		             function( value ){
////		            	 $scope.discuss = value.data;
////		             	},
////		             //error
////		             function( error ){
////		             		console.log("QUErY ERROR");
////		             		alert("error2");
////		             		}
////		           );
//			
//			var params = {p:0,s:50};
//	        if(discussType !=null && discussType != "" && discussType.toLowerCase() != "all"){
//	        	params.discussType = discussType;
//	        }
//	        if(topicId !=null && topicId != "" && topicId.toLowerCase() != "all"){
//	        	params.topicId = topicQueryId;
//	        }
//	        if(subTopicId !=null && subTopicId != "" && subTopicId.toLowerCase() != "all"){
//	        	params.subTopicId = subTopicQueryId;
//	        }
//	        $("#preloader").show();
//	        DiscussPage.get(params,
//	        		function(value){
//	        				$scope.discuss = value.data.content;
//				       	 $scope.pageInfo = BY.byUtil.getPageInfo(value.data);
//				       	$scope.pageInfo.isQueryInProgress = false;
//				       	$("#preloader").hide();
//	        		},
//	        		function(error){
//				       	console.log("DiscussPage");
//				       	alert("error");
//	        		});
//			
//			document.getElementById(element_id).style.display = 'none';
//
//			$route.reload();
//			//??????$location.path('/discuss/' + element_id + '/' + topicId + '/' + subTopicId);
//
//		},
//		function (error) {
//			console.log("Discuss");
//			alert("error");
//		});

	};
	
	$scope.trustForcefully = function(html) {
		return $sce.trustAsHtml(html);
	};


 }]);


//DISCUSS

byControllers.controller('DiscussSearchController', ['$scope', '$rootScope', '$route', '$routeParams', 'DiscussSearchForDiscussType', 'DiscussSearch',
  function($scope, $rootScope, $route, $routeParams, DiscussSearchForDiscussType, DiscussSearch) {
     $rootScope.term = $routeParams.term;

	 //If this is enabled, then we need to somehow inject topic and subtopic information into the Discuss being created by users
	 //For now Discuss cannot be created from the search page.
     $scope.showme = false;

     var disType = $routeParams.disType;

     $scope.discuss = "";

     if(disType == 'All')
     {

     	DiscussSearch.query({term: $rootScope.term},function(value){
     		$scope.discuss = value;
     		setTimeout(
     				function(){
     						$(".article-content").each(function(a,b){
     							var myRegExp = new RegExp($rootScope.term,'i');
     						$(b).html($(b).html().replace(myRegExp,"<span class='highlighted-text' >"+$rootScope.term+"</span>"));
     						}
     				)},500);
     	});

     	$scope.a = DiscussSearchForDiscussType.query({term: $rootScope.term, discussType: 'A' });
		$scope.p = DiscussSearchForDiscussType.query({term: $rootScope.term, discussType: 'P' });
	 	$scope.q = DiscussSearchForDiscussType.query({term: $rootScope.term, discussType: 'Q' });
	 }
	 else if(disType == 'Q')
	 {
	 	//queries to get the numbers
	 	$scope.discuss = DiscussSearchForDiscussType.query({term: $rootScope.term, discussType: 'Q' });

	 	$scope.q = $scope.discuss;

	 	$scope.p = DiscussSearchForDiscussType.query({term: $rootScope.term, discussType: 'P' });
	 	$scope.a = DiscussSearchForDiscussType.query({term: $rootScope.term, discussType: 'A' });
	 }
	 else if(disType == 'P')
	 {
		$scope.discuss = DiscussSearchForDiscussType.query({term: $rootScope.term, discussType: 'P' });

		$scope.p = $scope.discuss;
		$scope.q = DiscussSearchForDiscussType.query({term: $rootScope.term, discussType: 'Q' });
		$scope.a = DiscussSearchForDiscussType.query({term: $rootScope.term, discussType: 'A' });

	 }
	 else if(disType == 'A')
	 {
		 $scope.discuss = DiscussSearchForDiscussType.query({term: $rootScope.term, discussType: 'A' });

		 $scope.a = $scope.discuss;
		 $scope.p = DiscussSearchForDiscussType.query({term: $rootScope.term, discussType: 'P' });
	 	 $scope.q = DiscussSearchForDiscussType.query({term: $rootScope.term, discussType: 'Q' });
	 }
	 else
	 {
		 $scope.discuss = DiscussSearch.query({term: $rootScope.term});

		 $scope.a = DiscussSearchForDiscussType.query({term: $rootScope.term, discussType: 'A' });
		 $scope.p = DiscussSearchForDiscussType.query({term: $rootScope.term, discussType: 'P' });
	 	 $scope.q = DiscussSearchForDiscussType.query({term: $rootScope.term, discussType: 'Q' });
	 }

	 $scope.term = $rootScope.term;


	 $rootScope.bc_topic = 'list';
	 $rootScope.bc_subTopic = 'all';
	 $rootScope.bc_discussType = disType;

	  //User Discuss Like method
//	 	 $scope.UserLike = function(userId, discussId, index) {
//			//only read-only allowed without login
//	 		 
//			if(localStorage.getItem('SessionId') == '' || localStorage.getItem('SessionId') == undefined)
//			{
//				$rootScope.nextLocation = $location.path();
//				$location.path('/users/login');
//			}
//			else
//			{
//	 			//Create the new discuss user like
//	 			DiscussUserLikes.get({userId:userId, discussId: discussId}).$promise.then(
//	 		             //success
//	 		             function( value ){
//	 		            	 $scope.discuss = value.data;
//	 		             	},
//	 		             //error
//	 		             function( error ){
//	 		             		console.log("QUErY ERROR");
//	 		             		alert("error2");
//	 		             		}
//	 		           );
//			}
//
//		}
  }]);






//byControllers.controller('UserDiscussListController', ['$scope', '$rootScope', '$routeParams', 'UserDiscussList',
//  function($scope,$rootScope, $routeParams, UserDiscussList) {
//	  var userId = $rootScope.bc_userId;
//	  var userName = $rootScope.bc_username;
//	  var discussType = $rootScope.bc_discussType;
//	  var topicId = $rootScope.bc_topic;
//	  var subTopicId = $rootScope.bc_subTopic;
//
//	  if(discussType == '' || discussType == 'undefined' || !discussType || discussType == null)
//	  {
//	  	discussType = 'All';
//	  }
//
//     UserDiscussList.query({discussType:discussType, topicId:topicId, subTopicId:subTopicId, userId:userId}).$promise.then(
//             //success
//             function( value ){
//            	 $scope.discuss2 = value.data;
//             	},
//             //error
//             function( error ){
//             		console.log("QUErY ERROR");
//             		alert("error2");
//             		}
//           );
//  }]);






/****************  LOAD JS Controller = required for pages that require the custom.js functionality ********************/
/***************** Can be later refactored to a separate app.js file ***************************************************/

byControllers.controller('LoadCustomJSController', ['$scope',
        function($scope) {}]);



/***************** END LOAD JS CONTROLLER ******************************************************************************/



