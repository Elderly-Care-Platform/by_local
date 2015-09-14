var reloadDone = false;
var apiPrefix = "";

var byServices = angular.module("byServices", ["ngResource"]);
var byControllers = angular.module("byControllers", []);

var byApp = angular.module('byApp', [
 	"byControllers",
 	"byServices",
 	"ngRoute",
 	'ngSanitize',
 	'ngGoogleLocation',
 	'infinite-scroll'
 ]);

byApp.config(function($locationProvider) {
	  $locationProvider.hashPrefix('!');
	});

//Routing and Session Check for Login
byApp.run(function($rootScope, $location,$window, SessionIdService, discussCategoryList,$http, broadCastMenuDetail) {
	if(window.localStorage){
		$http.defaults.headers.common.sess = localStorage.getItem("SessionId");
		$http.get("api/v1/users/validateSession").success(function (response) {
        }).error(function(err){
        	$http.defaults.headers.common.sess = "";
        	SessionIdService.setSessionId("");
        	BY.byUtil.inValidateSession();
        })
	}

    // register listener to watch route changes
    $rootScope.$on("$routeChangeStart", function(event, next, current) {
    	$window.ga('send', 'pageview', { page: $location.url() });
    	window.scrollTo(0, 0);
        BY.removeEditor();
        BY.editorCategoryList.resetCategoryList();
		//For any location other than search, wipe out the search term
		if($location.path().indexOf('/search/') == -1)
        	$rootScope.term = '';

		//Menu should not be reset, if same menu id is selected as it create problem in iPad
		if(next && next.params && next.params.menuId){
			broadCastMenuDetail.setMenuId({"routeParamMenuId":next.params.menuId});
		}else{
			broadCastMenuDetail.setMenuId(0);
		}

    });

	window.fbAsyncInit = function() {
		// Executed when the SDK is loaded

		FB.init({

			appId: '475153235986093',
			//appId: 1503191563249716,
			xfbml: true,
			version    : 'v2.3'
		});

		//sAuth.watchAuthenticationStatusChange();

	};

	(function(d, s, id){
		var js, fjs = d.getElementsByTagName(s)[0];
		if (d.getElementById(id)) {return;}
		js = d.createElement(s); js.id = id;
		js.src = "//connect.facebook.net/en_US/sdk.js";
		fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));
});



// Logout Controller
byControllers.controller('LogoutController', ['$scope', '$location', '$rootScope' ,'$http','SessionIdService',
function ($scope,$location, $rootScope, $http,SessionIdService) {

	if($rootScope.sessionId != '') {
			   $location.path("/users/login");
	}
	$http.get(apiPrefix + "api/v1/users/logout");
	$rootScope.sessionId = undefined;
	$rootScope.bc_discussType = '';
	$rootScope.bc_username = '';
	$rootScope.bc_userId = '';

	SessionIdService.setSessionId("");
	BY.byUtil.inValidateSession();
	$http.defaults.headers.common.sess = "";

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



	};
	
	$scope.trustForcefully = function(html) {
		return $sce.trustAsHtml(html);
	};


 }]);


/****************  LOAD JS Controller = required for pages that require the custom.js functionality ********************/
/***************** Can be later refactored to a separate app.js file ***************************************************/

byControllers.controller('LoadCustomJSController', ['$scope',
        function($scope) {}]);



/***************** END LOAD JS CONTROLLER ******************************************************************************/



