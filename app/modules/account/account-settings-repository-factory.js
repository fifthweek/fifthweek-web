angular.module('webApp')
  .constant('accountSettingsRepositoryFactoryConstants', {
    accountSettingsKey: 'accountSettings'
  })
  .factory('accountSettingsRepositoryFactory',
  function($q, masterRepositoryFactory, accountSettingsRepositoryFactoryConstants) {
    'use strict';

    return {
      forCurrentUser: function() {

        var accountSettingsKey = accountSettingsRepositoryFactoryConstants.accountSettingsKey;
        var masterRepository = masterRepositoryFactory.forCurrentUser();

        var service = {};

        service.getUserId = function(){
          return masterRepository.getUserId();
        };

        service.getAccountSettings = function(){
          return masterRepository.get(accountSettingsKey);
        };

        service.tryGetAccountSettings = function(){
          if(!masterRepository.getUserId())
          {
            return $q.when();
          }

          return masterRepository.get(accountSettingsKey, true);
        };

        service.setAccountSettings = function(newAccountSettings){
          return masterRepository.set(accountSettingsKey, newAccountSettings);
        };

        service.decrementFreePostsRemaining = function(){
          return service.getAccountSettings()
            .then(function(accountSettings){
              accountSettings.freePostsRemaining = accountSettings.freePostsRemaining - 1;
              return service.setAccountSettings(accountSettings);
            });
        };

        return service;
      }
    };
  }
);
