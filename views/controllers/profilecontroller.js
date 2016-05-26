var userApp = angular.module('userApp', []);

userApp.controller('ProfileController',function ($scope, $http) {
	$http.get('/getUser'{
			"user": 1;
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