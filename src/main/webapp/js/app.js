var reloadDone = false;
var apiPrefix = "";

var byServices = angular.module("byServices", ["ngResource"]);
var byControllers = angular.module("byControllers", []);






var discuss = byServices.factory('SessionIdService', function($rootScope) {
    var sessionID = '';
    return {
        getSessionId: function() {
            if(sessionID=='' || sessionID==null)
            {
				if ("localStorage" in window)
				{
               		sessionID = localStorage.getItem("SessionId");
               		$rootScope.bc_userId = localStorage.getItem("USER_ID");
				}
				else
				{
					alert("No local storage");
				}
			}

            console.log("Get sessionId => " + sessionID);

            return sessionID;
        },

        setSessionId: function(sessId) {
            console.log("Set sessionId=" + sessId);
            localStorage.setItem("SessionId", sessId);
            sessionID = sessId;
            return;
        }
    }
});




//User
var user = byServices.factory('User', function($resource) {
	return $resource(apiPrefix+'api/v1/users/:userId',{}, {
		remove:{method: 'DELETE', params: {userId: '@id'}},
		update:{method: 'PUT', params: {userId: '@id'}},
		get: {method: 'GET', params: {userId: '@id'}}
	})
});

//UserProfile
var userProfile = byServices.factory('UserProfile', function($resource) {
	return $resource(apiPrefix+'api/v1/userprofile/:userId',{}, {
		remove:{method: 'DELETE', params: {userId: '@userId'}},
		update:{method: 'PUT', params: {userId: '@userId'}},
		get: {method: 'GET', params: {userId: '@userId'}}
	})
});


/*//List depedents of an user
var depList= byServices.factory('DependentList', function($resource) {
	return $resource(apiPrefix+'api/v1/dependent/list/:userId',{}, {
		//get: {method: 'GET', params: {userId: '@userId'}},
		query: { method: "GET", isArray: false }

	})
});
*/

var depList = byServices.factory('DependentList', function($resource) {
	return $resource(apiPrefix+'api/v1/dependent/list/:userId',{}, {
		//remove:{method: 'DELETE', params: {userId: '@userId'}},
		//update:{method: 'PUT', params: {userId: '@userId'}},
		//query: { method: "GET", isArray: true },
		get: {method: 'GET', params: {userId: '@userId'}}
	})
});


//Show dependent details for edit
var userDependent = byServices.factory('ShowDependent', function($resource) {
	return $resource(apiPrefix+'api/v1/dependent/:userId/:id',{}, {
		show: {method: 'GET', params: {userId: '@userId', id: '@id'}},
		get: {method: 'GET', params: {userId: '@userId', id: '@id'}},
		update:{method: 'PUT', params: {userId: '@userId', id: '@id'}},
		query: { method: "GET", isArray: true }
	})
});


//UserProfile - step 3
var userProfile3 = byServices.factory('UserDependent', function($resource) {
	return $resource(apiPrefix+'api/v1/dependent/:userId',{}, {
		remove:{method: 'DELETE', params: {userId: '@userId'}},
		update:{method: 'PUT', params: {userId: '@userId'}},
		get: {method: 'GET', params: {userId: '@userId'}}
	})
});






var userShow = byServices.factory('UserShow', function($resource) {
	return $resource(apiPrefix+'api/v1/users/show/:userId',{}, {
		show: {method: 'GET', params: {userId: '@id'}},
		get: {method: 'GET', params: {userId: '@id'}}
	})
});

var userEdit = byServices.factory('UserEdit', function($resource) {
	return $resource(apiPrefix+'api/v1/users/edit/:userId',{}, {
		get: {method: 'GET', params: {userId: '@id'}}
	})
});

var userByFilter = byServices.factory('UserList', function($resource) {
	return $resource(apiPrefix+'api/v1/users/list/all',{}, {

	})
});


//Discuss -
var discuss = byServices.factory('Discuss', function($resource) {
	return $resource(apiPrefix+'api/v1/discuss/:discussId',{}, {
		remove:{method: 'DELETE', params: {discussId: '@id'}},
		update:{method: 'PUT', params: {discussId: '@id'}},
		get: {method: 'GET', params: {discussId: '@id'}}
	})
});



var discussUserLikes = byServices.factory('DiscussUserLikes', function($resource) {
	return $resource(apiPrefix+'api/v1/discusslikes/create/:userId/:discussId',{}, {
		remove:{method: 'DELETE', params: {userId: '@userId', discussId: '@discussId'}},
		update:{method: 'PUT', params: {userId: '@userId', discussId: '@discussId'}},
		get: {method: 'GET', params: {userId: '@userId', discussId: '@discussId'}}
	})
});


var commentUserLikes = byServices.factory('AnswerCommentUserLikes', function($resource) {
	return $resource(apiPrefix+'api/v1/commentlikes/create/:userId/:commentId',{}, {
		remove:{method: 'DELETE', params: {userId: '@userId', commentId: '@commentId'}},
		update:{method: 'PUT', params: {userId: '@userId', commentId: '@commentId'}},
		get: {method: 'GET', params: {userId: '@userId', commentId: '@commentId'}}
	})
});



var discussComment = byServices.factory('DiscussComment', function($resource) {
	return $resource(apiPrefix+'api/v1/comment/:commentId',{}, {
		remove:{method: 'DELETE', params: {commentId: '@id'}},
		update:{method: 'PUT', params: {commentId: '@id'}},
		get: {method: 'GET', isArray : true, params: {commentId: '@id'}}
	})
});



var discuss = byServices.factory('DiscussCreate', function($resource) {
	return $resource(apiPrefix+'api/v1/discuss',{}, {
	})
});


var discussByFilterPost = byServices.factory('PostDiscuss', function($resource) {
	return $resource(apiPrefix+'api/v1/discuss/list/P/:bc_topic/:bc_subTopic',{}, {
		get: {method: 'GET', params: {bc_topic: '@bc_topic'}}
	})
});


var discussByFilterQuestion = byServices.factory('QuestionDiscuss', function($resource) {
	return $resource(apiPrefix+'api/v1/discuss/list/Q/:bc_topic/:bc_subTopic',{}, {
	})
});

var discussByFilterArticle = byServices.factory('ArticleDiscuss', function($resource) {
	return $resource(apiPrefix+'api/v1/discuss/list/A/:bc_topic/:bc_subTopic',{}, {
	})
});


var discussByFilter = byServices.factory('DiscussList', function($resource) {
	return $resource(apiPrefix+'api/v1/discuss/list/all',{}, {

	})
});

var discussByUserFilter = byServices.factory('UserDiscussList', function($resource) {

	///start here
	return $resource(apiPrefix+'api/v1/discuss/list/:discussType/:topicId/:subTopicId/:userId',{}, {
		get: {method: 'GET', params: {discussType: '@discussType', topicId: '@topicId', subTopicId: '@subTopicId', userId: '@userId'}}

	})
});

var discussSearch = byServices.factory('DiscussSearch', function($resource) {

	///start here
	return $resource(apiPrefix+'api/v1/search/:term',{}, {
		//get: {method: 'GET', params: {discussType: '@discussType', topicId: '@topicId', subTopicId: '@subTopicId', userId: '@userId'}}

	})
});


var allDiscussByTypeFilter = byServices.factory('DiscussAllForDiscussType', function($resource) {
	return $resource(apiPrefix+'api/v1/discuss/list/all/:discussType',{}, {
		get: {method: 'GET', params: {discussType: '@discussType'}}
	})
});


var searchByDiscussType = byServices.factory('DiscussSearchForDiscussType', function($resource) {
	return $resource(apiPrefix+'api/v1/search/:term/:discussType',{}, {
		get: {method: 'GET', params: {term: '@term', discussType: '@discussType'}}
	})
});


var discussByOTASTFilter = byServices.factory('DiscussOneTopicAllSubTopicList', function($resource) {
	return $resource(apiPrefix+'api/v1/discuss/list/:topicId/all',{}, {
		get: {method: 'GET', params: {topicId: '@topicId'}}
	})
});

var discussByOTOSTFilter = byServices.factory('DiscussOneTopicOneSubTopicList', function($resource) {
	return $resource(apiPrefix+'api/v1/discuss/list/:discussType/:topicId/:subTopicId',{}, {
		//get: {method: 'GET', params: {discussType: '@discussType', topicId: '@topicId', subTopicId: '@subTopicId'}}
	})
});


var discussByOTOSTFilterCount = byServices.factory('DiscussOneTopicOneSubTopicListCount', function($resource) {
	return $resource(apiPrefix+'api/v1/discuss/count/:discussType/:topicId/:subTopicId',{}, {
		//get: {method: 'GET', params: {discussType: '@discussType', topicId: '@topicId', subTopicId: '@subTopicId'}}
	})
});


var discussShow = byServices.factory('DiscussShow', function($resource) {
	return $resource(apiPrefix+'api/v1/discuss/:discussId',{}, {
		show: {method: 'GET', params: {discussId: '@id'}},
		get: {method: 'GET', params: {discussId: '@id'}}
	})
});


var homeFeaturedContent = byServices.factory('HomeFeaturedContent', function ($resource) {
    return $resource('api/v1/discuss/list/all/:discussType?featured=true&count=3', {}, {
        get: {method: 'GET', params: {discussType: '@discussType'}}
    })
});

var byApp = angular.module('byApp', [
 	"byControllers",
 	"byServices",
 	"app.directives"
 ]);



byApp.directive('bindHtmlUnsafe', function( $compile ) {
    return function( $scope, $element, $attrs ) {

        var compile = function( newHTML ) { // Create re-useable compile function
            newHTML = $compile(newHTML)($scope); // Compile html
            $element.html('').append(newHTML); // Clear and append it
        };

        var htmlName = $attrs.bindHtmlUnsafe; // Get the name of the variable
                                              // Where the HTML is stored

        $scope.$watch(htmlName, function( newHTML ) { // Watch for changes to
                                                      // the HTML
            if(!newHTML) return;
            compile(newHTML);   // Compile it
        });

    };
});


byApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider
    .when('/users/home', {templateUrl: 'views/home/home.html', controller: 'BYHomeController'})
    .when('/users/new', {templateUrl: 'views/users/create.html', controller: 'UserCreateController'})

    .when('/userprofile', {templateUrl: 'views/users/create2.html', controller: 'UserCreate2Controller'})
    .when('/dependent', {templateUrl: 'views/users/create3.html', controller: 'UserCreate3Controller'})
    .when('/dependent/list/:userId', {templateUrl: 'views/users/dependents.html', controller: 'DependentListController'})
    .when('/dependent/:userId/:id', {templateUrl: 'views/users/create3.html', controller: 'DependentShowEditController'})

    .when('/users/showedit/:userId', {templateUrl: 'views/users/edit.html', controller: 'UserEditController'})
    .when('/users/showedit/:userId', {templateUrl: 'views/users/edit.html', controller: 'UserCreateController'})
    .when('/users/delete/:userId', {templateUrl: 'views/users/list.html', controller: 'UserDeleteController'})
    .when('/users/login', {templateUrl: 'views/users/login.html', controller: 'LoginController'})
    .when('/users/logout/:sessionId', {templateUrl: 'views/users/home.html', controller: 'LogoutController'})
    //.when('/users/logout', {templateUrl: 'views/users/list.html', controller: 'LogoutController'})
    .when('/discuss/:discussType/list/all', {templateUrl: 'views/discuss/discussion.html', controller: 'DiscussListController'})
    .when('/discuss/:topicId/all', {templateUrl: 'views/discuss/discussion.html', controller: 'DiscussOneTopicAllSubTopicListController'})
    .when('/discuss/:discussType/:topicId/:subTopicId', {templateUrl: 'views/discuss/discussion.html', controller: 'DiscussOneTopicOneSubTopicListController'})
    .when('/discuss/new/P', {templateUrl: 'views/discuss/create.html', controller: 'DiscussCreateController'})
	.when('/discuss/new/Q', {templateUrl: 'views/discuss/create.html', controller: 'DiscussCreateController'})
	.when('/discuss/new/A', {templateUrl: 'views/discuss/create.html', controller: 'DiscussCreateController'})
	.when('/discuss/showedit/:discussId', {templateUrl: 'views/discuss/edit.html', controller: 'DiscussCreateController'})
	.when('/discuss/edit/:discussId', {templateUrl: 'views/discuss/list.html', controller: 'DiscussCreateController'})
	.when('/discuss/delete/:discussId', {templateUrl: 'views/discuss/list.html', controller: 'DiscussDeleteController'})
	.when('/search/:term/:disType', {templateUrl: 'views/discuss/search.html', controller: 'DiscussSearchController'})
	.when('/comment/:discussId', {templateUrl: 'views/discuss/qa.html', controller: 'DiscussDetailController'})
    .when('/discuss/:discussId', {templateUrl: 'views/discuss/detail.html', controller: 'DiscussPreviewController'});
      //????????$routeProvider.otherwise({redirectTo: '/users/login'});
  }]);


//Routing and Session Check for Login
byApp.run(function($rootScope, $location, SessionIdService) {

    // register listener to watch route changes
    $rootScope.$on("$routeChangeStart", function(event, next, current) {

        console.log("Routechanged... ");

		//For any location other than search, wipe out the search term
		if($location.path().indexOf('/search/') == -1)
        	$rootScope.term = '';


       	var session = SessionIdService.getSessionId();
       	if (session == '' || session == null) {

            // no logged user, we should be going to #login
            if (next.templateUrl == "views/users/login.html" || next.templateUrl == 'views/users/create.html') {
            // already going to #login, no redirect needed
            } else {
                // not going to #login, we should redirect now
            	$location.path("/users/login");
            }
        }
    });
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
					console.log("$edit failed " + JSON.stringify(error));
					$scope.error = 'Failed to edit user details';
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
                    	$scope.error = 'Email already exists. ';
                    	$scope.message = '';

                });

			};

		}
  }]);



//register_2.html
byControllers.controller('UserCreate2Controller', ['$scope', '$routeParams', '$location', 'UserProfile',
  function($scope, $routeParams, $location, UserProfile) {
	  	$scope.message = ""
	  	$scope.error = "";
     	var userId = localStorage.getItem('USER_ID');


     	if(userId != null && userId != 'undefined' && userId != '')
	 	{
	 		$scope.userProfile = UserProfile.get({userId: localStorage.getItem('USER_ID')});


	 		if($scope.userProfile != '' && $scope.userProfile != 'undefined' && $scope.userProfile != null && $scope.userProfile.userId != 'undefined' && $scope.userProfile.userId != '')
	 		{

				$scope.editprofile = function () {
					$scope.userProfile.$save(function (userProfile, headers) {
						$scope.message = 'Successfully edited user profile';
						$scope.error = '';
						$location.path('/userprofile');
					}, function (error) {
							// failure
							$scope.error = 'Error in editing user profile';
							$scope.message = '';

					});
				};
			}
			else
			{
				$scope.userProfile = new UserProfile();

				$scope.createprofile = function () {
					$scope.userProfile.userId = localStorage.getItem('USER_ID');
					//alert($scope.userProfile.userId  );
					/*if($scope.userProfile.userId == '' || $scope.userProfile.userId == null)
					{
						$location.path('/users/login');
						return;
					}
					*/
					$scope.userProfile.$save(function (userProfile, headers)
					{
						$scope.message = "User profile inserted successfully";
						$scope.error = '';
						$location.path('/userprofile');
					}, function (error) {
							// failure
							//alert('new user profile save failed!');
							//console.log("$save failed " + JSON.stringify(error));
							$scope.error = 'Error in saving user profile';
							$scope.message = '';

					});

				};
			}
	 	}
	 	else
	 	{


		}
  }]);



	//detail.html
  byControllers.controller('DiscussPreviewController', ['$scope', '$rootScope', '$routeParams', '$location', 'DiscussShow', 'UserDiscussList','DiscussComment',
    function($scope, $rootScope, $routeParams, $location, DiscussShow, UserDiscussList , DiscussComment) {
       var discussId = $routeParams.discussId;

      $scope.discuss = DiscussShow.get({discussId: discussId});

  		//these are coming null - 2nd June 2015
       var discussType = $rootScope.bc_discussType;
       var topicId = $scope.discuss.topicId;
       var subTopicId = $scope.discuss.subTopicId;
       var userId = $scope.discuss.userId;

       //alert("discuss type = " + discussType + " :: topic id = " + topicId + " :: sub topic id = " + subTopicId + " :: user id = " + userId );

       $scope.discuss2 = UserDiscussList.get({discussType:discussType, topicId: topicId, subTopicId: subTopicId, userId: $scope.discuss.userId});
       $scope.comments  = DiscussComment.get({parentId:discussId,ancestorId:discussId});
       $scope.date = new Date();
  }]);



//dependents.html - clicking on one dependent for editing
//User Listing
byControllers.controller('DependentShowEditController', ['$scope', '$rootScope', '$routeParams', '$location', 'ShowDependent', 'UserDependent',
	function($scope, $rootScope, $routeParams, $location, ShowDependent, UserDependent) {
	   var dependentId = $location.path().substring($location.path().lastIndexOf("/")+1);
	   var userId = $rootScope.bc_userId;
	   $scope.userDependent = ShowDependent.get({userId:$rootScope.bc_userId, id:dependentId});

	   //languages
	   var langs = $scope.userDependent.speaksLang;
	   $scope.managedependent = function () {


			$scope.userDependent.userId = localStorage.getItem('USER_ID');

			if($scope.userDependent.userId == '' || $scope.userDependent.userId == null)
			{
				$location.path('/users/login');
				return;
			}

			//speaks language drop down
			var lang = $rootScope.lang_selection_names;
			var str1 = JSON.stringify(lang);
			$scope.userDependent.speaksLang = str1;


			//InterestedIn drop down
			var interested_in = $rootScope.interest_selection_names;
			var str2 = JSON.stringify(interested_in);
			$scope.userDependent.interestedIn = str2;


			//LikesDoing drop down
			/*var likes_doing_in = $rootScope.likes_doing_selection_names;
			var arr3 = JSON.stringify(likes_doing_in);
			$scope.userDependent.likesDoing = arr3;
			$rootScope.likes_doing_selection = '';
			$rootScope.likes_doing_selection_names = '';
			*/

			$scope.userDependent.$save(function (userDependent, headers)
			{
				$scope.message = "Dependent edited successfully";
				$scope.error = '';

				$location.path('/dependent/list/'+ localStorage.getItem('USER_ID'));
			}, function (error) {
					// failure
					$scope.error = 'Error in editing dependent information';
					$scope.message = '';

			});

		};


}]);



//dependents.html - showing the list of dependents for thsi user
//User Listing
byControllers.controller('DependentListController', ['$scope', '$rootScope', '$location', 'DependentList',
	function($scope, $rootScope, $location, DependentList) {
		$scope.dependents = DependentList.query({userId:$rootScope.bc_userId});//query nnot working!
		if(!$scope.dependents)
		{
			$location.path('/dependent');
		}
}]);


