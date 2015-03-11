describe('creator - create subscription controller', function () {
  'use strict';

  var nextState = 'nextState';
  var error = 'error';

  var $q;

  var $scope;
  var $state;
  var calculatedStates;
  var subscriptionService;
  var target;

  beforeEach(function() {
    $state = jasmine.createSpyObj('$state', ['go']);
    calculatedStates = jasmine.createSpyObj('calculatedStates', ['getDefaultState']);
    subscriptionService = jasmine.createSpyObj('subscriptionService', ['createFirstSubscription']);

    module('webApp');
    module(function($provide) {
      $provide.value('$state', $state);
      $provide.value('calculatedStates', calculatedStates);
      $provide.value('subscriptionService', subscriptionService);
    });

    inject(function ($injector, $controller) {
      $q = $injector.get('$q');
      $scope = $injector.get('$rootScope').$new();
      target = $controller('createSubscriptionCtrl', { $scope: $scope });
    });

    subscriptionService.createFirstSubscription.and.returnValue($q.when());
  });

  it('should initialize with appropriate default state', function() {
    expect($scope.newSubscriptionData.subscriptionName).toBe('');
    expect($scope.newSubscriptionData.tagline).toBe('');
    expect($scope.newSubscriptionData.basePrice).toBe('1.00');
  });

  it('should create first subscription', function() {
    var subscriptionName = 'subscriptionName';
    var tagline = 'tagline';
    var basePrice = '2.59';
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

    it('should not redirect', function() {
      subscriptionService.createFirstSubscription.and.returnValue($q.reject(error));

      $scope.continue();
      $scope.$apply();

      expect($state.go).not.toHaveBeenCalled();
    });
  });

  describe('when service call succeeds', function() {

    it('should redirect to new initial state', function() {
      calculatedStates.getDefaultState.and.returnValue(nextState);

      $scope.continue();
      $scope.$apply();

      expect($state.go).toHaveBeenCalledWith(nextState);
    });
  });
});
