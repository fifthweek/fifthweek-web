/// <reference path='../angular.module('webApp')js' />

angular.module('webApp')
  .factory('utilities',
  function(fifthweekConstants, $parse) {
    'use strict';

    var service = {};

    // http://stackoverflow.com/a/6491621/592768
    // Adapted to be more readable.
    service.getAccessorPathSegments = function(path) {
      path = path.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
      path = path.replace(/^\./, '');           // strip a leading dot
      return path.split('.');
    };
    service.getValue = function(object, path) {
      var pathSegments = _.isArray(path) ? path : service.getAccessorPathSegments(path);
      for (var i = 0; i < pathSegments.length; ++i) {
        var pathSegment = pathSegments[i];
        if (pathSegment in object) {
          object = object[pathSegment];
        }
        else {
          return;
        }
      }
      return object;
    };

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
      if(error instanceof DisplayableError){
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

    service.parseFlag = function(object, flag) {
      return object.hasOwnProperty(flag) ? object[flag] !== false : false;
    };

    service.forScope = function(scope) {
      var scopeUtilities = {};

      scopeUtilities.getAccessor = function(suppliedValue) {
        var lastDelimiterIndex = suppliedValue.lastIndexOf('.');
        if (lastDelimiterIndex === -1) {
          throw new FifthweekError('Must not be bound to primitive');
        }

        var root = $parse(suppliedValue.substring(0, lastDelimiterIndex))(scope);
        var accessor = suppliedValue.substring(lastDelimiterIndex + 1);
        return {
          root: root,
          accessor: accessor
        };
      };

      return scopeUtilities;
    };

    service.forDirective = function(scope, element, attrs) {
      var directiveUtilities = {};

      directiveUtilities.scaffoldFormInput = function() {
        scope.showHelp = service.parseFlag(attrs, 'showHelp');
        scope.required = service.parseFlag(attrs, 'required');
        scope.focus = service.parseFlag(attrs, 'focus');
        scope.placeholder = attrs.placeholder;
        scope.breakpoint = attrs.breakpoint || 'sm';
        scope.label = attrs.label;

        var scopeService = service.forScope(scope);

        if(attrs.ngModel){
          scope.inputId = attrs.inputId || attrs.ngModel.replace(/\./g, '-');

          var modelAccessorInfo = scopeService.getAccessor(attrs.ngModel);
          scope.ngModel = modelAccessorInfo.root;
          scope.ngModelAccessor = modelAccessorInfo.accessor;
        }

        var isRequiredInternal = $parse(attrs.ngRequired);
        scope.isRequired = function(){
          return attrs.ngRequired ? isRequiredInternal(scope) : scope.required;
        };

        var isDisabledInternal = $parse(attrs.ngDisabled);
        scope.isDisabled = function(){
          return attrs.ngDisabled ? isDisabledInternal(scope) : false;
        };
      };

      return directiveUtilities;
    };

    return service;
  }
);
