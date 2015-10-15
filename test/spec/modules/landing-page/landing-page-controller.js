describe('landing page controller', function () {
  'use strict';

  var channelPrice0 = 69;
  var channelPrice1 = 45;
  var channelPrice2 = 99;
  var channelPriceHidden = 11;

  var error404 = new ApiError('', {status: 404});
  var error400 = new ApiError('', { status: 400 });

  var $controller;
  var $q;
  var $scope;
  var target;
  var landingPageConstants;
  var aggregateUserStateConstants;

  var $sce;
  var blogStub;
  var subscribeService;
  var accountSettingsRepositoryFactory;
  var accountSettingsRepository;
  var blogRepositoryFactory;
  var blogRepository;
  var subscriptionRepositoryFactory;
  var subscriptionRepository;
  var initializer;
  var $stateParams;
  var $state;
  var states;
  var errorFacade;
  var authenticationServiceConstants;
  var fetchAggregateUserState;

  var accountSettings;

  beforeEach(function() {
    $sce = jasmine.createSpyObj('$sce', ['trustAsResourceUrl']);
    blogStub = jasmine.createSpyObj('blogStub', ['getLandingPage']);
    subscribeService = jasmine.createSpyObj('subscribeService', ['subscribe', 'unsubscribe', 'getSubscriptionStatus']);
    accountSettingsRepository = jasmine.createSpyObj('accountSettingsRepository', ['getAccountSettings']);
    accountSettingsRepositoryFactory = jasmine.createSpyObj('accountSettingsRepositoryFactory', ['forCurrentUser']);
    accountSettingsRepositoryFactory.forCurrentUser.and.returnValue(accountSettingsRepository);
    blogRepository = jasmine.createSpyObj('blogRepository', ['getBlog', 'getUserId']);
    blogRepositoryFactory = jasmine.createSpyObj('blogRepositoryFactory', ['forCurrentUser']);
    blogRepositoryFactory.forCurrentUser.and.returnValue(blogRepository);
    subscriptionRepository = jasmine.createSpyObj('subscriptionRepository', ['tryGetBlogs']);
    subscriptionRepositoryFactory = jasmine.createSpyObj('subscriptionRepositoryFactory', ['forCurrentUser']);
    subscriptionRepositoryFactory.forCurrentUser.and.returnValue(subscriptionRepository);
    initializer = jasmine.createSpyObj('initializer', ['initialize']);
    $state = jasmine.createSpyObj('$state', ['go', 'reload']);
    $stateParams = {};
    fetchAggregateUserState = jasmine.createSpyObj('fetchAggregateUserState', ['waitForExistingUpdate']);
    errorFacade = jasmine.createSpyObj('errorFacade', ['handleError']);

    errorFacade.handleError.and.callFake(function(error, delegate){ delegate('friendlyError'); });

    module('webApp');
    module(function($provide) {
      $provide.value('$sce', $sce);
      $provide.value('blogStub', blogStub);
      $provide.value('subscribeService', subscribeService);
      $provide.value('accountSettingsRepositoryFactory', accountSettingsRepositoryFactory);
      $provide.value('blogRepositoryFactory', blogRepositoryFactory);
      $provide.value('subscriptionRepositoryFactory', subscriptionRepositoryFactory);
      $provide.value('initializer', initializer);
      $provide.value('$stateParams', $stateParams);
      $provide.value('$state', $state);
      $provide.value('fetchAggregateUserState', fetchAggregateUserState);
      $provide.value('errorFacade', errorFacade);
    });

    inject(function ($injector) {
      $q = $injector.get('$q');
      $scope = $injector.get('$rootScope').$new();
      $controller = $injector.get('$controller');
      states = $injector.get('states');
      landingPageConstants = $injector.get('landingPageConstants');
      aggregateUserStateConstants = $injector.get('aggregateUserStateConstants');
      authenticationServiceConstants = $injector.get('authenticationServiceConstants');
    });

    accountSettings = { username: 'username', profileImage: { fileId: 'fileId' } };
  });

  var initializeTarget = function() {
    target = $controller('landingPageCtrl', { $scope: $scope });
    $scope.$apply();
  };

  describe('when creating', function(){
    beforeEach(function(){
      initializeTarget();
    });

    it('should expose tracking information', function() {
      expect($scope.model.tracking.unsubscribedTitle).toBe('Unsubscribed');
      expect($scope.model.tracking.updatedTitle).toBe('Subscription Updated');
      expect($scope.model.tracking.subscribedTitle).toBe('Subscribed');
      expect($scope.model.tracking.category).toBe('Timeline');
    });

    it('should expose a default blog state of "unsubscribed"', function() {
      expect($scope.model.isSubscribed).toBe(false);
    });

    it('should set isLoaded to false', function(){
      expect($scope.model.isLoaded).toBe(false);
    });

    it('should set isOwner to false', function(){
      expect($scope.model.isOwner).toBe(false);
    });

    it('should set hasFreeAccess to false', function(){
      expect($scope.model.hasFreeAccess).toBe(false);
    });

    it('should set subscribedChannels to an empty object', function(){
      expect($scope.model.subscribedChannels).toEqual({});
    });

    it('should get an account settings repository', function(){
      expect(accountSettingsRepositoryFactory.forCurrentUser).toHaveBeenCalledWith();
    });

    it('should get a blog repository', function(){
      expect(blogRepositoryFactory.forCurrentUser).toHaveBeenCalledWith();
    });

    it('should get a subscription repository', function(){
      expect(subscriptionRepositoryFactory.forCurrentUser).toHaveBeenCalledWith();
    });

    it('should initialize with the loadLandingPage function', function(){
      expect(initializer.initialize).toHaveBeenCalledWith(target.internal.initialize);
    });
  });

  describe('when created', function(){
    beforeEach(function(){
      initializeTarget();
    });

    describe('when subscribe is called', function(){
      describe('when no channels are checked', function() {
        var success;
        var error;
        var deferredResult;
        beforeEach(function(){
          deferredResult = $q.defer();
          spyOn($scope, 'unsubscribe').and.returnValue(deferredResult.promise);

          $scope.model.blog = {
            blogId: 'blogId'
          };

          $scope.model.channels = [
            {
              checked: false,
              channelId: 'channelId1',
              price: 10
            },
            {
              checked: false,
              channelId: 'channelId2',
              price: 20
            },
            {
              checked: false,
              channelId: 'channelId3',
              price: 30
            }
          ];

          $scope.model.isSubscribed = false;

          $scope.subscribe().then(function(){ success = true; }, function(e){ error = e; });
          $scope.$apply();
        });

        it('should call unsubscribe', function(){
          expect($scope.unsubscribe).toHaveBeenCalledWith();
        });

        describe('when unsubscribe succeeds', function(){
          beforeEach(function(){
            deferredResult.resolve();
            $scope.$apply();
          });

          it('should complete successfully', function(){
            expect(success).toBe(true);
          });
        });

        describe('when unsubscribe fails', function(){
          beforeEach(function(){
            deferredResult.reject('error');
            $scope.$apply();
          });

          it('should propagate the error', function(){
            expect(error).toBe('error');
          });
        });
      });

      describe('when channels are checked', function(){
        var deferredResult;
        var error;
        beforeEach(function(){
          deferredResult = $q.defer();
          subscribeService.subscribe.and.returnValue(deferredResult.promise);

          $scope.model.blog = {
            blogId: 'blogId'
          };

          $scope.model.channels = [
            {
              checked: true,
              channelId: 'channelId1',
              price: 10
            },
            {
              checked: false,
              channelId: 'channelId2',
              price: 20
            },
            {
              checked: true,
              channelId: 'channelId3',
              price: 30
            }
          ];

          $scope.model.isSubscribed = false;
        });

        var testSubscribe = function(){
          describe('when subscribeService succeeds indicating user subscribed', function(){
            beforeEach(function(){
              $scope.model.isOwner = false;
            });

            describe('when isOwner is false', function(){
              beforeEach(function(){
                spyOn(target.internal, 'redirectIfRequired').and.returnValue(true);
                spyOn(target.internal, 'redirectToUnfilteredViewIfRequired').and.returnValue(true);
                deferredResult.resolve(true);
                $scope.$apply();
              });

              it('should not set isSubscribed to true', function(){
                expect($scope.model.isSubscribed).toBe(false);
              });
            });

            describe('when isOwner is true', function(){
              beforeEach(function(){
                $scope.model.isOwner = true;
                spyOn(target.internal, 'redirectIfRequired').and.returnValue(true);
                spyOn(target.internal, 'redirectToUnfilteredViewIfRequired').and.returnValue(true);
                deferredResult.resolve(true);
                $scope.$apply();
              });

              it('should not call redirectIfRequired ', function(){
                expect(target.internal.redirectIfRequired).not.toHaveBeenCalledWith();
              });

              it('should not call redirectToUnfilteredViewIfRequired ', function(){
                expect(target.internal.redirectToUnfilteredViewIfRequired).not.toHaveBeenCalledWith();
              });

              it('should set isSubscribed to true', function(){
                expect($scope.model.isSubscribed).toBe(true);
              });

              it('should set channelId to undefined', function(){
                expect($scope.model.channelId).toBeUndefined();
              });

              it('should set the current view to the blog', function(){
                expect($scope.model.currentView).toBe(landingPageConstants.views.blog);
              });
            });

            describe('when redirectIfRequired returns true', function(){
              beforeEach(function(){
                spyOn(target.internal, 'redirectIfRequired').and.returnValue(true);
                spyOn(target.internal, 'redirectToUnfilteredViewIfRequired').and.returnValue(false);
                deferredResult.resolve(true);
                $scope.$apply();
              });

              it('should call redirectIfRequired with true parameter', function(){
                expect(target.internal.redirectIfRequired).toHaveBeenCalledWith(true);
              });

              it('should not set isSubscribed to true', function(){
                expect($scope.model.isSubscribed).toBe(false);
              });
            });

            describe('when redirectToUnfilteredViewIfRequired returns true', function(){
              beforeEach(function(){
                spyOn(target.internal, 'redirectIfRequired').and.returnValue(false);
                spyOn(target.internal, 'redirectToUnfilteredViewIfRequired').and.returnValue(true);
                deferredResult.resolve(true);
                $scope.$apply();
              });

              it('should call redirectIfRequired with true parameter', function(){
                expect(target.internal.redirectIfRequired).toHaveBeenCalledWith(true);
              });

              it('should not set isSubscribed to true', function(){
                expect($scope.model.isSubscribed).toBe(false);
              });
            });

            describe('when redirectIfRequired and redirectToUnfilteredViewIfRequired returns false', function(){
              beforeEach(function(){
                spyOn(target.internal, 'redirectIfRequired').and.returnValue(false);
                spyOn(target.internal, 'redirectToUnfilteredViewIfRequired').and.returnValue(false);
                deferredResult.resolve(true);
                $scope.$apply();
              });

              it('should call redirectIfRequired with true parameter', function(){
                expect(target.internal.redirectIfRequired).toHaveBeenCalledWith(true);
              });

              it('should set isSubscribed to true', function(){
                expect($scope.model.isSubscribed).toBe(true);
              });

              it('should set channelId to undefined', function(){
                expect($scope.model.channelId).toBeUndefined();
              });

              it('should set the current view to the blog', function(){
                expect($scope.model.currentView).toBe(landingPageConstants.views.blog);
              });
            });
          });

          describe('when subscribeService succeeds indicating user has not subscribed', function(){
            beforeEach(function(){
              deferredResult.resolve(false);
              $scope.$apply();
            });

            it('should not set isSubscribed to true', function(){
              expect($scope.model.isSubscribed).toBe(false);
            });
          });

          describe('when subscribeService fails', function(){
            beforeEach(function(){
              deferredResult.reject('error');
              $scope.$apply();
            });

            it('should not set isSubscribed to true', function(){
              expect($scope.model.isSubscribed).toBe(false);
            });

            it('should propagate the error', function(){
              expect(error).toBe('error');
            });
          });
        };

        describe('when user has free access', function(){
          beforeEach(function(){
            $scope.model.hasFreeAccess = true;
            $scope.subscribe().catch(function(e){ error = e; });
            $scope.$apply();
          });

          it('should call subscribeService with zero accepted price', function(){
            expect(subscribeService.subscribe).toHaveBeenCalledWith('blogId', [
                { channelId: 'channelId1', acceptedPrice: 0 },
                { channelId: 'channelId3', acceptedPrice: 0 }
              ]
            );
          });

          testSubscribe();
        });

        describe('when user does not have free access', function(){
          beforeEach(function(){
            $scope.model.hasFreeAccess = false;
            $scope.subscribe().catch(function(e){ error = e; });
            $scope.$apply();
          });

          it('should call subscribeService with zero accepted price', function(){
            expect(subscribeService.subscribe).toHaveBeenCalledWith('blogId', [
                { channelId: 'channelId1', acceptedPrice: 10 },
                { channelId: 'channelId3', acceptedPrice: 30 }
              ]
            );
          });

          testSubscribe();
        });
      });
    });

    describe('when unsubscribe is called', function(){

      describe('when user is owner of blog', function(){
        beforeEach(function(){
          $scope.model.isOwner = true;
          $scope.unsubscribe();
          $scope.$apply();
        });

        it('should reload the state', function(){
          expect($state.reload).toHaveBeenCalledWith();
        });

        it('should not call subscribeService', function(){
          expect(subscribeService.unsubscribe).not.toHaveBeenCalled();
        });
      });

      describe('when user is not owner of blog', function(){
        var deferredResult;
        var error;
        beforeEach(function(){
          $scope.model.isOwner = false;

          deferredResult = $q.defer();
          subscribeService.unsubscribe.and.returnValue(deferredResult.promise);

          $scope.model.blog = {
            blogId: 'blogId'
          };

          $scope.model.isSubscribed = true;

          $scope.unsubscribe().catch(function(e){ error = e; });
          $scope.$apply();
        });

        it('should call subscribeService', function(){
          expect(subscribeService.unsubscribe).toHaveBeenCalledWith('blogId');
        });

        describe('when subscribeService succeeds', function(){
          beforeEach(function(){
            spyOn(target.internal, 'redirectIfRequired');
            deferredResult.resolve();
            $scope.$apply();
          });

          it('should set call redirectIfRequired', function(){
            expect(target.internal.redirectIfRequired).toHaveBeenCalledWith();
          });
        });

        describe('when subscribeService fails', function(){
          beforeEach(function(){
            deferredResult.reject('error');
            $scope.$apply();
          });

          it('should not set isSubscribed to false', function(){
            expect($scope.model.isSubscribed).toBe(true);
          });

          it('should propagate the error', function(){
            expect(error).toBe('error');
          });
        });
      });
    });

    describe('when manageSubscription is called', function(){
      it('should set the view to manage', function(){
        $scope.model.currentView = 'view';
        $scope.manageSubscription();
        expect($scope.model.currentView).toBe(landingPageConstants.views.manage);
      });
    });

    describe('when cancelManageSubscription is called', function(){
      beforeEach(function(){
        $scope.model.currentView = 'view';
        spyOn(target.internal, 'redirectIfRequired');
      });

      describe('when redirectIfRequired returns true', function(){
        beforeEach(function(){
          target.internal.redirectIfRequired.and.returnValue(true);
          $scope.cancelManageSubscription();
        });

        it('should call redirectIfRequired with no parameters', function(){
          expect(target.internal.redirectIfRequired).toHaveBeenCalledWith();
        });

        it('should not update the view', function(){
          expect($scope.model.currentView).toBe('view');
        });
      });

      describe('when redirectIfRequired returns false', function(){
        beforeEach(function(){
          target.internal.redirectIfRequired.and.returnValue(false);
          $scope.cancelManageSubscription();
        });

        it('should call redirectIfRequired with no parameters', function(){
          expect(target.internal.redirectIfRequired).toHaveBeenCalledWith();
        });

        it('should update the view', function(){
          expect($scope.model.currentView).toBe(landingPageConstants.views.blog);
        });
      });
    });

    describe('when preview is called', function(){
      describe('when channelId is not specified', function(){
        beforeEach(function(){
          $state.current = { name: 'current-state' };
          $scope.model.username = 'username';

          $scope.preview();
        });

        it('should redirect to previewing all', function(){
          expect($state.go).toHaveBeenCalledWith('current-state', { username: 'username', action: landingPageConstants.actions.previewAll, key: null });
        });
      });

      describe('when channelId is specified', function(){
        beforeEach(function(){
          $state.current = { name: 'current-state' };
          $scope.model.username = 'username';

          $scope.preview('channelId');
        });

        it('should redirect to previewing the channel', function(){
          expect($state.go).toHaveBeenCalledWith('current-state', { username: 'username', action: landingPageConstants.actions.previewChannel, key: 'channelId' });
        });
      });
    });

    describe('when cancelPreview is called', function(){
      beforeEach(function(){
        $state.current = { name: 'current-state' };
        $scope.model.username = 'username';

        $scope.cancelPreview();
      });

      it('should redirect to manage', function(){
        expect($state.go).toHaveBeenCalledWith('current-state', { username: 'username', action: landingPageConstants.actions.manage, key: null });
      });
    });

    describe('when ownerReturnToLandingPage is called', function(){
      describe('when on sub-page', function(){
        beforeEach(function(){
          $stateParams.action = 'an-action';
          $state.current = { name: 'current-state' };
          $scope.model.username = 'username';

          $scope.ownerReturnToLandingPage();
        });

        it('should redirect to actionless page', function(){
          expect($state.go).toHaveBeenCalledWith('current-state', { username: 'username', action: null, key: null });
        });
      });

      describe('when not on sub-page', function(){
        beforeEach(function(){
          $stateParams.action = null;
          $state.current = { name: 'current-state' };
          $scope.model.username = 'username';

          $scope.ownerReturnToLandingPage();
        });

        it('should refresh state', function(){
          expect($state.reload).toHaveBeenCalledWith();
        });
      });
    });

    describe('when currentUserUpdated is called', function(){
      describe('when isOwner changes', function(){
        beforeEach(function(){
          $scope.model.isOwner = false;
          $scope.model.userId = 'A';

          target.internal.currentUserUpdated({}, { userId: 'A' });
        });

        it('should reload the current state', function(){
          expect($state.reload).toHaveBeenCalledWith();
        });
      });

      describe('when isOwner does not change', function(){
        beforeEach(function(){
          $scope.model.isOwner = false;
          $scope.model.userId = 'A';

          target.internal.currentUserUpdated({}, { userId: 'B' });
        });

        it('should not reload the current state', function(){
          expect($state.reload).not.toHaveBeenCalled();
        });

        it('should get an account settings repository', function(){
          expect(accountSettingsRepositoryFactory.forCurrentUser).toHaveBeenCalledWith();
        });

        it('should get a blog repository', function(){
          expect(blogRepositoryFactory.forCurrentUser).toHaveBeenCalledWith();
        });

        it('should get a subscription repository', function(){
          expect(subscriptionRepositoryFactory.forCurrentUser).toHaveBeenCalledWith();
        });
      });
    });

    describe('when loadFromApi is called', function(){

      beforeEach(function(){
        $scope.model.isOwner = true;
      });

      describe('when getLandingPage succeeds', function(){
        beforeEach(function(){
          $scope.model = {
            a: 'a',
            b: {
              c: 'c'
            }
          };
          blogStub.getLandingPage.and.returnValue($q.when({ data: {
            b: {
              d: 'd'
            },
            e: 'e',
            blog: {
              blogId: 'blogId'
            }
          }}));
        });

        describe('when populateSubscriptionFromUserState succeeds', function(){
          beforeEach(function(){
            spyOn(target.internal, 'populateSubscriptionFromUserState').and.returnValue($q.when());
            target.internal.loadFromApi('username');
            $scope.$apply();
          });

          it('should merge the landing page data with the model', function(){
            expect($scope.model).toEqual({
              isOwner: false,
              a: 'a',
              b: {
                c: 'c',
                d: 'd'
              },
              e: 'e',
              blog: {
                blogId: 'blogId'
              }
            });
          });

          it('should call populateSubscriptionFromUserState', function(){
            expect(target.internal.populateSubscriptionFromUserState).toHaveBeenCalledWith('blogId');
          });
        });

        describe('when populateSubscriptionFromUserState fails', function(){
          var error;
          beforeEach(function(){
            spyOn(target.internal, 'populateSubscriptionFromUserState').and.returnValue($q.reject('error'));
            target.internal.loadFromApi('username').catch(function(e){ error = e; });
            $scope.$apply();
          });

          it('should merge the landing page data with the model', function(){
            expect($scope.model).toEqual({
              isOwner: false,
              a: 'a',
              b: {
                c: 'c',
                d: 'd'
              },
              e: 'e',
              blog: {
                blogId: 'blogId'
              }
            });
          });

          it('should call populateSubscriptionFromUserState', function(){
            expect(target.internal.populateSubscriptionFromUserState).toHaveBeenCalledWith('blogId');
          });

          it('should propagate the error', function(){
            expect(error).toBe('error');
          });
        });
      });

      describe('when getLandingPage fails with 404', function(){
        var error;
        var result;
        beforeEach(function(){
          error = undefined;
          result = undefined;
          blogStub.getLandingPage.and.returnValue($q.reject(error404));
          target.internal.loadFromApi('username').then(function(r){ result = r; }).catch(function(e){ error = e; });
          $scope.$apply();
        });

        it('should propagate the error', function(){
          expect(error).toBe(error404);
        });

        it('should set isOwner to false', function(){
          expect($scope.model.isOwner).toBe(false);
        });
      });

      describe('when getLandingPage fails', function(){
        var error;
        var result;
        beforeEach(function(){
          error = undefined;
          result = undefined;
          blogStub.getLandingPage.and.returnValue($q.reject(error400));
          target.internal.loadFromApi('username').then(function(r){ result = r; }).catch(function(e){ error = e; });
          $scope.$apply();
        });

        it('should propagate the error', function(){
          expect(error).toBe(error400);
        });

        it('should set isOwner to false', function(){
          expect($scope.model.isOwner).toBe(false);
        });
      });
    });

    describe('when populateSubscriptionFromUserState is called', function(){
      var deferredResult;
      var error;
      beforeEach(function(){
        deferredResult = $q.defer();
        subscribeService.getSubscriptionStatus.and.returnValue(deferredResult.promise);

        $scope.model.hasFreeAccess = false;
        $scope.model.isSubscribed = false;
        $scope.model.subscribedChannels = undefined;
        $scope.model.hiddenChannels = undefined;

        target.internal.populateSubscriptionFromUserState('blogId').catch(function(e){ error = e; });
        $scope.$apply();
      });

      it('should call subscribeService', function(){
        expect(subscribeService.getSubscriptionStatus).toHaveBeenCalledWith(subscriptionRepository, 'blogId');
      });

      describe('when subscribeService succeeds', function(){
        beforeEach(function(){
          deferredResult.resolve($q.when({
            hasFreeAccess: true,
            isSubscribed: true,
            subscribedChannels: 'subscribed',
            hiddenChannels: 'hidden'
          }));
          $scope.$apply();
        });

        it('should update hasFreeAccess', function(){
          expect($scope.model.hasFreeAccess).toBe(true);
        });

        it('should update isSubscribed', function(){
          expect($scope.model.isSubscribed).toBe(true);
        });

        it('should update subscribedChannels', function(){
          expect($scope.model.subscribedChannels).toBe('subscribed');
        });

        it('should update hiddenChannels', function(){
          expect($scope.model.hiddenChannels).toBe('hidden');
        });
      });

      describe('when subscribeService fails', function(){
        beforeEach(function(){
          deferredResult.resolve($q.reject('error'));
          $scope.$apply();
        });

        it('should not update hasFreeAccess', function(){
          expect($scope.model.hasFreeAccess).toBe(false);
        });

        it('should not update isSubscribed', function(){
          expect($scope.model.isSubscribed).toBe(false);
        });

        it('should not update subscribedChannels', function(){
          expect($scope.model.subscribedChannels).toBeUndefined();
        });

        it('should not update hiddenChannels', function(){
          expect($scope.model.hiddenChannels).toBeUndefined();
        });

        it('should propagate the error', function(){
          expect(error).toBe('error');
        });
      });
    });

    describe('when loadFromLocal is called', function(){

      var loadFromLocalTests = function(){

        it('should assign the current user id to the model', function(){
          expect($scope.model.userId).toBe('userId');
        });

        it('should assign the blog result to the model', function(){
          expect($scope.model.blog).toBe('blog');
        });

        it('should set isOwner to true', function(){
          expect($scope.model.isOwner).toBe(true);
        });

        it('should set hasFreeAccess to false', function(){
          expect($scope.model.hasFreeAccess).toBe(false);
        });

        it('should set the profile image', function(){
          expect($scope.model.profileImage).toBe(accountSettings.profileImage);
        });
      };

      describe('when current view is blog', function(){
        beforeEach(function(){
          $scope.model.currentView = landingPageConstants.views.blog;
          $scope.model.isOwner = false;
          $scope.model.hasFreeAccess = true;
          $scope.model.isSubscribed = true;
          blogRepository.getUserId.and.returnValue('userId');
          blogRepository.getBlog.and.returnValue($q.when('blog'));
          target.internal.loadFromLocal(accountSettings);
          $scope.$apply();
        });

        loadFromLocalTests();

        it('should set isSubscribed to true', function(){
          expect($scope.model.isSubscribed).toBe(true);
        });
      });

      describe('when current view is manage', function(){
        beforeEach(function(){
          $scope.model.currentView = landingPageConstants.views.manage;
          $scope.model.isOwner = false;
          $scope.model.hasFreeAccess = true;
          $scope.model.isSubscribed = true;
          blogRepository.getUserId.and.returnValue('userId');
          blogRepository.getBlog.and.returnValue($q.when('blog'));
          target.internal.loadFromLocal(accountSettings);
          $scope.$apply();
        });

        loadFromLocalTests();

        it('should set isSubscribed to false', function(){
          expect($scope.model.isSubscribed).toBe(false);
        });
      });
    });

    describe('when recalculateChannels is called', function(){
      beforeEach(function(){
        var channels = [
          {
            channelId: 'C',
            name: 'channel C',
            price: channelPrice2,
            isVisibleToNonSubscribers: true
          },
          {
            channelId: 'B',
            name: 'channel B',
            price: channelPrice0,
            isVisibleToNonSubscribers: true
          },
          {
            channelId: 'A',
            name: 'channel A',
            price: channelPrice1,
            isVisibleToNonSubscribers: true
          },
          {
            channelId: 'Z',
            name: 'channel Z',
            price: 15,
            isVisibleToNonSubscribers: false
          }
        ];

        var hiddenChannels = [
          {
            channelId: 'BH',
            name: 'channel BH',
            price: channelPriceHidden,
          }
        ];

        $scope.model = {};
        $scope.model.blog = { channels: channels };
        $scope.model.hiddenChannels = hiddenChannels;
      });

      describe('when no subscribed channels', function() {
        beforeEach(function(){
          $scope.model.subscribedChannels = {};
          target.internal.recalculateChannels();
        });

        it('should select all visible channels', function(){
          expect($scope.model.channels).toEqual([
            {
              isVisibleToNonSubscribers: true,
              channelId: 'A',
              name: 'channel A',
              price: channelPrice1,
              subscriptionInformation: undefined,
              checked: true
            },
            {
              isVisibleToNonSubscribers: true,
              channelId: 'B',
              name: 'channel B',
              price: channelPrice0,
              subscriptionInformation: undefined,
              checked: true
            },
            {
              isVisibleToNonSubscribers: true,
              channelId: 'C',
              name: 'channel C',
              price: channelPrice2,
              subscriptionInformation: undefined,
              checked: true
            }
          ]);
        });
      });

      describe('when has subscribed channels', function() {
        beforeEach(function(){
          $scope.model.subscribedChannels = {
            'B': { channelId: 'B' },
            'BH': { channelId: 'BH' },
            'C': { channelId: 'C' }
          };
          target.internal.recalculateChannels();
        });

        it('should expose all visible channels', function(){
          expect($scope.model.channels).toEqual([
            {
              isVisibleToNonSubscribers: true,
              channelId: 'A',
              name: 'channel A',
              price: channelPrice1,
              subscriptionInformation: undefined,
              checked: false
            },
            {
              isVisibleToNonSubscribers: true,
              channelId: 'B',
              name: 'channel B',
              price: channelPrice0,
              subscriptionInformation: { channelId: 'B' },
              checked: true
            },
            {
              isVisibleToNonSubscribers: false,
              channelId: 'BH',
              name: 'channel BH',
              price: channelPriceHidden,
              subscriptionInformation: { channelId: 'BH' },
              checked: true
            },
            {
              isVisibleToNonSubscribers: true,
              channelId: 'C',
              name: 'channel C',
              price: channelPrice2,
              subscriptionInformation: { channelId: 'C' },
              checked: true
            }
          ]);
        });
      });
    });

    describe('when reloadFromUserState is called', function(){
      var error;
      var success;
      var deferredPopulateSubscriptionFromUserState;
      beforeEach(function(){
        error = undefined;
        success = undefined;
        deferredPopulateSubscriptionFromUserState = $q.defer();
        $scope.model.blog = { blogId: 'blogId' };
        spyOn(target.internal, 'populateSubscriptionFromUserState').and.returnValue(deferredPopulateSubscriptionFromUserState.promise);
        spyOn(target.internal, 'recalculateChannels');
      });

      describe('when not loaded', function(){
        beforeEach(function(){
          $scope.model.isLoaded = false;
          $scope.model.isOwner = false;
          target.internal.reloadFromUserState().then(function(){ success = true; }, function(e){ error = e; });
          $scope.$apply();
        });

        it('should complete successfully', function(){
          expect(success).toBe(true);
        });

        it('should not call populateSubscriptionFromUserState', function(){
          expect(target.internal.populateSubscriptionFromUserState).not.toHaveBeenCalled();
        });

        it('should not call recalculateChannels', function(){
          expect(target.internal.recalculateChannels).not.toHaveBeenCalled();
        });
      });

      describe('when blog owner', function(){
        beforeEach(function(){
          $scope.model.isLoaded = true;
          $scope.model.isOwner = true;
          target.internal.reloadFromUserState().then(function(){ success = true; }, function(e){ error = e; });
          $scope.$apply();
        });

        it('should complete successfully', function(){
          expect(success).toBe(true);
        });

        it('should not call populateSubscriptionFromUserState', function(){
          expect(target.internal.populateSubscriptionFromUserState).not.toHaveBeenCalled();
        });

        it('should not call recalculateChannels', function(){
          expect(target.internal.recalculateChannels).not.toHaveBeenCalled();
        });
      });

      describe('when loaded and not blog owner', function(){
        beforeEach(function(){
          $scope.model.isLoaded = true;
          $scope.model.isOwner = false;
          target.internal.reloadFromUserState().then(function(){ success = true; }, function(e){ error = e; });
          $scope.$apply();
        });

        it('should call populateSubscriptionFromUserState', function(){
          expect(target.internal.populateSubscriptionFromUserState).toHaveBeenCalledWith('blogId');
        });

        describe('when populateSubscriptionFromUserState succeeds', function(){
          beforeEach(function(){
            deferredPopulateSubscriptionFromUserState.resolve();
            $scope.$apply();
          });

          it('should call recalculateChannels', function(){
            expect(target.internal.recalculateChannels).toHaveBeenCalledWith();
          });

          it('should complete successfully', function(){
            expect(success).toBe(true);
          });
        });

        describe('when populateSubscriptionFromUserState fails', function(){
          beforeEach(function(){
            deferredPopulateSubscriptionFromUserState.reject('error');
            $scope.$apply();
          });

          it('should propagate the error', function(){
            expect(error).toBe('error');
          });

          it('should not call recalculateChannels', function(){
            expect(target.internal.recalculateChannels).not.toHaveBeenCalled();
          });
        });
      });
    });

    describe('when postProcessResults is called', function(){
      beforeEach(function(){
        $scope.model = { blog: {} };
        spyOn(target.internal, 'recalculateChannels');
      });

      var testVideoUrl = function(){
        it('should pass the url with the protocol removed to the trustAsResourceUrl function', function(){
          expect($sce.trustAsResourceUrl).toHaveBeenCalledWith('//url');
        });

        it('should expose the video as a trusted url', function(){
          expect($scope.model.videoUrl).toBe('trusted url');
        });
      };

      describe('when the video url is undefined', function(){
        beforeEach(function(){
          target.internal.postProcessResults();
        });

        it('should call recalculateChannels', function(){
          expect(target.internal.recalculateChannels).toHaveBeenCalledWith();
        });

        it('should not expose a video url', function(){
          expect($scope.model.videoUrl).toBeUndefined();
        });
      });

      describe('when the video url is secure', function(){
        beforeEach(function(){
          $scope.model.blog.video = 'https://url';
          $sce.trustAsResourceUrl.and.returnValue('trusted url');
          target.internal.postProcessResults();
        });

        it('should call recalculateChannels', function(){
          expect(target.internal.recalculateChannels).toHaveBeenCalledWith();
        });

        testVideoUrl();
      });

      describe('when the video url is not secure', function(){
        beforeEach(function(){
          $scope.model.blog.video = 'http://url';
          $sce.trustAsResourceUrl.and.returnValue('trusted url');
          target.internal.postProcessResults();
        });

        it('should call recalculateChannels', function(){
          expect(target.internal.recalculateChannels).toHaveBeenCalledWith();
        });

        testVideoUrl();
      });
    });

    describe('when populateLandingPageData is called', function() {
      var getAccountSettings;
      var loadData;
      beforeEach(function(){
        getAccountSettings = $q.defer();
        loadData = $q.defer();

        spyOn(target.internal, 'loadFromLocal').and.returnValue(loadData.promise);
        spyOn(target.internal, 'loadFromApi').and.returnValue(loadData.promise);
        accountSettingsRepository.getAccountSettings.and.returnValue(getAccountSettings.promise);

        target.internal.populateLandingPageData();
      });

      it('should call getAccountSettings', function(){
        expect(accountSettingsRepository.getAccountSettings).toHaveBeenCalled();
      });

      var testProcessing = function(){
        describe('when load data completes successfully', function(){
          beforeEach(function(){
            spyOn(target.internal, 'postProcessResults');
            spyOn($scope, '$watch');
            loadData.resolve();
            $scope.$apply();
          });

          it('should call postProcessResults', function(){
            expect(target.internal.postProcessResults).toHaveBeenCalled();
          });

          it('should call updateTotalPrice when the channels list changes', function(){
            expect($scope.$watch).toHaveBeenCalledWith('model.channels', target.internal.updateTotalPrice, true);
          });
        });
      };

      describe('when username matches logged in user', function(){
        beforeEach(function(){
          $scope.model.username = 'username';
          getAccountSettings.resolve(accountSettings);
          $scope.$apply();
        });

        it('should call loadFromLocal', function(){
          expect(target.internal.loadFromLocal).toHaveBeenCalledWith(accountSettings);
        });

        testProcessing();
      });

      describe('when username does not match logged in user', function(){
        beforeEach(function(){
          $scope.model.username = 'username';
          getAccountSettings.resolve({ username: 'somethingElse' });
          $scope.$apply();
        });

        it('should call loadFromApi', function(){
          expect(target.internal.loadFromApi).toHaveBeenCalledWith('username');
        });

        testProcessing();
      });

      describe('when user is not logged in', function(){
        beforeEach(function(){
          $scope.model.username = 'username';
          getAccountSettings.resolve({});
          $scope.$apply();
        });

        it('should call loadFromApi', function(){
          expect(target.internal.loadFromApi).toHaveBeenCalledWith('username');
        });

        testProcessing();
      });
    });

    describe('when updateCurrentViewIfRequired is called', function(){
      describe('when subscribed', function(){
        beforeEach(function(){
          $scope.model.isSubscribed = true;
        });

        describe('when currentView is already set', function(){
          beforeEach(function(){
            $scope.model.currentView = 'something';
            target.internal.updateCurrentViewIfRequired();
          });

          it('should not change the current view', function(){
            expect($scope.model.currentView).toBe('something');
          });
        });

        describe('when currentView is not already set', function(){
          beforeEach(function(){
            $scope.model.currentView = undefined;
            target.internal.updateCurrentViewIfRequired();
          });

          it('should set the current view to blog', function(){
            expect($scope.model.currentView).toBe(landingPageConstants.views.blog);
          });
        });
      });

      describe('when not subscribed', function(){
        beforeEach(function(){
          $scope.model.isSubscribed = false;
        });

        describe('when currentView is already set', function(){
          describe('when currentView is set to blog', function(){
            beforeEach(function(){
              $state.current = { name: 'currentState' };
              $scope.model.username = 'currentUsername';

              $scope.model.currentView = landingPageConstants.views.blog;
              target.internal.updateCurrentViewIfRequired();
            });

            it('should redirect to the root landing page', function(){
              expect($state.go).toHaveBeenCalledWith('currentState', { username: 'currentUsername', action: null, key: null });
            });
          });

          describe('when currentView is set to manage', function(){
            beforeEach(function(){
              $scope.model.currentView = landingPageConstants.views.manage;
              target.internal.updateCurrentViewIfRequired();
            });

            it('should not change the current view', function(){
              expect($scope.model.currentView).toBe(landingPageConstants.views.manage);
            });

            it('should not redirect to the root landing page', function(){
              expect($state.go).not.toHaveBeenCalled();
            });
          });
        });

        describe('when currentView is not already set', function(){
          beforeEach(function(){
            $scope.model.currentView = undefined;
            target.internal.updateCurrentViewIfRequired();
          });

          it('should set the current view to manage', function(){
            expect($scope.model.currentView).toBe(landingPageConstants.views.manage);
          });
        });
      });
    });

    describe('when loadParameters is called', function(){
      beforeEach(function(){
        $scope.model.username = undefined;
        $scope.model.currentView = undefined;
        $scope.model.returnState = undefined;
        $scope.model.channelId = undefined;
      });

      var expectResult = function(result){
        expect(target.internal.loadParameters()).toBe(result);
      };

      it('should return false if there is no username', function(){
        $stateParams.username = undefined;
        $stateParams.action = landingPageConstants.actions.manage;
        $stateParams.key = 'key';
        expectResult(false);
      });

      describe('when username is provided', function(){
        beforeEach(function(){
          $stateParams.username = 'uSeRnAmE';
        });

        afterEach(function(){
          expect($scope.model.username).toBe('username');
        });

        it('should return false if the action is unrecognised', function(){
          $stateParams.action = '1234';
          expectResult(false);
        });

        it('should return true if action is manage and key is undefined', function(){
          $stateParams.action = landingPageConstants.actions.manage;
          $stateParams.key = undefined;
          expectResult(true);
          expect($scope.model.currentView).toBe(landingPageConstants.views.manage);
          expect($scope.model.returnState).toBeUndefined();
        });

        it('should return true if action is manage and key is defined', function(){
          $stateParams.action = landingPageConstants.actions.manage;
          $stateParams.key = 'key';
          expectResult(true);
          expect($scope.model.currentView).toBe(landingPageConstants.views.manage);
          expect($scope.model.returnState).toBe('key');
        });

        it('should return true if action is all', function(){
          $stateParams.action = landingPageConstants.actions.all;
          expectResult(true);
          expect($scope.model.currentView).toBe(landingPageConstants.views.blog);
        });

        it('should return true if action is previewAll', function(){
          $stateParams.action = landingPageConstants.actions.previewAll;
          expectResult(true);
          expect($scope.model.currentView).toBe(landingPageConstants.views.previewBlog);
        });

        it('should return false if action is channel and key is undefined', function(){
          $stateParams.action = landingPageConstants.actions.channel;
          $stateParams.key = undefined;
          expectResult(false);
        });

        it('should return true if action is channel and key is defined', function(){
          $stateParams.action = landingPageConstants.actions.channel;
          $stateParams.key = 'key';
          expectResult(true);
          expect($scope.model.currentView).toBe(landingPageConstants.views.blog);
          expect($scope.model.channelId).toBe('key');
        });

        it('should return false if action is previewChannel and key is undefined', function(){
          $stateParams.action = landingPageConstants.actions.previewChannel;
          $stateParams.key = undefined;
          expectResult(false);
        });

        it('should return true if action is previewChannel and key is defined', function(){
          $stateParams.action = landingPageConstants.actions.previewChannel;
          $stateParams.key = 'key';
          expectResult(true);
          expect($scope.model.currentView).toBe(landingPageConstants.views.previewBlog);
          expect($scope.model.channelId).toBe('key');
        });
      });
    });

    describe('when initialize is called', function(){
      var success;
      var error;
      var deferredWaitForExistingUpdate;
      var deferredLoadLandingPage;
      beforeEach(function(){
        success = undefined;
        error = undefined;
        deferredWaitForExistingUpdate = $q.defer();
        fetchAggregateUserState.waitForExistingUpdate.and.returnValue(deferredWaitForExistingUpdate.promise);

        deferredLoadLandingPage = $q.defer();
        spyOn(target.internal, 'loadLandingPage').and.returnValue(deferredLoadLandingPage.promise);

        $scope.model.isLoaded = false;

        target.internal.initialize().then(function(){ success = true; }, function(e){ error = e; });
        $scope.$apply();
      });

      it('should call waitForExistingUpdate', function(){
        expect(fetchAggregateUserState.waitForExistingUpdate).toHaveBeenCalledWith();
      });

      describe('when waitForExistingUpdate succeeds', function(){
        beforeEach(function(){
          deferredWaitForExistingUpdate.resolve();
          $scope.$apply();
        });

        it('should call loadLandingPage', function(){
          expect(target.internal.loadLandingPage).toHaveBeenCalledWith();
        });

        describe('when loadLandingPage succeeds', function(){
          beforeEach(function(){
            deferredLoadLandingPage.resolve();
            $scope.$apply();
          });

          it('should set isLoaded to true', function(){
            expect($scope.model.isLoaded).toBe(true);
          });

          it('should complete successfully', function(){
            expect(success).toBe(true);
          });
        });

        describe('when loadLandingPage fails', function(){
          beforeEach(function(){
            deferredLoadLandingPage.reject('error');
            $scope.$apply();
          });

          it('should log the error', function(){
            expect(errorFacade.handleError).toHaveBeenCalledWith('error', jasmine.any(Function));
          });

          it('should set the errorMessage to a friendly message', function(){
            expect($scope.model.errorMessage).toBe('friendlyError');
          });

          it('should set isLoaded to true', function(){
            expect($scope.model.isLoaded).toBe(true);
          });

          it('should complete successfully', function(){
            expect(success).toBe(true);
          });
        });
      });

      describe('when waitForExistingUpdate fails', function(){
        beforeEach(function(){
          deferredWaitForExistingUpdate.reject('error');
          $scope.$apply();
        });

        it('should not call loadLandingPage', function(){
          expect(target.internal.loadLandingPage).not.toHaveBeenCalled();
        });

        it('should log the error', function(){
          expect(errorFacade.handleError).toHaveBeenCalledWith('error', jasmine.any(Function));
        });

        it('should set the errorMessage to a friendly message', function(){
          expect($scope.model.errorMessage).toBe('friendlyError');
        });

        it('should set isLoaded to true', function(){
          expect($scope.model.isLoaded).toBe(true);
        });

        it('should complete successfully', function(){
          expect(success).toBe(true);
        });
      });
    });

    describe('when loadLandingPage is called', function(){
      var success;
      var error;
      var deferredPopulateLandingPageData;
      beforeEach(function(){
        success = undefined;
        error = undefined;
        deferredPopulateLandingPageData = $q.defer();

        spyOn(target.internal, 'populateLandingPageData').and.returnValue(deferredPopulateLandingPageData.promise);
      });

      var execute = function(){
        target.internal.loadLandingPage().then(function(){ success = true; }, function(e){ error = e; });
        $scope.$apply();
      };

      describe('when loadParameters returns false', function(){
        beforeEach(function(){
          spyOn(target.internal, 'loadParameters').and.returnValue(false);
          execute();
        });

        it('should complete successfully', function(){
          expect(success).toBe(true);
        });

        it('should not call populateLandingPageData', function(){
          expect(target.internal.populateLandingPageData).not.toHaveBeenCalled();
        });

        it('should redirect to the not found page', function(){
          expect($state.go).toHaveBeenCalledWith(states.notFound.name);
        });
      });

      describe('when loadParameters returns true', function(){
        beforeEach(function(){
          spyOn(target.internal, 'loadParameters').and.returnValue(true);
          spyOn($scope, '$on');
          execute();
        });

        it('should not redirect', function(){
          expect($state.go).not.toHaveBeenCalled();
        });

        it('should store views in the scope', function(){
          expect($scope.views).toBe(landingPageConstants.views);
        });

        it('should attach to the user state updated event', function(){
          expect($scope.$on).toHaveBeenCalledWith(aggregateUserStateConstants.updatedEvent, target.internal.reloadFromUserState);
        });

        it('should attach to the current user changed event', function(){
          expect($scope.$on).toHaveBeenCalledWith(authenticationServiceConstants.currentUserChangedEvent, target.internal.currentUserUpdated);
        });

        it('should call populateLandingPageData', function(){
          expect(target.internal.populateLandingPageData).toHaveBeenCalledWith();
        });

        describe('when populateLandingPageData succeeds', function(){
          beforeEach(function(){
            spyOn(target.internal, 'updateCurrentViewIfRequired');
            deferredPopulateLandingPageData.resolve();
            $scope.$apply();
          });

          it('should call updateCurrentViewIfRequired', function(){
            expect(target.internal.updateCurrentViewIfRequired).toHaveBeenCalledWith();
          });

          it('should complete successfully', function(){
            expect(success).toBe(true);
          });
        });

        describe('when populateLandingPageData fails with a 404 error', function(){
          beforeEach(function(){
            deferredPopulateLandingPageData.reject(new ApiError('Error', { status: 404 }));
            $scope.$apply();
          });

          it('should complete successfully', function(){
            expect(success).toBe(true);
          });

          it('should redirect to the not found page', function(){
            expect($state.go).toHaveBeenCalledWith(states.notFound.name);
          });

          it('should not log the error', function(){
            expect(errorFacade.handleError).not.toHaveBeenCalled();
          });
        });

        describe('when populateLandingPageData fails', function(){
          beforeEach(function(){
            deferredPopulateLandingPageData.reject('error');
            $scope.$apply();
          });

          it('should not redirect', function(){
            expect($state.go).not.toHaveBeenCalled();
          });

          it('should propagate the error', function(){
            expect(error).toBe('error');
          });
        });
      });
    });

    describe('when updateTotalPrice is called', function(){
      beforeEach(function(){
        $scope.model.channels = [
          {
            price: '69',
            checked: true
          },
          {
            price: '45',
            checked: false
          },
          {
            price: '99',
            checked: false
          }
        ];
      });

      describe('when first channel is checked', function(){
        beforeEach(function(){
          target.internal.updateTotalPrice();
        });

        it('should set the price to the first channel price', function(){
          expect($scope.model.totalPrice).toBe(channelPrice0);
          expect($scope.model.subscribedChannelCount).toBe(1);
        });
      });

      describe('when first and second channel is checked', function(){
        beforeEach(function(){
          $scope.model.channels[1].checked = true;
          target.internal.updateTotalPrice();
        });

        it('should set the price to the sum of the first and second channel prices', function(){
          expect($scope.model.totalPrice).toBe(channelPrice0 + channelPrice1);
          expect($scope.model.subscribedChannelCount).toBe(2);
        });
      });

      describe('when first and third channel is checked', function(){
        beforeEach(function(){
          $scope.model.channels[2].checked = true;
          target.internal.updateTotalPrice();
        });

        it('should set the price to the sum of the first and third channel prices', function(){
          expect($scope.model.totalPrice).toBe(channelPrice0 + channelPrice2);
          expect($scope.model.subscribedChannelCount).toBe(2);
        });
      });

      describe('when all channels are checked', function(){
        beforeEach(function(){
          $scope.model.channels[1].checked = true;
          $scope.model.channels[2].checked = true;
          target.internal.updateTotalPrice();
        });

        it('should set the price to the sum of all channel prices', function(){
          expect($scope.model.totalPrice).toBe(channelPrice0 + channelPrice1 + channelPrice2);
          expect($scope.model.subscribedChannelCount).toBe(3);
        });
      });
    });

    describe('when redirectIfRequired is called', function(){
      describe('when returnState is defined', function(){
        var result;
        beforeEach(function(){
          $scope.model.returnState = 'state';
          result = target.internal.redirectIfRequired();
        });

        it('should return true', function(){
          expect(result).toBe(true);
        });

        it('should redirect', function(){
          expect($state.go).toHaveBeenCalledWith('state');
        });
      });

      describe('when the action is set to manage', function(){
        var result;
        beforeEach(function(){
          $scope.model.returnState = undefined;
          $stateParams.action = landingPageConstants.actions.manage;

          $state.current = { name: 'current-state' };
          $scope.model.username = 'username';

          result = target.internal.redirectIfRequired();
        });

        it('should return true', function(){
          expect(result).toBe(true);
        });

        it('should redirect to the landing page blog', function(){
          expect($state.go).toHaveBeenCalledWith('current-state', { username: 'username', action: null, key: null });
        });
      });

      describe('when subscribing and return state is defined and action is not manage', function(){
        var result;
        beforeEach(function(){
          $scope.model.returnState = 'state';
          $stateParams.action = landingPageConstants.actions.all;
          result = target.internal.redirectIfRequired(true);
        });

        it('should return true', function(){
          expect(result).toBe(false);
        });

        it('should not redirect', function(){
          expect($state.go).not.toHaveBeenCalled();
        });
      });

      describe('when return state is not defined and action is not manage', function(){
        var result;
        beforeEach(function(){
          $scope.model.returnState = undefined;
          $stateParams.action = landingPageConstants.actions.all;
          result = target.internal.redirectIfRequired();
        });

        it('should return true', function(){
          expect(result).toBe(false);
        });

        it('should not redirect', function(){
          expect($state.go).not.toHaveBeenCalled();
        });
      });
    });

    describe('when redirectToUnfilteredViewIfRequired is called', function(){
      describe('when the action is set to channel', function(){
        var result;
        beforeEach(function(){
          $scope.model.returnState = undefined;
          $stateParams.action = landingPageConstants.actions.channel;

          $state.current = { name: 'current-state' };
          $scope.model.username = 'username';

          result = target.internal.redirectToUnfilteredViewIfRequired();
        });

        it('should return true', function(){
          expect(result).toBe(true);
        });

        it('should redirect to the landing page blog', function(){
          expect($state.go).toHaveBeenCalledWith('current-state', { username: 'username', action: landingPageConstants.actions.all, key: null });
        });
      });

      describe('when the action is set to previewChannel', function(){
        var result;
        beforeEach(function(){
          $scope.model.returnState = undefined;
          $stateParams.action = landingPageConstants.actions.previewChannel;

          $state.current = { name: 'current-state' };
          $scope.model.username = 'username';

          result = target.internal.redirectToUnfilteredViewIfRequired();
        });

        it('should return true', function(){
          expect(result).toBe(true);
        });

        it('should redirect to the landing page blog', function(){
          expect($state.go).toHaveBeenCalledWith('current-state', { username: 'username', action: landingPageConstants.actions.all, key: null });
        });
      });

      describe('when the action is set to all', function(){
        var result;
        beforeEach(function(){
          $scope.model.returnState = undefined;
          $stateParams.action = landingPageConstants.actions.all;
          result = target.internal.redirectIfRequired();
        });

        it('should return false', function(){
          expect(result).toBe(false);
        });

        it('should not redirect', function(){
          expect($state.go).not.toHaveBeenCalled();
        });
      });
    });
  });
});
