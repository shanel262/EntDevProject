var entDev = angular.module('EntDev', ['ngRoute']);

entDev.config(['$routeProvider',
	function($routeProvider){
		$routeProvider
		.when('/home', {
			templateUrl: 'partials/home.html'
		})
		.when('/register', {
			templateUrl: 'partials/register.html'
		})
		.when('/login', {
			templateUrl: 'partials/login.html'
		})
		.otherwise({
			redirectTo: "/login"
		})
	}
])

.run(function($rootScope, $location){
	$rootScope.$on('$routeChangeStart', function(event, nextRoute, currentRoute){
		console.log('LOGGED IN USER:', $rootScope.loggedInUser)
		console.log('NEXTROUTE:', $location.path())
		// console.log('CURRENTROUTE:', currentRoute.$$route.originalPath)
		if($rootScope.loggedInUser == null){
			if($location.path() != '/register'){
				if($location.path() != '/login'){
					$location.path('/login')
				}
			}
		}
	})
})

//Home
entDev.controller('HomeController', ["$scope", "HomeService", "$rootScope", function($scope, HomeService, $rootScope){
	$scope.test = $rootScope.loggedInUser
}])

entDev.factory('HomeService', ["$location", "$http", function($location, $http){
	// return {
		
	// }
}])

//Users
entDev.controller('UsersController', ["$scope", "UsersService", "$rootScope", "$route", function($scope, UsersService, $rootScope, $route){
	$scope.roles = ["Student", "Lecturer"]
	$rootScope.failed = false
	$rootScope.errorMsg = ''
	$scope.login = function(){
		login($scope.user)
		$scope.user = ''
	}
	$scope.register = function(){
		register($scope.user)
	}
	$rootScope.logout = function(){
		console.log('LOGOUT')
		$rootScope.loggedInUser = null
		console.log('loggedInUser:', $rootScope.loggedInUser)
		$scope.$apply()
		$route.reload()
	}
}])

entDev.factory('UsersService', ["$location", "$http", "$rootScope",function($location, $http, $rootScope){
	$rootScope.loggedInUser = null
	login = function(user){
		console.log('Logging in:', user)
		$http({
			method: 'POST',
			url: '/api/users/login',
			data: user 
		})
		.success(function(res){
			console.log('LOGIN RES:', res)
			$rootScope.loggedInUser = res.username
			$rootScope.failed = false
			$location.path('/home')
		})
		.error(function(res){
			console.log('FAILED LOGIN:', res)
			$rootScope.errorMsg = res
			$rootScope.failed = true
		})
	}
	register = function(user){
		$http({
			method: 'POST',
			url: '/api/users/register',
			data: user 
		})
		.success(function(res){
			console.log('Successful registration:', res)
			$rootScope.failed = false
			$location.path('/login')
		})
		.error(function(res){
			console.log('Failed registration:', res)
			$rootScope.failed = true
		})
	}
	// return {
		
	// }
}])