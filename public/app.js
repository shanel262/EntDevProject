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
		.when('/addModule', {
			templateUrl: 'partials/addModule.html'
		})
		.otherwise({
			redirectTo: "/login"
		})
	}
])

// .run(function($rootScope, $location){
// 	$rootScope.$on('$routeChangeStart', function(event, nextRoute, currentRoute){
// 		console.log('LOGGED IN USER:', $rootScope.loggedInUser.username)
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
	$rootScope.loggedInUser = {
		id: '58ef6387f853ef755eeefa15',
		name: 'Shane Lacey',
		username: 'shanel262',
		role: 'Lecturer'
	}
	$scope.modules = []
	console.log('loggedInUser at home:', $rootScope.loggedInUser)
	function getModules(){
		HomeService.getModules($rootScope.loggedInUser.id).then(function(res){
			console.log('RES:', res)
			$scope.modules = res.data
		})
	}
	getModules()
}])

entDev.factory('HomeService', ["$location", "$http", function($location, $http){
	return {
		getModules: function(userId){
			console.log('GETTING MODULES', userId)
			return $http({
				method: 'GET',
				url: '/api/modules/getModules/' + userId
			})
			.success(function(res){
				console.log('Successful retrieval;', res)
				return res
			})
			.error(function(res){
				console.log('Failed retrieval:', res)
				return res
			})
		}
	}
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
			$rootScope.loggedInUser = {
				id: res._id,
				username: res.username,
				name: res.name,
				role: res.name
			}
			// $rootScope.loggedInUser = res.username
			console.log('loggedInUser:', $rootScope.loggedInUser)
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

//Home
entDev.controller('ModuleController', ["$scope", "ModuleService", "$rootScope", function($scope, ModuleService, $rootScope){
	$rootScope.failed = false
	$scope.addModule = function(){
		if($scope.module.hidden == undefined){
			$scope.module.hidden = false
		}
		$scope.module.lecturer = $rootScope.loggedInUser.id
		console.log('ADDING MODULE:', $scope.module)
		addModule($scope.module)
	}
}])

entDev.factory('ModuleService', ["$location", "$http", function($location, $http){
	addModule = function(module){
		$http({
			method: 'POST',
			url: '/api/modules/addModule',
			data: module
		})
		.success(function(res){
			console.log('Successfully added:', res)
			$location.path('/home')
		})
		.error(function(res){
			console.log('Failed to add:', res)
			$rootScope.failed = true
		})
	}
	// return {

	// }
}])
