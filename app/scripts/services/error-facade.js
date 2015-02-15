angular.module('webApp').factory('errorFacade', function(logService, utilities) {
    'use strict';

    var service = {};

    service.handleError = function(error, setMessage){
      setMessage(utilities.getFriendlyErrorMessage(error));
      return logService.error(error);
    };

    return service;
  }
);
