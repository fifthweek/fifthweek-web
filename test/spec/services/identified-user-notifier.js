describe('identified-user-notifier', function(){
  'use strict';

  var $rootScope;
  var $q;
  var target;

  var localStorageService;
  var membershipStub;
  var logService;
  var identifiedUserNotifierConstants;
  var aggregateUserStateConstants;

  beforeEach(function() {
    localStorageService = jasmine.createSpyObj('localStorageService', ['get', 'set']);
    membershipStub = jasmine.createSpyObj('membershipStub', ['postIdentifiedUser']);
    logService = jasmine.createSpyObj('logService', ['error']);

    module('webApp');

    module(function($provide) {
      $provide.value('localStorageService', localStorageService);
      $provide.value('membershipStub', membershipStub);
      $provide.value('logService', logService);
    });

    inject(function($injector) {
      $rootScope = $injector.get('$rootScope');
      $q = $injector.get('$q');
      target = $injector.get('identifiedUserNotifier');
      identifiedUserNotifierConstants = $injector.get('identifiedUserNotifierConstants');
      aggregateUserStateConstants = $injector.get('aggregateUserStateConstants');
    });
  });

  describe('when initialize is called', function(){
    beforeEach(function(){
      spyOn(target.internal, 'loadUserInformation');
      spyOn($rootScope, '$on');

      target.initialize();
    });

    it('should call loadUserInformation', function(){
      expect(target.internal.loadUserInformation).toHaveBeenCalledWith();
    });

    it('should hook into the identified user notifier event', function(){
      expect($rootScope.$on).toHaveBeenCalledWith(identifiedUserNotifierConstants.eventName, target.internal.handleUserInformationUpdatedEvent);
    });

    it('should hook into the user state updated event', function(){
      expect($rootScope.$on).toHaveBeenCalledWith(aggregateUserStateConstants.updatedEvent, target.internal.handleAggregateUserStateEvent);
    });
  });

  describe('when handleAggregateUserStateEvent is called', function(){
    beforeEach(function(){
      target.internal.hasNotified = true;
      spyOn(target.internal, 'saveUserInformation');
      spyOn(target.internal, 'notify');
    });

    describe('when account settings exist', function(){
      beforeEach(function(){
        target.internal.handleAggregateUserStateEvent('event', { accountSettings: { email: 'email', username: 'username' }});
      });

      it('should call saveUserInformation', function(){
        expect(target.internal.saveUserInformation).toHaveBeenCalledWith('email', undefined, 'username');
      });

      it('should not call notify', function(){
        expect(target.internal.notify).not.toHaveBeenCalled();
      });
    });

    describe('when account settings do not exist and service has notified before', function(){
      beforeEach(function(){
        target.internal.hasNotified = true;
        target.internal.handleAggregateUserStateEvent('event', { accountSettings: undefined });
      });

      it('should not call saveUserInformation', function(){
        expect(target.internal.saveUserInformation).not.toHaveBeenCalled();
      });

      it('should not call notify', function(){
        expect(target.internal.notify).not.toHaveBeenCalled();
      });
    });

    describe('when account settings do not exist and service has not notified before', function(){
      beforeEach(function(){
        target.internal.hasNotified = false;
        target.internal.handleAggregateUserStateEvent('event', { accountSettings: undefined });
      });

      it('should not call saveUserInformation', function(){
        expect(target.internal.saveUserInformation).not.toHaveBeenCalled();
      });

      it('should call notify', function(){
        expect(target.internal.notify).toHaveBeenCalledWith();
      });
    });

    describe('when user state does not exist and service has not notified before', function(){
      beforeEach(function(){
        target.internal.hasNotified = false;
        target.internal.handleAggregateUserStateEvent('event', undefined);
      });

      it('should not call saveUserInformation', function(){
        expect(target.internal.saveUserInformation).not.toHaveBeenCalled();
      });

      it('should call notify', function(){
        expect(target.internal.notify).toHaveBeenCalledWith();
      });
    });
  });

  describe('when handleUserInformationUpdatedEvent is called', function(){
    beforeEach(function(){
      spyOn(target.internal, 'saveUserInformation');
      target.internal.handleUserInformationUpdatedEvent('event', {email: 'email', name: 'name'});
    });

    it('should call saveUserInformation', function(){
      expect(target.internal.saveUserInformation).toHaveBeenCalledWith('email', 'name');
    });
  });

  describe('when saveUserInformation is called', function(){
    beforeEach(function(){
      target.internal.hasNotified = true;
      spyOn(target.internal, 'notify');
    });

    describe('when no information has been set before', function(){
      beforeEach(function(){
        target.internal.userInformation = identifiedUserNotifierConstants.defaultUserInformation;
        target.internal.saveUserInformation('email', 'name', 'username');
      });

      it('should update internal userInformation', function(){
        expect(target.internal.userInformation).toEqual({ email: 'email', name: 'name', username: 'username' });
      });

      it('should update local storage', function(){
        expect(localStorageService.set).toHaveBeenCalledWith(identifiedUserNotifierConstants.localStorageKey, { email: 'email', name: 'name', username: 'username' });
      });

      it('should call notify', function(){
        expect(target.internal.notify).toHaveBeenCalledWith();
      });
    });

    describe('when name has changed', function(){
      beforeEach(function(){
        target.internal.userInformation = { email: 'email', name: 'name', username: 'username' };
        target.internal.saveUserInformation('email', 'name2', 'username');
      });

      it('should update internal userInformation', function(){
        expect(target.internal.userInformation).toEqual({ email: 'email', name: 'name2', username: 'username' });
      });

      it('should update local storage', function(){
        expect(localStorageService.set).toHaveBeenCalledWith(identifiedUserNotifierConstants.localStorageKey, { email: 'email', name: 'name2', username: 'username' });
      });

      it('should call notify', function(){
        expect(target.internal.notify).toHaveBeenCalledWith();
      });
    });

    describe('when username has changed', function(){
      beforeEach(function(){
        target.internal.userInformation = { email: 'email', name: 'name', username: 'username' };
        target.internal.saveUserInformation('email', 'name', 'username2');
      });

      it('should update internal userInformation', function(){
        expect(target.internal.userInformation).toEqual({ email: 'email', name: 'name', username: 'username2' });
      });

      it('should update local storage', function(){
        expect(localStorageService.set).toHaveBeenCalledWith(identifiedUserNotifierConstants.localStorageKey, { email: 'email', name: 'name', username: 'username2' });
      });

      it('should call notify', function(){
        expect(target.internal.notify).toHaveBeenCalledWith();
      });
    });

    describe('when email has changed', function(){
      beforeEach(function(){
        target.internal.userInformation = { email: 'email', name: 'name', username: 'username' };
        target.internal.saveUserInformation('email2', 'name', 'username');
      });

      it('should update internal userInformation', function(){
        expect(target.internal.userInformation).toEqual({ email: 'email2', name: 'name', username: 'username' });
      });

      it('should update local storage', function(){
        expect(localStorageService.set).toHaveBeenCalledWith(identifiedUserNotifierConstants.localStorageKey, { email: 'email2', name: 'name', username: 'username' });
      });

      it('should call notify', function(){
        expect(target.internal.notify).toHaveBeenCalledWith();
      });
    });

    describe('when name has been added', function(){
      beforeEach(function(){
        target.internal.userInformation = { email: 'email', name: undefined, username: 'username' };
        target.internal.saveUserInformation('email', 'name', undefined);
      });

      it('should update internal userInformation', function(){
        expect(target.internal.userInformation).toEqual({ email: 'email', name: 'name', username: 'username' });
      });

      it('should update local storage', function(){
        expect(localStorageService.set).toHaveBeenCalledWith(identifiedUserNotifierConstants.localStorageKey, { email: 'email', name: 'name', username: 'username' });
      });

      it('should call notify', function(){
        expect(target.internal.notify).toHaveBeenCalledWith();
      });
    });

    describe('when username has been added', function(){
      beforeEach(function(){
        target.internal.userInformation = { email: 'email', name: 'name', username: undefined };
        target.internal.saveUserInformation('email', undefined, 'username');
      });

      it('should update internal userInformation', function(){
        expect(target.internal.userInformation).toEqual({ email: 'email', name: 'name', username: 'username' });
      });

      it('should update local storage', function(){
        expect(localStorageService.set).toHaveBeenCalledWith(identifiedUserNotifierConstants.localStorageKey, { email: 'email', name: 'name', username: 'username' });
      });

      it('should call notify', function(){
        expect(target.internal.notify).toHaveBeenCalledWith();
      });
    });

    describe('when email is updated without name or username', function(){
      beforeEach(function(){
        target.internal.userInformation = { email: 'email', name: 'name', username: 'username' };
        target.internal.saveUserInformation('email2', undefined, undefined);
      });

      it('should update internal userInformation', function(){
        expect(target.internal.userInformation).toEqual({ email: 'email2', name: undefined, username: undefined });
      });

      it('should update local storage', function(){
        expect(localStorageService.set).toHaveBeenCalledWith(identifiedUserNotifierConstants.localStorageKey, { email: 'email2', name: undefined, username: undefined });
      });

      it('should call notify', function(){
        expect(target.internal.notify).toHaveBeenCalledWith();
      });
    });

    describe('when no information has changed and service has been notified before', function(){
      beforeEach(function(){
        target.internal.userInformation = { email: 'email', name: 'name', username: 'username' };
        target.internal.saveUserInformation('email', 'name', 'username');
      });

      it('should not update internal userInformation', function(){
        expect(target.internal.userInformation).toEqual({ email: 'email', name: 'name', username: 'username' });
      });

      it('should not update local storage', function(){
        expect(localStorageService.set).not.toHaveBeenCalled();
      });

      it('should not call notify', function(){
        expect(target.internal.notify).not.toHaveBeenCalled();
      });
    });

    describe('when no information has changed and service has not notified before', function(){
      beforeEach(function(){
        target.internal.hasNotified = false;
        target.internal.userInformation = { email: 'email', name: 'name', username: 'username' };
        target.internal.saveUserInformation('email', 'name', 'username');
      });

      it('should update internal userInformation', function(){
        expect(target.internal.userInformation).toEqual({ email: 'email', name: 'name', username: 'username' });
      });

      it('should update local storage', function(){
        expect(localStorageService.set).toHaveBeenCalledWith(identifiedUserNotifierConstants.localStorageKey, { email: 'email', name: 'name', username: 'username' });
      });

      it('should call notify', function(){
        expect(target.internal.notify).toHaveBeenCalledWith();
      });
    });
  });

  describe('when loadUserInformation is called', function(){
    beforeEach(function(){
      target.internal.userInformation = undefined;
    });

    describe('when local storage contains data', function(){
      beforeEach(function(){
        localStorageService.get.and.returnValue('stuff');
        target.internal.loadUserInformation();
      });

      it('should assign the local storage data to internal state', function(){
        expect(target.internal.userInformation).toBe('stuff');
      });
    });

    describe('when local storage is empty', function(){
      beforeEach(function(){
        localStorageService.get.and.returnValue(undefined);
        target.internal.loadUserInformation();
      });

      it('should assign the default value to internal state', function(){
        expect(target.internal.userInformation).toEqual(identifiedUserNotifierConstants.defaultUserInformation);
      });
    });
  });

  describe('when notify is called', function(){
    beforeEach(function(){
      target.internal.hasNotified = 'hasNotified';
    });

    describe('when email is set', function(){
      var deferredPost;
      beforeEach(function(){
        deferredPost = $q.defer();
        target.internal.userInformation = { email: 'email', something: 'something' };

        membershipStub.postIdentifiedUser.and.returnValue(deferredPost.promise);

        target.internal.notify();
        $rootScope.$apply();
      });

      it('should set hasNotified to true', function(){
        expect(target.internal.hasNotified).toBe(true);
      });

      it('should call the api', function(){
        expect(membershipStub.postIdentifiedUser).toHaveBeenCalledWith({ email: 'email', something: 'something', isUpdate: 'hasNotified' });
      });

      describe('when notifying api succeeds', function(){
        beforeEach(function(){
          deferredPost.resolve();
          $rootScope.$apply();
        });

        it('should not call logService', function(){
          expect(logService.error).not.toHaveBeenCalled();
        });
      });

      describe('when notifying api fails', function(){
        beforeEach(function(){
          deferredPost.reject('error');
          $rootScope.$apply();
        });

        it('should log the error', function(){
          expect(logService.error).toHaveBeenCalledWith('error');
        });
      });
    });

    describe('when email is not set', function(){
      beforeEach(function(){
        target.internal.userInformation = { email: undefined, something: 'something' };
        target.internal.notify();
        $rootScope.$apply();
      });

      it('should not set hasNotified to true', function(){
        expect(target.internal.hasNotified).toBe('hasNotified');
      });

      it('should not call the api', function(){
        expect(membershipStub.postIdentifiedUser).not.toHaveBeenCalled();
      });
    });
  });
});
