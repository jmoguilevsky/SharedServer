var userApp = angular.module('userApp', []);

userApp.controller('ProfileController',function ($scope, $http, $window) {
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

	$scope.editUser = function() {
        console.log("posting data...");
        var newUser = $scope.user;
        console.log(newUser);
        debugger;
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