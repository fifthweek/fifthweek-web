/// <reference path='../angular.module('webApp')js' />

angular.module('webApp')
  .factory('utilities',
  function(fifthweekConstants) {
    'use strict';

    var service = {};

    service.getHttpError = function(response){
      if(response.status === 0) {
        return new ConnectionError(response);
      }
      else if(Math.round(response.status / 100) === 5) {
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
      else if(response.status === 401) {
        return new UnauthenticatedError('Not authenticated.');
      }
      else if(response.status === 403) {
        return new UnauthorizedError('Not authorized.');
      }
      else {
        // Allow call-site to deal with other non-server errors. Returning a 4** code
        // is a standard behaviour for some API endpoints.
        return response;
      }
    };

    service.getFriendlyErrorMessage = function(errorOrResponse){
      if (errorOrResponse instanceof ApiError) {
        // The API error message is fine to display.
        return errorOrResponse.message;
      }
      else if(errorOrResponse instanceof ConnectionError) {
        return fifthweekConstants.connectionErrorText;
      }
      else if(errorOrResponse.data !== undefined) {
        if (errorOrResponse.data.message !== undefined) {
          return errorOrResponse.data.message;
        }

        if(errorOrResponse.data.error_description !== undefined){
          return errorOrResponse.data.error_description;
        }
      }

      // An unknown error  Try to log it and return a generic message.
      return fifthweekConstants.unexpectedErrorText;
    };

    return service;
  }
);

