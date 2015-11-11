describe('fw-subscription-information-controller', function () {
  'use strict';

  var channelPrice0 = 69;
  var channelPrice1 = 45;
  var channelPrice2 = 99;
  var channelPriceHidden = 11;

  var $controller;
  var $q;
  var $scope;
  var target;

  var $sce;
  var accountSettingsRepositoryFactory;
  var accountSettingsRepository;
  var blogRepositoryFactory;
  var blogRepository;
  var subscriptionRepositoryFactory;
  var subscriptionRepository;
  var fetchAggregateUserState;
  var subscribeService;
  var errorFacade;
  var landingPageInformationLoader;

  var fwSubscriptionInformationConstants;
  var authenticationServiceConstants;
  var aggregateUserStateConstants;

  beforeEach(function () {
    $sce = jasmine.createSpyObj('$sce', ['trustAsResourceUrl']);
    accountSettingsRepository = jasmine.createSpyObj('accountSettingsRepository', ['getAccountSettings', 'getUserId']);
    accountSettingsRepositoryFactory = jasmine.createSpyObj('accountSettingsRepositoryFactory', ['forCurrentUser']);
    accountSettingsRepositoryFactory.forCurrentUser.and.returnValue(accountSettingsRepository);
    blogRepository = jasmine.createSpyObj('blogRepository', ['getBlog', 'getUserId']);
    blogRepositoryFactory = jasmine.createSpyObj('blogRepositoryFactory', ['forCurrentUser']);
    blogRepositoryFactory.forCurrentUser.and.returnValue(blogRepository);
    subscriptionRepository = jasmine.createSpyObj('subscriptionRepository', ['tryGetBlogs']);
    subscriptionRepositoryFactory = jasmine.createSpyObj('subscriptionRepositoryFactory', ['forCurrentUser']);
    subscriptionRepositoryFactory.forCurrentUser.and.returnValue(subscriptionRepository);
    fetchAggregateUserState = jasmine.createSpyObj('fetchAggregateUserState', ['waitForExistingUpdate']);
    subscribeService = jasmine.createSpyObj('subscribeService', ['subscribe', 'unsubscribe', 'getSubscriptionStatus']);
    landingPageInformationLoader = jasmine.createSpyObj('landingPageInformationLoader', ['loadLandingPageData', 'updateSubscribedChannels']);
    errorFacade = jasmine.createSpyObj('errorFacade', ['handleError']);

    errorFacade.handleError.and.callFake(function(error, delegate){ delegate('friendlyError'); });

    module('webApp');
    module(function ($provide) {
      $provide.value('$sce', $sce);
      $provide.value('accountSettingsRepositoryFactory', accountSettingsRepositoryFactory);
      $provide.value('blogRepositoryFactory', blogRepositoryFactory);
      $provide.value('subscriptionRepositoryFactory', subscriptionRepositoryFactory);
      $provide.value('fetchAggregateUserState', fetchAggregateUserState);
      $provide.value('subscribeService', subscribeService);
      $provide.value('landingPageInformationLoader', landingPageInformationLoader);
      $provide.value('errorFacade', errorFacade);
    });

    inject(function ($injector) {
      $q = $injector.get('$q');
      $scope = $injector.get('$rootScope').$new();
      $controller = $injector.get('$controller');
      fwSubscriptionInformationConstants = $injector.get('fwSubscriptionInformationConstants');
      authenticationServiceConstants = $injector.get('authenticationServiceConstants');
      aggregateUserStateConstants = $injector.get('aggregateUserStateConstants');
    });
  });

  var initializeTarget = function () {
    target = $controller('fwSubscriptionInformationCtrl', {$scope: $scope});
    $scope.$apply();
  };

  describe('when creating', function(){
    beforeEach(function(){
      initializeTarget();
    });

    it('should expose tracking information', function() {
      expect($scope.tracking.unsubscribedTitle).toBe('Unsubscribed');
      expect($scope.tracking.updatedTitle).toBe('Subscription Updated');
      expect($scope.tracking.subscribedTitle).toBe('Subscribed');
      expect($scope.tracking.category).toBe('Timeline');
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

    it('should set errorMessage to undefined', function(){
      expect($scope.model.errorMessage).toBeUndefined();
    });

    it('should set landingPage to undefined', function(){
      expect($scope.model.landingPage).toBeUndefined();
    });

    it('should set isLoading to false', function(){
      expect($scope.model.isLoading).toBe(false);
    });
  });

  describe('when created', function(){
    beforeEach(function(){
      initializeTarget();
      accountSettingsRepositoryFactory.forCurrentUser.calls.reset();
      blogRepositoryFactory.forCurrentUser.calls.reset();
      subscriptionRepositoryFactory.forCurrentUser.calls.reset();
    });

    describe('onAggregateStateUpdated', function(){

      var standardTests = function(){
        it('should get an account settings repository', function(){
          expect(accountSettingsRepositoryFactory.forCurrentUser).toHaveBeenCalledWith();
        });

        it('should get a blog repository', function(){
          expect(blogRepositoryFactory.forCurrentUser).toHaveBeenCalledWith();
        });

        it('should get a subscription repository', function(){
          expect(subscriptionRepositoryFactory.forCurrentUser).toHaveBeenCalledWith();
        });
      };

      var expectReload = function(){
        it('should call reload', function(){
          expect(target.internal.reload).toHaveBeenCalledWith();
        });

        it('should not call reloadFromUserState', function(){
          expect(target.internal.reloadFromUserState).not.toHaveBeenCalled();
        });
      };

      var expectReloadFromUserState = function(){
        it('should not call reload', function(){
          expect(target.internal.reload).not.toHaveBeenCalled();
        });

        it('should call reloadFromUserState', function(){
          expect(target.internal.reloadFromUserState).toHaveBeenCalledWith();
        });
      };

      beforeEach(function(){
        spyOn(target.internal, 'reload');
        spyOn(target.internal, 'reloadFromUserState');
        $scope.model.userId = 'creatorId';
      });

      describe('when landing page not loaded', function(){
        beforeEach(function(){
          $scope.model.landingPage = undefined;
          target.internal.onAggregateStateUpdated();
        });

        standardTests();

        it('should not call reload', function(){
          expect(target.internal.reload).not.toHaveBeenCalled();
        });

        it('should not call reloadFromUserState', function(){
          expect(target.internal.reloadFromUserState).not.toHaveBeenCalled();
        });
      });

      describe('when previously owner', function(){
        beforeEach(function(){
          $scope.model.landingPage = { isOwner: true };
        });

        describe('when now owner', function(){
          beforeEach(function(){
            accountSettingsRepository.getUserId.and.returnValue('creatorId');
            target.internal.onAggregateStateUpdated();
          });

          standardTests();
          expectReloadFromUserState();
        });

        describe('when now not owner', function(){
          beforeEach(function(){
            accountSettingsRepository.getUserId.and.returnValue('userId');
            target.internal.onAggregateStateUpdated();
          });

          standardTests();
          expectReload();
        });
      });
      describe('when previously not owner', function(){
        beforeEach(function(){
          $scope.model.landingPage = { isOwner: false };
        });

        describe('when now owner', function(){
          beforeEach(function(){
            accountSettingsRepository.getUserId.and.returnValue('creatorId');
            target.internal.onAggregateStateUpdated();
          });

          standardTests();
          expectReload();
        });
        describe('when now not owner', function(){
          beforeEach(function(){
            accountSettingsRepository.getUserId.and.returnValue('userId');
            target.internal.onAggregateStateUpdated();
          });

          standardTests();
          expectReloadFromUserState();
        });
      });
    });

    describe('when reloadFromUserState is called', function(){
      var error;
      var success;
      var deferredUpdateSubscribedChannels;
      beforeEach(function(){
        error = undefined;
        success = undefined;

        deferredUpdateSubscribedChannels = $q.defer();
        landingPageInformationLoader.updateSubscribedChannels.and.returnValue(deferredUpdateSubscribedChannels.promise);

        spyOn(target.internal, 'recalculateChannels');
      });

      describe('when not loaded', function(){
        beforeEach(function(){
          $scope.model.landingPage = undefined;
          target.internal.reloadFromUserState().then(function(){ success = true; }, function(e){ error = e; });
          $scope.$apply();
        });

        it('should complete successfully', function(){
          expect(success).toBe(true);
        });

        it('should not call updateSubscribedChannels', function(){
          expect(landingPageInformationLoader.updateSubscribedChannels).not.toHaveBeenCalled();
        });

        it('should not call recalculateChannels', function(){
          expect(target.internal.recalculateChannels).not.toHaveBeenCalled();
        });
      });

      describe('when loaded', function(){
        beforeEach(function(){
          $scope.model.landingPage = 'landing-page';
          target.internal.reloadFromUserState().then(function(){ success = true; }, function(e){ error = e; });
          $scope.$apply();
        });

        it('should call updateSubscribedChannels', function(){
          expect(landingPageInformationLoader.updateSubscribedChannels).toHaveBeenCalledWith('landing-page', subscriptionRepository);
        });

        describe('when populateSubscriptionFromUserState succeeds', function(){
          beforeEach(function(){
            deferredUpdateSubscribedChannels.resolve();
            $scope.$apply();
          });

          it('should call recalculateChannels', function(){
            expect(target.internal.recalculateChannels).toHaveBeenCalledWith('landing-page');
          });

          it('should complete successfully', function(){
            expect(success).toBe(true);
          });
        });

        describe('when populateSubscriptionFromUserState fails', function(){
          beforeEach(function(){
            deferredUpdateSubscribedChannels.reject('error');
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

    describe('when recalculateChannels is called', function(){
      var landingPage;
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

        landingPage = {
          blog: { channels: channels },
          hiddenChannels: hiddenChannels
        };

        spyOn(target.internal, 'updateTotalPrice');
      });

      describe('when no subscribed channels', function() {
        beforeEach(function(){
          landingPage.subscribedChannels = {};
          target.internal.recalculateChannels(landingPage);
        });

        it('should return channels with no subscription information', function(){
          expect(landingPage.channels).toEqual([
            {
              isVisibleToNonSubscribers: true,
              channelId: 'A',
              name: 'channel A',
              price: channelPrice1,
              subscriptionInformation: undefined
            },
            {
              isVisibleToNonSubscribers: true,
              channelId: 'B',
              name: 'channel B',
              price: channelPrice0,
              subscriptionInformation: undefined
            },
            {
              isVisibleToNonSubscribers: true,
              channelId: 'C',
              name: 'channel C',
              price: channelPrice2,
              subscriptionInformation: undefined
            }
          ]);
        });

        it('should call updateTotalPrice', function(){
          expect(target.internal.updateTotalPrice).toHaveBeenCalledWith(landingPage);
        });
      });

      describe('when has subscribed channels', function() {
        beforeEach(function(){
          landingPage.subscribedChannels = {
            'B': { channelId: 'B' },
            'BH': { channelId: 'BH' },
            'C': { channelId: 'C' }
          };
          target.internal.recalculateChannels(landingPage);
        });

        it('should expose all visible channels and hidden subscribed channel', function(){
          expect(landingPage.channels).toEqual([
            {
              isVisibleToNonSubscribers: true,
              channelId: 'A',
              name: 'channel A',
              price: channelPrice1,
              subscriptionInformation: undefined
            },
            {
              isVisibleToNonSubscribers: true,
              channelId: 'B',
              name: 'channel B',
              price: channelPrice0,
              subscriptionInformation: { channelId: 'B' }
            },
            {
              isVisibleToNonSubscribers: false,
              channelId: 'BH',
              name: 'channel BH',
              price: channelPriceHidden,
              subscriptionInformation: { channelId: 'BH' }
            },
            {
              isVisibleToNonSubscribers: true,
              channelId: 'C',
              name: 'channel C',
              price: channelPrice2,
              subscriptionInformation: { channelId: 'C' }
            }
          ]);
        });

        it('should call updateTotalPrice', function(){
          expect(target.internal.updateTotalPrice).toHaveBeenCalledWith(landingPage);
        });
      });

      describe('when requiredChannelId is set', function() {
        beforeEach(function(){
          landingPage.subscribedChannels = {
            'B': { channelId: 'B' },
            'BH': { channelId: 'BH' },
            'C': { channelId: 'C' }
          };
          $scope.requiredChannelId = 'C';
          target.internal.recalculateChannels(landingPage);
        });

        it('should return required channel', function(){
          expect(landingPage.channels).toEqual([
            {
              isVisibleToNonSubscribers: true,
              channelId: 'C',
              name: 'channel C',
              price: channelPrice2,
              subscriptionInformation: { channelId: 'C' }
            }
          ]);
        });

        it('should call updateTotalPrice', function(){
          expect(target.internal.updateTotalPrice).toHaveBeenCalledWith(landingPage);
        });
      });
    });

    describe('when postProcessResults is called', function(){
      var landingPage;
      beforeEach(function(){
        landingPage = { blog: {} };

        spyOn(target.internal, 'recalculateChannels');
      });

      var testVideoUrl = function(){
        it('should pass the url with the protocol removed to the trustAsResourceUrl function', function(){
          expect($sce.trustAsResourceUrl).toHaveBeenCalledWith('//url');
        });

        it('should expose the video as a trusted url', function(){
          expect(landingPage.videoUrl).toBe('trusted url');
        });
      };

      describe('when the video url is undefined', function(){
        beforeEach(function(){
          target.internal.postProcessResults(landingPage);
        });

        it('should call recalculateChannels', function(){
          expect(target.internal.recalculateChannels).toHaveBeenCalledWith(landingPage);
        });

        it('should not expose a video url', function(){
          expect(landingPage.videoUrl).toBeUndefined();
        });
      });

      describe('when the video url is secure', function(){
        beforeEach(function(){
          landingPage.blog.video = 'https://url';
          $sce.trustAsResourceUrl.and.returnValue('trusted url');
          target.internal.postProcessResults(landingPage);
        });

        it('should call recalculateChannels', function(){
          expect(target.internal.recalculateChannels).toHaveBeenCalledWith(landingPage);
        });

        testVideoUrl();
      });

      describe('when the video url is not secure', function(){
        beforeEach(function(){
          landingPage.blog.video = 'http://url';
          $sce.trustAsResourceUrl.and.returnValue('trusted url');
          target.internal.postProcessResults(landingPage);
        });

        it('should call recalculateChannels', function(){
          expect(target.internal.recalculateChannels).toHaveBeenCalledWith(landingPage);
        });

        testVideoUrl();
      });
    });

    describe('when updateTotalPrice is called', function(){
      var landingPage;
      beforeEach(function(){
        landingPage = {};
        landingPage.channels = [
          {
            price: '69',
            subscriptionInformation: 'something'
          },
          {
            price: '45',
            subscriptionInformation: undefined
          },
          {
            price: '99',
            subscriptionInformation: undefined
          }
        ];
      });

      describe('when first channel is checked', function(){
        beforeEach(function(){
          target.internal.updateTotalPrice(landingPage);
        });

        it('should set the price to the first channel price', function(){
          expect(landingPage.totalPrice).toBe(channelPrice0);
          expect(landingPage.subscribedChannelCount).toBe(1);
        });
      });

      describe('when first and second channel is checked', function(){
        beforeEach(function(){
          landingPage.channels[1].subscriptionInformation = 'something';
          target.internal.updateTotalPrice(landingPage);
        });

        it('should set the price to the sum of the first and second channel prices', function(){
          expect(landingPage.totalPrice).toBe(channelPrice0 + channelPrice1);
          expect(landingPage.subscribedChannelCount).toBe(2);
        });
      });

      describe('when first and third channel is checked', function(){
        beforeEach(function(){
          landingPage.channels[2].subscriptionInformation = 'something';
          target.internal.updateTotalPrice(landingPage);
        });

        it('should set the price to the sum of the first and third channel prices', function(){
          expect(landingPage.totalPrice).toBe(channelPrice0 + channelPrice2);
          expect(landingPage.subscribedChannelCount).toBe(2);
        });
      });

      describe('when all channels are checked', function(){
        beforeEach(function(){
          landingPage.channels[1].subscriptionInformation = 'something';
          landingPage.channels[2].subscriptionInformation = 'something';
          target.internal.updateTotalPrice(landingPage);
        });

        it('should set the price to the sum of all channel prices', function(){
          expect(landingPage.totalPrice).toBe(channelPrice0 + channelPrice1 + channelPrice2);
          expect(landingPage.subscribedChannelCount).toBe(3);
        });
      });
    });

    describe('reload', function(){
      var success;
      var error;
      var deferredWaitForExistingUpdate;
      var deferredLoadLandingPageData;
      var loadedLandingPageData;
      beforeEach(function(){
        success = undefined;
        error = undefined;

        loadedLandingPageData = { something: 'something' };

        deferredWaitForExistingUpdate = $q.defer();
        fetchAggregateUserState.waitForExistingUpdate.and.returnValue(deferredWaitForExistingUpdate.promise);

        deferredLoadLandingPageData = $q.defer();
        landingPageInformationLoader.loadLandingPageData.and.returnValue(deferredLoadLandingPageData.promise);

        spyOn(target.internal, 'postProcessResults');

        $scope.model.errorMessage = 'blah';
        $scope.username = 'username';
      });

      describe('when loadedLandingPageData passed in', function(){
        beforeEach(function(){
          target.internal.reload(loadedLandingPageData).then(function() { success = true; }, function(e){ error = e; });
          $scope.$apply();
        });

        it('should set errorMessage to undefined', function(){
          expect($scope.model.errorMessage).toBeUndefined();
        });

        it('should set isLoading to true', function(){
          expect($scope.model.isLoading).toBe(true);
        });

        it('should call waitForExistingUpdate', function(){
          expect(fetchAggregateUserState.waitForExistingUpdate).toHaveBeenCalledWith();
        });

        describe('when waitForExistingUpdate succeeds', function(){
          beforeEach(function(){
            deferredWaitForExistingUpdate.resolve();
            $scope.$apply();
          });

          it('should call postProcessResults with a copy of the landing page data', function(){
            expect(target.internal.postProcessResults).toHaveBeenCalledWith(loadedLandingPageData);
            expect(loadedLandingPageData).toEqual(target.internal.postProcessResults.calls.first().args[0]);
            expect(loadedLandingPageData).not.toBe(target.internal.postProcessResults.calls.first().args[0]);
          });

          it('should set the landing page data to the scope', function(){
            expect($scope.model.landingPage).toEqual({
              something: 'something'
            });
          });

          it('should set isLoading to false', function(){
            expect($scope.model.isLoading).toBe(false);
          });

          it('should complete successfully', function(){
            expect(success).toBe(true);
          });
        });

        describe('when waitForExistingUpdate fails', function(){
          beforeEach(function(){
            deferredWaitForExistingUpdate.reject('error');
            $scope.$apply();
          });

          it('should set the error message', function(){
            expect($scope.model.errorMessage).toBe('friendlyError');
          });

          it('should set isLoading to false', function(){
            expect($scope.model.isLoading).toBe(false);
          });

          it('should complete successfully', function(){
            expect(success).toBe(true);
          });
        });
      });

      describe('when loadedLandingPageData not passed in', function(){
        beforeEach(function(){
          target.internal.reload().then(function() { success = true; }, function(e){ error = e; });
          $scope.$apply();
        });

        it('should set errorMessage to undefined', function(){
          expect($scope.model.errorMessage).toBeUndefined();
        });

        it('should set isLoading to true', function(){
          expect($scope.model.isLoading).toBe(true);
        });

        it('should call waitForExistingUpdate', function(){
          expect(fetchAggregateUserState.waitForExistingUpdate).toHaveBeenCalledWith();
        });

        describe('when waitForExistingUpdate succeeds', function(){
          beforeEach(function(){
            deferredWaitForExistingUpdate.resolve();
            $scope.$apply();
          });

          it('should call loadLandingPageData', function(){
            expect(landingPageInformationLoader.loadLandingPageData).toHaveBeenCalledWith('username', accountSettingsRepository, blogRepository, subscriptionRepository);
          });

          describe('when loadLandingPageData succeeds', function(){
            beforeEach(function(){
              deferredLoadLandingPageData.resolve(loadedLandingPageData);
              $scope.$apply();
            });

            it('should call postProcessResults with a copy of the landing page data', function(){
              expect(target.internal.postProcessResults).toHaveBeenCalledWith(loadedLandingPageData);
            });

            it('should set the landing page data to the scope', function(){
              expect($scope.model.landingPage).toEqual({
                something: 'something'
              });
            });

            it('should set isLoading to false', function(){
              expect($scope.model.isLoading).toBe(false);
            });

            it('should complete successfully', function(){
              expect(success).toBe(true);
            });
          });

          describe('when loadLandingPageData fails', function(){
            beforeEach(function(){
              deferredLoadLandingPageData.reject('error');
              $scope.$apply();
            });

            it('should set the error message', function(){
              expect($scope.model.errorMessage).toBe('friendlyError');
            });

            it('should set isLoading to false', function(){
              expect($scope.model.isLoading).toBe(false);
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

          it('should set the error message', function(){
            expect($scope.model.errorMessage).toBe('friendlyError');
          });

          it('should set isLoading to false', function(){
            expect($scope.model.isLoading).toBe(false);
          });

          it('should complete successfully', function(){
            expect(success).toBe(true);
          });
        });
      });
    });

    describe('initialize', function(){
      beforeEach(function(){
        spyOn($scope, '$on');
        spyOn(target.internal, 'reload');
        $scope.landingPageData = 'landingPageData';

        target.initialize();
      });

      it('should subscribe to the aggregate user state changed event', function(){
        expect($scope.$on).toHaveBeenCalledWith(aggregateUserStateConstants.updatedEvent, target.internal.onAggregateStateUpdated);
      });

      it('should call reload with the scope landing page data', function(){
        expect(target.internal.reload).toHaveBeenCalledWith($scope.landingPageData);
      });
    });

    describe('raiseSubscriptionStatusChangedEvent', function(){
      it('should emit event', function(){
        spyOn($scope, '$emit');
        target.internal.raiseSubscriptionStatusChangedEvent();

        expect($scope.$emit).toHaveBeenCalledWith(fwSubscriptionInformationConstants.subscriptionStatusChangedEvent);
      });
    });

    describe('subscribe', function(){
      var success;
      var error;
      var deferredSubscribe;
      beforeEach(function(){
        success = undefined;
        error = undefined;

        deferredSubscribe = $q.defer();
        subscribeService.subscribe.and.returnValue(deferredSubscribe.promise);

        spyOn(target.internal, 'raiseSubscriptionStatusChangedEvent');

        $scope.model.landingPage = { blog: { blogId: 'blogId' } };

        $scope.subscribe({ channelId: 'channelId', price: 'price' }).then(function() { success = true; }, function(e){ error = e; });
        $scope.$apply();
      });

      it('should call subscribe', function(){
        expect(subscribeService.subscribe).toHaveBeenCalledWith('blogId', 'channelId', 'price');
      });

      describe('when subscribe succeeds with true result', function(){
        beforeEach(function(){
          deferredSubscribe.resolve(true);
          $scope.$apply();
        });

        it('should call raiseSubscriptionStatusChangedEvent', function(){
          expect(target.internal.raiseSubscriptionStatusChangedEvent).toHaveBeenCalledWith();
        });

        it('should complete successfully', function(){
          expect(success).toBe(true);
        });
      });

      describe('when subscribe succeeds with false result', function(){
        beforeEach(function(){
          deferredSubscribe.resolve(false);
          $scope.$apply();
        });

        it('should not call raiseSubscriptionStatusChangedEvent', function(){
          expect(target.internal.raiseSubscriptionStatusChangedEvent).not.toHaveBeenCalled();
        });

        it('should complete successfully', function(){
          expect(success).toBe(true);
        });
      });

      describe('when subscribe fails', function(){
        beforeEach(function(){
          deferredSubscribe.reject('error');
          $scope.$apply();
        });

        it('should propagate the error', function(){
          expect(error).toBe('error');
        });
      });
    });

    describe('unsubscribe', function(){
      var success;
      var error;
      var deferredUnsubscribe;
      beforeEach(function(){
        success = undefined;
        error = undefined;

        deferredUnsubscribe = $q.defer();
        subscribeService.unsubscribe.and.returnValue(deferredUnsubscribe.promise);

        spyOn(target.internal, 'raiseSubscriptionStatusChangedEvent');

        $scope.model.landingPage = { blog: { blogId: 'blogId' } };

        $scope.unsubscribe({ channelId: 'channelId', price: 'price' }).then(function() { success = true; }, function(e){ error = e; });
        $scope.$apply();
      });

      it('should call subscribe', function(){
        expect(subscribeService.unsubscribe).toHaveBeenCalledWith('blogId', 'channelId');
      });

      describe('when unsubscribe succeeds', function(){
        beforeEach(function(){
          deferredUnsubscribe.resolve();
          $scope.$apply();
        });

        it('should call raiseSubscriptionStatusChangedEvent', function(){
          expect(target.internal.raiseSubscriptionStatusChangedEvent).toHaveBeenCalledWith();
        });

        it('should complete successfully', function(){
          expect(success).toBe(true);
        });
      });

      describe('when unsubscribe fails', function(){
        beforeEach(function(){
          deferredUnsubscribe.reject('error');
          $scope.$apply();
        });

        it('should propagate the error', function(){
          expect(error).toBe('error');
        });
      });
    });
  });
});

