describe('landing-page-information-loader', function(){
  'use strict';

  var $rootScope;
  var $q;
  var target;

  var blogStub;
  var subscribeService;

  beforeEach(function() {
    blogStub = jasmine.createSpyObj('blogStub', ['getLandingPage']);
    subscribeService = jasmine.createSpyObj('subscribeService', ['getSubscriptionStatus']);

    module('webApp');

    module(function($provide) {
      $provide.value('blogStub', blogStub);
      $provide.value('subscribeService', subscribeService);
    });

    inject(function($injector) {
      $rootScope = $injector.get('$rootScope');
      $q = $injector.get('$q');
      target = $injector.get('landingPageInformationLoader');
    });
  });

  describe('when populateSubscriptionFromUserState is called', function(){
    var deferredResult;
    var error;
    var data;
    beforeEach(function(){
      deferredResult = $q.defer();
      subscribeService.getSubscriptionStatus.and.returnValue(deferredResult.promise);

      data = {
        blog: { blogId: 'blogId' },
        hasFreeAccess: false,
        isSubscribed: false,
        subscribedChannels: undefined,
        hiddenChannels: undefined
      };

      target.internal.populateSubscriptionFromUserState(data, 'subscriptionRepository').catch(function(e){ error = e; });
      $rootScope.$apply();
    });

    it('should call subscribeService', function(){
      expect(subscribeService.getSubscriptionStatus).toHaveBeenCalledWith('blogId', 'subscriptionRepository');
    });

    describe('when subscribeService succeeds', function(){
      beforeEach(function(){
        deferredResult.resolve($q.when({
          hasFreeAccess: true,
          isSubscribed: true,
          subscribedChannels: 'subscribed',
          hiddenChannels: 'hidden'
        }));
        $rootScope.$apply();
      });

      it('should update hasFreeAccess', function(){
        expect(data.hasFreeAccess).toBe(true);
      });

      it('should update isSubscribed', function(){
        expect(data.isSubscribed).toBe(true);
      });

      it('should update subscribedChannels', function(){
        expect(data.subscribedChannels).toBe('subscribed');
      });

      it('should update hiddenChannels', function(){
        expect(data.hiddenChannels).toBe('hidden');
      });
    });

    describe('when subscribeService fails', function(){
      beforeEach(function(){
        deferredResult.resolve($q.reject('error'));
        $rootScope.$apply();
      });

      it('should not update hasFreeAccess', function(){
        expect(data.hasFreeAccess).toBe(false);
      });

      it('should not update isSubscribed', function(){
        expect(data.isSubscribed).toBe(false);
      });

      it('should not update subscribedChannels', function(){
        expect(data.subscribedChannels).toBeUndefined();
      });

      it('should not update hiddenChannels', function(){
        expect(data.hiddenChannels).toBeUndefined();
      });

      it('should propagate the error', function(){
        expect(error).toBe('error');
      });
    });
  });

  describe('when loadFromApi is called', function(){
    var result;
    var error;
    var deferredGetLandingPage;
    var deferredPopulateSubscriptionFromUserState;
    beforeEach(function(){
      result = undefined;
      error = undefined;

      deferredGetLandingPage = $q.defer();
      blogStub.getLandingPage.and.returnValue(deferredGetLandingPage.promise);

      deferredPopulateSubscriptionFromUserState = $q.defer();
      spyOn(target.internal, 'populateSubscriptionFromUserState').and.returnValue(deferredPopulateSubscriptionFromUserState.promise);

      target.internal.loadFromApi('username', 'subscriptionRepository').then(function(r){ result = r; }, function(e){ error = e; });
      $rootScope.$apply();
    });

    it('should call getLandingPage', function(){
      expect(blogStub.getLandingPage).toHaveBeenCalledWith('username');
    });

    describe('when getLandingPage succeeds', function(){
      beforeEach(function(){
        deferredGetLandingPage.resolve($q.when({ data: {
          something: 'something'
        }}));
        $rootScope.$apply();
      });

      it('should call populateSubscriptionFromUserState', function(){
        expect(target.internal.populateSubscriptionFromUserState).toHaveBeenCalledWith({ something: 'something', isOwner: false }, 'subscriptionRepository');
      });

      describe('when populateSubscriptionFromUserState succeeds', function(){
        beforeEach(function(){
          deferredPopulateSubscriptionFromUserState.resolve();
          $rootScope.$apply();
        });

        it('should return the result', function(){
          expect(result).toEqual({ something: 'something', isOwner: false });
        });
      });

      describe('when populateSubscriptionFromUserState fails', function(){
        beforeEach(function(){
          deferredPopulateSubscriptionFromUserState.reject('error');
          $rootScope.$apply();
        });

        it('should propagate the error', function(){
          expect(error).toBe('error');
        });
      });
    });

    describe('when getLandingPage fails', function(){
      beforeEach(function(){
        deferredGetLandingPage.reject('error');
        $rootScope.$apply();
      });

      it('should propagate the error', function(){
        expect(error).toBe('error');
      });
    });
  });

  describe('when loadFromLocal is called', function(){

    var result;
    var error;
    var deferredGetBlog;
    var blogRepository;
    beforeEach(function(){
      result = undefined;
      error = undefined;

      deferredGetBlog = $q.defer();
      blogRepository = jasmine.createSpyObj('blogRepository', ['getBlog', 'getUserId']);
      blogRepository.getBlog.and.returnValue(deferredGetBlog.promise);

      blogRepository.getUserId.and.returnValue('userId');

      target.internal.loadFromLocal({ profileImage: 'profileImage' }, blogRepository).then(function(r){ result = r; }, function(e){ error = e; });
      $rootScope.$apply();
    });

    it('should call getBlog', function(){
      expect(blogRepository.getBlog).toHaveBeenCalledWith();
    });

    describe('when getBlog succeeds', function(){
      beforeEach(function(){
        deferredGetBlog.resolve('blog');
        $rootScope.$apply();
      });

      it('should return the result', function(){
        expect(result).toEqual({
          userId: 'userId',
          isOwner: true,
          hasFreeAccess: false,
          isSubscribed: false,
          profileImage: 'profileImage',
          subscribedChannels: {},
          hiddenChannels: [],
          blog: 'blog'
        });
      });
    });

    describe('when getBlog fails', function(){
      beforeEach(function(){
        deferredGetBlog.reject('error');
        $rootScope.$apply();
      });

      it('should propagate the error', function(){
        expect(error).toBe('error');
      });
    });
  });

  describe('when loadLandingPageData is called', function() {
    var result;
    var error;
    var deferredGetAccountSettings;
    var deferredLoadData;
    var accountSettingsRepository;
    beforeEach(function(){
      result = undefined;
      error = undefined;

      deferredLoadData = $q.defer();
      spyOn(target.internal, 'loadFromLocal').and.returnValue(deferredLoadData.promise);
      spyOn(target.internal, 'loadFromApi').and.returnValue(deferredLoadData.promise);

      deferredGetAccountSettings = $q.defer();
      accountSettingsRepository = jasmine.createSpyObj('accountSettingsRepository', ['getAccountSettings']);
      accountSettingsRepository.getAccountSettings.and.returnValue(deferredGetAccountSettings.promise);

      target.loadLandingPageData('username', accountSettingsRepository, 'blogRepository', 'subscriptionRepository').then(function(r){ result = r; }, function(e){ error = e; });
      $rootScope.$apply();
    });

    it('should call getAccountSettings', function(){
      expect(accountSettingsRepository.getAccountSettings).toHaveBeenCalledWith();
    });

    describe('when getAccountSettings succeeds', function(){

      var testLoadData = function(){
        describe('when load data succeeds', function(){
          beforeEach(function(){
            deferredLoadData.resolve('data');
            $rootScope.$apply();
          });

          it('should return the result', function(){
            expect(result).toBe('data');
          });
        });

        describe('when load data fails', function(){
          beforeEach(function(){
            deferredLoadData.reject('error');
            $rootScope.$apply();
          });

          it('should propagate the error', function(){
            expect(error).toBe('error');
          });
        });
      };

      describe('when username matches logged in user', function(){
        var accountSettings;
        beforeEach(function(){
          accountSettings = { username: 'username' };
          deferredGetAccountSettings.resolve(accountSettings);
          $rootScope.$apply();
        });

        it('should call loadFromLocal', function(){
          expect(target.internal.loadFromLocal).toHaveBeenCalledWith(accountSettings, 'blogRepository');
        });

        testLoadData();
      });

      describe('when username does not match logged in user', function(){
        beforeEach(function(){
          deferredGetAccountSettings.resolve({ username: 'somethingElse' });
          $rootScope.$apply();
        });

        it('should call loadFromApi', function(){
          expect(target.internal.loadFromApi).toHaveBeenCalledWith('username', 'subscriptionRepository');
        });

        testLoadData();
      });

      describe('when user is not logged in', function(){
        beforeEach(function(){
          deferredGetAccountSettings.resolve();
          $rootScope.$apply();
        });

        it('should call loadFromApi', function(){
          expect(target.internal.loadFromApi).toHaveBeenCalledWith('username', 'subscriptionRepository');
        });

        testLoadData();
      });
    });

    describe('when getAccountSettings fails', function(){
      beforeEach(function(){
        deferredGetAccountSettings.reject('error');
        $rootScope.$apply();
      });

      it('should propagate the error', function(){
        expect(error).toBe('error');
      });
    });
  });

  describe('updateSubscribedChannels', function(){
    beforeEach(function(){
      spyOn(target.internal, 'populateSubscriptionFromUserState').and.returnValue($q.when('result'));
    });

    it('should return immediately if blog owner', function(){
      var success;

      target.updateSubscribedChannels({ isOwner: true }, 'subscriptionRepository').then(function(){ success = true; });
      $rootScope.$apply();

      expect(target.internal.populateSubscriptionFromUserState).not.toHaveBeenCalled();
      expect(success).toBe(true);
    });

    it('should call populateSubscriptionFromUserState if not blog owner', function(){
      var landingPage = { isOwner: false };
      var result;
      target.internal.populateSubscriptionFromUserState.and.returnValue($q.when('result'));

      target.updateSubscribedChannels(landingPage, 'subscriptionRepository').then(function(r){ result = r; });
      $rootScope.$apply();

      expect(target.internal.populateSubscriptionFromUserState).toHaveBeenCalledWith(landingPage, 'subscriptionRepository');
      expect(result).toBe('result');
    });
  });
});
