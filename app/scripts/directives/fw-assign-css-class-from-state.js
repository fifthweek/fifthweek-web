angular.module('webApp').directive('fwAssignCssClassFromState',
  function ($state) {
  'use strict';

  return {
    restrict: 'A',
    link:function (scope, element/*, attrs*/) {

      var addClass = function(state){
        if(state.data && state.data.bodyClass){
          element.addClass(state.data.bodyClass);
        }
      };

      var removeClass = function(state){
        if(state.data && state.data.bodyClass){
          element.removeClass(state.data.bodyClass);
        }
      };

      addClass($state.current);

      var removeListener = scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState/*, fromParams*/) {
        removeClass(fromState);
        addClass(toState);
      });

      element.on('$destroy', function() {
        removeListener();
      });
    }
  };
});
