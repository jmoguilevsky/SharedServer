var userApp = angular.module('userApp', []);



userApp.controller('LoginController',function ($scope, $http, $window) {
	$scope.userForm = {};

	$scope.login = function() {
		console.log('');
		$http.post('/login', {
			email : $scope.userForm.email,
			password: $scope.userForm.password
		})
		.success(function(data) {
	            $scope.user = data;
	            //console.log(data);
	            //$window.location.href = '/';
            })
		.error(function(data) {
			console.log('Error: ' + data);
		});
		/*$http.post('https://enigmatic-depths-58073.herokuapp.com/login', $scope.userForm)
		.success(function(data) {
	            $scope.user = data;
	            console.log(data);
	            $window.location.href = '/';
            })
		.error(function(data) {
			console.log('Error: ' + data);
		});*/
		
	};

});