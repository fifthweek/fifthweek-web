describe('creator - create subscription controller', function () {
  'use strict';

  var initialState = 'initialState';
  var nextState = 'nextState';
  var error = 'error';
  var errorMessage = 'errorMessage';

  var $q;
  var $controller;

  var $scope;
  var $state;
  var utilities;
  var logService;
  var analytics;
  var uiStateProvider;
  var subscriptionService;
  var target;

  beforeEach(module('webApp'));

  beforeEach(inject(function ($injector) {
    $q = $injector.get('$q');
    $controller = $injector.get('$controller');

    $scope = $injector.get('$rootScope').$new();
    $state = jasmine.createSpyObj('$state', ['go']);
    utilities = jasmine.createSpyObj('utilities', ['getFriendlyErrorMessage']);
    logService = jasmine.createSpyObj('logService', ['error']);
    analytics = jasmine.createSpyObj('analytics', ['eventTrack']);
    uiStateProvider = jasmine.createSpyObj('uiStateProvider', ['getDefaultState']);
    subscriptionService = jasmine.createSpyObj('subscriptionService', ['createFirstSubscription']);
    subscriptionService.createFirstSubscription.and.returnValue($q.when());
  }));

  function initializeTarget() {
    target = $controller('createSubscriptionCtrl', {
      $scope: $scope,
      $state: $state,
      utilities: utilities,
      logService: logService,
      analytics: analytics,
      uiStateProvider: uiStateProvider,
      subscriptionService: subscriptionService
    });
  }

  describe('when user has subscription', function() {

    it('should redirect user to initial state', function () {
      subscriptionService.hasSubscription = true;
      uiStateProvider.getDefaultState.and.returnValue(initialState);

      initializeTarget();

      expect($state.go).toHaveBeenCalledWith(initialState);
    });
  });

  describe('when user does not have a subscription', function() {

    beforeEach(function() {
      subscriptionService.hasSubscription = false;
      initializeTarget();
    });

    it('should initialize with appropriate default state', function() {
      expect($scope.isSubmitting).toBe(false);
      expect($scope.submissionSucceeded).toBe(false);
      expect($scope.message).toBe('');
      expect($scope.newSubscriptionData.subscriptionName).toBe('');
      expect($scope.newSubscriptionData.tagline).toBe('');
      expect($scope.newSubscriptionData.basePrice).toBe(1.00);
    });

    it('should set submitting flag on submission', function() {
      $scope.continue();
      $scope.$apply();

      expect($scope.isSubmitting).toBe(true);
    });

    it('should create first subscription', function() {
      var subscriptionName = 'subscriptionName';
      var tagline = 'tagline';
      var basePrice = 2.59;
      $scope.newSubscriptionData.subscriptionName = subscriptionName;
      $scope.newSubscriptionData.tagline = tagline;
      $scope.newSubscriptionData.basePrice = basePrice;

      $scope.continue();
      $scope.$apply();

      expect(subscriptionService.createFirstSubscription).toHaveBeenCalledWith({
        subscriptionName: subscriptionName,
        tagline: tagline,
        basePrice: 259
      });
    });

    describe('when service call fails', function() {

      it('should reset submitting flag', function() {
        subscriptionService.createFirstSubscription.and.returnValue($q.reject(error));

        $scope.continue();
        $scope.$apply();

        expect($scope.isSubmitting).toBe(false);
      });

      it('should log an error', function() {
        subscriptionService.createFirstSubscription.and.returnValue($q.reject(error));

        $scope.continue();
        $scope.$apply();

        expect(logService.error).toHaveBeenCalledWith(error);
      });

      it('should not redirect', function() {
        subscriptionService.createFirstSubscription.and.returnValue($q.reject(error));

        $scope.continue();
        $scope.$apply();

        expect($state.go).not.toHaveBeenCalled();
      });

      it('should return an error message', function() {
        subscriptionService.createFirstSubscription.and.returnValue($q.reject(error));
        utilities.getFriendlyErrorMessage.and.returnValue(errorMessage);

        $scope.continue();
        $scope.$apply();

        expect(utilities.getFriendlyErrorMessage).toHaveBeenCalledWith(error);
        expect($scope.message).toBe(errorMessage);
      });
    });

    describe('when service call succeeds', function() {

      it('should track an analytics event', function() {
        $scope.continue();
        $scope.$apply();

        expect(analytics.eventTrack).toHaveBeenCalledWith(
          'Subscription created',
          'Registration');
      });

      it('should set success flag', function() {
        $scope.continue();
        $scope.$apply();

        expect($scope.submissionSucceeded).toBe(true);
      });

      it('should redirect to new initial state', function() {
        uiStateProvider.getDefaultState.and.returnValue(nextState);

        $scope.continue();
        $scope.$apply();

        expect($state.go).toHaveBeenCalledWith(nextState);
      });
    });
  });
});
