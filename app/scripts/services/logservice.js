/// <reference path='../angular.module('webApp')js' />

angular.module('webApp')
  .factory('logService',
  function($injector, $log, fifthweekConstants) {
    'use strict';

    var service = {};

    service.shouldLog = function(payload)
    {
      return payload !== undefined && !jQuery.isEmptyObject(payload);
    };

    service.log = function(level, payload) {
      if(!service.shouldLog(payload)){
        return;
      }

      // We have to do this here to avoid an Angular circular dependency.
      var $http = $injector.get('$http');
      return $http.post(fifthweekConstants.apiBaseUri + 'log', {
        level: level,
        payload: payload
      }).catch(function(response) {
        $log.warn('Failed to log to server: ' + response);
      });
    };

    return service;
  }
);

