/// <reference path='../angular.module('webApp')js' />

angular.module('webApp')
  .factory('logService',
  function($injector, $log, fifthweekConstants) {
    'use strict';

    var service = {};

    service.log = function(level, payload) {
      // We have to do this here to avoid an Angular circular dependency.
      var $http = $injector.get('$http');
      $http.post(fifthweekConstants.apiBaseUri + 'log', {
        level: level,
        payload: payload
      }).catch(function(err) {
        $log.warn('Failed to log to server: ' + err);
      });
    };
    service.shouldLog = function(payload)
    {
      return payload !== undefined && !jQuery.isEmptyObject(payload);
    };

    return service;
  }
);

