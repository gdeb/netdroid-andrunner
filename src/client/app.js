/*jslint node: true */
'use strict';

require('angular');
require('angular-route');
require('angular-cookies');

angular.module('netdroid', [
	'ngRoute', 
	'authentication', 
    'navbar',
    'chat',
	'viewHome', 
	'viewCards', 
	'viewDecks',
    'viewLobby',
    'viewProfile',
    'websocket'
]);

require('./mainCtrl.js');
require('./authentication');
require('./navbar');
require('./websocket');
require('./chat');
require('./viewHome');
require('./viewCards');
require('./viewDecks');
require('./viewLobby');
require('./viewProfile');

angular.module('netdroid').config(['$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode(true);
}]);

// angular.module('netdroid').run(function () {
// 	document.getElementsByTagName('body')[0].style.display = 'block';
// });

