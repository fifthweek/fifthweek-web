'use strict';

describe('creator - create subscription controller', function () {

  var scope;
  var $state;
  var states;
  var utilities;
  var analytics;
  var subscriptionStub;
  var target;

  beforeEach(module('webApp', 'stateMock'));

  beforeEach(inject(function ($injector) {
    scope = $injector.get('$rootScope').$new();
    $state = $injector.get('$state');
    states = $injector.get('states');
    utilities = $injector.get('utilities');
    analytics = {};
    subscriptionStub = {};

    target = $injector.get('$controller')('createSubscriptionCtrl', {
      $scope: scope,
      $state: $state,
      states: states,
      utilities: utilities,
      analytics: analytics,
      subscriptionStub: subscriptionStub
    });
  }));

  afterEach(function(){
    $state.verifyNoOutstandingTransitions();
  });

  it('should contain empty form data on creation', function() {
    expect(scope.newSubscriptionData.subscriptionName).toBe('');
    expect(scope.newSubscriptionData.tagline).toBe('');
    expect(scope.newSubscriptionData.basePrice).toBe(1.00);
  });
});
