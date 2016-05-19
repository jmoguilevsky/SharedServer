var userApp = angular.module('userApp', []);



userApp.controller('LoginController',function ($scope, $http) {
	$scope.userForm = {};

	$scope.login = function() {
		$http.post('https://enigmatic-depths-58073.herokuapp.com/login', $scope.userForm)
		.success(function(data) {
                $scope.user = data;
                console.log(data);
            })
		.error(function(data) {
			console.log('Error: ' + data);
		});
	};

});