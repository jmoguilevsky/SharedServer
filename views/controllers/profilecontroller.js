var userApp = angular.module('userApp', []);

userApp.controller('ProfileController',function ($scope, $http, $window) {
	var re = /[^\/].*[\/]([0-9]*)+/; 

	var idUser =$window.location.href.split(re)[1];
	console.log(idUser);


	$http.get('/users/'+ idUser)
		.success(function(data) {
			$scope.user = data.user;
			console.log(data.user);
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});

	$scope.postUser = function() {
		debugger;
        console.log("posting data...");
        var newUser = $scope.user;
        
        newUser.interests = '[';
        $scope.user.interests.each(function (interest) {
        	newUser.interests += JSON.stringify(interest) + ',';
        });
        if (newUser.interests.length > 1) {
        	newUser.interests = newUser.interests.substr(newUser.interests.length - 1);
        }
        newUser.interests += ']';

        console.log(newUser);
        $http.post('/users/'+ idUser, { 
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
});