/// <reference path='../angular.module('webApp')js' />

angular.module('webApp').factory('stateChangeRedirectionService',
  function($state) {
    'use strict';

    var service = {};

    service.isPermitted = function(){
      return true;
    };

    service.redirectAwayIfRequired = function(event, toState, toParams){
      if(toState.redirectTo){
        event.preventDefault();
        $state.go(toState.redirectTo, toParams);
      }
    };

    return service;
  }
);

