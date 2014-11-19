angular.module('webApp').factory('ordersService', ['$http', 'webSettings',
  function($http, webSettings) {
    'use strict';

    var serviceBase = webSettings.apiBaseUri;

    var ordersServiceFactory = {};

    ordersServiceFactory.getOrders = function() {
      return $http.get(serviceBase + 'api/orders').then(function(results) {
        return results;
      });
    };

    return ordersServiceFactory;
  }
]);