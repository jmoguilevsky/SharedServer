var userApp = angular.module('userApp', []);

function loginController($scope, $http) {
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
}



userApp.controller('UserListController',function ($scope, $http) {
	
	$http.get('/users')
		.success(function(data) {
			$scope.users = data.users;
			console.log(data.users);
		})
		.error(function(data) {
			console.log('Error: ' + data);
	});

});