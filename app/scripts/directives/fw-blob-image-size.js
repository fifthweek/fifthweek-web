angular.module('webApp').directive('fwBlobImageSize',
  function () {
    'use strict';

    return {
      restrict: 'A',
      link:function (scope, element) {

        var isPending = element.hasClass('pending-image');

        if(isPending && scope.pendingWidth){
          element.css('width', scope.pendingWidth);
        }
        else if(scope.width){
          element.css('width', scope.width);
        }

        if(isPending && scope.pendingHeight){
          element.css('height', scope.pendingHeight);
        }
        else if(scope.height){
          element.css('height', scope.height);
        }

        if(scope.borderRadius){
          element.css('border-radius', scope.borderRadius);
        }
      }
    };
  });
