angular.module('webApp').directive('fwBlobImageSize',
  function () {
    'use strict';

    return {
      restrict: 'A',
      link:function (scope, element) {

        if(scope.width){
          element.css('width', scope.width);
        }

        if(scope.height){
          element.css('height', scope.height);
        }

        if(scope.borderRadius){
          element.css('border-radius', scope.borderRadius);
        }
      }
    };
  });
