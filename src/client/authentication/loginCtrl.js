/*jslint node: true */
'use strict';

angular.module('authentication').controller('LoginController', function ($scope, authService) {
    $scope.data = {};

    $scope.processForm = function () {
        authService.login($scope.data);
    };
});

//-----------------------------------------------------------------------------
