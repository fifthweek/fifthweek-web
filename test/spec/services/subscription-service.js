describe('subscription service factory', function(){
  'use strict';

  var subscriptionServiceImpl;
  var $injector;

  beforeEach(function(){
    subscriptionServiceImpl = jasmine.createSpyObj('subscriptionServiceImpl', ['initialize']);

    module('webApp');
    module(function($provide) {
      $provide.value('subscriptionServiceImpl', subscriptionServiceImpl);
    });

    inject(function(_$injector_) {
      $injector = _$injector_;
    });
  });

  it('should initialize the authentication service', function(){
    var target = $injector.get('subscriptionService');

    expect(target.initialize).toHaveBeenCalled();
  });

  it('should return the authentication service', function(){
    var target = $injector.get('subscriptionService');

    expect(target).toBe(subscriptionServiceImpl);
  });
});

describe('subscription service', function() {
  'use strict';

  var defaultChannelName = 'Basic Subscription';
  var defaultChannelDescription = 'Exclusive News Feed\nEarly Updates on New Releases';
  var subscriptionId = 'subscriptionId';
  var subscriptionData = 'subscriptionData';
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
    aggregateUserState = jasmine.createSpyObj('aggregateUserState', ['updateFromDelta']);
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
      target = $injector.get('subscriptionServiceImpl');
    });

    subscriptionStub.postSubscription.and.returnValue($q.when());
    subscriptionStub.putSubscription.and.returnValue($q.when());
  });

  it('should synchronize on initialization', function() {
    aggregateUserState.currentValue = null;
    target.initialize();
    expect(target.subscriptionId).toBe(null);
    expect(target.hasSubscription).toBe(false);

    aggregateUserState.currentValue = { };
    target.initialize();
    expect(target.subscriptionId).toBe(null);
    expect(target.hasSubscription).toBe(false);

    aggregateUserState.currentValue = { creatorStatus: null };
    target.initialize();
    expect(target.subscriptionId).toBe(null);
    expect(target.hasSubscription).toBe(false);

    aggregateUserState.currentValue = { creatorStatus: { subscriptionId: subscriptionId } };
    target.initialize();
    expect(target.subscriptionId).toBe(subscriptionId);
    expect(target.hasSubscription).toBe(true);
  });

  it('should synchronize with user state synchronization', function() {
    target.initialize();

    $rootScope.$broadcast(aggregateUserStateConstants.updatedEvent, {
      creatorStatus: {
        subscriptionId: subscriptionId
      }
    });
    expect(target.subscriptionId).toBe(subscriptionId);
    expect(target.hasSubscription).toBe(true);

    $rootScope.$broadcast(aggregateUserStateConstants.updatedEvent, { });
    expect(target.subscriptionId).toBe(null);
    expect(target.hasSubscription).toBe(false);
  });

  describe('when creating first subscription', function() {

    it('should require user to not have a subscription', function() {
      aggregateUserState.currentValue = { creatorStatus: { subscriptionId: subscriptionId } };
      target.initialize();

      var result = null;
      target.createFirstSubscription(subscriptionData).catch(function(error) {
        result = error;
      });
      $rootScope.$apply();

      expect(result instanceof FifthweekError).toBeTruthy();
    });

    it('should retain subscription ID', function() {
      aggregateUserState.currentValue = { };
      target.initialize();

      subscriptionStub.postSubscription.and.returnValue($q.when({ data: subscriptionId }));

      target.createFirstSubscription(subscriptionData);
      $rootScope.$apply();

      expect(subscriptionStub.postSubscription).toHaveBeenCalledWith(subscriptionData);
      expect(aggregateUserState.updateFromDelta).toHaveBeenCalledWith(
        userId,
        {
          creatorStatus: {
            subscriptionId: subscriptionId
          },
          createdChannelsAndCollections: {
            channels: [
              {
                channelId: subscriptionId,
                name: defaultChannelName,
                description: defaultChannelDescription,
                isDefault: true,
                collections: []
              }
            ]
          }
        });
    });

    it('should retain read the current user ID before calling the API', function() {
      aggregateUserState.currentValue = { };
      target.initialize();

      subscriptionStub.postSubscription.and.returnValue($q.when({ data: subscriptionId }));

      target.createFirstSubscription(subscriptionData);
      authenticationService.currentUser.userId = 'changed_user_id';
      $rootScope.$apply();

      expect(aggregateUserState.updateFromDelta).toHaveBeenCalledWith(
        userId,
        {
          creatorStatus: {
            subscriptionId: subscriptionId
          },
          createdChannelsAndCollections: {
            channels: [
              {
                channelId: subscriptionId,
                name: defaultChannelName,
                description: defaultChannelDescription,
                isDefault: true,
                collections: []
              }
            ]
          }
        });
    });

    it('should propagate errors', function() {
      aggregateUserState.currentValue = { };
      target.initialize();

      subscriptionStub.postSubscription.and.returnValue($q.reject(error));

      var result = null;
      target.createFirstSubscription(subscriptionData).catch(function(error) {
        result = error;
      });
      $rootScope.$apply();

      expect(result).toBe(error);
      expect(subscriptionStub.postSubscription).toHaveBeenCalledWith(subscriptionData);
      expect(aggregateUserState.updateFromDelta).not.toHaveBeenCalled();
    });
  });
});
