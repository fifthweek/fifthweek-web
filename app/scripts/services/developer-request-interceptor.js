angular.module('webApp').factory('developerRequestInterceptor',
    function(fifthweekConstants) {
      'use strict';

      var tokenUrl = fifthweekConstants.apiBaseUri + fifthweekConstants.tokenPath;

      var factory = {};

      factory.request = function(config) {
        // We don't add this header to the token URL as it triggers
        // a pre-flight OPTIONS request, which the OAUTH code doesn't handle.
        if(fifthweekConstants.developerName){
          config.headers = config.headers || {};
          config.headers[fifthweekConstants.developerNameHeader] = fifthweekConstants.developerName;
        }

        return config;
      };

      return factory;
    }
  );
