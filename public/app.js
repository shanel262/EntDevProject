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
		.when('/module/:_id', {
			templateUrl: 'partials/module.html'
		})
		.when('/module/:_id/addSection', {
			templateUrl: 'partials/addSection.html'
		})
		.when('/module/:_id/importSection', {
			templateUrl: 'partials/importSection.html'
		})
		.otherwise({
			redirectTo: "/home"
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
	$rootScope.loggedInUser = {
		id: '58ef6387f853ef755eeefa15',
		name: 'Shane Lacey',
		username: 'shanel262',
		role: 'Lecturer'
	}
	$scope.modules = []
	function getModules(){
		if($rootScope.loggedInUser){
			HomeService.getModules($rootScope.loggedInUser.id).then(function(res){
				$scope.modules = res.data
			})			
		}
	}
	getModules()
}])

entDev.factory('HomeService', ["$location", "$http", function($location, $http){
	return {
		getModules: function(userId){
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
		$scope.$apply()
		$route.reload()
	}
}])

entDev.factory('UsersService', ["$location", "$http", "$rootScope",function($location, $http, $rootScope){
	$rootScope.loggedInUser = null
	login = function(user){
		$http({
			method: 'POST',
			url: '/api/users/login',
			data: user 
		})
		.success(function(res){
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

//Add module
entDev.controller('AddModuleController', ["$scope", "AddModuleService", "$rootScope", function($scope, AddModuleService, $rootScope){
	$rootScope.failed = false
	$scope.addModule = function(){
		if($scope.module.hidden == undefined){
			$scope.module.hidden = false
		}
		$scope.module.lecturer = $rootScope.loggedInUser.id
		addModule($scope.module)
	}
}])

entDev.factory('AddModuleService', ["$location", "$http", function($location, $http){
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
			$rootScope.errorMsg = res
		})
	}
	// return {

	// }
}])

//Module
entDev.controller('ModuleController', ["$scope", "ModuleService", "SectionService","$rootScope", "$routeParams", function($scope, ModuleService, SectionService,$rootScope, $routeParams){
	$rootScope.failed = false
	$scope.sections = []
	ModuleService.getModuleTopics($routeParams._id).then(function(res){
		$scope.name = res.data.name
		$scope.id = res.data._id
		var sections = []
		for(var i=0; i < res.data.sections.length; i++){
			sections.push(res.data.sections[i]._id)
		}
		ModuleService.getSections(sections).then(function(res){
			console.log('RES2:', res.data)
			$scope.sections = res.data
		})
	})
	$scope.addSection = function(){
		$scope.section.moduleId = $routeParams._id
		addSection($scope.section)
	}
	$scope.downloadFile = function(fileId){
		console.log('downloadFile:', fileId)
		downloadFile(fileId)
	}
	$scope.unlink = function(sectionId){
		console.log('sectionId:', sectionId.toString())
		unlink(sectionId.toString())
	}
}])

entDev.factory('ModuleService', ["$location", "$http", function($location, $http){
	return {
		getModuleTopics: function(moduleId){
			return $http({
				method: 'GET',
				url: '/api/modules/getModule/' + moduleId
			})
			.success(function(res){
				console.log('Successful retrieval:', res)
				return res
			})
			.error(function(res){
				console.log('Failed retrieval:', res)
				return res
			})
		},
		getSection: function(_id){
			return $http({
				method: 'GET',
				url: '/api/sections/getSection/' + _id
			})
			.success(function(res){
				console.log('Successfully retrieved section:', res)
				return res
			})
			.error(function(res){
				console.log('Failed to retrieve section:', res)
				return res
			})
		},
		getSections: function(sections){
			return $http({
				method: 'GET',
				url: '/api/sections/getSections',
				params: {
					sections: sections
				}
			})
			.success(function(res){
				console.log('Successfully retrieved section:', res)
				return res
			})
			.error(function(res){
				console.log('Failed to retrieve section:', res)
				return res
			})
		}
	}
}])

//Add section
entDev.factory('SectionService', ["$location", "$http", "$routeParams", function($location, $http, $routeParams){
	addSection = function(section){
		$http({
			method: 'POST',
			url: '/api/modules/addSection',
			data: section
		})
		.success(function(res){
			console.log('Successfully added:', res)
			$location.path('/module/' + $routeParams._id)
		})
		.error(function(res){
			console.log('Failed to add:', res)
			$rootScope.failed = true
			$rootScope.errorMsg = res
		})
	}
	downloadFile = function(fileId){
		$http({
			method: 'GET',
			url: '/api/sections/downloadFile/' + fileId
		})
		.success(function(res){
			console.log('Successfully downloaded:', res)
		})
		.error(function(res){
			console.log('Failed to download:', res)
		})
	}
	unlink = function(sectionId){
		console.log('UNLINK SERVICE:', sectionId)
		$http({
			method: 'GET',
			url: '/api/sections/unlink/' + sectionId 
		})
		.success(function(res){
			console.log('Successfully unlinked:', res)
		})
		.error(function(res){
			console.log('Failed to unlink:', res)
		})
	}
}])

entDev.controller('ImportController', ["$scope", "$location", "$http", "$rootScope", "HomeService", function($scope, $location, $http, $rootScope, HomeService){
	$rootScope.loggedInUser = {
		id: '58ef6387f853ef755eeefa15',
		name: 'Shane Lacey',
		username: 'shanel262',
		role: 'Lecturer'
	}
	$scope.modules = []
	HomeService.getModules($rootScope.loggedInUser.id).then(function(res){
		$scope.modules = res.data
	})
}])

entDev.factory('ImportService', ["$location", "$http", function($location, $http){
	return {
	}
}])
