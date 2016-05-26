var userApp = angular.module('userApp', []);

userApp.controller('ProfileController',function ($scope, $http, $routeParams) {
	$scope.user = {};

	$scope.get('/getUser'{
			"user": $routeParams.param1;
		})
	.success(function(data) {
		$scope.user = data.user;
		console.log("data");
		console.log(data.user);
	})
	.error(function(data) {
		console.log('Error: ' + data);
	});
});