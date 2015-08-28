angular.module('MyApp', ['appRoutes','mainCtrl', 'authService', 'userCtrl', 'userService', 'storyService', 'storyCtrl'])

.config(function($httpProvider) {

	$httpProvider.interceptors.push('AuthInterceptor');
});

angular.module('appRoutes', ['ngRoute'])

.config(function($routeProvider, $locationProvider) {
	
	$routeProvider

	.when('/', {

		templateUrl: 'app/views/pages/home.html',
		controller: 'MainController',
		controllerAs: 'main'
	})

	.when('/login', {
		templateUrl: 'app/views/pages/login.html'

	})

	.when('/signup', {
		templateUrl: 'app/views/pages/signup.html'
	})

	$locationProvider.html5Mode(true);
})