//register_3.html
byControllers.controller('UserCreate3Controller', ['$scope', '$rootScope', '$routeParams', '$location', 'UserDependent',
  function($scope, $rootScope, $routeParams, $location, UserDependent) {
	  	$scope.message = ""
	  	$scope.error = "";
     	var userId = localStorage.getItem('USER_ID');


		$scope.userDependent = new UserDependent();
		$scope.managedependent = function () {


			$scope.userDependent.userId = localStorage.getItem('USER_ID');

			if($scope.userDependent.userId == '' || $scope.userDependent.userId == null)
			{
				$location.path('/users/login');
				return;
			}

			//speaks language drop down
			var lang = $rootScope.lang_selection_names;
			var str1 = JSON.stringify(lang);
			$scope.userDependent.speaksLang = str1;


			//InterestedIn drop down
			var interested_in = $rootScope.interest_selection_names;
			var str2 = JSON.stringify(interested_in);
			$scope.userDependent.interestedIn = str2;


			//LikesDoing drop down
			/*var likes_doing_in = $rootScope.likes_doing_selection_names;
			var arr3 = JSON.stringify(likes_doing_in);
			$scope.userDependent.likesDoing = arr3;
			$rootScope.likes_doing_selection = '';
			$rootScope.likes_doing_selection_names = '';
			*/

			$scope.userDependent.$save(function (userDependent, headers)
			{
				$scope.message = "New Dependent added successfully";
				$scope.error = '';
				$location.path('/dependent/list/'+ localStorage.getItem('USER_ID'));
			}, function (error) {
					// failure
					$scope.error = 'Error in saving dependent information';
					$scope.message = '';

			});

		};


		//On clicking add new deendent in dependent list page
		$scope.newdependentform = function () {
			$location.path('/dependent');
		}
  }]);





//User Edit
byControllers.controller('UserEditController', ['$scope', '$routeParams', '$location', 'UserShow',
  function($scope, $routeParams, $location, UserShow) {
	var userId = $routeParams.userId;
    $scope.user = UserShow.get({userId: userId});
  }]);



//User Delete
byControllers.controller('UserDeleteController', ['$scope', '$routeParams', '$location', 'User',
  function($scope, $routeParams, $location, User) {
    var userId = $routeParams.userId;
	$scope.user = User.remove({userId: userId});
	$scope.users = User.query();
	$location.path('/users/all');
  }]);


//User Listing
byControllers.controller('UserListController', ['$scope', 'UserList',
	function($scope, UserList) {
	   $scope.users = UserList.query();
	}]);


// Logout Controller
byControllers.controller('LogoutController', ['$scope', '$location', '$rootScope' ,
function ($scope,$location, $rootScope) {

	if($rootScope.sessionId != '') {
			   $location.path("/users/login");
	}
	$rootScope.sessionId='';
	$rootScope.bc_discussType = '';
	$rootScope.bc_username = '';
	$rootScope.bc_userId = '';

	localStorage.setItem("SessionId", "");
	localStorage.setItem("USER_ID", "");
	localStorage.setItem("USER_NAME", "");

	localStorage.removeItem(0);
	localStorage.removeItem(1);
	localStorage.removeItem(2);


	//$localStorage.$reset();
	//???window.location.reload();

	var element = document.getElementById("login_placeholder");
	element.innerHTML = "Login";
	element.href = apiPrefix+"#/users/login";

	var pro = document.getElementById('profile_placeholder');
	pro.innerHTML = "Signup";
	pro.href = apiPrefix+"#/users/new";


	$location.path("/users/login");
	}

]);



byControllers.controller('LoginController', ['$scope', '$rootScope', '$http', '$location', '$rootScope',
   function ($scope, $rootScope, $http, $location, $rootScope) {
       $scope.user = {};
       $scope.user.email = '';
       $scope.user.password = '';
       $scope.loginUser = function(user) {
           $scope.resetError();
           $http.post(apiPrefix+'api/v1/users/login', user).success(function(login) {
			if(login.sessionId===null) {
			       $scope.setError(login.status);
   					return;
               }
               $scope.user.email = '';
               $scope.user.password = '';
   				$rootScope.sessionId=login.sessionId;
   				$rootScope.bc_discussType = 'A';
   				$rootScope.bc_username = login.userName;
   				$rootScope.bc_userId = login.id;


				if ("localStorage" in window)
				{
					localStorage.setItem("SessionId", login.sessionId);
					localStorage.setItem("USER_ID", login.id);
					localStorage.setItem("USER_NAME", login.userName);
					$location.path("/users/home");
					var element = document.getElementById("login_placeholder");
					element.innerHTML = "Logout";
					element.href = apiPrefix+"#/users/logout/"+login.sessionId;

					var pro = document.getElementById('profile_placeholder');
					pro.innerHTML = "Profile";
					pro.href = apiPrefix+"#/userprofile";

				}
				else
				{
					$scope.setError('Browser does not support cookies');
					$location.path("/users/login");
				}


           }).error(function() {
               $scope.error = 'Invalid user/password combination';
				$scope.message = '';
           });
       }

       $scope.resetError = function() {
           $scope.error = '';
           $scope.message = '';
       }

       $scope.setError = function(message) {
           $scope.error = message;
           $scope.message = '';
           $rootScope.SessionId='';
       }
   }]);



// Logout Controller
/*byControllers.controller('LogoutController', ['$scope', '$route', '$rootScope', '$http', '$location', '$rootScope',
   function ($scope, $route, $rootScope, $http, $location, $rootScope) {
	   if($rootScope.sessionId != '') {
		   $location.path("/users/login");
	   }
       $scope.logoutUser = function(sessionId) {
           $scope.resetError();
           $http.get(apiPrefix+'api/v1/users/logout/:sessionId', sessionId).success(function() {
			   $rootScope.sessionId='';
   				$rootScope.bc_discussType = '';
   				$rootScope.bc_username = '';
   				$rootScope.bc_userId = '';


   			//if ("localStorage" in window)
   			{
				alert("about to delete local storage");
				localStorage.setItem("SessionId", "");
				localStorage.setItem("USER_ID", "");
				localStorage.setItem("USER_NAME", "");

				localStorage.removeItem(0);
				localStorage.removeItem(1);
				localStorage.removeItem(2);
               	$location.path("/users/login");
   			}
   			//else
   			//{
			//	$scope.setError('Browser does not support cookies');
   			//	$location.path("/users/login");
   			//}


           }).error(function() {
               $scope.setError('could not logout');
           });
           $route.reload();
       }

       $scope.resetError = function() {
           $scope.error = false;
           $scope.errorMessage = '';
       }

       $scope.setError = function(message) {
           $scope.error = true;
           $scope.errorMessage = message;
           $rootScope.SessionId='';
       }
   }]);
*/



//home
byControllers.controller('BYHomeController', ['$scope', '$rootScope', '$routeParams', '$timeout', 'HomeFeaturedContent', 'Discuss',
    function ($scope, $rootScope, $routeParams, $timeout, HomeFeaturedContent, Discuss) {
		console.log($routeParams);
        $scope.editor = {};
        $scope.editor.subject = "";
        $scope.currentAcceleratorSelected = "home_featured_articles";
        $scope.$watch("articles", function (value) {
            $timeout(
                function () {
                    $scope.scrollToId($scope.currentAcceleratorSelected)
                }, 100);
        });

        $scope.homeViews = {};

        $scope.homeViews.leftPanel = "views/home/homeLeftPanel.html";

		if($routeParams.type === "aboutUs") {
			$scope.currentView = "aboutUs";
			$scope.homeViews.contentPanel = "views/home/aboutUs.html";
		} else	{
			$scope.homeViews.contentPanel = "views/home/homeContentPanel.html";
			$scope.articles = HomeFeaturedContent.query({discussType: 'A'});
			$scope.questions = HomeFeaturedContent.query({discussType: 'Q'});
			$scope.posts = HomeFeaturedContent.query({discussType: 'P'});

		}

		$scope.add = function (type) {
			$scope.currentView = "editor";
			$scope.homeViews.contentPanel = "views/home/home" + type + "EditorPanel.html";
			window.scrollTo(0, 0);
		}

        $scope.register = function (discussType) {
            $scope.discuss = new Discuss();
            $scope.discuss.discussType = discussType;
            $scope.discuss.text = tinyMCE.activeEditor.getContent();
            $scope.discuss.title = $scope.editor.subject;

            //putting the userId to discuss being created
            $scope.discuss.userId = localStorage.getItem("USER_ID");
			$scope.discuss.username = localStorage.getItem("USER_NAME");


            //save the discuss
            $scope.discuss.$save(function (discuss, headers) {
                $scope.editor.subject = "";
                $scope.switchToContentView();
            });

        };

        $scope.switchToContentView = function (scrollTo) {
            $scope.currentAcceleratorSelected = scrollTo || $scope.currentAcceleratorSelected;
            if ($scope.currentView != "content") {
                $scope.currentView = "content";
                $scope.homeViews.contentPanel = "views/home/homeContentPanel.html";
                $scope.articles = HomeFeaturedContent.query({discussType: 'A'});
                $scope.questions = HomeFeaturedContent.query({discussType: 'Q'});
                $scope.posts = HomeFeaturedContent.query({discussType: 'P'});
            } else {
				$scope.scrollToId(scrollTo);
			}
        }

        //$scope.switchToContentView();

        $scope.scrollToId = function (id) {
        	var tag = $("#" + id + ":visible");
            if(tag.length > 0){
         	   $('html,body').animate({scrollTop: tag.offset().top - $(".breadcrumbs").height() - $(".header").height()}, 'slow');
            }
        }

    }]);


//DISCUSS

