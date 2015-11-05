angular.module('webApp').directive('fwSetNavigationVisibilityFromState',
  function ($state, uiRouterConstants) {
    'use strict';

    return {
      restrict: 'A',
      link:function (scope, element/*, attrs*/) {

        var apply = function(state){
          if(state.data && state.data.navigationHidden){
            if(state.data.navigationHidden === 'header'){
              element.addClass('navigation-header-hidden');
              element.removeClass('navigation-hidden');
            }else{
              element.addClass('navigation-hidden');
              element.removeClass('navigation-header-hidden');
            }
          } else {
            element.removeClass('navigation-hidden');
            element.removeClass('navigation-header-hidden');
          }
        };

        apply($state.current);

        scope.$on(uiRouterConstants.stateChangeSuccessEvent, function(event, toState/*, toParams, fromState, fromParams*/) {
          apply(toState);
        });
      }
    };
  });
