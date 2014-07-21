console.log('test home angular');

var netdroid = angular.module('netdroid', ['ngRoute']);

netdroid.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'partials/test-partial1.html',
        controller: 'test'
      }).
      when('/login', {
        templateUrl: 'partials/test-partial2.html',
        controller: 'test'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);


netdroid.controller('test', function($scope) {
	$scope.demo = 'hello from test.js. Fuck Milgrom!';
});
