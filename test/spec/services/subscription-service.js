describe('subscription service', function() {
  'use strict';

  var subscriptionId = 'subscriptionId';
  var subscriptionData = 'subscriptionData';
  var error = 'error';

  var $rootScope;
  var $q;
  var subscriptionStub;
  var aggregateUserStateServiceConstants;
  var target;

  beforeEach(function() {
    subscriptionStub = jasmine.createSpyObj('subscriptionStub', ['postSubscription', 'putSubscription']);

    module('webApp');
    module(function($provide) {
      $provide.value('subscriptionStub', subscriptionStub);
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

  it('should have no subscription by default', function() {
    expect(target.subscriptionId).toBe(null);
    expect(target.hasSubscription).toBe(false);
  });

  it('should allow its state to be synchronized', function() {
    target.synchronize(subscriptionId);

    expect(target.subscriptionId).toBe(subscriptionId);
    expect(target.hasSubscription).toBe(true);
  });

  it('should auto-synchronize when user state refreshes', function() {
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

  it('should allow its state to be synchronized with same default values', function() {
    target.synchronize(null);

    expect(target.subscriptionId).toBe(null);
    expect(target.hasSubscription).toBe(false);
  });

  describe('when creating first subscription', function() {

    it('should require user to not have a subscription', function() {
      target.synchronize(subscriptionId);

      var result = null;
      target.createFirstSubscription(subscriptionData).catch(function(error) {
        result = error;
      });
      $rootScope.$apply();

      expect(result instanceof FifthweekError).toBeTruthy();
    });

    it('should retain subscription ID', function() {
      subscriptionStub.postSubscription.and.returnValue($q.when({ data: subscriptionId }));

      target.createFirstSubscription(subscriptionData);
      $rootScope.$apply();

      expect(subscriptionStub.postSubscription).toHaveBeenCalledWith(subscriptionData);
      expect(target.subscriptionId).toBe(subscriptionId);
      expect(target.hasSubscription).toBe(true);
    });

    it('should propagate errors', function() {
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
