angular.module('webApp').directive('fwSetSidebarEnabledFromState',
  function ($state, uiRouterConstants) {
    'use strict';

    return {
      restrict: 'A',
      link:function (scope, element/*, attrs*/) {

        var apply = function(state){
          if(state.data && state.data.navigationHidden){
            element.addClass('navigation-hidden');
          } else {
            element.removeClass('navigation-hidden');
          }
        };

        apply($state.current);

        scope.$on(uiRouterConstants.stateChangeSuccessEvent, function(event, toState/*, toParams, fromState, fromParams*/) {
          apply(toState);
        });
      }
    };
  });
