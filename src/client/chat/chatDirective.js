
angular.module('chat').directive('anrChat', function () {
    return {
        restrict: 'A',
        link: (scope, element, attrs) => element[0].focus()
    };    
});

