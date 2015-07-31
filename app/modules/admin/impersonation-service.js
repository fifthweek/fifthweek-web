angular.module('webApp')
  .constant('impersonationServiceConstants', {
    impersonationChangedEvent: 'impersonationChanged'
  })
  .factory('impersonationService',
  function($rootScope, impersonationServiceConstants) {
    'use strict';

    var service = {
      impersonatedUserId: null
    };

    service.internal = {};

    service.impersonate = function(userId) {
      service.impersonatedUserId = userId;
      $rootScope.$broadcast(impersonationServiceConstants.impersonationChangedEvent, userId);
    };

    return service;
  });
