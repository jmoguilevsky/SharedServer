var userApp = angular.module('userApp', []);



userApp.controller('ProfileController',function ($scope, $http, $routeParams) {
	$scope.user = {};

	$scope.getProfile = function() {
		console.log($routeParams.param1);
		$http.post('/getUser', {
			"user": $routeParams.param1;
		})
		.success(function(data) {
	            $scope.user = data;
            })
		.error(function(data) {
			console.log('Error: ' + data);
		});
	};
});