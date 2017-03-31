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

// .run(function($rootScope, $location){
// 	$rootScope.$on('$routeChangeStart', function(event, nextRoute, currentRoute){
// 		console.log('LOGGED IN USER:', $rootScope.loggedInUser)
// 		console.log('NEXTROUTE:', $location.path())
// 		// console.log('CURRENTROUTE:', currentRoute.$$route.originalPath)
// 		if($rootScope.loggedInUser == null){
// 			if($location.path() != '/register'){
// 				if($location.path() != '/login'){
// 					$location.path('/login')
// 				}
// 			}
// 		}
// 	})
// })

//Home
entDev.controller('HomeController', ["$scope", "HomeService", "$rootScope", function($scope, HomeService, $rootScope){
	$scope.test = $rootScope.loggedInUser
}])

entDev.factory('HomeService', ["$location", "$http", function($location, $http){
	// return {
		
	// }
}])

//Users
entDev.controller('UsersController', ["$scope", "UsersService", "$rootScope", function($scope, UsersService, $rootScope){
	$scope.login = function(){
		login($scope.user)
	}
	$scope.register = function(){
		register($scope.user)
	}
}])

entDev.factory('UsersService', ["$location", "$http", "$rootScope",function($location, $http, $rootScope){
	$rootScope.loggedInUser = null
	login = function(user){
		console.log('Logging in:', user)
		$http.post('/api/users/login', user).then(function(res){
			if(res.status !== 200){
				console.log('ERROR:', err)
			}
			else{
				console.log('LOGIN RES:', res)
				$rootScope.loggedInUser = res.data.username
				$location.path('/home')
			}
		})
	}
	register = function(user){
		console.log('Registering user:', user)
		$http.post('/api/users/register', user).then(function(res){
			if(res.status !== 201){
				console.log('ERROR:', err)
			}
			else{
				console.log('REGISTER RES:', res)
				$location.path('/login')
			}
		})
	}
	// return {
		
	// }
}])