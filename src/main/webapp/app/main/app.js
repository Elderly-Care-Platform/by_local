define([
	'angular',
	'angularRoute',
	'byProductApp',
	'byAppRoute',
	'byResource',
	'byEditor',
	'angularResource',  'angularInfiniteScroll',
	'angularGoogleLocation',
	"byMenuCtrl", 'LoginController', 'headerCtrl', 'sharedContextService', 'errorService'
], function(angular, angularRoute, byProductApp, byAppRoute, byResource, byEditor,
			angularResource, angularInfiniteScroll, angularGoogleLocation,
			mainMenuController, LoginController, headerCtrl, sharedContextService, errorService) {

	var byApp = angular.module('byApp', ["ngRoute", "ngResource", "byServices", "byProductApp",
								"infinite-scroll", "ngGoogleLocation"]);


	byApp.config(['$controllerProvider', function($controllerProvider){
		byApp.registerController = $controllerProvider.register;
	}]);

	byApp.config(['$filterProvider', function($filterProvider){
		byApp.registerService = $filterProvider.register;
	}]);

	byApp.config(byAppRoute);
	byApp.config(function($locationProvider) {
		$locationProvider.hashPrefix('!');
	});

	byApp.controller('MainMenuController', mainMenuController);
	byApp.controller('LoginController', LoginController);
	byApp.controller('BYHeaderCtrl', headerCtrl);
	byApp.service('SharedContextService', sharedContextService);
	byApp.service('ErrorService', errorService);


	byApp.run(function($rootScope, $location, $window, SessionIdService, discussCategoryList, $http) {
		// register listener to watch route changes
		$rootScope.$on("$routeChangeStart", function(event, next, current) {
			$window.ga('send', 'pageview', { page: $location.url() });
			$("meta[name='robots']").attr("content", "index, follow");
			//window.scrollTo(0, 0);
			BY.byEditor.removeEditor();
			$rootScope.$broadcast('currentLocation', $location.path());

			//For any location other than search, wipe out the search term
			if($location.path().indexOf('/search/') == -1)
				$rootScope.term = '';

		});

		$rootScope.$on('$routeChangeError', function(event) {
			$location.path('/pageNotFound');
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

	return byApp;
});


