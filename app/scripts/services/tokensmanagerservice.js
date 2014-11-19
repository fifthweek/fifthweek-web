angular.module('webApp').factory('tokensManagerService', ['$http', 'webSettings',
  function($http, webSettings) {
    'use strict';

    var serviceBase = webSettings.apiBaseUri;

    var tokenManagerServiceFactory = {};

    tokenManagerServiceFactory.getRefreshTokens = function() {
      return $http.get(serviceBase + 'api/refreshTokens').then(function(results) {
        return results;
      });
    };

    tokenManagerServiceFactory.deleteRefreshTokens = function(tokenid) {
      return $http.delete(serviceBase + 'api/refreshTokens/?tokenid=' + tokenid).then(function(results) {
        return results;
      });
    };

    return tokenManagerServiceFactory;
  }
]);