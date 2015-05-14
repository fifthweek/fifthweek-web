angular.module('webApp')
  .constant('identifiedUserNotifierConstants', {
    eventName: 'identifiedUserInformationUpdatedEvent',
    localStorageKey: 'identifiedUserInformation',
    defaultUserInformation: { email: undefined }
  })
  .factory('identifiedUserNotifier',
  function($rootScope, localStorageService, membershipStub, logService, identifiedUserNotifierConstants, aggregateUserStateConstants) {
    'use strict';

    var service = {};
    service.internal = {
      hasNotified: false,
      userInformation: undefined
    };

    service.internal.loadUserInformation = function(){
      var loadedUserInformation = localStorageService.get(identifiedUserNotifierConstants.localStorageKey);
      service.internal.userInformation = loadedUserInformation || identifiedUserNotifierConstants.defaultUserInformation;
    };

    service.internal.notify = function(){
      if(service.internal.userInformation.email) {
        var data = _.cloneDeep(service.internal.userInformation);
        data.isUpdate = service.internal.hasNotified;

        service.internal.hasNotified = true;

        membershipStub.postIdentifiedUser(data)
          .catch(function(error){
            logService.error(error);
          });
      }
    };

    service.internal.saveUserInformation = function(email, name, username){
      var changed = false;

      if(email === service.internal.userInformation.email) {
        if(name && service.internal.userInformation.name !== name){
          service.internal.userInformation.name = name;
          changed = true;
        }

        if(username && service.internal.userInformation.username !== username){
          service.internal.userInformation.username = username;
          changed = true;
        }
      }
      else {
        service.internal.userInformation = {
          email: email,
          name: name,
          username: username
        };
        changed = true;
      }

      if(changed || !service.internal.hasNotified){
        localStorageService.set(identifiedUserNotifierConstants.localStorageKey, service.internal.userInformation);
        service.internal.notify();
      }
    };

    service.internal.handleUserInformationUpdatedEvent = function(event, data){
      service.internal.saveUserInformation(data.email, data.name);
    };

    service.internal.handleAggregateUserStateEvent = function(event, data){
      if(data && data.accountSettings){
        service.internal.saveUserInformation(data.accountSettings.email, undefined, data.accountSettings.username);
      }
      else if(!service.internal.hasNotified) {
        service.internal.notify();
      }
    };

    service.initialize = function(){
      service.internal.loadUserInformation();
      $rootScope.$on(identifiedUserNotifierConstants.eventName, service.internal.handleUserInformationUpdatedEvent);
      $rootScope.$on(aggregateUserStateConstants.updatedEvent, service.internal.handleAggregateUserStateEvent);
    };

    return service;
  });
