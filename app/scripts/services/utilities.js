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

      scopeUtilities.defineModelAccessor = function(attrs) {
        var ngModelLength = attrs.ngModel.lastIndexOf('.');
        if (ngModelLength === -1) {
          throw new FifthweekError('Must not be bound to primitive');
        }
        if (attrs.ngModel.indexOf('.') !== ngModelLength) {
          // Thought about using eval, except a little unsafe. Lodash doesn't appear
          // to have a way of doing this. Would be good to see how Angular does it.
          throw new FifthweekError('Nested properties currently not supported (but easy to add!)');
        }

        scope.ngModel = scope[attrs.ngModel.substring(0, ngModelLength)];
        scope.ngModelAccessor = attrs.ngModel.substring(ngModelLength + 1);
      };

      return scopeUtilities;
    };

    service.forDirective = function(scope, element, attrs) {
      var directiveUtilities = {};

      directiveUtilities.scaffoldFormInput = function() {
        scope.required = attrs.hasOwnProperty('required') ? attrs.required !== false : false;
        scope.focus = attrs.hasOwnProperty('focus') ? attrs.focus !== false : false;
        scope.placeholder = attrs.placeholder;
        scope.breakpoint = attrs.breakpoint || 'sm';
        scope.inputId = attrs.ngModel.replace('.', '-');
        service.forScope(scope).defineModelAccessor(attrs);
      };

      return directiveUtilities;
    };

    return service;
  }
);
