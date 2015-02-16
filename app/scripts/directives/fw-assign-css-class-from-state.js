angular.module('webApp').directive('fwAssignCssClassFromState',
  function ($state, uiRouterConstants) {
  'use strict';

  return {
    restrict: 'A',
    link:function (scope, element) {

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

      var removeListener = scope.$on(uiRouterConstants.stateChangeSuccessEvent, function(event, toState, toParams, fromState/*, fromParams*/) {
        removeClass(fromState);
        addClass(toState);
      });

      element.on('$destroy', function() {
        removeListener();
      });
    }
  };
});
