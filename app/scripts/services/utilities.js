/// <reference path='../angular.module('webApp')js' />

angular.module('webApp')
  .factory('utilities',
  function(fifthweekConstants) {
    'use strict';

    var service = {};

    service.getHttpError = function(response){
      if(response.status === 0){
        return new ConnectionError(response);
      }
      else{
        if(response.data !== undefined) {
          if (response.data.message !== undefined) {
            return new ApiError(response.data.message);
          }
          if(response.data.error_description !== undefined){
            return new ApiError(response.data.error_description);
          }
        }
        return new ApiError(fifthweekConstants.unexpectedErrorText);
      }
    };

    service.getFriendlyErrorMessage = function(error){
      if(error instanceof ApiError){
        // The API error message is fine to display.
        return error.message;
      }
      else if(error instanceof ConnectionError){
        return fifthweekConstants.connectionErrorText;
      }
      else{
        // An unknown error.  Try to log it and return a generic message.
        return fifthweekConstants.unexpectedErrorText;
      }
    };

    return service;
  }
);

