angular.module('webApp')
  .constant('impersonationServiceConstants', {
    impersonationChangedEvent: 'impersonationChanged'
  })
  .factory('impersonationService',
  function($rootScope, impersonationServiceConstants) {
    'use strict';

    var service = {};

    service.internal = {};

    service.impersonate = function(userId) {
      $rootScope.$broadcast(impersonationServiceConstants.impersonationChangedEvent, userId);
    };

    return service;
  });
