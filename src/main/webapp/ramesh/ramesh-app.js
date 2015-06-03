/**
 * 
 */

var rameshApp = angular.module('rameshApp', [ 'rameshServices',
		'rameshControllers' ]);

rameshApp.config([ '$routeProvider', function($routeProvider) {
	$routeProvider.when('/topic', {
		templateUrl : 'partials/topics.html',
		controller : 'topicController'
	}).when('/user', {
		templateUrl : 'partials/user.html',
		controller : 'userController'
	}).when('/discuss', {
		templateUrl : 'partials/discuss.html',
		controller : 'discussController'
	}).otherwise({
		redirectTo : '/'
	});
} ]);
