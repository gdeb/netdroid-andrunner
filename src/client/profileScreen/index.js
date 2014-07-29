/*jslint node: true */
'use strict';

angular.module('profileScreen', []);

require('./profileCtrl.js');

angular.module('profileScreen').config(['$routeProvider', 'access_levels', function($routeProvider, access) {

    $routeProvider.
        when('/profile', {
            templateUrl: 'templates/partial-profile.html',
            controller: 'profileController',
            access: access.user,
        });
}]);

