angular.module('FormUpload').controller('searchAllEmployeeCntrl', ['$scope', '$http', '$window', function ($scope, $http, $window) {
	$scope.search = function() {
		$http.get('/checkAvailability').then(function (response) {
			console.log('Data found in collection')
			$scope.errorSearchAll = ''
			$window.location = '/searchAll'
		}, function (response) {
			console.log('Error occured')
			$scope.errorSearchAll = 'No employee details are found'
		});
	}
}]);