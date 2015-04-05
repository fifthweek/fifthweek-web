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

        service.setAccountSettings = function(newAccountSettings){
          return masterRepository.set(accountSettingsKey, newAccountSettings);
        };

        return service;
      }
    };
  }
);
