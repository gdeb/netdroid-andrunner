/*jslint node: true */
'use strict';

angular.module('netdroid', [
	'ngRoute', 
	'authentication', 
    'navbar',
	'homeScreen', 
	'cardsScreen', 
	'decksScreen',
    'lobbyScreen',
    'profileScreen',
]);

require('./sessionService.js');
require('./mainCtrl.js');

angular.module('netdroid').config(['$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode(true);
}]);

angular.module('netdroid').run(function () {
	document.getElementsByTagName('body')[0].style.display = 'block';
});