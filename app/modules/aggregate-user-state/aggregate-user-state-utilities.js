angular.module('webApp')
  .factory('aggregateUserStateUtilities',
  function(aggregateUserState) {
    'use strict';

    var service = {};

    service.getUsername = function(){
      if(aggregateUserState.currentValue && aggregateUserState.currentValue.accountSettings){
        return aggregateUserState.currentValue.accountSettings.username;
      }

      return undefined;
    };

    return service;
  }
);
