angular.module('webApp')
  .constant('subscriptionsRepositoryFactoryConstants', {
    key: 'subscriptions.blogs'
  })
  .factory('subscriptionsRepositoryFactory',
  function($q, masterRepositoryFactory, subscriptionsRepositoryFactoryConstants) {
    'use strict';

    return {
      forCurrentUser: function() {

        var key = subscriptionsRepositoryFactoryConstants.key;
        var masterRepository = masterRepositoryFactory.forCurrentUser();

        var service = {};

        service.tryGetSubscriptions = function(){
          if(!masterRepository.getUserId())
          {
            return $q.when();
          }

          return masterRepository.get(key);
        };

        service.getSubscriptions = function(){
          return masterRepository.get(key);
        };

        return service;
      }
    };
  }
);
