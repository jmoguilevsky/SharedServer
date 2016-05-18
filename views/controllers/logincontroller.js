var userApp = angular.module('userApp', []);



userApp.controller('LoginController',function ($scope, $http) {
	$scope.formData = {};

	$scope.login = function() {
		$http.post('/login', $scope.formData)
		.success(function(data) {
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.todos = data;
                console.log(data);
            })
		.error(function(data) {
			console.log('Error: ' + data);
		});
	};

});