byControllers.controller('DiscussSearchController', ['$scope', '$rootScope', '$routeParams', 'DiscussSearchForDiscussType', 'DiscussSearch',
  function($scope, $rootScope, $routeParams, DiscussSearchForDiscussType, DiscussSearch) {
     $rootScope.term = $routeParams.term;

	 //If this is enabled, then we need to somehow inject topic and subtopic information into the Discuss being created by users
	 //For now Discuss cannot be created from the search page.
     $scope.showme = false;

     var disType = $routeParams.disType;

     $scope.discuss = "";

     if(disType == 'All')
     {

     	$scope.discuss = DiscussSearch.query({term: $rootScope.term});

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

  }]);




byControllers.controller('DiscussListController', ['$scope', '$rootScope', '$routeParams', 'DiscussList', 'DiscussAllForDiscussType',
  function($scope, $rootScope, $routeParams, DiscussList, DiscussAllForDiscussType) {
     $scope.discuss = DiscussList.query();

     var discussType = $routeParams.discussType;

     if(discussType == '' || discussType == 'undefined' || !discussType || discussType == null)
     {
		 discussType = 'All';
	 }

	 //queries to get the numbers
	 $scope.discuss_questions = DiscussAllForDiscussType.query({discussType: "Q"});

	 $scope.discuss_posts = DiscussAllForDiscussType.query({discussType: "P"});

	 $scope.discuss_articles = DiscussAllForDiscussType.query({discussType: "A"});

	 $scope.discuss = DiscussAllForDiscussType.query({discussType: discussType});

	 $rootScope.bc_topic = 'list';
	 $rootScope.bc_subTopic = 'all';
	 $rootScope.bc_discussType = discussType;

  }]);


byControllers.controller('UserDiscussListController', ['$scope', '$rootScope', '$routeParams', 'UserDiscussList',
  function($scope,$rootScope, $routeParams, UserDiscussList) {
	  //???var userId = 'aditya';
	  var userId = $rootScope.bc_userId;
	  var userName = $rootScope.bc_username;
	  var discussType = $rootScope.bc_discussType;
	  var topicId = $rootScope.bc_topic;
	  var subTopicId = $rootScope.bc_subTopic;

	  if(discussType == '' || discussType == 'undefined' || !discussType || discussType == null)
	  {
	  	discussType = 'All';
	  }

     $scope.discuss2 = UserDiscussList.query({discussType:discussType, topicId:topicId, subTopicId:subTopicId, userId:userId});
  }]);


byControllers.controller('DiscussOneTopicAllSubTopicListController', ['$scope', '$rootScope', '$location', '$routeParams', 'DiscussOneTopicAllSubTopicList',
   function($scope, $rootScope, $location, $routeParams, DiscussOneTopicAllSubTopicList) {
		//alert("Discuss ALl = " + $location.path());
	  $scope.showme = false;

	  var topicId = $routeParams.topicId;
	  var discussType = $routeParams.discussType;

	  if(discussType == '' || discussType == 'undefined' || !discussType || discussType == null)
	  {
	  	discussType = 'All';
	  }

      $scope.discuss = DiscussOneTopicAllSubTopicList.query({topicId: topicId});
      $rootScope.bc_topic = topicId;
      $rootScope.bc_subTopic = null;

      $rootScope.bc_discussType = discussType;

      $location.path('/discuss/' + discussType + '/' + topicId + '/all');
   }]);



byControllers.controller('DiscussOneTopicOneSubTopicListController', ['$scope', '$route', '$rootScope', '$location', '$routeParams', 'DiscussOneTopicOneSubTopicList', 'DiscussOneTopicOneSubTopicListCount', 'DiscussUserLikes', 'Discuss',
  function($scope, $route, $rootScope, $location, $routeParams, DiscussOneTopicOneSubTopicList, DiscussOneTopicOneSubTopicListCount, DiscussUserLikes, Discuss) {

	  $scope.showme = true;

	 var discussType = $routeParams.discussType;
 	 var topicId = $routeParams.topicId;
	 var subTopicId = $routeParams.subTopicId;

	 if(discussType == '' || discussType == 'undefined' || !discussType || discussType == null)
	 {
	 	discussType = 'All';
	 }

	 //code to prevent users from creating posts and questions when sub topic = all
	 if($location.path().endsWith('/all'))
	 {
	 	$scope.showme = false;
	 }

	 $rootScope.bc_topic = topicId;
     $rootScope.bc_subTopic = subTopicId;
     $rootScope.bc_discussType = discussType === '' ? 'A' : discussType;

     //queries to get the numbers
     $scope.discuss_questions = DiscussOneTopicOneSubTopicList.query({discussType: "Q", topicId: topicId, subTopicId:subTopicId});

	 $scope.discuss_posts = DiscussOneTopicOneSubTopicList.query({discussType: "P", topicId: topicId, subTopicId:subTopicId});

     $scope.discuss_articles = DiscussOneTopicOneSubTopicList.query({discussType: "A", topicId: topicId, subTopicId:subTopicId});

	 $scope.discuss = DiscussOneTopicOneSubTopicList.query({discussType: discussType, topicId: topicId, subTopicId:subTopicId});



	 //User Discuss Like method
	 $scope.UserLike = function(userId, discussId) {

		//Create the new discuss user like
		$scope.discussuserlikes = DiscussUserLikes.get({userId:userId, discussId: discussId});

		$scope.discuss = Discuss.query({discussId:discussId});
		$route.reload();

		document.getElementById('like_count').innerHTML = $scope.discuss.aggrReplyCount;

	}



	//???$location.path('/discuss/' + discussType + '/' + topicId + '/' + subTopicId);



  }]);








   //load JS file
byControllers.controller('LoadCustomJSController', ['$scope',
	function($scope) {

		//$timeout(function() {

		$scope.load = function() {




			///tintmce

			tinymce.init({
							   selector: "#share-tip,#ask-question,#give-feedback,#main-commentbox",
							   theme: "modern",
							   skin: 'light',
							   statusbar : false,
							   menubar:false,
							   plugins: [
							   "image link",
							   "searchreplace visualblocks",
							   "insertdatetime media paste emoticons"
							   ],
							   toolbar: "bold italic | bullist numlist | link unlink emoticons image media",
							   setup : function(ed) {
								   var placeholder = $('#' + ed.id).attr('placeholder');
								   if (typeof placeholder !== 'undefined' && placeholder !== false) {
									 var is_default = false;
									 ed.on('init', function() {
									   // get the current content
									   var cont = ed.getContent();

									   // If its empty and we have a placeholder set the value
									   if (cont.length === 0) {
										 ed.setContent(placeholder);
										 // Get updated content
										 cont = placeholder;
									 }
									   // convert to plain text and compare strings
									   is_default = (cont == placeholder);

									   // nothing to do
									   if (!is_default) {
										 return;
									 }
								 }).on('keydown', function() {
										   // replace the default content on focus if the same as original placeholder
										   if (is_default) {
											 ed.setContent('');
											 is_default = false;
										 }
									 }).on('blur', function() {
									   if (ed.getContent().length === 0) {
										 ed.setContent(placeholder);
									 }
								 });
								 }
								 ed.on('init', function (evt) {
								   var toolbar = $(evt.target.editorContainer)
								   .find('>.mce-container-body >.mce-toolbar-grp');
								   var editor = $(evt.target.editorContainer)
								   .find('>.mce-container-body >.mce-edit-area');

									   // switch the order of the elements
									   toolbar.detach().insertAfter(editor);
								   });
								 ed.on("keyup", function() {
								   var id = ed.id;
								   if($.trim(ed.getContent({format: 'text'})).length){
									   $("#" + id).parents(".textarea-label").find(".btn").removeClass("disabled");
								   } else {
									   $("#" + id).parents(".textarea-label").find(".btn").addClass("disabled");
								   }
							   });
							 }
							   /*file_browser_callback: function(field_name, url, type, win) {
								   win.document.getElementById(field_name).value = myFileBrowser(field_name, url, type, win);
							   }*/
						   });
						   tinymce.init({
							   selector: "#submit-article",
							   theme: "modern",
							   skin: 'light',
							   statusbar : false,
							   menubar:false,
							   plugins: [
							   "advlist autolink autosave link image lists charmap print preview hr anchor pagebreak spellchecker",
							   "searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking",
							   "table contextmenu directionality emoticons template textcolor paste fullpage textcolor colorpicker textpattern"
							   ],
							   toolbar: "styleselect | bold italic | bullist numlist hr  | undo redo | link unlink emoticons image media | spellchecker  ",

							   setup : function(ed)
							   {
								   var placeholder = $('#' + ed.id).attr('placeholder');
								   if (typeof placeholder !== 'undefined' && placeholder !== false) {
									 var is_default = false;
									 ed.on('init', function() {
										   // get the current content
										   var cont = ed.getContent();

										   // If its empty and we have a placeholder set the value
										   if (cont.length === 0) {
											 ed.setContent(placeholder);
											 // Get updated content
											 cont = placeholder;
										 }
										   // convert to plain text and compare strings
										   is_default = (cont == placeholder);

										   // nothing to do
										   if (!is_default) {
											 return;
										 }
									 }).on('keydown', function() {
											   // replace the default content on focus if the same as original placeholder
											   if (is_default) {
												 ed.setContent('');
												 is_default = false;
											 }
										 }).on('blur', function() {
										   if (ed.getContent().length === 0) {
											 ed.setContent(placeholder);
										 }
									 });
									 }
									 ed.on('init', function (evt) {
									   var toolbar = $(evt.target.editorContainer)
									   .find('>.mce-container-body >.mce-toolbar-grp');
									   var editor = $(evt.target.editorContainer)
									   .find('>.mce-container-body >.mce-edit-area');

										   // switch the order of the elements
										   toolbar.detach().insertAfter(editor);
									   });
									 ed.on("keyup", function() {
									   var id = ed.id;
									   if($.trim(ed.getContent({format: 'text'})).length){
										   $("#" + id).parents(".textarea-label").find(".btn").removeClass("disabled");
									   } else {
										   $("#" + id).parents(".textarea-label").find(".btn").addClass("disabled");
									   }
								   });
							   }


							});

			//tinymce















/* Write here your custom javascript codes */
th = 0;
init_offset = 0;
init_bc_offset = 0;
left_flag = false;
tx = false;
aq_set = false;
st_set = false;
gf_set = false;
sm_set = false;
dp = 1;
/*function setHeight(){
	if($(window).width() < 991){
		return;
	}
	if($(".left-container").length){
		if($("body").scrollTop() + $(window).height() >= $(".footer-v1").offset().top){
			$(".left-container").height( $(".footer-v1").offset().top - $(".left-container").offset().top);
		} else{
			$(".left-container").height($(window).height() - init_offset);
		}
	}
}*/

$(window).load(function(){
				$(".preloader").fadeOut('500');
			});
function setHeight(){
	if($(window).width() < 986){
		var windowHeight = $(window).height();

			if($("body").scrollTop() > windowHeight){
				$(".topScroll").show();
			}else
			{
				$(".topScroll").hide();
			}
			$(".breadCrumbMargin").css("margin-top",'40px');
			$(".searchWrapper").appendTo('.searchClearboth');
			var w = $(".left-container").width();
			$(".left-container-img-wrapper").width(w);
			if($(".homePage").length){
				$(".left-container-img-wrapper").width(w - 0);
			}

			if($(".register-page").length){

				$(".signup-info").prependTo(".second-register-page ");
				$(".signup-info").prependTo(".first-register-page ");
			}


			if($(".third-register-page").length){

				$(".signup-info").prependTo(".third-register-page");

				var year=new Date().getFullYear();
				$( "#datepicker,#datepicker1" ).datepicker({
					showOn: "focus",
					changeYear: true,
					yearRange: '1900:year'

				});
			}
			if($(".discussion-page").length && !$(".profile-page").length) {
				$(".submit-article-textarea").css("top",$(".submit-article").offset().top + 35 + "px");
			}

		return;
	}
	if($(".left-container").length){
		var leftCHeight = $(window).height() - $(".header").height() - $(".headerBottom").height()  - 50 ;

		$(".left-container").height(leftCHeight);
	}
	var headerH =  $(".headerBottom").height() + $(".headerBottomImage").height();
			var bostSTF = $(window).scrollTop();

			if(bostSTF > headerH)
			{
				$(".left-container").css('padding-bottom', headerH +"px");
				$(".left-container").css('margin-top', - headerH +"px");

			}
			if(bostSTF < headerH){
				$(".left-container").css('padding-bottom', 0 +"px");
				$(".left-container").css('margin-top', - 0 +"px");
			}

	$(window).scroll(function(){

			var headerH =  $(".headerBottom").height() + $(".headerBottomImage").height();
			var bostSTF = $(window).scrollTop();

			if(bostSTF > headerH)
			{
				$(".left-container").css('padding-bottom', headerH +"px");
				$(".left-container").css('margin-top', - headerH +"px");

			}
			if(bostSTF < headerH){
				$(".left-container").css('padding-bottom', 0 +"px");
				$(".left-container").css('margin-top', - 0 +"px");
			}

			var windowHeight = $(window).height();

			if($("body").scrollTop() > windowHeight){
				$(".topScroll").show();
			}else
			{
				$(".topScroll").hide();
			}

			var footerH = $(".footer-v1").height() ;


			if($(window).scrollTop() >= $(document).height() - $(window).height() - footerH  ) {

        var leftCHeight = $(window).height() - $(".header").height() - $(".headerBottom").height()  - 50 - footerH  ;

		$(".left-container").height(leftCHeight);
    }

	});

}
$(function(){



	var screenWidth = $(window).innerWidth();
	if (screenWidth<991) {
		$(".searchWrapper").appendTo('.mobileSearch');
		$(".dropdown-menu .mega-menu-content .equal-height-in").removeClass("col-md-2");
		$(".exp-dropdown").css('display','block');
		$(".head-more").parent().hide();
	};
	// Search box focus and lost focus

	$(".searchWrapper input").keyup(function(){
		if($.trim($(this).val()) == ""){
			$(".header-go-button").addClass("disabled");
		} else {
			$(".header-go-button").removeClass("disabled");
		}
	});
	// If likes exist

	$(".icon-heart").each(function(){
		$(this).parents("li").addClass("add-like");
	});
	$(".add-like a").click(function(e){
		var l = parseInt($(this).parents("li").find("span").text());
		l++;
		$(this).parents("li").find("span").text(l.toString());
	});
	//
	/*if($(".left-container").length){
		$(document).on("mousewheel",".left-container",function(e){
			if(tx == true){
				$(".left-container").css("overflow-y","hidden");
				e.preventDefault();
				e.stopPropagation();
			} else {
				$(".left-container").css("overflow-y","auto");
			}

		});
}*/

if($(".articles-page").length || $(".profile-page").length ){
	$(".article-share-links .rounded-x.icon-speech,.article-share-links .post_text-comment").click(function(e){
		e.preventDefault();
		var obj = { "scrollTop" : $(".enter-comment-wrap").offset().top};
		$("body").animate(obj,300);
		tinyMCE.get('main-commentbox').getBody().focus();
		return false;
	});
	$("body").click(function(e){
		if($(e.target).parents(".tnymcePopUpwrapper").length || $(e.target).hasClass("inner-enter-comment-wrap") || $(e.target).parents(".inner-enter-comment-wrap").length|| $(e.target).parents(".mce-container").length || $(e.target).parents(".mce-tooltip").length || $(e.target).parents(".mce-btn").length){
			return false;
		}
		if($("#comment-ta").length){
			hideinnertext();
		}

		if($(e.target).parents(".tnymcePopUpwrapper").length || $(e.target).hasClass("send-message-textarea") || $(e.target).parents(".send-message-textarea").length || $(e.target).parents(".mce-container").length || $(e.target).parents(".mce-tooltip").length || $(e.target).parents(".mce-btn").length){
			return false;
		}
		hidemessage();
	});
	$(document).on("click",".inner-enter-comment-wrap",function(e){
		e.stopPropagation();
		return false;
	});
	$(document).on("click",".send-message-textarea",function(e){
		e.stopPropagation();
		return false;
	});
	function hideinnertext(){
		tinyMCE.get('comment-ta').remove();
		$(".inner-enter-comment-wrap").remove();
	}
	function hidemessage(){
			//$(".send-message").parent().removeClass("zindex-10");
			$(".send-message-textarea").css("display","none").css("width","0px");
			tx = false;
			//$(".left-container").css("overflow-y","auto");
		}
		$(".send-message").click(function(e){
			e.stopPropagation();
			//$(this).parent().addClass("zindex-10");
			var obj = {"width" : $(".container.content").width() + "px"};
			if(left_flag && !sm_set){
				$(".send-message-textarea").css("top",parseInt($(".send-message-textarea").css("top")) - $(".left-container").scrollTop() );
				sm_set = true;
			}
			/*if(left_flag){
				$(".left-container").css("overflow-y","hidden");
			}*/
			tx = true;
			$(".send-message-textarea").css("display","block");
			$(".send-message-textarea").animate(obj,500).addClass("exp");
			//tinyMCE.get('message-text').getBody().focus();
			return false;
		});
	}
	$(".main-comment .add-comment").click(function(e){
		e.preventDefault();
		var cur = $(this).parents(".main-comment").first();
		if($(".inner-enter-comment-wrap").length){
			hideinnertext();
		}
		if(!$(".inner-enter-comment-wrap").length){
			cur.append('<div class="inner-enter-comment-wrap"><textarea rows="3" id="comment-ta" placeholder="Enter your comment here"></textarea><div class="clearfix"></div><button class="inner-comment-submit btn btn-sm btn-success disabled">Submit</button><div class="clearfix"></div></div>');
		}
		if($(window).width() > 992){
			var obj = {scrollTop : $(".inner-enter-comment-wrap").offset().top - 230};
			$("body").animate(obj,200);
		}
		initTinyMce("comment-ta");
		setTimeout(function(){
			tinyMCE.get('comment-ta').getBody().focus();
		},300);

		return false;
	});
	$(".discussion-page #sidebar-nav-1 li").hover(function(){
		if(!$(this).hasClass("selected")){
			$(this).addClass("active");
		}
	},function(){
		if(!$(this).hasClass("selected")){
			$(this).removeClass("active");
		}
	});


	$(".discussion-page #sidebar-nav-1 li").click(function(){
		if($(this).hasClass("selected")){
			return false;
		}
		$(".discussion-page #sidebar-nav-1 .active").removeClass("active");
		$(".discussion-page #sidebar-nav-1 .selected").removeClass("selected");
		$(this).addClass("selected");
		$(this).addClass("active");
		var className = $(this).data("index");
		$(".blog-author.main-article[data-index=" + className + "]").css("display","block");
		$(".blog-author.main-article[data-index!=" + className + "]").css("display","none");
		if($(window).width() < 992){
			var obj = { "scrollTop" : $(".article-outer-wrapper").offset().top};
			$("html,body").animate(obj,300);
		}
		setHeight();
	});

	if($(".discussion-page").length){
		$(".blog-author[data-index=discussion-QA][data-answers=0] > .blog-author-desc").append("<button class='first-to-answer btn btn-xs btn-warning'>BE THE FIRST TO ANSWER</button>");
		$(".article-share-links .add-comment .post-text").click(function(e){
			e.preventDefault();
			var cur_e = $(e.target);
			if(cur_e.parents(".answer-focus").length){
				return;
			}
			if($(this).parents(".blog-author").data('index') != "discussion-articles" && $(this).parents(".blog-author").data('index') != "discussion-QA" || $(".QA-wrapper").length){
				e.preventDefault();
				if($("#comment-ta").length){
					hidecommentbox();
				}
				var ele = $(this);
				var cur = $(this).parents(".main-article").first();
				if(!cur.find(".inner-enter-comment-wrap").length && $(".discussion-wrapper").length){
					cur.append('<div class="inner-enter-comment-wrap"><textarea id="comment-ta" rows="3" placeholder="Enter your comment here"></textarea><div class="clearfix"></div><button class="inner-comment-submit btn btn-sm btn-success disabled">Submit</button><div class="clearfix"></div></div>');
				} else if(!cur.find(".inner-enter-comment-wrap").length && $(".QA-wrapper").length){
					//if(cur_e.parents(".blog-author").hasClass(".answer-block")){
						if(ele.hasClass("answer-add-comment")){
							ele.parents(".answer-blog-author-desc").after('<div class="inner-enter-comment-wrap"><textarea id="comment-ta" rows="3" placeholder="Enter your comment here"></textarea><div class="clearfix"></div><button class="inner-comment-submit btn btn-sm btn-success disabled">Submit</button><div class="clearfix"></div></div>');
						} else {
							ele.parents(".answer-block").find(".blog-author-desc").first().after('<div class="inner-enter-comment-wrap"><textarea id="comment-ta" rows="3" placeholder="Enter your comment here"></textarea><div class="clearfix"></div><button class="inner-comment-submit btn btn-sm btn-success disabled">Submit</button><div class="clearfix"></div></div>');
						}

					//} else {
					//	cur_e.parents(".blog-author").find(".blog-author-desc").append('<div class="inner-enter-comment-wrap"><textarea id="comment-ta" rows="3" placeholder="Enter your comment here"></textarea><div class="clearfix"></div><button class="inner-comment-submit btn btn-md btn-success disabled">Submit</button><div class="clearfix"></div></div>');
					//}
				}
				if($(window).width() > 992){
					var obj = {scrollTop : $(".inner-enter-comment-wrap").offset().top - 230};
					$("body").animate(obj,200);
				}
				initTinyMce("comment-ta");
				setTimeout(function(){
					tinyMCE.get('comment-ta').getBody().focus();
					if($(window).width() > 992){
						setHeight();
					}

				},100);
				return false;
			} else {
				window.location.href = $(this).parents(".blog-author").data('link');
			}
		});
$(".blog-author[data-index]").click(function(){
	if($(this).data('link')){
		window.location.href = $(this).data('link');
	} else{

	}
});
$(".ask-question").click(function(e){
	e.stopPropagation();
	if(!$(".ask-question-textarea").hasClass("exp")){
		hidetextarea();
	}
	if(left_flag && !aq_set){
		$(".ask-question-textarea").css("top",parseInt($(".ask-question-textarea").css("top")) - $(".left-container").scrollTop() );
		aq_set = true;
	}
	/*if(left_flag){
		$(".left-container").css("overflow-y","hidden");
	}*/
	tx = true;
	//$(".textareas").prepend($(".ask-question-textarea"));
	var obj = { "width" : $(".container.content").width() + "px"};
	var st = $("body").scrollTop();
	$(".ask-question-textarea").css("display","block");
	$("body").scrollTop(st);
	$(".ask-question-textarea").animate(obj,500,function(){$("body").scrollTop(st);}).addClass("exp");
	tinyMCE.get('ask-question').getBody().focus();
	return false;
});

$(".share-tips").click(function(e){

	e.stopPropagation();
	if(!$(".share-tip-textarea").hasClass("exp")){
		hidetextarea();
	}
	if(left_flag && !st_set){
		$(".share-tip-textarea").css("top",parseInt($(".share-tip-textarea").css("top")) - $(".left-container").scrollTop() );
		st_set = true;
	}
	/*if(left_flag){
		$(".left-container").css("overflow-y","hidden");
	}*/
	tx = true;
	//$(".textareas").prepend($(".share-tip-textarea"));
	var obj = {"width" : $(".container.content").width() + "px"};
	$(".share-tip-textarea").css("display","block");
	$(".share-tip-textarea").animate(obj,500);
	tinyMCE.get('share-tip').getBody().focus();
	return false;
});
$(".submit-article").click(function(e){

	e.stopPropagation();
	if(!$(".submit-article-textarea").hasClass("exp")){
		hidetextarea();
	}
	if(left_flag && !st_set){
		$(".submit-article-textarea").css("top",parseInt($(".submit-article-textarea").css("top")) - $(".left-container").scrollTop() );
		st_set = true;
	}
	/*if(left_flag){
		$(".left-container").css("overflow-y","hidden");
	}*/
	tx = true;
	//$(".textareas").prepend($(".share-tip-textarea"));
	var obj = {"width" : $(".container.content").width() + "px"};
	$(".submit-article-textarea").css("display","block");
	$(".submit-article-textarea").animate(obj,500);
	tinyMCE.get('share-tip').getBody().focus();
	return false;
})

/*$(".submit-article").click(function(e){
	$("#fileopen").click();
});*/



$(".give-feedback").click(function(e){
	e.stopPropagation();
	if(!$(".give-feedback-textarea").hasClass("exp")){
		hidetextarea();
	}

	if(left_flag && !gf_set){
		$(".give-feedback-textarea").css("top",parseInt($(".give-feedback-textarea").css("top")) - $(".left-container").scrollTop() );
		gf_set = true;
	}
	/*if(left_flag){
		$(".left-container").css("overflow-y","hidden");
	}*/
	tx = true;
    //$(".textareas").prepend($(".give-feedback-textarea"));
    var obj = {"width" : $(".container.content").width() + "px"};
    var st = $("html").scrollTop();
    $(".give-feedback-textarea").css("display","block");
    $("html").scrollTop(st);
    $(".give-feedback-textarea").animate(obj,500).addClass("exp");
    tinyMCE.get('give-feedback').getBody().focus();
    return false;
});

$(".textarea-label").addClass("exp");
$("body").click(function(e){
	if($(e.target).parents(".tnymcePopUpwrapper").length || $(e.target).hasClass("textarea-label") || $(e.target).parents(".textarea-label").length || $(e.target).parents(".mce-container").length || $(e.target).parents(".mce-tooltip").length || $(e.target).parents(".mce-btn").length){
		return false;
	}
	hidetextarea();
	if($(e.target).parents(".tnymcePopUpwrapper").length || $(e.target).hasClass("inner-enter-comment-wrap") || $(e.target).parents(".inner-enter-comment-wrap").length){
		return false;
	}
	hidecommentbox();
});

$(".exp").click(function(e){
	e.stopPropagation();
});

$(".textarea-label").removeClass("exp");

function hidetextarea(){
	$(".zindex-10").removeClass("zindex-10");
	$(".textarea-label").css("display","none");
	$(".textarea-label").css("width","0px");
	$(".textarea-label").removeClass("exp");
	tx = false;
	//$(".left-container").css("overflow-y","auto");
}
function hidecommentbox(){
	if($("#comment-ta").length){
		tinymce.get('comment-ta').remove();
	}
	$(".inner-enter-comment-wrap").remove();
}
}

if($(".QA-wrapper").length || $(".article-wrapper").length){

	$(document).on("click",".first-to-answer,.answer-focus,.answer-focus .post-text",function(){

		if($(".enter-comment-wrap").css("display") == "none"){
			$(".enter-comment-wrap").css("display","block");
			tinyMCE.get('main-commentbox').getBody().focus();
			var obj = {scrollTop : $(".enter-comment-wrap").offset().top};
			$("body").animate(obj,200);
		} else {
			//$(".enter-comment-wrap").css("display","none");
		}

	});
	$(".enter-comment-wrap .comment-submit").click(function(){

		if(!$(".article-wrapper").length){

			var cur = $(this);
			var text_html = tinyMCE.get('main-commentbox').getContent({format:'raw'});
			var html = $(".hidden-answer-sample").clone(true);
			html.find(".article-content").html(text_html);
			html.find(".post-shares span").html("0");
			html.removeClass("hidden-answer-sample");
			$(".article-outer-wrapper > .blog-author > .blog-author-desc").after(html);
			if($(".article-outer-wrapper > .blog-author").data('answers') == "0"){
				$(this).attr("data-answers","1");
				$(".first-to-answer").html("ANSWER THIS QUESTION");
			}
			tinyMCE.get('main-commentbox').setContent("");
			$(".comment-submit").addClass("disabled");
			$(".enter-comment-wrap").css("display","none");
			setHeight();
		} else {
			var cur = $(this);
			var text_html = tinyMCE.get('main-commentbox').getContent({format:'raw'});
			var html = $(".hidden-article-comment").clone(true);
			html.find(".post-shares.post-shares-lg").before(text_html);
			html.find(".post-shares span").html("0");
			html.removeClass("hidden-article-comment");
			$(".enter-comment-wrap").before(html);
			tinyMCE.get('main-commentbox').setContent("");
			$(".comment-submit").addClass("disabled");
			setHeight();
		}

	});
$(".blog-author").on("click",".inner-comment-submit",function(){
	var cur = $(this);
	var cur_par = $(this).parents(".blog-author");
	var text_html = tinyMCE.get('comment-ta').getContent({format:'raw'});
	var html = $(".hidden-comment-sample").clone(true);
	html.find(".overflow-h").after(text_html);
	html.find(".post-shares span").html("0");
	html.removeClass("hidden-comment-sample");
	cur.parents(".inner-enter-comment-wrap").after(html);
	tinyMCE.get('comment-ta').remove();
	$(".inner-enter-comment-wrap").remove();
	setHeight();
});
}

if($(".register-page").length){
	//$(".chzn-select").chosen(); $(".chzn-select-deselect").chosen({allow_single_deselect:true});
	$("#business-establishment").change(function(){
		$("#taking-care-of,#pro-elder-care,#volunteer,#none,#NGO").prop("checked",false);
	});
	$("#none").change(function(){
		$("#taking-care-of,#pro-elder-care,#volunteer,#business-establishment,#NGO").prop("checked",false);
	});
	$("#NGO").change(function(){
		$("#taking-care-of,#pro-elder-care,#volunteer,#business-establishment,#none").prop("checked",false);
	});
	$("#taking-care-of,#pro-elder-care,#volunteer").change(function(){
		$("#business-establishment,#none,#NGO").prop("checked",false);
	});
	if($(".third-register-page").length){
		$(".dropdown-wrapper").addClass("exp");
		$(".interests-selector").click(function(e){
			if(!$(".interests-wrapper").hasClass("exp")){
				hidewrappers();
			}
			e.stopPropagation();
			if($(".interests-wrapper").css("display") == "none"){
				$(".interests-wrapper").slideDown();
				$(".interests-wrapper").addClass("exp");
			} else {
				var text="";
				$(".interests-wrapper .parent").each(function(){
					var cur = $(this).find("input[type=checkbox]");
					if(cur.prop("checked")){
						text = text + cur.parents(".parent").next(".reg-main-label").find("label").text() + ", ";
					}
				});
				text = text.substring(0,text.length - 2);
				$(".interests-selector").val(text);
				$(".interests-wrapper").slideUp();
				$(".interests-wrapper").removeClass("exp");
			}
		});
		$(".likes-doing-selector").click(function(e){
			if(!$(".likes-doing-wrapper").hasClass("exp")){
				hidewrappers();
			}
			e.stopPropagation();
			if($(".likes-doing-wrapper").css("display") == "none"){
				$(".likes-doing-wrapper").slideDown();
				$(".likes-doing-wrapper").addClass("exp");
			} else {
				var text="";
				$(".likes-doing-wrapper .parent").each(function(){
					var cur = $(this).find("input[type=checkbox]");
					if(cur.prop("checked")){
						text = text + cur.parents(".parent").next(".reg-main-label").find("label").text() + ", ";
					}
				});
				text = text.substring(0,text.length - 2);
				$(".likes-doing-selector").val(text);
				$(".likes-doing-wrapper").slideUp();
				$(".likes-doing-wrapper").removeClass("exp");
			}
		});
		$(".suffering-from-selector").click(function(e){
			if(!$(".suffering-wrapper").hasClass("exp")){
				hidewrappers();
			}
			e.stopPropagation();
			if($(".suffering-wrapper").css("display") == "none"){
				$(".suffering-wrapper").slideDown();
				$(".suffering-wrapper").addClass("exp");
			} else {
				var text="";
				$(".suffering-wrapper .parent").each(function(){
					var cur = $(this).find("input[type=checkbox]");
					if(cur.prop("checked")){
						text = text + cur.parents(".parent").next(".reg-main-label").find("label").text() + ", ";
					}
				});
				text = text.substring(0,text.length - 2);
				$(".suffering-from-selector").val(text);
				$(".suffering-wrapper").slideUp();
				$(".suffering-wrapper").removeClass("exp");
			}
		});
		$(".dropdown-wrapper").css("display","block");
		///??????$(".interests-wrapper").offset({top : $(".interests-selector").offset().top + $(".interests-selector").innerHeight()  , left :$(".interests-selector").offset().left });
		//???????$(".likes-doing-wrapper").offset({top: $(".likes-doing-selector").offset().top + $(".likes-doing-selector").innerHeight(), left: $(".likes-doing-selector").offset().left});
		//???????$(".suffering-wrapper").offset({top: $(".suffering-from-selector").offset().top + $(".suffering-from-selector").innerHeight(), left: $(".suffering-from-selector").offset().left});
		//???????$(".dropdown-wrapper").css("display","none");
		$("body").click(function(e){
			e.stopPropagation();
			hidewrappers();
		});
		$(".exp").click(function(e){
			e.stopPropagation();
		});
		$(".interests-wrapper").removeClass("exp");
		function hidewrappers(){
			var text = "";
			$(".interests-wrapper .parent").each(function(){
				var cur = $(this).find("input[type=checkbox]");
				if(cur.prop("checked")){
					text = text + cur.parents(".parent").next(".reg-main-label").find("label").text() + ", ";
				}
			});
			text = text.substring(0,text.length - 2);
			$(".interests-selector").val(text);
			var text = "";
			$(".likes-doing-wrapper .parent").each(function(){
				var cur = $(this).find("input[type=checkbox]");
				if(cur.prop("checked")){
					text = text + cur.parents(".parent").next(".reg-main-label").find("label").text() + ", ";
				}
			});
			text = text.substring(0,text.length - 2);
			$(".likes-doing-selector").val(text);
			var text = "";
			$(".suffering-wrapper .parent").each(function(){
				var cur = $(this).find("input[type=checkbox]");
				if(cur.prop("checked")){
					text = text + cur.parents(".parent").next(".reg-main-label").find("label").text() + ", ";
				}
			});
			text = text.substring(0,text.length - 2);
			$(".suffering-from-selector").val(text);
			$(".dropdown-wrapper").css("display","none").removeClass("exp");
		}
		$(".interests-wrapper .parent input[type=checkbox]").change(function(){
			var id = $(this).parents(".parent").data("parent");
			if(id === undefined){
				return false;
			}
			if($(this).prop("checked")){
				$(".interests-wrapper .child[data-parent=" + id + "] input[type=checkbox]").prop("checked",true);
			} else {
				$(".interests-wrapper .child[data-parent=" + id + "] input[type=checkbox]").prop("checked",false);
			}
		});
		$(".likes-doing-wrapper .parent input[type=checkbox]").change(function(){
			var id = $(this).parents(".parent").data("parent");
			if(id === undefined){
				return false;
			}
			if($(this).prop("checked")){
				$(".likes-doing-wrapper .child[data-parent=" + id + "] input[type=checkbox]").prop("checked",true);
			} else {
				$(".likes-doing-wrapper .child[data-parent=" + id + "] input[type=checkbox]").prop("checked",false);
			}
		});
		$(".suffering-wrapper .parent input[type=checkbox]").change(function(){
			var id = $(this).parents(".parent").data("parent");
			if(id === undefined){
				return false;
			}
			if($(this).prop("checked")){
				$(".suffering-wrapper .child[data-parent=" + id + "] input[type=checkbox]").not("#other-issues,.other-issues-row input[type=checkbox]").prop("checked",true);
			} else {
				$(".suffering-wrapper .child[data-parent=" + id + "] input[type=checkbox]").prop("checked",false);
			}
		});
		$(".interests-wrapper .child input[type=checkbox]").change(function(){
			var id = $(this).parents(".child").data("parent");
			if($(this).prop("checked")){
				$(".interests-wrapper .parent[data-parent=" + id + "] input[type=checkbox]").prop("checked",true);
			} else {
				var flag = false;
				$(".interests-wrapper .child[data-parent=" + id + "] input[type=checkbox]").each(function(){
					if($(this).prop("checked")){
						flag = true;
					}
				});
				if(flag == false){
					$(".interests-wrapper .parent[data-parent=" + id + "] input[type=checkbox]").prop("checked",false);
				}
			}
		});
		$(".likes-doing-wrapper .child input[type=checkbox]").change(function(){
			var id = $(this).parents(".child").data("parent");
			if($(this).prop("checked")){
				$(".likes-doing-wrapper .parent[data-parent=" + id + "] input[type=checkbox]").prop("checked",true);
			} else {
				var flag = false;
				$(".likes-doing-wrapper .child[data-parent=" + id + "] input[type=checkbox]").each(function(){
					if($(this).prop("checked")){
						flag = true;
					}
				});
				if(flag == false){
					$(".likes-doing-wrapper .parent[data-parent=" + id + "] input[type=checkbox]").prop("checked",false);
				}
			}
		});
		$(".suffering-wrapper .child input[type=checkbox]").change(function(){
			var id = $(this).parents(".child").data("parent");
			if($(this).prop("checked")){
				$(".suffering-wrapper .parent[data-parent=" + id + "] input[type=checkbox]").prop("checked",true);
			} else {
				var flag = false;
				$(".suffering-wrapper .child[data-parent=" + id + "] input[type=checkbox]").each(function(){
					if($(this).prop("checked")){
						flag = true;
					}
				});
				if(flag == false){
					$(".suffering-wrapper .parent[data-parent=" + id + "] input[type=checkbox]").prop("checked",false);
				}
			}
		});
		$(".sub-parent input[type=checkbox]").change(function(){
			var cur = $(this);
			var id = cur.parent(".sub-parent").data("sub-parent");
			if(cur.prop("checked")){
				$(".sub-child[data-sub-parent=" + id + "]").slideDown();
			} else {
				$(".sub-child[data-sub-parent=" + id + "] input").prop("checked",false);
				var flag = false;
				$(".suffering-wrapper .child[data-parent=" + id + "] input[type=checkbox]").each(function(){
					if($(this).prop("checked")){
						flag = true;
					}
				});
				if(flag == false){
					$(".suffering-wrapper .parent[data-parent=" + id + "] input[type=checkbox]").prop("checked",false);
				}
				$(".sub-child[data-sub-parent=" + id + "]").slideUp();
			}
		});
		$("#other-medical-issue").change(function(){
			if($(this).prop("checked")){
				$(".other-medical-issue-text").css("display","block");
			} else {
				$(".other-medical-issue-text").css("display","none").val("");
			}
		});
		$(".suffering-wrapper .parent-other-main input[type=checkbox]").change(function(){
			if($(this).prop("checked")){
				$(".suffering-wrapper .child-other-main").css("display","block");
			} else {
				$(".suffering-wrapper .child-other-main").css("display","none");
				$(".suffering-wrapper .child-other-main input[type=text]").val("");
			}
		});
		$(".likes-doing-wrapper .parent-other-main input[type=checkbox]").change(function(){
			if($(this).prop("checked")){
				$(".likes-doing-wrapper .child-other-main").css("display","block");
			} else {
				$(".likes-doing-wrapper .child-other-main").css("display","none");
				$(".likes-doing-wrapper .child-other-main input[type=text]").val("");
			}
		});
		$(".add-sig").click(function(){
			//$(".add-sig-wrap").css("display","none");
			dp++;
			var html = '<div class="row margin-bottom-20 add-sig-content-edit-wrap"><div class="col-md-5">';
			html = html + '<span class="gender-her">Her</span>&nbsp;<span class="edit-res"></span> <input type="text" class="edit-label" /></div>';
			html = html + '<div class="col-md-6"><section class="col col-6"><label class="input">';
			html = html + '<i class="icon-append fa fa-calendar"></i> ';
			html = html + '<input type="text" style="font-weight: 400;" class="name-textbox textbox datepicker" name="name"  id="datepicker' + dp + '" readonly /></label>';
			html = html + '</section></div><div class="col-md-1 removeExtraDates"><i class="icon-append fa fa-close"></i></div></div>';
			$(".add-sig-wrap").before(html);
			$(".add-sig-content-edit-wrap .edit-label").focus();
			var year=new Date().getFullYear();

			$(".datepicker").datepicker({
				showOn: "focus",
				changeYear: true,
				yearRange: '1900:year'
			});
			//alert($(".taking-care-select-2").find('option[value=' + $(".taking-care-select-2").val() + ']').data('gender'));
			if($(".taking-care-select-2").find('option[value=' + $(".taking-care-select-2").val() + ']').data('gender') == "0"){
				$(".gender-she").html("She");
				$(".gender-her").html("Her");
				$(".gender-her-small").html("her");
				$(".gender-she-small").html("she");
			} else {
				$(".gender-she").html("He");
				$(".gender-her").html("His");
				$(".gender-her-small").html("his");
				$(".gender-she-small").html("he");
			}

			$(".taking-selected").html($(".taking-care-select option:selected").text());
			var addsigcontenteditwrapCount = $(".add-sig-content-edit-wrap").length;
			if(addsigcontenteditwrapCount < 5)
			{
				$(".add-sig").show();
			} else{
				$(".add-sig").hide();
			}
		});


$(".add-sig_4").click(function(){
			//$(".add-sig-wrap").css("display","none");
			dp++;
			var html = '<div class="row margin-bottom-20 add-sig-content-edit-wrap"><div class="col-md-5">';
			html = html + '<span class="gender-her">My</span>&nbsp;<span class="edit-res"></span> <input type="text" class="edit-label" /></div>';
			html = html + '<div class="col-md-6"><section class="col col-6"><label class="input">';
			html = html + '<i class="icon-append fa fa-calendar"></i> ';
			html = html + '<input type="text" style="font-weight: 400;" class="name-textbox textbox datepicker" name="name"  id="datepicker' + dp + '" readonly /></label>';
			html = html + '</section></div><div class="col-md-1 removeExtraDates"><i class="icon-append fa fa-close"></i></div></div>';
			$(".add-sig-wrap").before(html);
			$(".add-sig-content-edit-wrap .edit-label").focus();
			var addsigcontenteditwrapCount = $(".add-sig-content-edit-wrap").length;
			if(addsigcontenteditwrapCount < 5)
			{
				$(".add-sig_4").show();
			} else{
				$(".add-sig_4").hide();
			}
			var year=new Date().getFullYear();

			$(".datepicker").datepicker({
				showOn: "focus",
				changeYear: true,
				yearRange: '1900:year'
			});


		});

$(".lives-dependency-select").change(function(){
	var id = $(this).val();
	if(id == "2"){
		$(".lives-town-select").parent().slideUp();
	}else {
		$(".lives-town-select").parent().slideDown();
	}
	$(".taking-selected").html($(".taking-care-select option:selected").text());
});
$(".third-register-page").on("click",".edit-res",function(){
	var cur= $(this);
	cur.css("display","none");
	cur.siblings(".edit-label").css("display","inline-block");
});
$(document).on("focus",".edit-label",function(){
	var cur= $(this);
	cur.siblings(".edit-res").css("display","none");
	cur.css("display","inline-block");
});
$(document).on("blur",".edit-label",function(){
	var cur = $(this);
	if($.trim(cur.val())){
		cur.siblings(".edit-res").css("display","inline-block");
		cur.css("display","none");
		cur.siblings(".edit-res").text(cur.val());
	} else if(!$.trim(cur.parents(".add-sig-content-edit-wrap").find(".datepicker").val())){
		cur.parents(".add-sig-content-edit-wrap").remove();
	}
});
$('.grayRegisterBgLight').on('click', '.add-sig-content-edit-wrap .removeExtraDates', function() {
			//console.log("remove the tab");
			$(this).parents(".add-sig-content-edit-wrap").remove();
			var addsigcontenteditwrapCount = $(".add-sig-content-edit-wrap").length;
			if(addsigcontenteditwrapCount < 5)
			{
				$(".add-sig").show();
				$(".add-sig_4").show();
			} else{
				$(".add-sig").hide();
				$(".add-sig_4").hide();
			}
		});

$(".taking-care-select").change(function(){
	var id = $(this).val();
	var gender = $(this).find('option[value=' + id + ']').data('gender');
	if(gender == "0"){
		$(".gender-she").html("She");
		$(".gender-her").html("Her");
		$(".gender-her-small").html("her");
		$(".gender-she-small").html("she");
		$(".otherGender").slideUp();
		$(".taking-care-select-2").val(0);
	} else if(gender == "1") {
		$(".gender-she").html("He");
		$(".gender-her").html("His");
		$(".gender-her-small").html("his");
		$(".gender-her-smallapp").html("him");
		$(".gender-she-small").html("he");
		$(".otherGender").slideUp();
		$(".taking-care-select-2").val(0);
	} else {
		$(".otherGender").slideDown();
	}
	$(".taking-selected").html($(".taking-care-select option:selected").text());
});
$(".taking-care-select-2").change(function(){
	var id = $(this).val();
	var gender = $(this).find('option[value=' + id + ']').data('gender');
	if(gender == "0"){
		$(".gender-she").html("She");
		$(".gender-her").html("Her");
		$(".gender-her-small").html("her");
		$(".gender-she-small").html("she");
	} else if(gender == "1") {
		$(".gender-she").html("He");
		$(".gender-her").html("His");
		$(".gender-her-small").html("his");
		$(".gender-her-smallapp").html("him");
		$(".gender-she-small").html("he");
	}

});
$(".add-email").click(function(){
	var html = '<div class="row added-email-wrap margin-bottom-20"><div class="col-md-5">Alternative Email ID</div>';
	html = html + '<div class="col-md-6"><input type="email" class="textbox email-text" /></div><div class="col-md-1 removeExtraEmailId"> <i class="icon-append fa fa-close"></i></div></div>';
	$(".add-email-wrap").before(html);
	$(".email-text").last().focus();
	var addedemailwrapCount = $(".added-email-wrap").length;
			if(addedemailwrapCount < 5)
			{
				$(".add-email").show();
			} else{
				$(".add-email").hide();
			}
});
$('.grayRegisterBgLight').on('click', '.added-email-wrap .removeExtraEmailId', function() {
			//console.log("remove the tab");
			$(this).parents(".added-email-wrap").remove();
			var addedemailwrapCount = $(".added-email-wrap").length;
			if(addedemailwrapCount < 5)
			{
				$(".add-email").show();
			} else{
				$(".add-email").hide();
			}
		});
		/*$(document).on("blur",".email-text",function(){
			var cur = $(this);
			if($(".email-text").index(cur) != 0 && $.trim(cur.val()) == ""){
				cur.parents(".added-email-wrap").remove();
			}
		});*/
$(".add-phone").click(function(){
	var html = '<div class="row added-phone-wrap margin-bottom-20"><div class="col-md-5">Alternative Phone no</div>';
	html = html + '<div class="col-md-6"><input type="text" class="textbox phone-text" /></div><div class="col-md-1 removeExtraPhone"> <i class="icon-append fa fa-close"></i></div></div>';
	$(".add-phone-wrap").before(html);
	$(".phone-text").last().focus();
	var addedphonewrapCount = $(".added-phone-wrap").length;
			if(addedphonewrapCount < 5)
			{
				$(".add-phone").show();
			} else{
				$(".add-phone").hide();
			}
});
$('.grayRegisterBgLight').on('click', '.added-phone-wrap .removeExtraPhone', function() {
			//console.log("remove the tab");
			$(this).parents(".added-phone-wrap").remove();
			var addedphonewrapCount = $(".added-phone-wrap").length;
			if(addedphonewrapCount < 5)
			{
				$(".add-phone").show();
			} else{
				$(".add-phone").hide();
			}
		});
		/*$(document).on("blur",".phone-text",function(){
			var cur = $(this);
			if($(".phone-text").index(cur) != 0 && $.trim(cur.val()) == ""){
				cur.parents(".added-phone-wrap").remove();
			}
		});	*/
$(".profession-select").change(function(){
	if($(this).val() == "1"){
		$(".profession-wrap").slideDown();
	} else {
		$(".profession-wrap").slideUp();
	}
});
$(".dropdown-wrapper").removeClass("exp");
}
}

});
$(window).load(function(){
	var screenWidth = $(window).innerWidth();
	if($(".left-container").length){
		$(".breadCrumbMargin").css("margin-top",$(".breadcrumbs").height());
		if(screenWidth > 992){
			if($(".both-container").length){
				$(".both-container").css("min-height", $(window).height() - $(".both-container").offset().top - $(".footer-v1").height() + "px");
			}
		}
		$("body").scrollTop(0);
		init_offset = $(".left-container").offset().top;
		$("body").scrollTop(0);
		//init_bc_offset = $(".breadcrumbs").offset().top;
		$("body").scrollTop(0);
		if($(".left-container").height() > $(window).height() - $(".left-container").offset().top){
			left_flag = true;
		}
	}
	if (screenWidth>990) {
		$(".heightNewsJquery").height($("#heightNews").height());
	}

	$(window).scroll(function(){
		setHeight();
	});
	setHeight();
	if($(".discussion-page").length){
		if($(".ask-question-textarea").length){


			$(".ask-question-textarea").css("top",$(".ask-question").offset().top + $(".ask-question").innerHeight() + "px").css("left",$(".ask-question").offset().left + "px");
			$(".share-tip-textarea").css("top",$(".share-tips").offset().top + $(".share-tips").innerHeight() + "px").css("left",$(".share-tips").offset().left + "px");
			$(".ask-question-textarea,.share-tip-textarea,.submit-article-textarea,.give-feedback-textarea").css("height","initial").css("width",$(".container.content").width() + "px");
			$(".ask-question-textarea,.share-tip-textarea,.submit-article-textarea,.give-feedback-textarea").css("display","block");
			th = $(".ask-question-textarea").height() + 25;
			$(".give-feedback-textarea").css("top",$(".give-feedback").offset().top - th + "px").css("left",$(".give-feedback").offset().left + "px");
			$(".ask-question-textarea").css("top",$(".ask-question").offset().top - th + "px").css("left",$(".ask-question").offset().left + "px");
			$(".share-tip-textarea").css("top",$(".share-tips").offset().top - th + "px").css("left",$(".share-tips").offset().left + "px");
		//$(".submit-article-textarea").css("top",$(".submit-article").offset().top - th + "px").css("left",$(".submit-article").offset().left + "px");
		$(".ask-question-textarea,.share-tip-textarea,.submit-article-textarea,.give-feedback-textarea").css("height", th + "px").css("display","none").css("width","0px");
		}
	}
if($(".articles-page").length || $(".profile-page").length){
	$(".send-message-textarea").css("display","block").css("height","initial").css("width",$(".container.content").width() + "px");
	th = $(".send-message-textarea").height() + 25;
	$(".send-message-textarea").css("top",$(".send-message").offset().top - th + "px").css("left",$(".send-message").offset().left + "px");
	$(".send-message-textarea").css("display","none").css("height", th + "px").css("width","0px");
}
if($(".third-register-page").length){
	var year=new Date().getFullYear();
	$( "#datepicker,#datepicker1" ).datepicker({
		showOn: "focus",
		changeYear: true,
		yearRange: '1900:year'

	});
}

});

	///////////tinymce code .////////////////

	function initTinyMce(id){
			tinymce.init({
				selector: "#" + id,
				statusbar : false,
				menubar:false,
				toolbar:false,
				setup : function(ed) {
					ed.on("keyup", function() {
						if($.trim(ed.getContent({format: 'text'})).length){
							$(".inner-comment-submit").removeClass("disabled");
						} else {
							$(".inner-comment-submit").addClass("disabled");
						}
					});
				}
		});
		   tinymce.init({
				   selector: "#share-tip,#ask-question,#give-feedback",
				   theme: "modern",
				   skin: 'light',
				   statusbar : false,
				   menubar:false,
				   plugins: [
				   "image link",
				   "searchreplace visualblocks",
				   "insertdatetime media paste emoticons"
				   ],
				   toolbar: "bold italic | bullist numlist | link unlink emoticons image media",
				   setup : function(ed) {
					   var placeholder = $('#' + ed.id).attr('placeholder');
					   if (typeof placeholder !== 'undefined' && placeholder !== false) {
						 var is_default = false;
						 ed.on('init', function() {
						   // get the current content
						   var cont = ed.getContent();

						   // If its empty and we have a placeholder set the value
						   if (cont.length === 0) {
							 ed.setContent(placeholder);
							 // Get updated content
							 cont = placeholder;
						 }
						   // convert to plain text and compare strings
						   is_default = (cont == placeholder);

						   // nothing to do
						   if (!is_default) {
							 return;
						 }
					 }).on('keydown', function() {
							   // replace the default content on focus if the same as original placeholder
							   if (is_default) {
								 ed.setContent('');
								 is_default = false;
							 }
						 }).on('blur', function() {
						   if (ed.getContent().length === 0) {
							 ed.setContent(placeholder);
						 }
					 });
					 }
					 ed.on('init', function (evt) {
					   var toolbar = $(evt.target.editorContainer)
					   .find('>.mce-container-body >.mce-toolbar-grp');
					   var editor = $(evt.target.editorContainer)
					   .find('>.mce-container-body >.mce-edit-area');

						   // switch the order of the elements
						   toolbar.detach().insertAfter(editor);
					   });
					 ed.on("keyup", function() {
					   var id = ed.id;
					   if($.trim(ed.getContent({format: 'text'})).length){
						   $("#" + id).parents(".textarea-label").find(".btn").removeClass("disabled");
					   } else {
						   $("#" + id).parents(".textarea-label").find(".btn").addClass("disabled");
					   }
				   });
				 }
				   /*file_browser_callback: function(field_name, url, type, win) {
					   win.document.getElementById(field_name).value = myFileBrowser(field_name, url, type, win);
				   }*/
			   });
			   tinymce.init({
				   selector: "#submit-article",
				   theme: "modern",
				   skin: 'light',
				   statusbar : false,
				   menubar:false,
				   plugins: [
				   "advlist autolink autosave link image lists charmap print preview hr anchor pagebreak spellchecker",
				   "searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking",
				   "table contextmenu directionality emoticons template textcolor paste fullpage textcolor colorpicker textpattern"
				   ],
				   toolbar: "styleselect | bold italic | bullist numlist hr  | undo redo | link unlink emoticons image media | spellchecker  ",

				   setup : function(ed)
				   {
					   var placeholder = $('#' + ed.id).attr('placeholder');
					   if (typeof placeholder !== 'undefined' && placeholder !== false) {
						 var is_default = false;
						 ed.on('init', function() {
							   // get the current content
							   var cont = ed.getContent();

							   // If its empty and we have a placeholder set the value
							   if (cont.length === 0) {
								 ed.setContent(placeholder);
								 // Get updated content
								 cont = placeholder;
							 }
							   // convert to plain text and compare strings
							   is_default = (cont == placeholder);

							   // nothing to do
							   if (!is_default) {
								 return;
							 }
						 }).on('keydown', function() {
								   // replace the default content on focus if the same as original placeholder
								   if (is_default) {
									 ed.setContent('');
									 is_default = false;
								 }
							 }).on('blur', function() {
							   if (ed.getContent().length === 0) {
								 ed.setContent(placeholder);
							 }
						 });
						 }
						 ed.on('init', function (evt) {
						   var toolbar = $(evt.target.editorContainer)
						   .find('>.mce-container-body >.mce-toolbar-grp');
						   var editor = $(evt.target.editorContainer)
						   .find('>.mce-container-body >.mce-edit-area');

							   // switch the order of the elements
							   toolbar.detach().insertAfter(editor);
						   });
						 ed.on("keyup", function() {
						   var id = ed.id;
						   if($.trim(ed.getContent({format: 'text'})).length){
							   $("#" + id).parents(".textarea-label").find(".btn").removeClass("disabled");
						   } else {
							   $("#" + id).parents(".textarea-label").find(".btn").addClass("disabled");
						   }
					   });
				   }


				});


				function myFileBrowser (field_name, url, type, win) {

					//alert("Field_Name: " + field_name + "nURL: " + url + "nType: " + type + "nWin: " + win); // debug/testing

					/* If you work with sessions in PHP and your client doesn't accept cookies you might need to carry
					   the session name and session ID in the request string (can look like this: "?PHPSESSID=88p0n70s9dsknra96qhuk6etm5").
					   These lines of code extract the necessary parameters and add them back to the filebrowser URL again. */

					var cmsURL = window.location.toString();    // script URL - use an absolute path!
					if (cmsURL.indexOf("?") < 0) {
						//add the type as the only query parameter
						cmsURL = cmsURL + "?type=" + type;
					}
					else {
						//add the type as an additional query parameter
						// (PHP session ID is now included if there is one at all)
						cmsURL = cmsURL + "&type=" + type;
					}

					tinyMCE.activeEditor.windowManager.open({
						file : cmsURL,
						title : 'My File Browser',
						width : 80,  // Your dimensions may differ - toy around with them!
						height : 80,
						resizable : "yes",
						inline : "yes",  // This parameter only has an effect if you use the inlinepopups plugin!
						close_previous : "no"
					}, {
						window : win,
						input : field_name
					});
					return false;

				}
				/////////////tinymce ends///////////////////


				///bbotstrap-multiselect starts ////
				/**
				 * @author zhixin wen <wenzhixin2010@gmail.com>
				 * @version 1.1.0
				 *
				 * http://wenzhixin.net.cn/p/multiple-select/
				 */

				(function ($) {

				    'use strict';

				    function MultipleSelect($el, options) {
				        var that = this,
				            name = $el.attr('name') || options.name || ''

				        $el.parent().hide();
				        var elWidth = $el.css("width");
				        $el.parent().show();
				        if (elWidth=="0px") {elWidth = $el.outerWidth()+20}

				        this.$el = $el.hide();
				        this.options = options;
				        this.$parent = $('<div' + $.map(['class', 'title'],function (att) {
				            var attValue = that.$el.attr(att) || '';
				            attValue = (att === 'class' ? ('ms-parent' + (attValue ? ' ' : '')) : '') + attValue;
				            return attValue ? (' ' + att + '="' + attValue + '"') : '';
				        }).join('') + ' />');
				        this.$choice = $('<button type="button" class="ms-choice"><span class="placeholder">' +
				            options.placeholder + '</span><div></div></button>');
				        this.$drop = $('<div class="ms-drop ' + options.position + '"></div>');
				        this.$el.after(this.$parent);
				        this.$parent.append(this.$choice);
				        this.$parent.append(this.$drop);

				        if (this.$el.prop('disabled')) {
				            this.$choice.addClass('disabled');
				        }
				        this.$parent.css('width', options.width || elWidth);

				        if (!this.options.keepOpen) {
				            $('body').click(function (e) {
				                if ($(e.target)[0] === that.$choice[0] ||
				                    $(e.target).parents('.ms-choice')[0] === that.$choice[0]) {
				                    return;
				                }
				                if (e.target.tagName.toUpperCase() === "INPUT" &&
				                    ($(e.target)[0] === that.$drop[0] ||
				                    $(e.target).parents('.ms-drop')[0] !== that.$drop[0]) &&
				                    that.options.isOpen) {
				                    that.close();
				                }
				            });
				        }

				        this.selectAllName = 'name="selectAll' + name + '"';
				        this.selectGroupName = 'name="selectGroup' + name + '"';
				        this.selectItemName = 'name="selectItem' + name + '"';
				    }

				    MultipleSelect.prototype = {
				        constructor: MultipleSelect,

				        init: function () {
				            var that = this,
				                html = [];
				            if (this.options.filter) {
				                html.push(
				                    '<div class="ms-search">',
				                    '<input type="text" autocomplete="off" autocorrect="off" autocapitilize="off" spellcheck="false">',
				                    '</div>'
				                );
				            }
				            html.push('<ul>');
				            if (this.options.selectAll && !this.options.single) {
				                html.push(
				                    '<li class="ms-select-all">',
				                    '<label>',
				                    '<input type="checkbox" ' + this.selectAllName + ' /> ',
				                    this.options.selectAllDelimiter[0] + this.options.selectAllText + this.options.selectAllDelimiter[1],
				                    '</label>',
				                    '</li>'
				                );
				            }
				            $.each(this.$el.children(), function (i, elm) {
				                html.push(that.optionToHtml(i, elm));
				            });
				            html.push('<li class="ms-no-results">' + this.options.noMatchesFound + '</li>');
				            html.push('</ul>');
				            this.$drop.html(html.join(''));

				            this.$drop.find('ul').css('max-height', this.options.maxHeight + 'px');
				            this.$drop.find('.multiple').css('width', this.options.multipleWidth + 'px');

				            this.$searchInput = this.$drop.find('.ms-search input');
				            this.$selectAll = this.$drop.find('input[' + this.selectAllName + ']');
				            this.$selectGroups = this.$drop.find('input[' + this.selectGroupName + ']');
				            this.$selectItems = this.$drop.find('input[' + this.selectItemName + ']:enabled');
				            this.$disableItems = this.$drop.find('input[' + this.selectItemName + ']:disabled');
				            this.$noResults = this.$drop.find('.ms-no-results');
				            this.events();
				            this.updateSelectAll(true);
				            this.update(true);

				            if (this.options.isOpen) {
				                this.open();
				            }
				        },

				        optionToHtml: function (i, elm, group, groupDisabled) {
				            var that = this,
				                $elm = $(elm),
				                html = [],
				                multiple = this.options.multiple,
				                optAttributesToCopy = ['class', 'title'],
				                clss = $.map(optAttributesToCopy, function (att, i) {
				                    var isMultiple = att === 'class' && multiple;
				                    var attValue = $elm.attr(att) || '';
				                    return (isMultiple || attValue) ?
				                        (' ' + att + '="' + (isMultiple ? ('multiple' + (attValue ? ' ' : '')) : '') + attValue + '"') :
				                        '';
				                }).join(''),
				                disabled,
				                type = this.options.single ? 'radio' : 'checkbox';

				            if ($elm.is('option')) {
				                var value = $elm.val(),
				                    text = that.options.textTemplate($elm),
				                    selected = (that.$el.attr('multiple') != undefined) ? $elm.prop('selected') : ($elm.attr('selected') == 'selected'),
				                    style = this.options.styler(value) ? ' style="' + this.options.styler(value) + '"' : '';

				                disabled = groupDisabled || $elm.prop('disabled');
				                if ((this.options.blockSeparator > "") && (this.options.blockSeparator == $elm.val())) {
				                    html.push(
				                        '<li' + clss + style + '>',
				                        '<label class="' + this.options.blockSeparator + (disabled ? 'disabled' : '') + '">',
				                        text,
				                        '</label>',
				                        '</li>'
				                    );
				                } else {
				                    html.push(
				                        '<li' + clss + style + '>',
				                        '<label' + (disabled ? ' class="disabled"' : '') + '>',
				                        '<input type="' + type + '" ' + this.selectItemName + ' value="' + value + '"' +
				                            (selected ? ' checked="checked"' : '') +
				                            (disabled ? ' disabled="disabled"' : '') +
				                            (group ? ' data-group="' + group + '"' : '') +
				                            '/> ',
				                        text,
				                        '</label>',
				                        '</li>'
				                    );
				                }
				            } else if (!group && $elm.is('optgroup')) {
				                var _group = 'group_' + i,
				                    label = $elm.attr('label');

				                disabled = $elm.prop('disabled');
				                html.push(
				                    '<li class="group">',
				                    '<label class="optgroup' + (disabled ? ' disabled' : '') + '" data-group="' + _group + '">',
				                    (this.options.hideOptgroupCheckboxes ? '' : '<input type="checkbox" ' + this.selectGroupName +
				                        (disabled ? ' disabled="disabled"' : '') + ' /> '),
				                    label,
				                    '</label>',
				                    '</li>');
				                $.each($elm.children(), function (i, elm) {
				                    html.push(that.optionToHtml(i, elm, _group, disabled));
				                });
				            }
				            return html.join('');
				        },

				        events: function () {
				            var that = this;

				            function toggleOpen(e) {
				                e.preventDefault();
				                that[that.options.isOpen ? 'close' : 'open']();
				            }

				            var label = this.$el.parent().closest('label')[0] || $('label[for=' + this.$el.attr('id') + ']')[0];
				            if (label) {
				                $(label).off('click').on('click', function (e) {
				                    if (e.target.nodeName.toLowerCase() !== 'label' || e.target !== this) {
				                        return;
				                    }
				                    toggleOpen(e);
				                    if (!that.options.filter || !that.options.isOpen) {
				                        that.focus();
				                    }
				                    e.stopPropagation(); // Causes lost focus otherwise
				                });
				            }
				            this.$choice.off('click').on('click', toggleOpen)
				                .off('focus').on('focus', this.options.onFocus)
				                .off('blur').on('blur', this.options.onBlur);

				            this.$parent.off('keydown').on('keydown', function (e) {
				                switch (e.which) {
				                    case 27: // esc key
				                        that.close();
				                        that.$choice.focus();
				                        break;
				                }
				            });
				            this.$searchInput.off('keydown').on('keydown',function (e) {
				                if (e.keyCode === 9 && e.shiftKey) { // Ensure shift-tab causes lost focus from filter as with clicking away
				                    that.close();
				                }
				            }).off('keyup').on('keyup', function (e) {
				                    if (that.options.filterAcceptOnEnter &&
				                        (e.which === 13 || e.which == 32) && // enter or space
				                        that.$searchInput.val() // Avoid selecting/deselecting if no choices made
				                        ) {
				                        that.$selectAll.click();
				                        that.close();
				                        that.focus();
				                        return;
				                    }
				                    that.filter();
				                });
				            this.$selectAll.off('click').on('click', function () {
				                var checked = $(this).prop('checked'),
				                    $items = that.$selectItems.filter(':visible');
				                if ($items.length === that.$selectItems.length) {
				                    that[checked ? 'checkAll' : 'uncheckAll']();
				                } else { // when the filter option is true
				                    that.$selectGroups.prop('checked', checked);
				                    $items.prop('checked', checked);
				                    that.options[checked ? 'onCheckAll' : 'onUncheckAll']();
				                    that.update();
				                }
				            });
				            this.$selectGroups.off('click').on('click', function () {
				                var group = $(this).parent().attr('data-group'),
				                    $items = that.$selectItems.filter(':visible'),
				                    $children = $items.filter('[data-group="' + group + '"]'),
				                    checked = $children.length !== $children.filter(':checked').length;
				                $children.prop('checked', checked);
				                that.updateSelectAll();
				                that.update();
				                that.options.onOptgroupClick({
				                    label: $(this).parent().text(),
				                    checked: checked,
				                    children: $children.get()
				                });
				            });
				            this.$selectItems.off('click').on('click', function () {
				                that.updateSelectAll();
				                that.update();
				                that.updateOptGroupSelect();
				                that.options.onClick({
				                    label: $(this).parent().text(),
				                    value: $(this).val(),
				                    checked: $(this).prop('checked')
				                });

				                if (that.options.single && that.options.isOpen && !that.options.keepOpen) {
				                    that.close();
				                }
				            });
				        },

				        open: function () {
				            if (this.$choice.hasClass('disabled')) {
				                return;
				            }
				            this.options.isOpen = true;
				            this.$choice.find('>div').addClass('open');
				            this.$drop.show();

				            // fix filter bug: no results show
				            this.$selectAll.parent().show();
				            this.$noResults.hide();

				            // Fix #77: 'All selected' when no options
				            if (this.$el.children().length === 0) {
				                this.$selectAll.parent().hide();
				                this.$noResults.show();
				            }

				            if (this.options.container) {
				                var offset = this.$drop.offset();
				                this.$drop.appendTo($(this.options.container));
				                this.$drop.offset({ top: offset.top, left: offset.left });
				            }
				            if (this.options.filter) {
				                this.$searchInput.val('');
				                this.$searchInput.focus();
				                this.filter();
				            }
				            this.options.onOpen();
				        },

				        close: function () {
				            this.options.isOpen = false;
				            this.$choice.find('>div').removeClass('open');
				            this.$drop.hide();
				            if (this.options.container) {
				                this.$parent.append(this.$drop);
				                this.$drop.css({
				                    'top': 'auto',
				                    'left': 'auto'
				                });
				            }
				            this.options.onClose();
				        },

				        update: function (isInit) {
				            var selects = this.getSelects(),
				                $span = this.$choice.find('>span');

				            if (selects.length === 0) {
				                $span.addClass('placeholder').html(this.options.placeholder);
				            } else if (this.options.countSelected && selects.length < this.options.minimumCountSelected) {
				                $span.removeClass('placeholder').html(
				                    (this.options.displayValues ? selects : this.getSelects('text'))
				                        .join(this.options.delimiter));
				            } else if (this.options.allSelected &&
				                selects.length === this.$selectItems.length + this.$disableItems.length) {
				                $span.removeClass('placeholder').html(this.options.allSelected);
				            } else if ((this.options.countSelected || this.options.etcaetera) && selects.length > this.options.minimumCountSelected) {
				                if (this.options.etcaetera) {
				                    $span.removeClass('placeholder').html((this.options.displayValues ? selects : this.getSelects('text').slice(0, this.options.minimumCountSelected)).join(this.options.delimiter) + '...');
				                }
				                else {
				                    $span.removeClass('placeholder').html(this.options.countSelected
				                        .replace('#', selects.length)
				                        .replace('%', this.$selectItems.length + this.$disableItems.length));
				                }
				            } else {
				                $span.removeClass('placeholder').html(
				                    (this.options.displayValues ? selects : this.getSelects('text'))
				                        .join(this.options.delimiter));
				            }
				            // set selects to select
				            this.$el.val(this.getSelects());

				            // add selected class to selected li
				            this.$drop.find('li').removeClass('selected');
				            this.$drop.find('input[' + this.selectItemName + ']:checked').each(function () {
				                $(this).parents('li').first().addClass('selected');
				            });

				            // trigger <select> change event
				            if (!isInit) {
				                this.$el.trigger('change');
				            }
				        },

				        updateSelectAll: function (Init) {
				            var $items = this.$selectItems;
				            if (!Init) { $items = $items.filter(':visible'); }
				            this.$selectAll.prop('checked', $items.length &&
				                $items.length === $items.filter(':checked').length);
				            if (this.$selectAll.prop('checked')) {
				                this.options.onCheckAll();
				            }
				        },

				        updateOptGroupSelect: function () {
				            var $items = this.$selectItems.filter(':visible');
				            $.each(this.$selectGroups, function (i, val) {
				                var group = $(val).parent().attr('data-group'),
				                    $children = $items.filter('[data-group="' + group + '"]');
				                $(val).prop('checked', $children.length &&
				                    $children.length === $children.filter(':checked').length);
				            });
				        },

				        //value or text, default: 'value'
				        getSelects: function (type) {
				            var that = this,
				                texts = [],
				                values = [];
				            this.$drop.find('input[' + this.selectItemName + ']:checked').each(function () {
				                texts.push($(this).parents('li').first().text());
				                values.push($(this).val());
				            });

				            if (type === 'text' && this.$selectGroups.length) {
				                texts = [];
				                this.$selectGroups.each(function () {
				                    var html = [],
				                        text = $.trim($(this).parent().text()),
				                        group = $(this).parent().data('group'),
				                        $children = that.$drop.find('[' + that.selectItemName + '][data-group="' + group + '"]'),
				                        $selected = $children.filter(':checked');

				                    if ($selected.length === 0) {
				                        return;
				                    }

				                    html.push('[');
				                    html.push(text);
				                    if ($children.length > $selected.length) {
				                        var list = [];
				                        $selected.each(function () {
				                            list.push($(this).parent().text());
				                        });
				                        html.push(': ' + list.join(', '));
				                    }
				                    html.push(']');
				                    texts.push(html.join(''));
				                });
				            }
				            return type === 'text' ? texts : values;
				        },

				        setSelects: function (values) {
				            var that = this;
				            this.$selectItems.prop('checked', false);
				            $.each(values, function (i, value) {
				                that.$selectItems.filter('[value="' + value + '"]').prop('checked', true);
				            });
				            this.$selectAll.prop('checked', this.$selectItems.length ===
				                this.$selectItems.filter(':checked').length);
				            this.update();
				        },

				        enable: function () {
				            this.$choice.removeClass('disabled');
				        },

				        disable: function () {
				            this.$choice.addClass('disabled');
				        },

				        checkAll: function () {
				            this.$selectItems.prop('checked', true);
				            this.$selectGroups.prop('checked', true);
				            this.$selectAll.prop('checked', true);
				            this.update();
				            this.options.onCheckAll();
				        },

				        uncheckAll: function () {
				            this.$selectItems.prop('checked', false);
				            this.$selectGroups.prop('checked', false);
				            this.$selectAll.prop('checked', false);
				            this.update();
				            this.options.onUncheckAll();
				        },

				        focus: function () {
				            this.$choice.focus();
				            this.options.onFocus();
				        },

				        blur: function () {
				            this.$choice.blur();
				            this.options.onBlur();
				        },

				        refresh: function () {
				            this.init();
				        },

				        filter: function () {
				            var that = this,
				                text = $.trim(this.$searchInput.val()).toLowerCase();
				            if (text.length === 0) {
				                this.$selectItems.parent().show();
				                this.$disableItems.parent().show();
				                this.$selectGroups.parent().show();
				            } else {
				                this.$selectItems.each(function () {
				                    var $parent = $(this).parent();
				                    $parent[$parent.text().toLowerCase().indexOf(text) < 0 ? 'hide' : 'show']();
				                });
				                this.$disableItems.parent().hide();
				                this.$selectGroups.each(function () {
				                    var $parent = $(this).parent();
				                    var group = $parent.attr('data-group'),
				                        $items = that.$selectItems.filter(':visible');
				                    $parent[$items.filter('[data-group="' + group + '"]').length === 0 ? 'hide' : 'show']();
				                });

				                //Check if no matches found
				                if (this.$selectItems.filter(':visible').length) {
				                    this.$selectAll.parent().show();
				                    this.$noResults.hide();
				                } else {
				                    this.$selectAll.parent().hide();
				                    this.$noResults.show();
				                }
				            }
				            this.updateOptGroupSelect();
				            this.updateSelectAll();
				        }
				    };

				    $.fn.multipleSelect = function () {
				        var option = arguments[0],
				            args = arguments,

				            value,
				            allowedMethods = [
				                'getSelects', 'setSelects',
				                'enable', 'disable',
				                'checkAll', 'uncheckAll',
				                'focus', 'blur',
				                'refresh', 'close'
				            ];

				        this.each(function () {
				            var $this = $(this),
				                data = $this.data('multipleSelect'),
				                options = $.extend({}, $.fn.multipleSelect.defaults,
				                    $this.data(), typeof option === 'object' && option);

				            if (!data) {
				                data = new MultipleSelect($this, options);
				                $this.data('multipleSelect', data);
				            }

				            if (typeof option === 'string') {
				                if ($.inArray(option, allowedMethods) < 0) {
				                    throw "Unknown method: " + option;
				                }
				                value = data[option](args[1]);
				            } else {
				                data.init();
				                if (args[1]) {
				                    value = data[args[1]].apply(data, [].slice.call(args, 2));
				                }
				            }
				        });

				        return value ? value : this;
				    };

				    $.fn.multipleSelect.defaults = {
				        name: '',
				        isOpen: false,
				        placeholder: '',
				        selectAll: true,
				        selectAllText: 'Select all',
				        selectAllDelimiter: ['[', ']'],
				        allSelected: 'All selected',
				        minimumCountSelected: 20,
				        countSelected: '# of % selected',
				        noMatchesFound: 'No matches found',
				        multiple: false,
				        multipleWidth: 80,
				        single: false,
				        filter: false,
				        width: undefined,
				        maxHeight: 250,
				        container: null,
				        position: 'bottom',
				        keepOpen: false,
				        blockSeparator: '',
				        displayValues: false,
				        delimiter: ', ',

				        styler: function () {
				            return false;
				        },
				        textTemplate: function ($elm) {
				            return $elm.text();
				        },

				        onOpen: function () {
				            return false;
				        },
				        onClose: function () {
				            return false;
				        },
				        onCheckAll: function () {
				            return false;
				        },
				        onUncheckAll: function () {
				            return false;
				        },
				        onFocus: function () {
				            return false;
				        },
				        onBlur: function () {
				            return false;
				        },
				        onOptgroupClick: function () {
				            return false;
				        },
				        onClick: function () {
				            return false;
				        }
				    };
				})(jQuery);

				////bootstrap-multiselect ends ////


				////////// fileuploadajax//////////
				///////////////////
				jQuery.extend({
					createUploadIframe:function(id,uri){
						var frameId='jUploadFrame' + id;
						if(window.ActiveXObject){
							var io=document.createElement('<iframe id="'+frameId+'" name="'+frameId+'" />');
							if(typeof uri=='boolean'){
								io.src='javascript:false';
							}else if(typeof uri=='string'){
								io.src=uri;
							}
						}else{
							var io=document.createElement('iframe');
							io.id=frameId;
							io.name=frameId;
						}
						io.style.position='absolute';
						io.style.top='-1000px';
						io.style.left='-1000px';
						document.body.appendChild(io);
						return io;
					},
					createUploadForm:function(id,fileElementId){
						// Create form
						var formId = 'jUploadForm' + id;
						var fileId = 'jUploadFile' + id;
						var form = $('<form  action="" method="POST" name="' + formId + '" id="' + formId + '" enctype="multipart/form-data"></form>');
						var oldElement = $('#' + fileElementId);
						var newElement = $(oldElement).clone();
						$(oldElement).attr('id', fileId);
						$(oldElement).before(newElement);
						$(oldElement).appendTo(form);
						// Set CSS attributes
						$(form).css('position', 'absolute');
						$(form).css('top', '-1200px');
						$(form).css('left', '-1200px');
						$(form).appendTo('body');
						return form;
					},
					ajaxFileUpload:function(s){
						// TODO introduce global settings, allowing the client to modify them for all requests, not only timeout
						s = jQuery.extend({}, jQuery.ajaxSettings, s);
						var id = new Date().getTime();
						var form = jQuery.createUploadForm(id,s.fileElementId);
						var io = jQuery.createUploadIframe(id,s.secureuri);
						var frameId = 'jUploadFrame' + id;
						var formId = 'jUploadForm' + id;
						// Watch for a new set of requests
						if(s.global && !jQuery.active++){
							jQuery.event.trigger( "ajaxStart" );
						}
						var requestDone = false;
						// Create the request object
						var xml = {}
						if(s.global){
							jQuery.event.trigger("ajaxSend", [xml, s]);
						}
						// Wait for a response to come back
						var uploadCallback = function(isTimeout){
							var io = document.getElementById(frameId);
							try{
								if(io.contentWindow){
									xml.responseText = io.contentWindow.document.body?io.contentWindow.document.body.innerHTML:null;
									xml.responseXML = io.contentWindow.document.XMLDocument?io.contentWindow.document.XMLDocument:io.contentWindow.document;
								}else if(io.contentDocument){
									xml.responseText = io.contentDocument.document.body?io.contentDocument.document.body.innerHTML:null;
									xml.responseXML = io.contentDocument.document.XMLDocument?io.contentDocument.document.XMLDocument:io.contentDocument.document;
								}
							}catch(e){
								jQuery.handleError(s,xml,null,e);
							}
							if(xml || isTimeout=="timeout"){
								requestDone = true;
								var status;
								try{
									status = isTimeout != "timeout" ? "success" : "error";
									// Make sure that the request was successful or notmodified
									if(status != "error"){
										// process the data (runs the xml through httpData regardless of callback)
										var data = jQuery.uploadHttpData(xml,s.dataType);
										// If a local callback was specified, fire it and pass it the data
										if(s.success){
											s.success( data, status );
										}
										// Fire the global callback
										if(s.global){
											jQuery.event.trigger("ajaxSuccess",[xml,s]);
										}
									}else{
										jQuery.handleError(s,xml,status);
									}
								}catch(e){
									status = "error";
									jQuery.handleError(s,xml,status,e);
								}
								// The request was completed
								if(s.global){
									jQuery.event.trigger("ajaxComplete",[xml,s]);
								}
								// Handle the global AJAX counter
								if(s.global && !--jQuery.active){
									jQuery.event.trigger("ajaxStop");
								}
								// Process result
								if(s.complete){
									s.complete(xml, status);
								}
								jQuery(io).unbind();
								setTimeout(function(){
									try{
										$(io).remove();
										$(form).remove();
									}catch(e){
										jQuery.handleError(s, xml, null, e);
									}
								},100);
								xml = null;
							}
						}
						// Timeout checker
						if(s.timeout>0){
							setTimeout(function(){
								// Check to see if the request is still happening
								if(!requestDone) uploadCallback("timeout");
							},s.timeout);
						}
						try{
							// var io = $('#' + frameId);
							var form = $('#' + formId);
							$(form).attr('action', s.url);
							$(form).attr('method', 'POST');
							$(form).attr('target', frameId);
							if(form.encoding){
								form.encoding = 'multipart/form-data';
							}else{
								form.enctype = 'multipart/form-data';
							}
							$(form).submit();
						}catch(e){
							jQuery.handleError(s,xml,null,e);
						}
						if(window.attachEvent){
							document.getElementById(frameId).attachEvent('onload', uploadCallback);
						}else{
							document.getElementById(frameId).addEventListener('load', uploadCallback, false);
						}
						return {abort:function(){}};
					},
					uploadHttpData:function(r,type){
						var data = !type;
						data = type == "xml" || data ? r.responseXML : r.responseText;
						// If the type is "script", eval it in global context
						if(type=="script"){
							jQuery.globalEval(data);
						}
						// Get the JavaScript object, if JSON is used.
						if(type=="json"){
							eval("data = "+data);
						}
						// evaluate scripts within html
						if(type=="html"){
							jQuery("<div>").html(data).evalScripts();
						}
						//alert($('param', data).each(function(){alert($(this).attr('value'));}));
						return data;
					}
				})

				//////////////////////


				////////fileupladajax///////////

		}
	}
		   //don't forget to call the load function
   		$scope.load();

   	}
   ]);




byControllers.controller('ListQuestionController', ['$scope', '$location', 'QuestionDiscuss',
function($scope, $location, QuestionDiscuss) {
	$scope.discuss = QuestionDiscuss.query();
	$scope.discuss.discussType = "Q";
	$location.path('/discuss/Q');
}]);

byControllers.controller('ListPostController', ['$scope', '$location', 'PostDiscuss',
function($scope, $location, PostDiscuss) {
	$scope.discuss = PostDiscuss.query();
	$scope.discuss.discussType = "P";
	$location.path('/discuss/P');
}]);

byControllers.controller('ListArticleController', ['$scope', '$location', 'ArticleDiscuss',
function($scope, $location, ArticleDiscuss) {
	$scope.discuss = ArticleDiscuss.query();
	$scope.discuss.discussType = "A";
	$location.path('/discuss/A');
}]);



byControllers.controller('DiscussCreateController', ['$scope', '$route', '$routeParams', '$location', 'Discuss', 'DiscussOneTopicOneSubTopicList',
  function($scope, $route, $routeParams, $location, Discuss, DiscussOneTopicOneSubTopicList) {
     	$scope.discuss = new Discuss();
		var segment = $location.path().substring(1);
		segment = segment.substring(segment.indexOf("/")+1);
		segment = segment.substring(segment.indexOf("/")+1);
		$scope.discuss.topicId = segment.substring(0,segment.indexOf("/"));
		$scope.discuss.subTopicId = $location.path().substring($location.path().lastIndexOf("/")+1);


		$scope.register = function (discussType) {
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
			$scope.discuss.$save(function (discuss, headers) {
				var location = $scope.discuss.discussType;
				var mode = discussType;

				$scope.discuss = DiscussOneTopicOneSubTopicList.query({discussType: discussType, topicId: topicId, subTopicId:subTopicId});
				document.getElementById(element_id).style.display = 'none';

				$route.reload();
				$location.path('/discuss/' + element_id + '/' + topicId + '/' + subTopicId);

			});

		};

  }]);






byControllers.controller('DiscussEditController', ['$scope', '$routeParams', '$location', 'DiscussShow',
  function($scope, $routeParams, $location, DiscussShow) {
	var discussId = $routeParams.discussId;
	$scope.discuss = DiscussShow.show({discussId: discussId});
    //??????tinyMCE.setContent($scope.discuss.text);

	tinyMCE.activeEditor.setContent($scope.discuss.text, {format : 'raw'});

  }]);

byControllers.controller('DiscussDetailController', ['$scope', '$rootScope', '$routeParams', '$route', '$location', 'DiscussShow', 'DiscussComment', 'DiscussUserLikes', 'Discuss',
  function($scope, $rootScope, $routeParams, $route, $location, DiscussShow, DiscussComment, DiscussUserLikes, Discuss) {

	var discussId = $routeParams.discussId;
	var type = $location.path().endsWith("/A");

	//when the page loads up make sure that there are no blocks visible
	document.getElementById('comment_block').style.display = 'none';
	document.getElementById('answer_block').style.display = 'none';

    $scope.discuss = DiscussShow.get({discussId: discussId});
    $scope.comments = DiscussComment.get({parentId:discussId,ancestorId:discussId}); //DiscussComment.get({discussId: discussId});

    $scope.getCommentTree = function(parentId, ancestorId){
		$scope.comments = DiscussComment.get({parentId:parentId,ancestorId:ancestorId});
	}
	$scope.getDiscussTree = function(discussId){
		$scope.comments = DiscussComment.get({parentId:discussId,ancestorId:discussId});
	}

    //$scope.comments = DiscussComment.get({ancestorId: discussId, parentId:$scope.comment.parentId });

    $rootScope.bc_topic = $scope.discuss.topicId;
    $rootScope.bc_subTopic = $scope.discuss.subTopicId;

    $scope.current_comment = '';

	//these are coming null
	var discussType = $rootScope.bc_discussType;
	var topicId = $scope.discuss.topicId;
	var subTopicId = $scope.discuss.subTopicId;
	var userId = $scope.discuss.userId;
	$scope.type = '';

	//User Discuss Like method
	 $scope.UserLike = function(userId, discussId) {

		//Create the new discuss user like
		$scope.discussuserlikes = DiscussUserLikes.get({userId:userId, discussId: discussId});

		$scope.discuss = Discuss.query({discussId:discussId});
		$route.reload();

		document.getElementById('like_count').innerHTML = $scope.discuss.aggrReplyCount;

	}


	//User Comments Like method
		 $scope.UserCommentLike = function(userId, commentId) {

			/*
			//Create the new discuss user like
			$scope.commentuserlikes = AnswerCommentUserLikes.get({userId:userId, commentId: commentId});

			$scope.comment = Discuss.query({commentId:commentId});
			$route.reload();

			document.getElementById('like_count').innerHTML = $scope.discuss.aggrReplyCount;
			*/
	}





    $scope.createNewComment = function(typeId, disId, parId)
    {
		$scope.current_comment_id = parId;
		$scope.type = typeId;


		if(typeId == 'A'){

			document.getElementById('answer_block').style.display = 'block';

		    $('.' +disId).append($('#answer_block'));
		    $('#answer_block').show = 'clip';

			var id = 'main-commentbox_answer';


			tinyMCE.init({
			   selector: "#" + id,
			   theme: "modern",
			   skin: 'light',
			   statusbar : false,
			   menubar:false,
			   plugins: [
			   "image link",
			   "searchreplace visualblocks",
			   "insertdatetime media paste emoticons"
			   ],
			   toolbar: "bold italic | bullist numlist | link unlink emoticons image media",
			   setup : function(ed) {
				   var placeholder = $('#' + ed.id).attr('placeholder');
				   if (typeof placeholder !== 'undefined' && placeholder !== false) {
					 var is_default = false;
					 ed.on('init', function() {
					   // get the current content
					   var cont = ed.getContent();

					   // If its empty and we have a placeholder set the value
					   if (cont.length === 0) {
						 ed.setContent(placeholder);
						 // Get updated content
						 cont = placeholder;
					 }
					   // convert to plain text and compare strings
					   is_default = (cont == placeholder);

					   // nothing to do
					   if (!is_default) {
						 return;
					 }
				 }).on('keydown', function() {
						   // replace the default content on focus if the same as original placeholder
						  if (is_default) {
							ed.setContent('');
							is_default = false;
						 }

					 }).on('blur', function() {
					   if (ed.getContent().length === 0) {
						 ed.setContent(placeholder);
					 }
				 });
				 }
				 ed.on('init', function (evt) {
				   var toolbar = $(evt.target.editorContainer)
				   .find('>.mce-container-body >.mce-toolbar-grp');
				   var editor = $(evt.target.editorContainer)
				   .find('>.mce-container-body >.mce-edit-area');

					   // switch the order of the elements
					   toolbar.detach().insertAfter(editor);
				   });
				 ed.on("keyup", function() {
				   var id = ed.id;
				   if($.trim(ed.getContent({format: 'text'})).length){
					   $("#" + id).parents(".textarea-label").find(".btn").removeClass("disabled");
				   } else {
					   $("#" + id).parents(".textarea-label").find(".btn").addClass("disabled");
				   }
			   });
			 }
			});


			tinyMCE.execCommand('mceAddControl', false, id);
			tinyMCE.execCommand('mceFocus', false, id);

		}else if(typeId == 'C'){

			document.getElementById('comment_block').style.display = 'block';
			$('.' + parId).append($('#comment_block'));

			var id = 'main-commentbox_comment';


  			tinyMCE.init({
			   selector: "#" + id,
			   theme: "modern",
			   skin: 'light',
			   statusbar : false,
			   menubar:false,
			   plugins: [
			   "image link",
			   "searchreplace visualblocks",
			   "insertdatetime media paste emoticons"
			   ],
			   toolbar: "bold italic | bullist numlist | link unlink emoticons image media",
			   setup : function(ed) {
				   var placeholder = $('#' + ed.id).attr('placeholder');
				   if (typeof placeholder !== 'undefined' && placeholder !== false) {
					 var is_default = false;
					 ed.on('init', function() {
					   // get the current content
					   var cont = ed.getContent();

					   // If its empty and we have a placeholder set the value
					   if (cont.length === 0) {
						 ed.setContent(placeholder);
						 // Get updated content
						 cont = placeholder;
					 }
					   // convert to plain text and compare strings
					   is_default = (cont == placeholder);

					   // nothing to do
					   if (!is_default) {
						 return;
					 }
				 }).on('keydown', function() {
						   // replace the default content on focus if the same as original placeholder
						  if (is_default) {
							 ed.setContent('');
							 is_default = false;
						 	}


					 }).on('blur', function() {
					   if (ed.getContent().length === 0) {
						 ed.setContent(placeholder);
					 }
				 });
				 }
				 ed.on('init', function (evt) {
				   var toolbar = $(evt.target.editorContainer)
				   .find('>.mce-container-body >.mce-toolbar-grp');
				   var editor = $(evt.target.editorContainer)
				   .find('>.mce-container-body >.mce-edit-area');

					   // switch the order of the elements
					   toolbar.detach().insertAfter(editor);
				   });
				 ed.on("keyup", function() {
				   var id = ed.id;
				   if($.trim(ed.getContent({format: 'text'})).length){
					   $("#" + id).parents(".textarea-label").find(".btn").removeClass("disabled");
				   } else {
					   $("#" + id).parents(".textarea-label").find(".btn").addClass("disabled");
				   }
			   });
			 }
			});

			tinyMCE.execCommand('mceAddControl', false, id);
			tinyMCE.execCommand('mceFocus', false, id);
		}else	{
			//wrong place
		}
	}

	//dispose off the tinymce box
	$scope.dispose  = function(typeId){
			if(typeId == 'A')
				document.getElementById('answer_block').style.display = 'none';
			else if(typeId == 'C')
				document.getElementById('comment_block').style.display = 'none';
			else
			{
				//wrong place
			}
	}

	$scope.saveComment  = function(){

		$scope.comment = new DiscussComment();
		$scope.comment.discussType = $scope.type;

		//putting the userId to discuss being created
		$scope.comment.userId = localStorage.getItem("USER_ID");

		var htmlval = tinyMCE.activeEditor.getContent();
		$scope.comment.discussCommenContent = htmlval;

		if($scope.type == 'A')
		{
			$scope.comment.discussId = $scope.discuss.id;
			$scope.comment.parentId = null;
		}
		else if($scope.type == 'C')
		{
			$scope.comment.discussId = null;
			$scope.comment.parentId = $scope.current_comment_id;
		}
		else
		{
			//wrong place
		}

		$scope.comment.$save(function (comment, headers) {
			$scope.discuss = DiscussShow.get({discussId: discussId});
			$scope.comments = DiscussComment.get({ancestorId: discussId, parentId:$scope.comment.parentId });

			if($scope.type == 'A')
			{
				document.getElementById('answer_block').style.display = 'none';
			}
			else if($scope.type == 'C')
			{
				document.getElementById('comment_block').style.display = 'none';

			}
			else
			{
				//wrong place
			}
			$scope.discuss = DiscussShow.get({discussId: discussId});
    		$scope.comments = DiscussComment.get({discussId: discussId});

			//important to call this re-establish the state
    		$route.reload();

			$rootScope.bc_topic = $scope.discuss.topicId;
			$rootScope.bc_subTopic = $scope.discuss.subTopicId;


			$location.path('/comment/' + discussId);

		}, function (error) {
			// failure
			console.log("$comment creation failed " + JSON.stringify(error));
			//$scope.error = 'Failed to edit user details';
			//$scope.message = '';

		});

		newComment= false;
	}


     //??$scope.discuss2 = UserDiscussList.get({discussType:discussType, topicId: 'BEAUTIFUL LIVES', subTopicId: 'Stars forever', userId: userId});
  }]);


byControllers.controller('DiscussDeleteController', ['$scope', '$routeParams', '$location', 'Discuss',
  function($scope, $routeParams, $location, Discuss) {
     var discussId = $routeParams.discussId;
     $scope.discuss = Discuss.get({discussId:discussId});

	//this is comign as undefined
	var loc = $scope.discuss.discussType;

	$scope.discuss = Discuss.remove({discussId: discussId});

	$scope.discuss = Discuss.query();
	//TODO - thsi is not working - not redirecting after a delete - so hard-codng t to Show Articles NOW
	$location.path('/discuss/' + 'A');
  }]);



var UserRoleController = function($scope) {
    $scope.userRoleIds =
    [
        "SUPER_USER",
        "WRITER",
        "EDITOR",
        "USER"
    ];
};



//Topic/Sub Topic drop down in DISCUSS Create
var option1Options =	[
		"BEAUTIFUL LIVES",
		"ELDER'S ROUTINE",
		"HEALTH CONDITIONS",
		"CAREGIVER'S CORNER",
		"FAMILY & RELATIONSHIP",
		"SERVICES",
		"PRODUCTS"
	];

var option2Options = [
		["Stars forever","Personal stories"],
		["Chores","Medications", "Personal hygiene", "Food and Nutrition", "Mobility", "Activities"],
		["Alzheimer's and dementia","Parkinson's", "Mental disorders", "Broken hip", "Stroke", "Vision and Hearing loss", "Arthritis", "Diabetes", "Incontinence", "Heart", "Cancer", "Respiratory", "Kidney", "Digestive system", "Sleep disorders", "Osteoporosis", "Other"],
		["Caregiving guides","Stress and burnout", "Personal stories"],
		["FR1","FR2"],
		["SRV1","SRV2"],
		["PRO1","PRO2"]
	];



function myCtrl($scope){
    $scope.options1 = option1Options;
    $scope.options2 = []; // we'll get these later
    $scope.getOptions2 = function(){
        // just some silly stuff to get the key of what was selected since we are using simple arrays.
        var key = $scope.options1.indexOf($scope.discuss.topicId);
        // Here you could actually go out and fetch the options for a server.
        var myNewOptions = option2Options[key];
        // Now set the options.
        // If you got the results from a server, this would go in the callback
        $scope.options2 = myNewOptions;
    };
}


//cutting text that is to be displayed
angular.module('ng').filter('cut', function () {
    return function (value, wordwise, max, tail) {
        if (!value) return '';

        max = parseInt(max, 10);
        if (!max) return value;
        if (value.length <= max) return value;

        value = value.substr(0, max);
        if (wordwise) {
            var lastspace = value.lastIndexOf(' ');
            if (lastspace != -1) {
                value = value.substr(0, lastspace);
            }
        }

        return value + (tail || ' ');
    };
});


//Angular Date Picker
var date_app = angular.module('dateApp', ['pickadate']);
//angular.module('dateApp', ['pickadate']);

	      function DateController($scope, dateFilter) {
	        $scope.date = dateFilter(new Date(), 'yyyy-MM-dd');
	        $scope.minDate = '2013-10-06';
	        $scope.maxDate = '2014-10-06';
	      }


//var app = angular.module('byApp', ['app.directives']);

byControllers.controller('LanguagesController', function($scope){
    $scope.languages = [
          {"id": 1, "name": "English", "assignable": true},
          {"id": 2, "name": "Hindi", "assignable": true},
          {"id": 3, "name": "Gujarati", "assignable": true},
		  {"id": 4, "name": "Bengali", "assignable": true},
		  {"id": 5, "name": "Tamil", "assignable": true},
		  {"id": 6, "name": "Telugu", "assignable": true},
		  {"id": 7, "name": "Punjabi", "assignable": true},
		  {"id": 8, "name": "Malayalam", "assignable": true},
		  {"id": 9, "name": "Marathi", "assignable": true},
		  {"id": 10, "name": "Oriya", "assignable": true},
		  {"id": 11, "name": "Assamese", "assignable": true},
		  {"id": 12, "name": "Kannada", "assignable": true},
		  {"id": 12, "name": "Other", "assignable": true}

    ];

    $scope.member = {languages: []};
    $scope.selected_items = [];
    $scope.selected_item_names = [];
});


byControllers.controller('InterestedInController', function($scope){
    $scope.interests = [
          {"id": 1, "name": "Arts &amp; Culture", "assignable": true},
          {"id": 2, "name": "Movies &amp; Songs (Hindi, etc.)", "assignable": true},
          {"id": 3, "name": "Literature modern &amp; classical", "assignable": true},
          {"id": 4, "name": "Visual Arts - sculpture painting ceramics toys etc.", "assignable": true},
          {"id": 5, "name": "Classical Music &amp; Dance", "assignable": true},
          {"id": 6, "name": "Science &amp; Technology", "assignable": true},
          {"id": 7, "name": "Spirituality &amp; Religions", "assignable": true},
          {"id": 8, "name": "Dance &amp; Performance art (incl. local forms as Kathakali, etc.)", "assignable": true},
          {"id": 9, "name": "Traditions &amp; Cultures", "assignable": true},
          {"id": 10, "name": "Environmental issues", "assignable": true},
          {"id": 11, "name": "Women issues", "assignable": true},
          {"id": 12, "name": "Poverty &amp; social issues", "assignable": true},
          {"id": 13, "name": "Politics world and local", "assignable": true},
          {"id": 14, "name": "Health &amp; Medicine", "assignable": true},
          {"id": 15, "name": "Money &amp; Finance", "assignable": true},
          {"id": 16, "name": "Fashion", "assignable": true},
          {"id": 17, "name": "Pets", "assignable": true},
          {"id": 18, "name": "Home (maintenance, interior design, etc.)", "assignable": true},
          {"id": 19, "name": "Jokes &amp; Humor", "assignable": true}
    ];

    $scope.member = {interests: []};
    $scope.selected_items = [];
    $scope.selected_item_names = [];
});



byControllers.controller('LikesDoingController', function($scope){
    $scope.likes = [
          {"id": 1, "name": "Games (chess, cards, etc)", "assignable": true},
          {"id": 2, "name": "Creative writing", "assignable": true},
          {"id": 3, "name": "Photography", "assignable": true},
          {"id": 4, "name": "Cooking &amp; Recipes", "assignable": true},
          {"id": 5, "name": "Food &amp; drinks exploration", "assignable": true},
          {"id": 6, "name": "Handcrafting", "assignable": true},
          {"id": 7, "name": "Yoga &amp; Mediation", "assignable": true},
          {"id": 8, "name": "Tourism &amp; Travelling", "assignable": true},
          {"id": 9, "name": "Walking &amp; Hiking", "assignable": true},
          {"id": 10, "name": "Sports &amp; Fitness", "assignable": true},
          {"id": 11, "name": "Singing &amp; Dancing", "assignable": true},
          {"id": 12, "name": "Pets", "assignable": true},
          {"id": 13, "name": "Religions &amp; Traditions", "assignable": true},
          {"id": 14, "name": "Languages", "assignable": true},
          {"id": 15, "name": "Other", "assignable": true}
    ];

    $scope.member = {likes: []};
    $scope.selected_items = [];
    $scope.selected_item_names = [];
});


//Suffering From Conrroller

byControllers.controller('SufferingFromController', function($scope){
    $scope.suffers = [
          {"id": 1, "name": option2Options[2][0], "assignable": true},
          {"id": 2, "name": option2Options[2][1], "assignable": true},
          {"id": 3, "name": option2Options[2][2], "assignable": true},
          {"id": 4, "name": option2Options[2][3], "assignable": true},
          {"id": 5, "name": option2Options[2][4], "assignable": true},
          {"id": 6, "name": option2Options[2][5], "assignable": true},
          {"id": 7, "name": option2Options[2][6], "assignable": true},
          {"id": 8, "name": option2Options[2][7], "assignable": true},
          {"id": 9, "name": option2Options[2][8], "assignable": true},
          {"id": 10, "name": option2Options[2][9], "assignable": true},
          {"id": 11, "name": option2Options[2][10], "assignable": true},
          {"id": 12, "name": option2Options[2][11], "assignable": true},
          {"id": 13, "name": option2Options[2][12], "assignable": true},
          {"id": 14, "name": option2Options[2][13], "assignable": true},
          {"id": 15, "name": option2Options[2][14], "assignable": true},
          {"id": 16, "name": option2Options[2][15], "assignable": true},
          {"id": 17, "name": option2Options[2][16], "assignable": true},
          {"id": 18, "name": option2Options[2][17], "assignable": true},
          {"id": 19, "name": option2Options[2][18], "assignable": true}
    ];

    $scope.member = {suffers: []};
    $scope.selected_items = [];
    $scope.selected_item_names = [];
});




var app_directives = angular.module('app.directives', []);

app_directives.directive('byHomeArticleCard', function () {
    return {
        restrict: 'A',
        templateUrl: 'views/home/homeArticleCard.html'
    };
});

app_directives.directive('byHomeQuestionsCard', function () {
    return {
        restrict: 'A',
        templateUrl: 'views/home/homeQuestionCard.html'
    };
});


app_directives.directive('byHomePostsCard', function () {
    return {
        restrict: 'A',
        templateUrl: 'views/home/homePostsCard.html'
    };
});

app_directives.directive('diHref', ['$location', '$route',
	function ($location, $route) {
		return function (scope, element, attrs) {
			scope.$watch('diHref', function () {
				if (attrs.diHref) {
					element.attr('href', attrs.diHref);
					element.bind('click', function (event) {
						scope.$apply(function () {
							if ($location.url() == attrs.diHref || "#" + $location.url() == attrs.diHref) $route.reload();
						});
					});
				}
			});
		}
	}]);

app_directives.directive('discuss', function () {
    var directive = {};

    directive.restrict = 'E';
    /* restrict this directive to elements */

    directive.template = "<div>THSIS IS SUPPOSE TO BE A DISCUSS CONTENT {{content.firstName}}</div>";

    directive.scope = {
        content: "=user"
    }

    return directive;
});

app_directives.directive('dropdownMultiselectLanguages', function(){

   return {
       restrict: 'E',
       scope:{

            model: '=',
            names: '=',
            options: '=',
            pre_selected: '=preSelected'
       },
       template: "<div class='btn-group' data-ng-class='{open: open}'>"+
        "<button class='btn btn-small' data-ng-click='open=!open;openDropdown()'>---- Select languages spoken ----</button>"+
                "<button class='btn btn-small dropdown-toggle' data-ng-click='open=!open;openDropdown()'><span class='caret'></span></button>"+
                "<ul class='dropdown-menu' aria-labelledby='dropdownMenu'>" +
                    "<li><a data-ng-click='selectAll()'><i class='icon-ok-sign'></i>  Check All</a></li>" +
                    "<li><a data-ng-click='deselectAll();'><i class='icon-remove-sign'></i>  Uncheck All</a></li>" +
                    "<li class='divider'></li>" +
                    "<li data-ng-repeat='option in options'> <a data-ng-click='setSelectedItem()'>{{option.name}}<span data-ng-class='isChecked(option.id)'></span></a></li>" +
                "</ul>" +
            "</div>" ,
       controller: function($scope, $rootScope){

           $scope.openDropdown = function(){

			   		if($scope.model && $scope.model != 'undefined' && $scope.model != '' && $scope.model != null)
			   		{
			   		var from_db = $scope.model;


			   		if(from_db.indexOf('\"') != -1)
			   			from_db = from_db.slice(1, from_db.length -1);

			   		var arr;
			   		if(from_db.indexOf(',') != -1)
			   			arr = from_db.split(',');
			   		else arr = from_db;

					var db_select = '[';
			   		for(var i = 0; i < arr.length; i++)
			   		{
						//alert(arr[i]);
						db_select = db_select + '{\"id\":' + arr[i] + '},';
					}
					db_select = db_select.slice(0,db_select.length -1) + ']';
					$scope.selected_items = db_select;
					$rootScope.lang_selection = $scope.model;
					//alert($scope.selected_items);

					}
					else
					{

                    $scope.selected_items = [];
                    $scope.selected_item_names = [];

                    for(var i=0; i<$scope.pre_selected.length; i++){
						$scope.selected_items.push($scope.pre_selected[i].id);
						$scope.selected_item_names.push($scope.pre_selected[i].name);
                    }

					$rootScope.lang_selection = $scope.model;
					$rootScope.lang_selection_names = $scope.names;

					if(document.getElementById('lang_dd').style.display === 'block')
					{

						//document.getElementById('lang_dd').style.display = 'none';
						//document.getElementById('lang_display').disabled = true;
						//????????document.getElementById('lang_display').style.display = 'block';
					}
					else
					{

						//?????document.getElementById('lang_display').style.display = 'none';
						//document.getElementById('lang_dd').style.display = 'block';
						//document.getElementById('lang_display').disabled = false;
					}
					}
			};

            $scope.selectAll = function () {
                $scope.model = _.pluck($scope.options, 'id');
                $scope.names = _.pluck($scope.options, 'name');

                $rootScope.lang_selection_names = $scope.names;
                $rootScope.lang_selection = $scope.model;
				//??????????????document.getElementById('langs').value = $rootScope.lang_selection_names;

                console.log($scope.model);
            };
            $scope.deselectAll = function() {
                $scope.model=[];
                $scope.names=[];
                console.log($scope.model);
                $rootScope.lang_selection_names = '';
                $rootScope.lang_selection = '';
                //????????????document.getElementById('langs').value = $rootScope.lang_selection_names;
            };
            $scope.setSelectedItem = function(){

                var id = this.option.id;

                var aname = this.option.name;
                if (_.contains($scope.model, id)) {

                    $scope.model = _.without($scope.model, id);
                    $scope.names = _.without($scope.names, aname);
                } else {
					if(!$scope.model || $scope.model == 'undefined' || $scope.model == '' || $scope.model == null)
					{
						$scope.model = [];
					}
                    $scope.model.push(id);
                    $scope.names.push(aname);
                }
                console.log($scope.model);
                $rootScope.lang_selection_names = $scope.names;
                $rootScope.lang_selection = $scope.model;
				//????????document.getElementById('langs').value = $rootScope.lang_selection_names;
                return false;
            };
            $scope.isChecked = function (id) {

                if (_.contains($scope.model, id)) {
                    return 'icon-ok pull-right';
                }
                return false;
            };
       }
   }
});




app_directives.directive('dropdownMultiselectInterests', function(){

   return {
       restrict: 'E',
       scope:{

            model: '=',
            names: '=',
            options: '=',
            pre_selected: '=preSelected'
       },
       template: "<div class='btn-group' data-ng-class='{open: open}'>"+
        "<button class='btn btn-small' data-ng-click='open=!open;openDropdown()'>---- Select interests pursued ----</button>"+
                "<button class='btn btn-small dropdown-toggle' data-ng-click='open=!open;openDropdown()'><span class='caret'></span></button>"+
                "<ul class='dropdown-menu' aria-labelledby='dropdownMenu'>" +
                    "<li><a data-ng-click='selectAll()'><i class='icon-ok-sign'></i>  Check All</a></li>" +
                    "<li><a data-ng-click='deselectAll();'><i class='icon-remove-sign'></i>  Uncheck All</a></li>" +
                    "<li class='divider'></li>" +
                    "<li data-ng-repeat='option in options'> <a data-ng-click='setSelectedItem()'>{{option.name}}<span data-ng-class='isChecked(option.id)'></span></a></li>" +
                "</ul>" +
            "</div>" ,
       controller: function($scope, $rootScope){

           $scope.openDropdown = function(){
                    $scope.selected_items = [];
                    $scope.selected_item_names = [];

                    for(var i=0; i<$scope.pre_selected.length; i++){
						$scope.selected_items.push($scope.pre_selected[i].id);
						$scope.selected_item_names.push($scope.pre_selected[i].name);
                    }

					$rootScope.interest_selection = $scope.model;
					$rootScope.interest_selection_names = $scope.names;

					if(document.getElementById('int_dd').style.display === 'block')
					{

						document.getElementById('int_dd').style.display = 'none';
						//document.getElementById('lang_display').disabled = true;
						document.getElementById('int_display').style.display = 'block';
					}
					else
					{

						document.getElementById('int_display').style.display = 'none';
						document.getElementById('int_dd').style.display = 'block';
						//document.getElementById('lang_display').disabled = false;
					}

            };

            $scope.selectAll = function () {
                $scope.model = _.pluck($scope.options, 'id');
                $scope.names = _.pluck($scope.options, 'name');

                $rootScope.interest_selection_names = $scope.names;
				document.getElementById('interests').value = $rootScope.interest_selection_names;

                console.log($scope.model);
            };
            $scope.deselectAll = function() {
                $scope.model=[];
                $scope.names=[];

                $rootScope.interest_selection_names = '';
				document.getElementById('interests').value = $rootScope.interest_selection_names;
                console.log($scope.model);
            };
            $scope.setSelectedItem = function(){
                var id = this.option.id;
                var aname = this.option.name;
                if (_.contains($scope.model, id)) {
                    $scope.model = _.without($scope.model, id);
                    $scope.names = _.without($scope.names, aname);
                } else {
                    $scope.model.push(id);
                    $scope.names.push(aname);
                }

                $rootScope.interest_selection_names = $scope.names;
				document.getElementById('interests').value = $rootScope.interest_selection_names;

                console.log($scope.model);
                return false;
            };
            $scope.isChecked = function (id) {
                if (_.contains($scope.model, id)) {
                    return 'icon-ok pull-right';
                }
                return false;
            };
       }
   }
});






//Likes Doing Directive


app_directives.directive('dropdownMultiselectLikes', function(){

   return {
       restrict: 'E',
       scope:{

            model: '=',
            names: '=',
            options: '=',
            pre_selected: '=preSelected'
       },
       template: "<div class='btn-group' data-ng-class='{open: open}'>"+
        "<button class='btn btn-small' data-ng-click='open=!open;openDropdown()'>---- Select what you like doing ----</button>"+
                "<button class='btn btn-small dropdown-toggle' data-ng-click='open=!open;openDropdown()'><span class='caret'></span></button>"+
                "<ul class='dropdown-menu' aria-labelledby='dropdownMenu'>" +
                    "<li><a data-ng-click='selectAll()'><i class='icon-ok-sign'></i>  Check All</a></li>" +
                    "<li><a data-ng-click='deselectAll();'><i class='icon-remove-sign'></i>  Uncheck All</a></li>" +
                    "<li class='divider'></li>" +
                    "<li data-ng-repeat='option in options'> <a data-ng-click='setSelectedItem()'>{{option.name}}<span data-ng-class='isChecked(option.id)'></span></a></li>" +
                "</ul>" +
            "</div>" ,
       controller: function($scope, $rootScope){

           $scope.openDropdown = function(){
                    $scope.selected_items = [];
                    $scope.selected_item_names = [];

                    for(var i=0; i<$scope.pre_selected.length; i++){
						$scope.selected_items.push($scope.pre_selected[i].id);
						$scope.selected_item_names.push($scope.pre_selected[i].name);
                    }

					$rootScope.like_selection = $scope.model;
					$rootScope.like_selection_names = $scope.names;

					if(document.getElementById('like_dd').style.display === 'block')
					{

						document.getElementById('like_dd').style.display = 'none';
						//document.getElementById('lang_display').disabled = true;
						document.getElementById('like_display').style.display = 'block';
					}
					else
					{

						document.getElementById('like_display').style.display = 'none';
						document.getElementById('like_dd').style.display = 'block';
						//document.getElementById('lang_display').disabled = false;
					}
			};

            $scope.selectAll = function () {
                $scope.model = _.pluck($scope.options, 'id');
                $scope.names = _.pluck($scope.options, 'name');

                $rootScope.like_selection_names = $scope.names;
				document.getElementById('likes').value = $rootScope.like_selection_names;

                console.log($scope.model);
            };
            $scope.deselectAll = function() {
                $scope.model=[];
                $scope.names=[];
                console.log($scope.model);
                $rootScope.like_selection_names = '';
                document.getElementById('likes').value = $rootScope.like_selection_names;
            };
            $scope.setSelectedItem = function(){
                var id = this.option.id;
                var aname = this.option.name;
                if (_.contains($scope.model, id)) {
                    $scope.model = _.without($scope.model, id);
                    $scope.names = _.without($scope.names, aname);
                } else {
                    $scope.model.push(id);
                    $scope.names.push(aname);
                }
                console.log($scope.model);
                $rootScope.like_selection_names = $scope.names;
				document.getElementById('likes').value = $rootScope.like_selection_names;
                return false;
            };
            $scope.isChecked = function (id) {
                if (_.contains($scope.model, id)) {
                    return 'icon-ok pull-right';
                }
                return false;
            };
       }
   }
});



app_directives.directive('dropdownMultiselectSuffers', function(){

   return {
       restrict: 'E',
       scope:{

            model: '=',
            names: '=',
            options: '=',
            pre_selected: '=preSelected'
       },
       template: "<div class='btn-group' data-ng-class='{open: open}'>"+
        "<button class='btn btn-small' data-ng-click='open=!open;openDropdown()'>---- What are you suffering from ----</button>"+
                "<button class='btn btn-small dropdown-toggle' data-ng-click='open=!open;openDropdown()'><span class='caret'></span></button>"+
                "<ul class='dropdown-menu' aria-labelledby='dropdownMenu'>" +
                    "<li><a data-ng-click='selectAll()'><i class='icon-ok-sign'></i>  Check All</a></li>" +
                    "<li><a data-ng-click='deselectAll();'><i class='icon-remove-sign'></i>  Uncheck All</a></li>" +
                    "<li class='divider'></li>" +
                    "<li data-ng-repeat='option in options'> <a data-ng-click='setSelectedItem()'>{{option.name}}<span data-ng-class='isChecked(option.id)'></span></a></li>" +
                "</ul>" +
            "</div>" ,
       controller: function($scope, $rootScope){

           $scope.openDropdown = function(){
                    $scope.selected_items = [];
                    $scope.selected_item_names = [];

                    for(var i=0; i<$scope.pre_selected.length; i++){
						$scope.selected_items.push($scope.pre_selected[i].id);
						$scope.selected_item_names.push($scope.pre_selected[i].name);
                    }

					$rootScope.suffer_selection = $scope.model;
					$rootScope.suffer_selection_names = $scope.names;

					if(document.getElementById('suffer_dd').style.display === 'block')
					{

						document.getElementById('suffer_dd').style.display = 'none';
						//document.getElementById('lang_display').disabled = true;
						document.getElementById('suffer_display').style.display = 'block';
					}
					else
					{

						document.getElementById('suffer_display').style.display = 'none';
						document.getElementById('suffer_dd').style.display = 'block';
						//document.getElementById('lang_display').disabled = false;
					}
			};

            $scope.selectAll = function () {
                $scope.model = _.pluck($scope.options, 'id');
                $scope.names = _.pluck($scope.options, 'name');

                $rootScope.suffer_selection_names = $scope.names;
				document.getElementById('suffers').value = $rootScope.suffer_selection_names;

                console.log($scope.model);
            };
            $scope.deselectAll = function() {
                $scope.model=[];
                $scope.names=[];
                console.log($scope.model);
                $rootScope.suffer_selection_names = '';
                document.getElementById('suffers').value = $rootScope.suffer_selection_names;
            };
            $scope.setSelectedItem = function(){
                var id = this.option.id;
                var aname = this.option.name;
                if (_.contains($scope.model, id)) {
                    $scope.model = _.without($scope.model, id);
                    $scope.names = _.without($scope.names, aname);
                } else {
                    $scope.model.push(id);
                    $scope.names.push(aname);
                }
                console.log($scope.model);
                $rootScope.suffer_selection_names = $scope.names;
				document.getElementById('suffers').value = $rootScope.suffer_selection_names;
                return false;
            };
            $scope.isChecked = function (id) {
                if (_.contains($scope.model, id)) {
                    return 'icon-ok pull-right';
                }
                return false;
            };
       }
   }
});










////////////////// discuss comments //////////////////////////////



//service
var discussService = byServices.factory('discussService', function(
		$resource) {
	var discussUrl = apiPrefix+'api/v1/discuss';
	var discussService = {}

	var myDiscussResource = $resource(discussUrl, {}, {
		getDiscussList : {
			method : 'GET',
			isArray : true,
		},
		getDiscussListOfType : {
			method : 'GET',
			isArray : true,
			params : {
				addln : '@type'
			}
		},
		update : {
			method : 'PUT'
		},

	})
	discussService.getDiscussList = function(query) {
		return myDiscussResource.getDiscussList(query);
	}

	discussService.saveDiscuss = function(discuss, callback) {
		return myDiscussResource.update(discuss, callback);
	}

	// / Discuss Comment
	var discussCommentUrl = apiPrefix+'api/v1/comment';
	var myDiscussCommentResource = $resource(discussCommentUrl, {}, {
		getDiscussCommentList : {
			method : 'GET',
			isArray : true
		},
		update : {
			method : 'PUT'
		}

	})

	discussService.getDiscussCommentList = function(query) {
		return myDiscussCommentResource.getDiscussCommentList(query);
	}

	discussService.save = function(query, callback) {

		return myDiscussCommentResource.update(query, callback);
	}

	return discussService;
});




byControllers.controller('DiscussCommentController', ['$scope', '$rootScope', '$route', '$routeParams', '$location', 'DiscussComment', 'Discuss',
  function($scope, $route, $rootScope, $routeParams, $location, DiscussComment, Discuss) {

	  	$scope.comment = new DiscussComment();
		$scope.newComment = $rootScope.newComment;

		$scope.saveComment  = function(){

			var htmlval = tinyMCE.activeEditor.getContent();
		    newComment.discussCommenContent = htmlval;
		    newComment= false;
	}

	}]);


//controller
var commentController = function($scope, $rootScope, $routeParams, DiscussShow, DiscussComment, discussService) {
	var commentController = {};
	$scope.discussType = '';
	//???$scope.appState = stateService.appState;
	$scope.newEditDiscuss = false;
	$scope.discussList = false;

	var discussId = $routeParams.discussId;

    $scope.discuss = DiscussShow.get({discussId: discussId});

	// Discuss Comment
	$scope.newDiscussComment = false;

	$scope.createCommentOnDiscuss = function(discussId, discussType) {
		//???var curDiscuss = $scope.discussList[index];
		
		var curDiscuss = DiscussShow.get({discussId: discussId});
		$scope.newDiscussComment = {
			userId : $rootScope.bc_userId,
			discussId : curDiscuss.id,
			parentId : '',
			discussCommentTitle : 'Please make your comment ',
			discussCommentType : discussType == 'Q' ? 'A' : 'C'
		}
	}

	$scope.resetNewDiscussComment = function() {
		$scope.newDiscussComment = false;
	}

	$scope.saveDiscussComment = function(discussId, discussType) {
		

		var htmlval = tinyMCE.activeEditor.getContent();
		$scope.newDiscussComment = new DiscussComment();

			$scope.newDiscussComment.userId = $rootScope.bc_userId,
			$scope.newDiscussComment.discussId = discussId;
			$scope.newDiscussComment.parentId = '';
			$scope.newDiscussComment.discussCommentTitle = '';
			$scope.newDiscussComment.discussCommentType = discussType == 'Q' ? 'A' : 'C';

			$scope.newDiscussComment.discussType = discussType;
			$scope.newDiscussComment.discussCommenContent=htmlval;

			

			discussService.save($scope.newDiscussComment, function() {
				$scope.newDiscussComment = false;
				var query = {
					parentId : $scope.newDiscussComment.parentId,
					ancestorId : $scope.newDiscussComment.ancestorId
				}
			//?????????$scope.commentList = discussService.getDiscussCommentList(query);
		})
	}


	/*
	$scope.getComments = function(index) {
		var query = {
			discussId : $scope.discussList[index].id,
		}
		$scope.commentList = discussService.getDiscussCommentList(query);
	}

	$scope.getCommentsTree = function(index) {
		var query = {
			ancestorId : $scope.discussList[index].id,
		}
		$scope.commentList = discussService.getDiscussCommentList(query);
	}

	$scope.createCommentOnComment = function(index) {
		var curComment = $scope.commentList[index];
		$scope.newDiscussComment = {
			userId : $scope.appState.loggedInUser.id,
			discussId : curComment.discussId,
			parentId : curComment.id,
			discussCommentTitle : 'Please make your comment ',
			discussCommentType : 'C'
		}
	}

	$scope.getCommentsOnComment = function(index) {
		var curComment = $scope.commentList[index];
		var query = {
			parentId : curComment.id,
		}
		$scope.commentList = discussService.getDiscussCommentList(query);
	}
	$scope.getCommentsOnCommentTree = function(index) {
		var curComment = $scope.commentList[index];
		var query = {
			parentId : curComment.id,
			ancestorId : curComment.ancestorId
		}
		$scope.commentList = discussService.getDiscussCommentList(query);
	}
	*/
	return commentController;
};

byControllers.controller('CommentController', commentController);




