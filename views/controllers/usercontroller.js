var userApp = angular.module('userApp', []);


userApp.controller('UserListController',function ($scope, $http) {
	
	$http.get('/usersWithPhotos')
	.success(function(data) {
		$scope.users = data.users;
		console.log("data ");
		console.log(data.users);
	})
	.error(function(data) {
		console.log('Error: ' + data);
	});
});