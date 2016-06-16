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

function getDictionaryOfInterestsByCategory(interests) {
	var categories = {};
	interests.forEach(function (interest) {
		if ( typeof(categories[interest.category]) == "undefined") {
			categories[interest.category] = [interest.value];
		}else{
			categories[interest.category].push(interest.value);
		}
	});
	return categories;
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
	.success(function(newInterests) {
		$scope.selectedCategory = '';
		$scope.selectedValue = '';
		$scope.categories = getDistinctElements(newInterests.interests);
		$scope.dictInterestsByCategory = getDictionaryOfInterestsByCategory(newInterests.interests);
		console.log($scope.categories);
	})
	.error(function(newInterests) {
		console.log('Error: ' + interests);
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
		$scope.user.interests = jQuery.extend(true, {}, originalUser.interests);
		$scope.user.name = jQuery.extend(true, {}, originalUser.name);
		$scope.user.alias = jQuery.extend(true, {}, originalUser.alias);
		$scope.user.sex = jQuery.extend(true, {}, originalUser.sex);
	}

	$scope.selectCategory = function (category) {
		$scope.selectedCategory = category;
		$scope.selectedValue = '';
	}

	$scope.selectValue = function (value) {
		$scope.selectedValue = value;
	}

	$scope.addInterest = function () {
		$scope.user.interests.push({
			category: $scope.selectedCategory,
			value: $scope.selectedValue
		});
		$scope.selectedCategory = '';
		$scope.selectedValue = '';
	}
});