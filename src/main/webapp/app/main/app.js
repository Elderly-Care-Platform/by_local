define([
	'angular',
	'angularRoute',
	'../main/appRoute',
	'../components/menu/mainMenuController', 'LoginController', 'angularResource','byResource', 'angularInfiniteScroll',
	'angularGoogleLocation', 'byEditor', 'productConfig', 'productResources','angularCache',
], function(angular, angularRoute, appRoute, MainMenuController, LoginController, angularResource, byResource,
			angularInfiniteScroll, angularGoogleLocation, byEditor, productConfig, productResources, angularCache) {
	var byApp = angular.module('byApp', ["ngRoute", "ngResource","byServices", "byProductResources", "infinite-scroll", "ngGoogleLocation", "jmdobry.angular-cache"]);


	byApp.config(['$controllerProvider', function($controllerProvider){
		byApp.registerController = $controllerProvider.register;
	}]);

	byApp.config(appRoute);
	byApp.config(function($locationProvider) {
		$locationProvider.hashPrefix('!');
	});

	byApp.controller('MainMenuController', MainMenuController);
	byApp.controller('LoginController', LoginController);
	productConfig(byApp);

	byApp.filter('encodeUri', function encodeUri($window) {
		return function(value) {
			try {
				return $window.encodeURIComponent(JSON.stringify(value));
			} catch (e) {
				return $window.encodeURIComponent(value);
			}
		};
	});

	byApp.run(function($rootScope, $location, $window, SessionIdService, discussCategoryList, $http, broadCastMenuDetail) {
		if(window.localStorage){
			//$http.defaults.headers.common.sess = localStorage.getItem("SessionId");
			$http.get("api/v1/users/validateSession").success(function (response) {
			}).error(function(err){
				//$http.defaults.headers.common.sess = "";
				SessionIdService.setSessionId("");
				BY.byUtil.inValidateSession();
			})
		}

		// register listener to watch route changes
		$rootScope.$on("$routeChangeStart", function(event, next, current) {
                        $window.ga('send', 'pageview', { page: $location.url() });
			window.scrollTo(0, 0);
			BY.byEditor.removeEditor();
			BY.byEditor.editorCategoryList.resetCategoryList();
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

	return byApp;
});


