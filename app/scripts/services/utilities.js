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
      else if(response.status === 401){
        return new UnauthenticatedError('Not authenticated.');
      }
      else if(response.status === 403){
        return new UnauthorizedError('Not authorized.');
      }
      else{
        if(response.data !== undefined) {
          if (response.data.message !== undefined) {
            return new ApiError(response.data.message, response);
          }
          if(response.data.error_description !== undefined){
            return new ApiError(response.data.error_description, response);
          }
        }
        return new ApiError(fifthweekConstants.unexpectedErrorText, response);
      }
    };

    service.getFriendlyErrorMessage = function(error){
      if(error instanceof ApiError || error instanceof InputValidationError){
        // These error messages are fine to display.
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

    service.forScope = function(scope) {
      var scopeUtilities = {};

      scopeUtilities.createVirtualSetter = function(name) {
        var setterName = _.camelCase('set ' + name);
        if (_.isFunction(scope[setterName])) {
          return scope[setterName];
        }
        else {
          return function(value) {
            scope[name] = value;
          };
        }
      };

      return scopeUtilities;
    };

    return service;
  }
);
