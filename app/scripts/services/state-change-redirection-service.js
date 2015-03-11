/// <reference path='../angular.module('webApp')js' />

angular.module('webApp').factory('stateChangeRedirectionService',
  function($rootScope, $state) {
    'use strict';

    var service = {};

    service.isPermitted = function(){
      return true;
    };

    service.redirectAwayIfRequired = function(event, toState, toParams){
      if(toState.redirectTo){
        event.preventDefault();

        $rootScope.debugLines = $rootScope.debugLines || [];
        $rootScope.debugLines.push('service.redirectAwayIfRequired 1 = ' + toState);

        $state.go(toState.redirectTo, toParams);
      }
    };

    return service;
  }
);

