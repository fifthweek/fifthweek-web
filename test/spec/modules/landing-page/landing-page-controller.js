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
  var accountSettingsRepositoryFactory;
  var accountSettingsRepository;
  var channelRepositoryFactory;
  var channelRepository;
  var blogRepositoryFactory;
  var blogRepository;
  var initializer;
  var $stateParams;
  var $state;
  var states;
  var errorFacade;

  beforeEach(function() {
    $sce = jasmine.createSpyObj('$sce', ['trustAsResourceUrl']);
    blogStub = jasmine.createSpyObj('blogStub', ['getLandingPage']);
    accountSettingsRepository = jasmine.createSpyObj('accountSettingsRepository', ['getAccountSettings']);
    accountSettingsRepositoryFactory = { forCurrentUser: function() { return accountSettingsRepository; }};
    channelRepository = jasmine.createSpyObj('channelRepository', ['getChannels']);
    channelRepositoryFactory = { forCurrentUser: function() { return channelRepository; }};
    blogRepository = jasmine.createSpyObj('blogRepository', ['getBlog']);
    blogRepositoryFactory = { forCurrentUser: function() { return blogRepository; }};
    initializer = jasmine.createSpyObj('initializer', ['initialize']);
    $state = jasmine.createSpyObj('$state', ['go']);
    $stateParams = {};
    errorFacade = jasmine.createSpyObj('errorFacade', ['handleError']);

    errorFacade.handleError.and.callFake(function(error, delegate){ delegate('friendlyError'); });

    module('webApp');
    module(function($provide) {
      $provide.value('$sce', $sce);
      $provide.value('blogStub', blogStub);
      $provide.value('accountSettingsRepositoryFactory', accountSettingsRepositoryFactory);
      $provide.value('channelRepositoryFactory', channelRepositoryFactory);
      $provide.value('blogRepositoryFactory', blogRepositoryFactory);
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
      expect($scope.model.subscribed).toBe(false);
    });

    it('should set isLoaded to false', function(){
      expect($scope.model.isLoaded).toBe(false);
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
      beforeEach(function(){
        $scope.model.subscribed = false;
        $scope.subscribe();
      });

      it('should set subscribed to true', function(){
        expect($scope.model.subscribed).toBe(true);
      });
    });

    describe('when unsubscribe is called', function(){
      beforeEach(function(){
        $scope.model.subscribed = true;
        $scope.unsubscribe();
      });

      it('should set subscribed to true', function(){
        expect($scope.model.subscribed).toBe(false);
      });
    });

    describe('when loadFromApi is called', function(){

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
            e: 'e'
          }}));
          target.internal.loadFromApi();
          $scope.$apply();
        });

        it('should merge the landing page data with the model', function(){
          expect($scope.model).toEqual({
            a: 'a',
            b: {
              c: 'c',
              d: 'd'
            },
            e: 'e'
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
          target.internal.loadFromApi().then(function(r){ result = r; }).catch(function(e){ error = e; });
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
      });

      describe('when getLandingPage fails', function(){
        var error;
        var result;
        beforeEach(function(){
          error = undefined;
          result = undefined;
          blogStub.getLandingPage.and.returnValue($q.reject(new ApiError('Error', { status: 400 })));
          target.internal.loadFromApi().then(function(r){ result = r; }).catch(function(e){ error = e; });
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
      });
    });

    describe('when loadFromLocal is called', function(){
      beforeEach(function(){
        blogRepository.getBlog.and.returnValue($q.when('blog'));
        channelRepository.getChannels.and.returnValue($q.when('channels'));
        target.internal.loadFromLocal();
        $scope.$apply();
      });

      it('should assign the blog result to the model', function(){
        expect($scope.model.blog).toBe('blog');
      });

      it('should assign the channels result to the model', function(){
        expect($scope.model.channels).toBe('channels');
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
        $scope.model.blog = {};
        $scope.model.channels = channels;
      });

      var testChannels = function(){
        it('should expose all visible channels', function(){
          expect($scope.model.channels).toEqual([
            {
              id: 'B',
              name: 'channel B',
              price: '0.69',
              description: ['ooh', 'yeah', 'baby'],
              isDefault: true,
              checked: true
            },
            {
              id: 'A',
              name: 'channel A',
              price: '0.45',
              description: ['hello'],
              isDefault: false,
              checked: false
            },
            {
              id: 'C',
              name: 'channel C',
              price: '0.99',
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
          getAccountSettings.resolve({ username: 'username' });
          $scope.$apply();
        });

        it('should call loadFromLocal', function(){
          expect(target.internal.loadFromLocal).toHaveBeenCalledWith('username');
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
          expect($scope.model.totalPrice).toBe((channelPrice0 / 100).toFixed(2))
        });
      });

      describe('when first and second channel is checked', function(){
        beforeEach(function(){
          $scope.model.channels[1].checked = true;
          target.internal.updateTotalPrice();
        });

        it('should set the price to the sum of the first and second channel prices', function(){
          expect($scope.model.totalPrice).toBe(((channelPrice0 + channelPrice1) / 100).toFixed(2))
        });
      });

      describe('when first and third channel is checked', function(){
        beforeEach(function(){
          $scope.model.channels[2].checked = true;
          target.internal.updateTotalPrice();
        });

        it('should set the price to the sum of the first and third channel prices', function(){
          expect($scope.model.totalPrice).toBe(((channelPrice0 + channelPrice2) / 100).toFixed(2))
        });
      });

      describe('when all channels are checked', function(){
        beforeEach(function(){
          $scope.model.channels[1].checked = true;
          $scope.model.channels[2].checked = true;
          target.internal.updateTotalPrice();
        });

        it('should set the price to the sum of all channel prices', function(){
          expect($scope.model.totalPrice).toBe(((channelPrice0 + channelPrice1 + channelPrice2) / 100).toFixed(2))
        });
      });
    });
  });
});
