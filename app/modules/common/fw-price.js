angular.module('webApp')
  .directive('fwPrice', function () {
    'use strict';

    return {
      restrict: 'E',
      scope: {
        value: '='
      },
      template: '<span class="price">${{formattedPrice}}/week</span>',
      link: function(scope) {

        var updatePrice = function(){
          scope.formattedPrice = (scope.value /100).toFixed(2);
        };

        scope.$watch('value', updatePrice);
      }
    };
  });
