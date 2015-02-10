describe('subscription service', function() {
  'use strict';

  var subscriptionId = 'subscriptionId';
  var subscriptionData = 'subscriptionData';
  var error = 'error';

  var $rootScope;
  var $q;
  var subscriptionStub;
  var aggregateUserStateService;
  var aggregateUserStateServiceConstants;
  var target;

  beforeEach(function() {
    subscriptionStub = jasmine.createSpyObj('subscriptionStub', ['postSubscription', 'putSubscription']);
    aggregateUserStateService = {};

    module('webApp');
    module(function($provide) {
      $provide.value('subscriptionStub', subscriptionStub);
      $provide.value('aggregateUserStateService', aggregateUserStateService);
    });

    inject(function($injector) {
      $q = $injector.get('$q');
      $rootScope = $injector.get('$rootScope');
      aggregateUserStateServiceConstants = $injector.get('aggregateUserStateServiceConstants');
      target = $injector.get('subscriptionService');
    });

    subscriptionStub.postSubscription.and.returnValue($q.when());
    subscriptionStub.putSubscription.and.returnValue($q.when());
  });

  it('should synchronize on initialization', function() {
    aggregateUserStateService.userState = null;
    target.initialize();
    expect(target.subscriptionId).toBe(null);
    expect(target.hasSubscription).toBe(false);

    aggregateUserStateService.userState = { };
    target.initialize();
    expect(target.subscriptionId).toBe(null);
    expect(target.hasSubscription).toBe(false);

    aggregateUserStateService.userState = { creatorStatus: null };
    target.initialize();
    expect(target.subscriptionId).toBe(null);
    expect(target.hasSubscription).toBe(false);

    aggregateUserStateService.userState = { creatorStatus: { subscriptionId: subscriptionId } };
    target.initialize();
    expect(target.subscriptionId).toBe(subscriptionId);
    expect(target.hasSubscription).toBe(true);
  });

  it('should synchronize with user state synchronization', function() {
    target.initialize();

    $rootScope.$broadcast(aggregateUserStateServiceConstants.userStateRefreshedEvent, {
      creatorStatus: {
        subscriptionId: subscriptionId
      }
    });
    expect(target.subscriptionId).toBe(subscriptionId);
    expect(target.hasSubscription).toBe(true);

    $rootScope.$broadcast(aggregateUserStateServiceConstants.userStateRefreshedEvent, { });
    expect(target.subscriptionId).toBe(null);
    expect(target.hasSubscription).toBe(false);
  });

  describe('when creating first subscription', function() {

    it('should require user to not have a subscription', function() {
      aggregateUserStateService.userState = { creatorStatus: { subscriptionId: subscriptionId } };
      target.initialize();

      var result = null;
      target.createFirstSubscription(subscriptionData).catch(function(error) {
        result = error;
      });
      $rootScope.$apply();

      expect(result instanceof FifthweekError).toBeTruthy();
    });

    it('should retain subscription ID', function() {
      aggregateUserStateService.userState = { };
      target.initialize();

      subscriptionStub.postSubscription.and.returnValue($q.when({ data: subscriptionId }));

      target.createFirstSubscription(subscriptionData);
      $rootScope.$apply();

      expect(subscriptionStub.postSubscription).toHaveBeenCalledWith(subscriptionData);
      expect(target.subscriptionId).toBe(subscriptionId);
      expect(target.hasSubscription).toBe(true);
    });

    it('should propagate errors', function() {
      aggregateUserStateService.userState = { };
      target.initialize();
      
      subscriptionStub.postSubscription.and.returnValue($q.reject(error));

      var result = null;
      target.createFirstSubscription(subscriptionData).catch(function(error) {
        result = error;
      });
      $rootScope.$apply();

      expect(result).toBe(error);
      expect(subscriptionStub.postSubscription).toHaveBeenCalledWith(subscriptionData);
      expect(target.subscriptionId).toBe(null);
      expect(target.hasSubscription).toBe(false);
    });
  });
});
