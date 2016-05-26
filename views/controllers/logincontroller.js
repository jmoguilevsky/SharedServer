var userApp = angular.module('userApp', []);

userApp.controller('LoginController',function ($scope, $http, $window) {
	$scope.userForm = {};

	$scope.login = function() {
		$http.post('/login', {
			"user": $scope.userForm
		})
		.success(function(data) {
	            $scope.user = data;
	            //console.log(data);
	            $window.location.href = '/';
            })
		.error(function(data) {
			console.log('Error: ' + data);
		});
	};
});