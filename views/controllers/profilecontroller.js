var userApp = angular.module('userApp', []);

userApp.controller('ProfileController',function ($scope, $http, $window) {
	var re = /[^\/].*[\/]([0-9]*)+/; 

	var idUser =$window.location.href.split(re)[1];
	console.log(idUser);


	$http.get('/users/'+ idUser)
	.success(function(data) {
		$scope.user = data.user;
		console.log(data);
		console.log(data.user);
	})
	.error(function(data) {
		console.log('Error: ' + data);
	});
});