angular.module('webApp').directive('fwBlobImageSize',
  function () {
    'use strict';

    return {
      restrict: 'A',
      link:function (scope, element) {

        if(scope.width){
          element.attr('width', scope.width);
        }
        if(scope.height){
          element.attr('height', scope.height);
        }
      }
    };
  });
