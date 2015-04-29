describe('landing page controller', function () {
  'use strict';

  var channelPrice0 = 69;
  var channelPrice1 = 45;
  var channelPrice2 = 99;

  var $controller;
  var $q;
  var $scope;
  var target;

  var $sce;
  var blogStub;
  var subscribeService;
  var accountSettingsRepositoryFactory;
  var accountSettingsRepository;
  var blogRepositoryFactory;
  var blogRepository;
  var subscriptionRepositoryFactory;
  var subscriptionRepository;
  var fetchAggregateUserState;
  var initializer;
  var $stateParams;
  var $state;
  var states;
  var errorFacade;

  var accountSettings;

  beforeEach(function() {
    $sce = jasmine.createSpyObj('$sce', ['trustAsResourceUrl']);
    blogStub = jasmine.createSpyObj('blogStub', ['getLandingPage']);
    subscribeService = jasmine.createSpyObj('subscribeService', ['subscribe', 'unsubscribe', 'getSubscriptionStatus']);
    accountSettingsRepository = jasmine.createSpyObj('accountSettingsRepository', ['getAccountSettings']);
    accountSettingsRepositoryFactory = { forCurrentUser: function() { return accountSettingsRepository; }};
    blogRepository = jasmine.createSpyObj('blogRepository', ['getBlog', 'getUserId']);
    blogRepositoryFactory = { forCurrentUser: function() { return blogRepository; }};
    subscriptionRepository = jasmine.createSpyObj('subscriptionRepository', ['tryGetBlogs']);
    subscriptionRepositoryFactory = { forCurrentUser: function() { return subscriptionRepository; }};
    fetchAggregateUserState = jasmine.createSpyObj('fetchAggregateUserState', ['updateIfStale', 'updateFromServer']);
    initializer = jasmine.createSpyObj('initializer', ['initialize']);
    $state = jasmine.createSpyObj('$state', ['go']);
    $stateParams = {};
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
      $provide.value('fetchAggregateUserState', fetchAggregateUserState);
      $provide.value('initializer', initializer);
      $provide.value('$stateParams', $stateParams);
      $provide.value('$state', $state);
      $provide.value('errorFacade', errorFacade);
    });

    inject(function ($injector) {
      $q = $injector.get('$q');
      $scope = $injector.get('$rootScope').$new();
      $controller = $injector.get('$controller');
      states = $injector.get('states');
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
      expect($scope.model.tracking.title).toBe('Subscribed');
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

    it('should initialize with the loadLandingPage function', function(){
      expect(initializer.initialize).toHaveBeenCalledWith(target.internal.loadLandingPage);
    });
  });

  describe('when created', function(){
    beforeEach(function(){
      initializeTarget();
    });

    describe('when subscribe is called', function(){
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
            priceInUsCentsPerWeek: 10
          },
          {
            checked: false,
            channelId: 'channelId2',
            priceInUsCentsPerWeek: 20
          },
          {
            checked: true,
            channelId: 'channelId3',
            priceInUsCentsPerWeek: 30
          }
        ];

        $scope.model.isSubscribed = false;
      });

      var testSubscribe = function(){
        describe('when subscribeService succeeds indicating user subscribed', function(){
          beforeEach(function(){
            deferredResult.resolve(true);
            $scope.$apply();
          });

          it('should set isSubscribed to true', function(){
            expect($scope.model.isSubscribed).toBe(true);
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

    describe('when unsubscribe is called', function(){
      var deferredResult;
      var error;
      beforeEach(function(){
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
          deferredResult.resolve();
          $scope.$apply();
        });

        it('should set isSubscribed to false', function(){
          expect($scope.model.isSubscribed).toBe(false);
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

        describe('when populateSubscriptionStatus succeeds', function(){
          beforeEach(function(){
            spyOn(target.internal, 'populateSubscriptionStatus').and.returnValue($q.when());
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

          it('should call populateSubscriptionStatus', function(){
            expect(target.internal.populateSubscriptionStatus).toHaveBeenCalledWith('blogId');
          });
        });

        describe('when populateSubscriptionStatus fails', function(){
          var error;
          beforeEach(function(){
            spyOn(target.internal, 'populateSubscriptionStatus').and.returnValue($q.reject('error'));
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

          it('should call populateSubscriptionStatus', function(){
            expect(target.internal.populateSubscriptionStatus).toHaveBeenCalledWith('blogId');
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
          blogStub.getLandingPage.and.returnValue($q.reject(new ApiError('Error', { status: 404 })));
          target.internal.loadFromApi('username').then(function(r){ result = r; }).catch(function(e){ error = e; });
          $scope.$apply();
        });

        it('should redirect to the not-found page', function(){
          expect($state.go).toHaveBeenCalledWith(states.notFound.name);
        });

        it('should not propagate the error', function(){
          expect(error).toBeUndefined();
        });

        it('should return a result indicating to stop processing', function(){
          expect(result).toBe(true);
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
          blogStub.getLandingPage.and.returnValue($q.reject(new ApiError('Error', { status: 400 })));
          target.internal.loadFromApi('username').then(function(r){ result = r; }).catch(function(e){ error = e; });
          $scope.$apply();
        });

        it('should not redirect', function(){
          expect($state.go).not.toHaveBeenCalled();
        });

        it('should propagate the error', function(){
          expect(error instanceof ApiError).toBe(true);
          expect(error.response.status).toBe(400);
        });

        it('should return a result indicating to continue processing', function(){
          expect(result).toBeFalsy();
        });

        it('should set isOwner to false', function(){
          expect($scope.model.isOwner).toBe(false);
        });
      });
    });

    describe('when populateSubscriptionStatus is called', function(){
      var deferredResult;
      var error;
      beforeEach(function(){
        deferredResult = $q.defer();
        subscribeService.getSubscriptionStatus.and.returnValue(deferredResult.promise);

        $scope.model.hasFreeAccess = false;
        $scope.model.isSubscribed = false;

        target.internal.populateSubscriptionStatus('blogId').catch(function(e){ error = e; });
        $scope.$apply();
      });

      it('should call subscribeService', function(){
        expect(subscribeService.getSubscriptionStatus).toHaveBeenCalledWith(subscriptionRepository, 'blogId');
      });

      describe('when subscribeService succeeds', function(){
        beforeEach(function(){
          deferredResult.resolve($q.when({
            hasFreeAccess: true,
            isSubscribed: true
          }));
          $scope.$apply();
        });

        it('should update hasFreeAccess', function(){
          expect($scope.model.hasFreeAccess).toBe(true);
        });

        it('should update isSubscribed', function(){
          expect($scope.model.isSubscribed).toBe(true);
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

        it('should propagate the error', function(){
          expect(error).toBe('error');
        });
      });
    });

    describe('when loadFromLocal is called', function(){
      beforeEach(function(){
        $scope.model.isOwner = false;
        $scope.model.hasFreeAccess = true;
        $scope.model.isSubscribed = true;
        blogRepository.getUserId.and.returnValue('userId');
        blogRepository.getBlog.and.returnValue($q.when('blog'));
        target.internal.loadFromLocal(accountSettings);
        $scope.$apply();
      });

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

      it('should set isSubscribed to false', function(){
        expect($scope.model.isSubscribed).toBe(false);
      });

      it('should set the profile image', function(){
        expect($scope.model.profileImage).toBe(accountSettings.profileImage);
      });
    });

    describe('when postProcessResults is called', function(){
      beforeEach(function(){
        var channels = [
          {
            channelId: 'C',
            name: 'channel C',
            priceInUsCentsPerWeek: channelPrice2,
            description: 'foo\nbar',
            isDefault: false,
            isVisibleToNonSubscribers: true
          },
          {
            channelId: 'B',
            name: 'channel B',
            priceInUsCentsPerWeek: channelPrice0,
            description: 'ooh\nyeah\nbaby',
            isDefault: true,
            isVisibleToNonSubscribers: true
          },
          {
            channelId: 'A',
            name: 'channel A',
            priceInUsCentsPerWeek: channelPrice1,
            description: 'hello',
            isDefault: false,
            isVisibleToNonSubscribers: true
          },
          {
            channelId: 'Z',
            name: 'channel Z',
            priceInUsCentsPerWeek: 15,
            description: 'world',
            isDefault: false,
            isVisibleToNonSubscribers: false
          }
        ];
        $scope.model = {};
        $scope.model.blog = { channels: channels };
      });

      var testChannels = function(){
        it('should expose all visible channels', function(){
          expect($scope.model.channels).toEqual([
            {
              channelId: 'B',
              name: 'channel B',
              price: '0.69',
              priceInUsCentsPerWeek: channelPrice0,
              description: ['ooh', 'yeah', 'baby'],
              isDefault: true,
              checked: true
            },
            {
              channelId: 'A',
              name: 'channel A',
              price: '0.45',
              priceInUsCentsPerWeek: channelPrice1,
              description: ['hello'],
              isDefault: false,
              checked: false
            },
            {
              channelId: 'C',
              name: 'channel C',
              price: '0.99',
              priceInUsCentsPerWeek: channelPrice2,
              description: ['foo', 'bar'],
              isDefault: false,
              checked: false
            }
          ]);
        });
      };

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

        testChannels();

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

        testChannels();
        testVideoUrl();
      });

      describe('when the video url is not secure', function(){
        beforeEach(function(){
          $scope.model.blog.video = 'http://url';
          $sce.trustAsResourceUrl.and.returnValue('trusted url');
          target.internal.postProcessResults();
        });

        testChannels();
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
        describe('when load data result indicates to stop processing', function(){
          beforeEach(function(){
            spyOn(target.internal, 'postProcessResults');
            spyOn($scope, '$watch');
            loadData.resolve(true);
            $scope.$apply();
          });

          it('should not call postProcessResults', function(){
            expect(target.internal.postProcessResults).not.toHaveBeenCalled();
          });

          it('should not call updateTotalPrice when the channels collection changes', function(){
            expect($scope.$watch).not.toHaveBeenCalled();
          });
        });

        describe('when load data result indicates to continue processing', function(){
          beforeEach(function(){
            spyOn(target.internal, 'postProcessResults');
            spyOn($scope, '$watch');
            loadData.resolve();
            $scope.$apply();
          });

          it('should call postProcessResults', function(){
            expect(target.internal.postProcessResults).toHaveBeenCalled();
          });

          it('should call updateTotalPrice when the channels collection changes', function(){
            expect($scope.$watch).toHaveBeenCalledWith('model.channels', target.internal.updateTotalPrice, true);
          });
        });
      };

      describe('when username matches logged in user', function(){
        beforeEach(function(){
          $stateParams.username = 'UsErnAme';
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
          $stateParams.username = 'UsErnAme';
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
          $stateParams.username = 'UsErnAme';
          getAccountSettings.resolve({});
          $scope.$apply();
        });

        it('should call loadFromApi', function(){
          expect(target.internal.loadFromApi).toHaveBeenCalledWith('username');
        });

        testProcessing();
      });
    });

    describe('when loadLandingPage is called', function(){
      beforeEach(function(){
        spyOn(target.internal, 'populateLandingPageData');
      });

      describe('when username is not provided', function(){
        beforeEach(function(){
          $stateParams.username = '';
          target.internal.loadLandingPage();
          $scope.$apply();
        });

        it('should redirect to the notFound page', function(){
          expect($state.go).toHaveBeenCalledWith(states.notFound.name);
        });

        it('should not call populateLandingPageData', function(){
          expect(accountSettingsRepository.getAccountSettings).not.toHaveBeenCalled();
        });
      });

      describe('when username is provided', function(){
        var deferred;
        beforeEach(function(){
          deferred = $q.defer();
          target.internal.populateLandingPageData.and.returnValue(deferred.promise);
          $stateParams.username = 'username';
          target.internal.loadLandingPage();
          $scope.$apply();
        });

        it('should call populateLandingPageData', function(){
          expect(target.internal.populateLandingPageData).toHaveBeenCalled();
        });

        describe('when populateLandingPageData succeeds', function(){
          beforeEach(function(){
            deferred.resolve();
            $scope.$apply();
          });

          it('should set isLoaded to true', function(){
            expect($scope.model.isLoaded).toBe(true);
          });
        });

        describe('when populateLandingPageData errors', function(){
          beforeEach(function(){
            deferred.reject('error');
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
        });
      });
    });

    describe('when updateTotalPrice is called', function(){

      beforeEach(function(){
        $scope.model.channels = [
          {
            price: '0.69',
            checked: true
          },
          {
            price: '0.45',
            checked: false
          },
          {
            price: '0.99',
            checked: false
          }
        ];
      });

      describe('when first channel is checked', function(){
        beforeEach(function(){
          target.internal.updateTotalPrice();
        });

        it('should set the price to the first channel price', function(){
          expect($scope.model.totalPrice).toBe((channelPrice0 / 100).toFixed(2));
        });
      });

      describe('when first and second channel is checked', function(){
        beforeEach(function(){
          $scope.model.channels[1].checked = true;
          target.internal.updateTotalPrice();
        });

        it('should set the price to the sum of the first and second channel prices', function(){
          expect($scope.model.totalPrice).toBe(((channelPrice0 + channelPrice1) / 100).toFixed(2));
        });
      });

      describe('when first and third channel is checked', function(){
        beforeEach(function(){
          $scope.model.channels[2].checked = true;
          target.internal.updateTotalPrice();
        });

        it('should set the price to the sum of the first and third channel prices', function(){
          expect($scope.model.totalPrice).toBe(((channelPrice0 + channelPrice2) / 100).toFixed(2));
        });
      });

      describe('when all channels are checked', function(){
        beforeEach(function(){
          $scope.model.channels[1].checked = true;
          $scope.model.channels[2].checked = true;
          target.internal.updateTotalPrice();
        });

        it('should set the price to the sum of all channel prices', function(){
          expect($scope.model.totalPrice).toBe(((channelPrice0 + channelPrice1 + channelPrice2) / 100).toFixed(2));
        });
      });
    });
  });
});
