angular.module('ng-focus', [])
  .directive('focus', function ($timeout) {
    'use strict';

    return function (scope, elem, attrs) {
      // Fix by using attrs.$observe instead of scope.$watch
      attrs.$observe('focus', function (newVal) {
        if (newVal) {
          $timeout(function () {
            elem[0].focus();
          }, 0, false);
        }
      });
    };
  });
