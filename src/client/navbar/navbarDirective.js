/*jslint node: true */
'use strict';

angular.module('navbar').directive('anrNavbar', function () {
    return {
        restrict: 'E',
        templateUrl: 'templates/navbar.html',
    };    
});

