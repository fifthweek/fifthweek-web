angular.module('webApp')
  .constant('subscriptionRepositoryFactoryConstants', {
    subscriptionKey: 'subscription'
  })
  .factory('subscriptionRepositoryFactory',
  function($q, masterRepositoryFactory, subscriptionRepositoryFactoryConstants) {
    'use strict';

    return {
      forCurrentUser: function() {

        var subscriptionKey = subscriptionRepositoryFactoryConstants.subscriptionKey;
        var masterRepository = masterRepositoryFactory.forCurrentUser();

        var service = {};

        service.getUserId = function(){
          return masterRepository.getUserId();
        };

        service.getSubscription = function(){
          return masterRepository.get(subscriptionKey)
            .then(function(data){
              if(data){
                return $q.when(data);
              }

              return $q.reject(new DisplayableError('You do not have a subscription.'));
            });
        };

        service.setSubscription = function(newSubscription){
          return masterRepository.set(subscriptionKey, newSubscription);
        };

        return service;
      }
    };
  }
);
