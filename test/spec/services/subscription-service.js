describe('subscription service', function() {
  'use strict';

  var defaultChannelName = 'Basic Subscription';
  var defaultChannelDescription = 'Exclusive News Feed\nEarly Updates on New Releases';
  var basePrice = '1.99';
  var subscriptionId = 'subscriptionId';
  var subscriptionData = { basePrice: basePrice };
  var error = 'error';
  var userId = 'user_id';

  var $rootScope;
  var $q;
  var subscriptionStub;
  var aggregateUserState;
  var aggregateUserStateConstants;
  var authenticationService;
  var target;

  beforeEach(function() {
    subscriptionStub = jasmine.createSpyObj('subscriptionStub', ['postSubscription', 'putSubscription']);
    aggregateUserState = jasmine.createSpyObj('aggregateUserState', ['setDelta']);
    authenticationService = { currentUser: { userId: userId }};

    module('webApp');
    module(function($provide) {
      $provide.value('subscriptionStub', subscriptionStub);
      $provide.value('aggregateUserState', aggregateUserState);
      $provide.value('authenticationService', authenticationService);
    });

    inject(function($injector) {
      $q = $injector.get('$q');
      $rootScope = $injector.get('$rootScope');
      aggregateUserStateConstants = $injector.get('aggregateUserStateConstants');
      target = $injector.get('subscriptionService');
    });

    subscriptionStub.postSubscription.and.returnValue($q.when());
    subscriptionStub.putSubscription.and.returnValue($q.when());
  });

  it('should synchronize on initialization', function() {
    aggregateUserState.currentValue = null;
    expect(target.subscriptionId).toBe(null);
    expect(target.hasSubscription).toBe(false);

    aggregateUserState.currentValue = { };
    expect(target.subscriptionId).toBe(null);
    expect(target.hasSubscription).toBe(false);

    aggregateUserState.currentValue = { creatorStatus: null };
    expect(target.subscriptionId).toBe(null);
    expect(target.hasSubscription).toBe(false);

    aggregateUserState.currentValue = { creatorStatus: { subscriptionId: subscriptionId } };
    expect(target.subscriptionId).toBe(subscriptionId);
    expect(target.hasSubscription).toBe(true);
  });

  describe('when creating first subscription', function() {

    it('should require user to not have a subscription', function() {
      aggregateUserState.currentValue = { creatorStatus: { subscriptionId: subscriptionId } };

      var result = null;
      target.createFirstSubscription(subscriptionData).catch(function(error) {
        result = error;
      });
      $rootScope.$apply();

      expect(result instanceof FifthweekError).toBeTruthy();
    });

    it('should retain subscription ID', function() {
      aggregateUserState.currentValue = { };

      subscriptionStub.postSubscription.and.returnValue($q.when({ data: subscriptionId }));

      target.createFirstSubscription(subscriptionData);
      $rootScope.$apply();

      expect(subscriptionStub.postSubscription).toHaveBeenCalledWith(subscriptionData);

      expect(aggregateUserState.setDelta.calls.allArgs()).toEqual([
        [userId, 'creatorStatus', {subscriptionId: subscriptionId}],
        [userId, 'createdChannelsAndCollections', {
          channels: [
            {
              channelId: subscriptionId,
              name: defaultChannelName,
              priceInUsCentsPerWeek: basePrice,
              description: defaultChannelDescription,
              isDefault: true,
              collections: []
            }
          ]
        }]
      ]);
    });

    it('should retain read the current user ID before calling the API', function() {
      aggregateUserState.currentValue = { };

      subscriptionStub.postSubscription.and.returnValue($q.when({ data: subscriptionId }));

      target.createFirstSubscription(subscriptionData);
      authenticationService.currentUser.userId = 'changed_user_id';
      $rootScope.$apply();

      expect(aggregateUserState.setDelta.calls.allArgs()).toEqual([
        [userId, 'creatorStatus', {subscriptionId: subscriptionId}],
        [userId, 'createdChannelsAndCollections', {
          channels: [
            {
              channelId: subscriptionId,
              name: defaultChannelName,
              priceInUsCentsPerWeek: basePrice,
              description: defaultChannelDescription,
              isDefault: true,
              collections: []
            }
          ]
        }]
      ]);
    });

    it('should propagate errors', function() {
      aggregateUserState.currentValue = { };

      subscriptionStub.postSubscription.and.returnValue($q.reject(error));

      var result = null;
      target.createFirstSubscription(subscriptionData).catch(function(error) {
        result = error;
      });
      $rootScope.$apply();

      expect(result).toBe(error);
      expect(subscriptionStub.postSubscription).toHaveBeenCalledWith(subscriptionData);
      expect(aggregateUserState.setDelta).not.toHaveBeenCalled();
    });
  });
});
