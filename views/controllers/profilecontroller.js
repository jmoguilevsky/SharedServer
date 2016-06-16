var userApp = angular.module('userApp', []);
function getDistinctElements(interests) {
	var unique = {};
	var distinct = [];
	for( var i in interests ){
		if( typeof(unique[interests[i].category]) == "undefined"){
			distinct.push(interests[i].category);
		}
		unique[interests[i].category] = 0;
	}
	return distinct;
}

userApp.controller('ProfileController', function ($scope, $http, $window) {
	var re = /[^\/].*[\/]([0-9]*)+/; 

	var idUser =$window.location.href.split(re)[1];
	var originalUser = {};
	console.log(idUser);


	$http.get('/users/'+ idUser)
	.success(function(data) {
		$scope.user = data.user;
		originalUser = jQuery.extend(true, {}, $scope.user);
		console.log(data.user);
	})
	.error(function(data) {
		console.log('Error: ' + data);
	});

	$http.get('/interests/')
	.success(function(data) {
		$scope.allInterests = data.interests;
		$scope.categories = getDistinctElements(data.interests);
		console.log($scope.categories);
	})
	.error(function(data) {
		console.log('Error: ' + data);
	});	

	$scope.editUser = function() {
		console.log("posting data...");
		var newUser = $scope.user;
		console.log(newUser);
		$http.put('/users/'+ idUser, { 
			user: newUser,
			metadata: {
				version: 0.1	
			}
		})
		.success(function(){ 
			$window.location.reload(); 
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
	};

	$scope.removeInterest = function (index) {
		console.log(index);
		console.log(JSON.stringify($scope.user.interests));
		$scope.user.interests.splice(index,1);
		console.log(JSON.stringify($scope.user.interests));
	}

	$scope.cancelEdit = function () {
		$scope.user = jQuery.extend(true, {}, originalUser);
	}
});