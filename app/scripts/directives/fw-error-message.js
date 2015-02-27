angular.module('webApp').directive('fwErrorMessage', function () {
  'use strict';

  return {
    scope: {
      value: '=',
      class: '@'
    },
    templateUrl:'views/partials/error-message.html'
  };

});
