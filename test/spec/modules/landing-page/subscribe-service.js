describe('subscribe-service', function(){
  'use strict';

  var $rootScope;
  var $q;
  var target;

  var subscriptionStub;
  var fetchAggregateUserState;
  var subscriptionRepositoryFactory;
  var subscriptionRepository;
  var blogRepositoryFactory;
  var blogRepository;
  var $modal;

  beforeEach(function() {
    subscriptionStub = jasmine.createSpyObj('subscriptionStub', ['putBlogSubscriptions']);
    fetchAggregateUserState = jasmine.createSpyObj('fetchAggregateUserState', ['updateIfStale', 'updateFromServer', 'waitForExistingUpdate']);
    blogRepository = jasmine.createSpyObj('blogRepository', ['tryGetBlog']);
    blogRepositoryFactory = { forCurrentUser: function() { return blogRepository; }};
    subscriptionRepository = jasmine.createSpyObj('subscriptionRepository', ['tryGetBlogs', 'getUserId']);
    subscriptionRepositoryFactory = { forCurrentUser: function() { return subscriptionRepository; }};
    $modal = jasmine.createSpyObj('$modal', ['open']);

    module('webApp');

    module(function($provide) {
      $provide.value('subscriptionStub', subscriptionStub);
      $provide.value('fetchAggregateUserState', fetchAggregateUserState);
      $provide.value('blogRepositoryFactory', blogRepositoryFactory);
      $provide.value('subscriptionRepositoryFactory', subscriptionRepositoryFactory);
      $provide.value('$modal', $modal);
    });

    inject(function($injector) {
      $rootScope = $injector.get('$rootScope');
      $q = $injector.get('$q');
      target = $injector.get('subscribeService');
    });
  });

  describe('when subscribe is called', function(){

    var deferredUserInformation;
    var result;
    var error;
    beforeEach(function(){
      var channelsAndPrices = [
        { channelId: 'channelId1', acceptedPrice: 10 },
        { channelId: 'channelId3', acceptedPrice: 30 }
      ];
      deferredUserInformation = $q.defer();
      spyOn(target.internal, 'getSignedInUserInformation').and.returnValue(deferredUserInformation.promise);
      result = undefined;
      target.subscribe('blogId', channelsAndPrices).then(function(r){ result = r; }, function(e){ error = e; });
      $rootScope.$apply();
    });

    it('should call getSignedInUserInformation', function(){
      expect(target.internal.getSignedInUserInformation).toHaveBeenCalledWith('blogId');
    });

    describe('when the user does not log in', function(){
      beforeEach(function(){
        deferredUserInformation.resolve($q.when());
        $rootScope.$apply();
      });

      it('should not call putBlogSubscriptions', function(){
        expect(subscriptionStub.putBlogSubscriptions).not.toHaveBeenCalled();
      });

      it('should complete successfully indicating no subscription occurred', function(){
        expect(result).toBe(false);
      });
    });

    describe('when user is the blog owner', function(){
      beforeEach(function(){
        deferredUserInformation.resolve($q.when({
          isOwner: true
        }));
        $rootScope.$apply();
      });

      it('should not call putBlogSubscriptions', function(){
        expect(subscriptionStub.putBlogSubscriptions).not.toHaveBeenCalled();
      });

      it('should complete successfully indicating a subscription occurred', function(){
        expect(result).toBe(true);
      });
    });

    describe('when user has free access', function(){
      beforeEach(function(){
        subscriptionStub.putBlogSubscriptions.and.returnValue($q.when());
        deferredUserInformation.resolve($q.when({
          isOwner: false,
          hasFreeAccess: true
        }));
        $rootScope.$apply();
      });

      it('should call putBlogSubscriptions with accepted price of zero', function(){
        expect(subscriptionStub.putBlogSubscriptions).toHaveBeenCalledWith(
          'blogId',
          { subscriptions: [
            { channelId: 'channelId1', acceptedPrice: 0 },
            { channelId: 'channelId3', acceptedPrice: 0 }
          ] }
        );
      });

      it('should complete successfully indicating a subscription occurred', function(){
        expect(result).toBe(true);
      });
    });

    describe('when user does not have free access and is not owner', function(){
      beforeEach(function(){
        spyOn(target.internal, 'showGuestListOnlyDialog').and.returnValue($q.when());
        deferredUserInformation.resolve($q.when({
          isOwner: false,
          hasFreeAccess: false
        }));
        $rootScope.$apply();
      });

      it('should not call putBlogSubscriptions', function(){
        expect(subscriptionStub.putBlogSubscriptions).not.toHaveBeenCalled();
      });

      it('should call showGuestListOnlyDialog', function(){
        expect(target.internal.showGuestListOnlyDialog).toHaveBeenCalled();
      });

      it('should complete successfully indicating no subscription occurred', function(){
        expect(result).toBe(false);
      });
    });

    describe('when getUserInformation fails', function(){
      beforeEach(function(){
        deferredUserInformation.resolve($q.reject('error'));
        $rootScope.$apply();
      });

      it('should not call putBlogSubscriptions', function(){
        expect(subscriptionStub.putBlogSubscriptions).not.toHaveBeenCalled();
      });

      it('should not complete successfully', function(){
        expect(result).toBeUndefined();
      });

      it('should propagate the error', function(){
        expect(error).toBe('error');
      });
    });
  });

  describe('when unsubscribe is called', function(){

    var deferredUserInformation;
    var complete;
    var error;
    beforeEach(function(){
      deferredUserInformation = $q.defer();
      spyOn(target.internal, 'getUserInformation').and.returnValue(deferredUserInformation.promise);
      complete = false;
      target.unsubscribe('blogId').then(function(){ complete = true; }, function(e){ error = e; });
      $rootScope.$apply();
    });

    it('should call getUserInformation', function(){
      expect(target.internal.getUserInformation).toHaveBeenCalledWith('blogId');
    });

    describe('when user is the blog owner', function(){
      beforeEach(function(){
        deferredUserInformation.resolve($q.when({
          isOwner: true
        }));
        $rootScope.$apply();
      });

      it('should not call putBlogSubscriptions', function(){
        expect(subscriptionStub.putBlogSubscriptions).not.toHaveBeenCalled();
      });

      it('should complete successfully', function(){
        expect(complete).toBe(true);
      });
    });

    describe('when user is not the owner', function(){
      beforeEach(function(){
        subscriptionStub.putBlogSubscriptions.and.returnValue($q.when());
        deferredUserInformation.resolve($q.when({
          isOwner: false,
          userId: 'userId'
        }));
        $rootScope.$apply();
      });

      it('should call putBlogSubscriptions', function(){
        expect(subscriptionStub.putBlogSubscriptions).toHaveBeenCalledWith('blogId', { subscriptions: [] });
      });

      it('should update the user state', function(){
        expect(fetchAggregateUserState.updateFromServer).toHaveBeenCalledWith('userId');
      });

      it('should complete successfully', function(){
        expect(complete).toBe(true);
      });
    });

    describe('when getUserInformation fails', function(){
      beforeEach(function(){
        deferredUserInformation.resolve($q.reject('error'));
        $rootScope.$apply();
      });

      it('should not call putBlogSubscriptions', function(){
        expect(subscriptionStub.putBlogSubscriptions).not.toHaveBeenCalled();
      });

      it('should not update the user state', function(){
        expect(fetchAggregateUserState.updateFromServer).not.toHaveBeenCalled();
      });

      it('should not complete successfully', function(){
        expect(complete).toBe(false);
      });

      it('should propagate the error', function(){
        expect(error).toBe('error');
      });
    });
  });

  describe('when getSubscriptionStatus is called', function(){
    var deferredSubscription;
    var deferredUserState;
    var result;
    var error;
    beforeEach(function(){
      subscriptionRepository.getUserId.and.returnValue('userId');
      deferredSubscription = $q.defer();
      deferredUserState = $q.defer();
      fetchAggregateUserState.updateIfStale.and.returnValue(deferredUserState.promise);
      subscriptionRepository.tryGetBlogs.and.returnValue(deferredSubscription.promise);
      target.getSubscriptionStatus(subscriptionRepository, 'blogId')
        .then(function(r){ result = r; }, function(e) { error = e; });
      $rootScope.$apply();
    });

    describe('when calls succeed', function(){

      beforeEach(function(){
        deferredUserState.resolve($q.when());
      });

      describe('when user is not subscribed', function(){
        beforeEach(function(){
          deferredSubscription.resolve(undefined);
          $rootScope.$apply();
        });

        it('should set hasFreeAccess to false', function(){
          expect(result.hasFreeAccess).toBe(false);
        });

        it('should set isSubscribed to false', function(){
          expect(result.isSubscribed).toBe(false);
        });

        it('should set userId', function(){
          expect(result.userId).toBe('userId');
        });
      });

      describe('when user is subscribed', function(){
        beforeEach(function(){
          deferredSubscription.resolve([{
            blogId: 'blogId',
            freeAccess: false,
            channels: [{ channelId: 'channelId' }]
          }]);
          $rootScope.$apply();
        });

        it('should set hasFreeAccess to false', function(){
          expect(result.hasFreeAccess).toBe(false);
        });

        it('should set isSubscribed to false', function(){
          expect(result.isSubscribed).toBe(true);
        });

        it('should set userId', function(){
          expect(result.userId).toBe('userId');
        });
      });

      describe('when user has free access', function(){
        beforeEach(function(){
          deferredSubscription.resolve([{
            blogId: 'blogId',
            freeAccess: true,
            channels: []
          }]);
          $rootScope.$apply();
        });

        it('should set hasFreeAccess to false', function(){
          expect(result.hasFreeAccess).toBe(true);
        });

        it('should set isSubscribed to false', function(){
          expect(result.isSubscribed).toBe(false);
        });

        it('should set userId', function(){
          expect(result.userId).toBe('userId');
        });
      });
    });

    describe('when updateIfStale fails', function() {
      beforeEach(function(){
        deferredUserState.reject('error');
        $rootScope.$apply();
      });

      it('should propagate the error', function(){
        expect(error).toBe('error');
      });
    });

    describe('when tryGetBlogs fails', function() {
      beforeEach(function(){
        deferredUserState.resolve($q.when());
        deferredSubscription.reject('error');
        $rootScope.$apply();
      });

      it('should propagate the error', function(){
        expect(error).toBe('error');
      });
    });
  });

  describe('when getUserInformation is called', function(){
    var deferredSubscriptionStatus;
    var deferredBlog;
    var result;
    var error;
    beforeEach(function(){
      result = undefined;
      error = undefined;
      deferredSubscriptionStatus = $q.defer();
      deferredBlog = $q.defer();
      spyOn(target, 'getSubscriptionStatus').and.returnValue(deferredSubscriptionStatus.promise);
      blogRepository.tryGetBlog.and.returnValue(deferredBlog.promise);

      target.internal.getUserInformation('blogId').then(function(r){ result = r; }, function(e){ error = e; });
      $rootScope.$apply();
    });

    it('should call getSubscriptionStatus', function(){
      expect(target.getSubscriptionStatus).toHaveBeenCalledWith(subscriptionRepository, 'blogId');
    });

    describe('when getSubscriptionStatus succeeds', function(){
      beforeEach(function(){
        deferredSubscriptionStatus.resolve({
          freeAccess: true
        });
        $rootScope.$apply();
      });

      it('should call tryGetBlog', function(){
        expect(blogRepository.tryGetBlog).toHaveBeenCalledWith();
      });

      describe('when tryGetBlog succeeds and blogIds match', function(){
        beforeEach(function(){
          deferredBlog.resolve({
            blogId: 'blogId'
          });
          $rootScope.$apply();
        });

        it('should complete successfully', function(){
          expect(result).toBeDefined();
        });

        it('should contain the subscription status', function(){
          expect(result.freeAccess).toBe(true);
        });

        it('should set the currentUserBlogId', function(){
          expect(result.currentUserBlogId).toBe('blogId');
        });

        it('should set isOwner to true', function(){
          expect(result.isOwner).toBe(true);
        });
      });

      describe('when tryGetBlog succeeds and blogIds do not match', function(){
        beforeEach(function(){
          deferredBlog.resolve({
            blogId: 'currentUserBlogId'
          });
          $rootScope.$apply();
        });

        it('should complete successfully', function(){
          expect(result).toBeDefined();
        });

        it('should contain the subscription status', function(){
          expect(result.freeAccess).toBe(true);
        });

        it('should set the currentUserBlogId', function(){
          expect(result.currentUserBlogId).toBe('currentUserBlogId');
        });

        it('should set isOwner to false', function(){
          expect(result.isOwner).toBe(false);
        });
      });

      describe('when tryGetBlog succeeds and the user has no blog', function(){
        beforeEach(function(){
          deferredBlog.resolve(undefined);
          $rootScope.$apply();
        });

        it('should complete successfully', function(){
          expect(result).toBeDefined();
        });

        it('should contain the subscription status', function(){
          expect(result.freeAccess).toBe(true);
        });

        it('should set the currentUserBlogId to undefined', function(){
          expect(result.currentUserBlogId).toBeUndefined();
        });

        it('should set isOwner to false', function(){
          expect(result.isOwner).toBe(false);
        });
      });

      describe('when tryGetBlog fails', function(){
        beforeEach(function(){
          deferredBlog.reject('error');
          $rootScope.$apply();
        });

        it('should not complete successfully', function(){
          expect(result).toBeUndefined();
        });

        it('should propagate the error', function(){
          expect(error).toBe('error');
        });
      });
    });

    describe('when getSubscriptionStatus fails', function(){
      beforeEach(function(){
        deferredSubscriptionStatus.reject('error');
        $rootScope.$apply();
      });

      it('should not complete successfully', function(){
        expect(result).toBeUndefined();
      });

      it('should propagate the error', function(){
        expect(error).toBe('error');
      });
    });
  });

  describe('when handleDialogError is called', function(){

    it('should propagate Error derived objects', function(){
      var error;
      target.internal.handleDialogError(new FifthweekError('error')).catch(function(e){ error = e; });
      $rootScope.$apply();

      expect(error).toBeDefined();
      expect(error instanceof FifthweekError).toBe(true);
      expect(error.message).toBe('error');
    });

    it('should absorb non Error derived objects', function(){
      var error;
      target.internal.handleDialogError('error').catch(function(e){ error = e; });
      $rootScope.$apply();

      expect(error).toBeUndefined();
    });
  });

  describe('when beginSignInWorkflow is called', function(){
    var deferredResult;
    var error;
    var result;
    beforeEach(function(){
      deferredResult = $q.defer();
      $modal.open.and.returnValue({ result: deferredResult.promise });
      spyOn(target.internal, 'handleDialogError').and.returnValue($q.reject('handledError'));
      target.internal.beginSignInWorkflow().then(function(r){ result = r; }, function(e){ error = e; });
      $rootScope.$apply();
    });

    it('should call $modal.open', function(){
      expect($modal.open).toHaveBeenCalledWith({
        controller: 'signInWorkflowDialogCtrl',
        templateUrl: 'modules/landing-page/sign-in-workflow-dialog.html',
        size: 'sm'
      });
    });

    describe('when modal succeeds', function(){
      beforeEach(function(){
        deferredResult.resolve($q.when('result'));
        $rootScope.$apply();
      });

      it('should propagate the result', function(){
        expect(result).toBe('result');
      });
    });

    describe('when modal fails', function(){
      beforeEach(function(){
        deferredResult.reject('error');
        $rootScope.$apply();
      });

      it('should call handleDialogError', function(){
        expect(target.internal.handleDialogError).toHaveBeenCalledWith('error');
      });

      it('should propagate the error', function(){
        expect(error).toBe('handledError');
      });
    });
  });

  describe('when showGuestListOnlyDialog is called', function(){
    var deferredResult;
    var error;
    var result;
    beforeEach(function(){
      deferredResult = $q.defer();
      $modal.open.and.returnValue({ result: deferredResult.promise });
      spyOn(target.internal, 'handleDialogError').and.returnValue($q.reject('handledError'));
      target.internal.showGuestListOnlyDialog().then(function(r){ result = r; }, function(e){ error = e; });
      $rootScope.$apply();
    });

    it('should call $modal.open', function(){
      expect($modal.open).toHaveBeenCalledWith({
        templateUrl: 'modules/landing-page/guest-list-only-dialog.html',
        size: 'sm'
      });
    });

    describe('when modal succeeds', function(){
      beforeEach(function(){
        deferredResult.resolve($q.when('result'));
        $rootScope.$apply();
      });

      it('should propagate the result', function(){
        expect(result).toBe('result');
      });
    });

    describe('when modal fails', function(){
      beforeEach(function(){
        deferredResult.reject('error');
        $rootScope.$apply();
      });

      it('should call handleDialogError', function(){
        expect(target.internal.handleDialogError).toHaveBeenCalledWith('error');
      });

      it('should propagate the error', function(){
        expect(error).toBe('handledError');
      });
    });
  });

  describe('when ensureSignedIn is called', function(){
    var deferredUserInformation;
    var deferredSignInWorkflow;
    var error;
    var result;
    beforeEach(function(){
      error = undefined;
      result = undefined;
      deferredUserInformation = $q.defer();
      deferredSignInWorkflow = $q.defer();
      spyOn(target.internal, 'getUserInformation').and.returnValue(deferredUserInformation.promise);
      spyOn(target.internal, 'beginSignInWorkflow').and.returnValue(deferredSignInWorkflow.promise);

      target.internal.ensureSignedIn('blogId').then(function(r){ result = r; }, function(e){ error = e; });
      $rootScope.$apply();
    });

    it('should call getUserInformation', function(){
      expect(target.internal.getUserInformation).toHaveBeenCalledWith('blogId');
    });

    describe('when getUserInformation returns a signed in user', function(){
      beforeEach(function(){
        deferredUserInformation.resolve({
          userId: 'userId'
        });
        $rootScope.$apply();
      });

      it('should not call beginSignInWorkflow', function(){
        expect(target.internal.beginSignInWorkflow).not.toHaveBeenCalled();
      });

      it('should return true to indicate the user is signed in', function(){
        expect(result).toBe(true);
      });
    });

    describe('when getUserInformation returns a signed out user', function(){
      beforeEach(function(){
        deferredUserInformation.resolve({
          userId: undefined
        });
        $rootScope.$apply();
      });

      it('should call beginSignInWorkflow', function(){
        expect(target.internal.beginSignInWorkflow).toHaveBeenCalledWith();
      });

      describe('when beginSignInWorkflow succeeds', function(){
        beforeEach(function(){
          deferredSignInWorkflow.resolve('result');
          $rootScope.$apply();
        });

        it('should propagate the result', function(){
          expect(result).toBe('result');
        });
      });

      describe('when beginSignInWorkflow fails', function(){
        beforeEach(function(){
          deferredSignInWorkflow.reject('error');
          $rootScope.$apply();
        });

        it('should propagate the error', function(){
          expect(error).toBe('error');
        });
      });
    });

    describe('when getUserInformation fails', function(){
      beforeEach(function(){
        deferredUserInformation.reject('error');
        $rootScope.$apply();
      });

      it('should not call beginSignInWorkflow', function(){
        expect(target.internal.beginSignInWorkflow).not.toHaveBeenCalled();
      });

      it('should propagate the error', function(){
        expect(error).toBe('error');
      });
    });
  });

  describe('when getSignedInUserInformation is called', function(){
    var deferredEnsureSignedIn;
    var deferredWaitForExistingUpdate;
    var deferredGetUserInformation;
    var result;
    var error;
    beforeEach(function(){
      error = undefined;
      result = undefined;

      deferredEnsureSignedIn = $q.defer();
      deferredWaitForExistingUpdate = $q.defer();
      deferredGetUserInformation = $q.defer();

      spyOn(target.internal, 'ensureSignedIn').and.returnValue(deferredEnsureSignedIn.promise);
      fetchAggregateUserState.waitForExistingUpdate.and.returnValue(deferredWaitForExistingUpdate.promise);
      spyOn(target.internal, 'getUserInformation').and.returnValue(deferredGetUserInformation.promise);

      target.internal.getSignedInUserInformation('blogId').then(function(r){ result = r; }, function(e){ error = e; });
      $rootScope.$apply();
    });

    it('should call ensureSignedIn', function(){
      expect(target.internal.ensureSignedIn).toHaveBeenCalledWith('blogId');
    });

    describe('when ensureSignedIn returns true', function(){
      beforeEach(function(){
        deferredEnsureSignedIn.resolve(true);
        $rootScope.$apply();
      });

      it('should call waitForExistingUpdate', function(){
        expect(fetchAggregateUserState.waitForExistingUpdate).toHaveBeenCalledWith();
      });

      describe('when waitForExistingUpdate succeeds', function(){
        beforeEach(function(){
          deferredWaitForExistingUpdate.resolve();
          $rootScope.$apply();
        });

        it('should call getUserInformation', function(){
          expect(target.internal.getUserInformation).toHaveBeenCalledWith('blogId');
        });

        describe('when getUserInformation succeeds', function(){
          beforeEach(function(){
            deferredGetUserInformation.resolve('result');
            $rootScope.$apply();
          });

          it('should propagate the result', function(){
            expect(result).toBe('result');
          });
        });

        describe('when getUserInformation fails', function(){
          beforeEach(function(){
            deferredGetUserInformation.reject('error');
            $rootScope.$apply();
          });

          it('should propagate the error', function(){
            expect(error).toBe('error');
          });
        });
      });

      describe('when waitForExistingUpdate fails', function(){
        beforeEach(function(){
          deferredWaitForExistingUpdate.reject('error');
          $rootScope.$apply();
        });

        it('should propagate the error', function(){
          expect(error).toBe('error');
        });

        it('should not call getUserInformation', function(){
          expect(target.internal.getUserInformation).not.toHaveBeenCalled();
        });
      });
    });

    describe('when ensureSignedIn returns false', function(){
      beforeEach(function(){
        deferredEnsureSignedIn.resolve(false);
        $rootScope.$apply();
      });

      it('should return false', function(){
        expect(result).toBe(false);
      });

      it('should not call waitForExistingUpdate', function(){
        expect(fetchAggregateUserState.waitForExistingUpdate).not.toHaveBeenCalled();
      });

      it('should not call getUserInformation', function(){
        expect(target.internal.getUserInformation).not.toHaveBeenCalled();
      });
    });

    describe('when ensureSignedIn fails', function(){
      beforeEach(function(){
        deferredEnsureSignedIn.reject('error');
        $rootScope.$apply();
      });

      it('should propagate the error', function(){
        expect(error).toBe('error');
      });

      it('should not call waitForExistingUpdate', function(){
        expect(fetchAggregateUserState.waitForExistingUpdate).not.toHaveBeenCalled();
      });

      it('should not call getUserInformation', function(){
        expect(target.internal.getUserInformation).not.toHaveBeenCalled();
      });
    });
  });
});
