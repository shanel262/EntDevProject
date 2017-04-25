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
		.when('/module/:_id/editStudents', {
			templateUrl: 'partials/editStudents.html'
		})
		.otherwise({
			redirectTo: "/home"
		})
	}
])

.run(function($rootScope, $location, UsersService){
	$rootScope.$on('$routeChangeStart', function(event, nextRoute, currentRoute){
		var check = isLoggedIn()
		if(check){
			if($location.path() == '/register'){
				$location.path('/home')
			}
			else if($location.path() == '/login'){
				$location.path('/home')
			}
		}
		else{
			console.log('No logged in user: Redirect')
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
	$scope.modules = []
	function getModules(){
		if($rootScope.loggedInUser){
			if($rootScope.loggedInUser.role == 'Lecturer'){
				HomeService.getModulesLecturer($rootScope.loggedInUser.id).then(function(res){
					$scope.modules = res.data
				})							
			}
			else if($rootScope.loggedInUser.role == 'Student'){
				HomeService.getModulesStudent($rootScope.loggedInUser.id).then(function(res){
					$scope.modules = res.data
				})							
			}
		}
	}
	getModules()
}])

entDev.factory('HomeService', ["$location", "$http", function($location, $http){
	return {
		getModulesLecturer: function(userId){
			return $http({
				method: 'GET',
				url: '/api/modules/getModulesLecturer/' + userId
			})
			.success(function(res){
				return res
			})
			.error(function(res){
				console.log('Failed retrieval:', res)
				return res
			})
		},
		getModulesStudent: function(userId){
			return $http({
				method: 'GET',
				url: '/api/modules/getModulesStudent/' + userId
			})
			.success(function(res){
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
entDev.controller('UsersController', ["$scope", "UsersService", "$rootScope", "$route", "$window", function($scope, UsersService, $rootScope, $route, $window){
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
		$rootScope.loggedInUser = null
		$window.localStorage.setItem('id', null)
		$window.localStorage.setItem('username', null)
		$window.localStorage.setItem('role', null)
		$window.localStorage.setItem('token', null)
		$route.reload()
	}
}])

entDev.factory('UsersService', ["$location", "$http", "$rootScope", "$window", function($location, $http, $rootScope, $window){
	$rootScope.loggedInUser = null
	login = function(user){
		$http({
			method: 'POST',
			url: '/api/users/login',
			data: user 
		})
		.success(function(res){
			var payload = res.token.split('.')[1]
			payload = window.atob(payload)
			payload = JSON.parse(payload)
			$rootScope.loggedInUser = {
				id: payload._id,
				username: payload.username,
				name: payload.name,
				role: payload.role
			}
			$window.localStorage.setItem('id', payload._id)
			$window.localStorage.setItem('username', payload.username)
			$window.localStorage.setItem('role', payload.role)
			$window.localStorage.setItem('token', res.token)
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
			$rootScope.failed = false
			$location.path('/login')
		})
		.error(function(res){
			console.log('Failed registration:', res)
			$rootScope.failed = true
		})
	}
	isLoggedIn = function(){
		var token = window.localStorage.getItem('token')
		var payload
		if(token != 'undefined' && token != 'null'){
			payload = token.split('.')[1]
			payload = window.atob(payload)
			payload = JSON.parse(payload)
			$rootScope.loggedInUser = {
				id: payload._id,
				name: payload.name,
				username: payload.username,
				role: payload.role
			}
			return true
		}
		else{
			return false
		}
	}
	return {
		isLoggedIn: isLoggedIn
	}
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
			$location.path('/home')
		})
		.error(function(res){
			console.log('Failed to add:', res)
			$rootScope.failed = true
			$rootScope.errorMsg = res
		})
	}
}])

//Module
entDev.controller('ModuleController', ["$scope", "ModuleService", "SectionService", "$rootScope", "$routeParams", "$window", function($scope, ModuleService, SectionService, $rootScope, $routeParams, $window){
	$rootScope.failed = false
	$scope.editSection = false
	if($rootScope.loggedInUser.role == 'Lecturer'){
		$scope.viewAsStudent = false
	}
	else if($rootScope.loggedInUser.role == 'Student'){
		$scope.viewAsStudent = true
	}
	$scope.sections = []
	ModuleService.getModuleTopics($routeParams._id).then(function(res){
		$scope.name = res.data.name
		$scope.id = res.data._id
		var sections = []
		for(var i=0; i < res.data.sections.length; i++){
			sections.push(res.data.sections[i]._id)
		}
		$scope.sectionsInModule = res.data.sections
		var sectionsInModule = res.data.sections
		ModuleService.getSections(sections).then(function(res){
			res.data.forEach(function(section){
				sectionsInModule.forEach(function(secInMod){
					if(secInMod._id == section._id){
						section.index = secInMod.index
					}
				})
			})
			$scope.index = 'index'
			$scope.sections = res.data
		})
	})
	$scope.addSection = function(){
		$scope.section.moduleId = $routeParams._id
		if($scope.section.hidden == undefined){
			$scope.section.hidden = false
		}
		addSection($scope.section)
	}
	$scope.downloadFile = function(fileId){
		downloadFile(fileId)
	}
	$scope.unlink = function(sectionId){
		var confirmation = $window.confirm('Are you sure?')
		if(confirmation){
			var modAndSec = {
				modId: $routeParams._id,
				secId: sectionId
			}
			unlink(modAndSec)			
		}
	}
	$scope.show = function(sectionId){
		var section = { sectionId: sectionId }
		show(section)
	}
	$scope.hide = function(sectionId){
		var section = { sectionId: sectionId }
		hide(section)
	}
	$scope.edit = function(){
		if($scope.editSection == false){$scope.editSection = true}
	}
	$scope.save = function(){
		if($scope.editSection == true){$scope.editSection = false}
	}
	$scope.deleteFile = function(secId, fileId){
		var secAndFile = {
			secId: secId,
			fileId: fileId
		}
		deleteFile(secAndFile)
	}
	$scope.changeView = function(){
		if($scope.viewAsStudent){
			$scope.viewAsStudent = false
		}
		else{
			$scope.viewAsStudent = true
		}
	}
	$scope.deleteSection = function(sectionId, moduleId){
		var confirm = $window.confirm('Are you sure?')
		if(confirm){
			var section = {
				sectionId: sectionId,
				moduleId: moduleId
			}
			deleteSection(section)			
		}
	}
	$scope.deleteModule = function(moduleId){
		var confirm = $window.confirm('Are you sure?')
		if(confirm){
			var module = {moduleId: moduleId}
			deleteModule(module)
		}
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
entDev.factory('SectionService', ["$location", "$http", "$routeParams", "$window", "$rootScope", function($location, $http, $routeParams, $window, $rootScope){
	addSection = function(section){
		$http({
			method: 'POST',
			url: '/api/modules/addSection',
			data: section
		})
		.success(function(res){
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
	deleteFile = function(secAndFile){
		$http({
			method: 'POST',
			url: '/api/sections/deleteFile',
			data: secAndFile
		})
		.success(function(res){
			window.location.reload()
		})
		.error(function(res){
			console.log('Failed to delete:', res)
		})
	}
	unlink = function(modAndSec){
		$http({
			method: 'POST',
			url: '/api/sections/unlink',
			data: modAndSec 
		})
		.success(function(res){
			window.location.reload()
		})
		.error(function(res){
			console.log('Failed to unlink:', res)
		})
	}
	show = function(sectionId){
		$http({
			method: 'POST',
			url: '/api/sections/show',
			data: sectionId
		})
		.success(function(res){
			window.location.reload()
		})
		.error(function(res){
			console.log('Failed to change to show', res)
		})
	}
	hide = function(sectionId){
		$http({
			method: 'POST',
			url: '/api/sections/hide',
			data: sectionId
		})
		.success(function(res){
			window.location.reload()
		})
		.error(function(res){console.log('Failed to change to hide', res)})
	}
	deleteSection = function(section){
		$http({
			method: 'POST',
			url: '/api/modules/deleteSection',
			data: section
		})
		.success(function(res){
			window.location.reload()
		})
		.error(function(res){
			console.log('Failed to delete section:', res)
		})
	}
	deleteModule = function(module){
		$http({
			method: 'POST',
			url: '/api/modules/deleteModule',
			data: module
		})
		.success(function(res){
			$location.path('/home')
		})
		.error(function(res){
			console.log('Failed to delete module:', res)
		})
	}
}])

entDev.controller('ImportController', ["$scope", "$location", "$routeParams", "$rootScope", "HomeService", "ModuleService", "ImportService", function($scope, $location, $routeParams, $rootScope, HomeService, ModuleService, ImportService){
	var dontInclude = []
	var sections = []
	$scope.import= {}
	$scope.modId = $routeParams._id
	HomeService.getModulesLecturer($rootScope.loggedInUser.id)
	.then(function(res){
		$scope.modules = res.data
		for(var module = 0; module < res.data.length; module++){
			if(res.data[module]._id == $routeParams._id){
				res.data[module].sections.forEach(function(section){
					dontInclude.push(section._id)
				})
			}
		}
		for(var module = 0; module < res.data.length; module++){
			if(res.data[module]._id != $routeParams._id){
				for(var section = 0; section < res.data[module].sections.length; section++){
					if(!dontInclude.includes(res.data[module].sections[section]._id)){
						sections.push(res.data[module].sections[section]._id)
					}
				}
			}
		}
	})
	.then(function(){
		getSections()
	})
	var getSections = function(){
		ModuleService.getSections(sections).then(function(res){
			$scope.sections = res.data
		})
	}
	$scope.importSections = function(){
		var sectionIds = []
		Object.keys($scope.import).forEach(function(key){
			if($scope.import[key] == true){
				sectionIds.push(key)
			}
		})
		sectionIds.push($routeParams._id)
		importSections(sectionIds)
	}
}])

entDev.factory('ImportService', ["$location", "$http", "$routeParams", function($location, $http, $routeParams){
	importSections = function(sectionIds){
		$http({
			method: 'POST',
			url: '/api/modules/importSections',
			params: {
				sectionIds: sectionIds
			}
		})
		.success(function(res){
			$location.path('/module/' + $routeParams._id)
		})
		.error(function(res){
			console.log('Failed to import:', res)
		})
	}
}])

entDev.controller('EditStudentsController', ["$scope", "$http", "$routeParams", "$rootScope", "ModuleService", "EditStudentsServices", function($scope, $http, $routeParams, $rootScope, ModuleService, EditStudentsServices){
	$scope.modId = $routeParams._id
	ModuleService.getModuleTopics($scope.modId).then(function(res){
		$http({
			method: 'GET',
			url: '/api/users/getAllStudents',
		})
		.success(function(students){
			if(res.data.students.length > 0){
				students.forEach(function(student){
					res.data.students.forEach(function(studentOnModule){
						if(student._id == studentOnModule){
							student.enrolled = true
						}
					})
					if(!student.enrolled){
						student.enrolled = false
					}
				})
				$scope.students = students
			}
			else{
				students.forEach(function(student){
					student.enrolled = false
				})
				$scope.students = students
			}
		})
		.error(function(res){
			console.log('Failed to find all students', res)
		})		
	})

	$scope.addStudent = function(studentId){
		var student = {
			studentId: studentId,
			moduleId: $scope.modId
		}
		addStudent(student)
	}

	$scope.removeStudent = function(studentId){
		var student = {
			studentId: studentId,
			moduleId: $scope.modId
		}
		removeStudent(student)
	}
}])

entDev.factory('EditStudentsServices', ["$http", function($http){
	addStudent = function(student){
		$http({
			method: 'POST',
			url: '/api/modules/addStudent',
			data: student
		})
		.success(function(res){
			window.location.reload()
		})
		.error(function(res){
			console.log('Failed to add student', res)
		})
	}

	removeStudent = function(student){
		$http({
			method: 'POST',
			url: '/api/modules/removeStudent',
			data: student
		})
		.success(function(res){
			window.location.reload()
		})
		.error(function(res){
			console.log('Failed to remove student', res)			
		})

	}
}])
