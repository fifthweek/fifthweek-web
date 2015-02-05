/// <reference path='../angular.module('webApp')js' />

angular.module('webApp').factory('stateChangeRedirectionHandler',
  function($state) {
    'use strict';

    var service = {};

    service.handleStateChangeStart = function(event, toState, toParams/*, fromState, fromParams*/){
      if(toState.redirectTo){
        event.preventDefault();
        $state.go(toState.redirectTo, toParams);
      }
    };

    return service;
  }
);

