/*jslint node: true */
'use strict';

angular.module('netdroid').controller('main', function ($scope, $location, chatFactory) {
    $scope.location = $location;
    $scope.chat = chatFactory;
});