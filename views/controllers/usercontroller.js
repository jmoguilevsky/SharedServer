var userApp = angular.module('userApp', []);

userApp.controller('UserListController',function ($scope, $http) {
	$http.get('/api/users')
        .success(function(data) {
            $scope.users = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

	/*$scope.users = [{
		"name":"joni",
		"alias":"el mago wimo"
	},{
		"name":"manu",
		"alias":"el doctor hibbert"
	}]*/
});