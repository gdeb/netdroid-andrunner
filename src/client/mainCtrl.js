/*jslint node: true */
'use strict';

angular.module('netdroid').controller('MainCtrl', function ($location, chatFactory, access_levels, authService) {
    this.location = $location;
    this.chat = chatFactory;
    this.access = access_levels;
    this.user = authService.user;
});