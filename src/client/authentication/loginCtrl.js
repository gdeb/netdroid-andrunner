/*jslint node: true */
'use strict';

angular.module('authentication').controller('LoginController', function ($scope, authService, $location) {
    $scope.data = {};

    $scope.processForm = function () {
        authService.login($scope.data)
            .success(function (data) {
                if (data.result === 'success')
                    $location.path('/lobby');
                else
                    $scope.data = {};
            });
    };
});

//-----------------------------------------------------------------------------
