var entDev = angular.module('EntDev', ['ngRoute']);

entDev.config(['$routeProvider',
	function($routeProvider){
		$routeProvider
		.when('/', {
			templateUrl: 'partials/home.html'
		})
		.otherwise({
			redirectTo: "/"
		})
	}
])

//Home
entDev.controller('HomeController', ["$scope", "HomeService", function($scope, HomeService){
	$scope.test = "test string"
}])

entDev.factory('HomeService', ["$location", "$http", function($location, $http){
	// return {
		
	// }
}])