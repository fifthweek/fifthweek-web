angular.module('webApp').factory('errorFacade', function($q, logService, utilities) {
    'use strict';

    var service = {};

    service.handleError = function(error, setMessage){
      if(error instanceof CancellationError){
        return $q.when();
      }

      setMessage(utilities.getFriendlyErrorMessage(error));
      return logService.error(error);
    };

    return service;
  }
);
