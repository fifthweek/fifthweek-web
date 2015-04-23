angular.module('webApp')
  .constant('subscriptionRepositoryFactoryConstants', {
    key: 'subscriptions.blogs'
  })
  .factory('subscriptionRepositoryFactory',
  function($q, masterRepositoryFactory, subscriptionRepositoryFactoryConstants) {
    'use strict';

    return {
      forCurrentUser: function() {

        var key = subscriptionRepositoryFactoryConstants.key;
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
