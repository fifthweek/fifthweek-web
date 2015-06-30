angular.module('webApp')
  .directive('fwPrice', function () {
    'use strict';

    return {
      restrict: 'E',
      scope: {
        value: '=',
        showInterval: '=?'
      },
      template: '<span class="price">${{formattedPrice}}{{showInterval ? \'/week\' : \'\'}}</span>',
      link: function(scope) {

        var updatePrice = function(){
          scope.formattedPrice = (scope.value /100).toFixed(2);
        };

        if(scope.showInterval === undefined){
          scope.showInterval = true;
        }

        scope.$watch('value', updatePrice);
      }
    };
  });
