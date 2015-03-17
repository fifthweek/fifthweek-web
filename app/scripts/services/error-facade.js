angular.module('webApp').factory('errorFacade', function(logService, utilities) {
    'use strict';

    var service = {};

    service.handleError = function(error, setMessage){
      if(error instanceof CancellationError){
        return;
      }

      setMessage(utilities.getFriendlyErrorMessage(error));
      return logService.error(error);
    };

    return service;
  }
);
