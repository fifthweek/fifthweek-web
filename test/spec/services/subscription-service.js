describe('subscription service', function() {
  'use strict';

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
  var subscriptionServiceConstants;
  var subscriptionRepositoryFactory;
  var subscriptionRepository;
  var target;

  var date;

  beforeEach(function() {
    date = new Date('2015-01-11T11:11:11Z');
    jasmine.clock().install();
    jasmine.clock().mockDate(date);

    subscriptionStub = jasmine.createSpyObj('subscriptionStub', ['postSubscription', 'putSubscription']);
    aggregateUserState = jasmine.createSpyObj('aggregateUserState', ['setDelta']);
    subscriptionRepositoryFactory = jasmine.createSpyObj('subscriptionRepositoryFactory', ['forCurrentUser']);
    subscriptionRepository = jasmine.createSpyObj('subscriptionRespository', ['setSubscription']);
    authenticationService = { currentUser: { userId: userId }};

    subscriptionRepositoryFactory.forCurrentUser.and.returnValue(subscriptionRepository);

    module('webApp');
    module(function($provide) {
      $provide.value('subscriptionStub', subscriptionStub);
      $provide.value('aggregateUserState', aggregateUserState);
      $provide.value('authenticationService', authenticationService);
      $provide.value('subscriptionRepositoryFactory', subscriptionRepositoryFactory);
      $provide.value('subscriptionRepository', subscriptionRepository);
    });

    inject(function($injector) {
      $q = $injector.get('$q');
      $rootScope = $injector.get('$rootScope');
      aggregateUserStateConstants = $injector.get('aggregateUserStateConstants');
      subscriptionServiceConstants = $injector.get('subscriptionServiceConstants');
      target = $injector.get('subscriptionService');
    });

    subscriptionStub.postSubscription.and.returnValue($q.when());
    subscriptionStub.putSubscription.and.returnValue($q.when());
  });

  afterEach(function(){
    jasmine.clock().uninstall();
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

    describe('when the user does not have a subscription', function(){

      beforeEach(function(){
        aggregateUserState.currentValue = { };

        subscriptionStub.postSubscription.and.returnValue($q.when({ data: subscriptionId }));

        target.createFirstSubscription(subscriptionData);
        $rootScope.$apply();
      });

      it('should persist the new subscription with the API', function() {
        expect(subscriptionStub.postSubscription).toHaveBeenCalledWith(subscriptionData);
      });

      it('should set the creator status to aggregate user state', function(){
        expect(aggregateUserState.setDelta).toHaveBeenCalledWith(userId, 'creatorStatus', {subscriptionId: subscriptionId});
      });

      it('should set the default channel to aggregate user state', function(){
        expect(aggregateUserState.setDelta).toHaveBeenCalledWith(userId, 'createdChannelsAndCollections', {
          channels: [
            {
              channelId: subscriptionId,
              name: subscriptionServiceConstants.defaultChannelName,
              priceInUsCentsPerWeek: basePrice,
              description: subscriptionServiceConstants.defaultChannelDescription,
              isDefault: true,
              isVisibleToNonSubscribers: true,
              collections: []
            }
          ]
        });
      });

      it('should set the subscription data to aggregate user state', function(){
        expect(subscriptionRepository.setSubscription).toHaveBeenCalledWith({
          subscriptionId: subscriptionId,
          creatorId: userId,
          introduction: subscriptionServiceConstants.defaultSubscriptionIntroduction,
          creationDate: date
        });
      });
    });

    it('should request a subscription repository before calling the API', function() {
      aggregateUserState.currentValue = { };

      subscriptionStub.postSubscription.and.returnValue($q.when({ data: subscriptionId }));

      target.createFirstSubscription(subscriptionData);

      expect(subscriptionRepositoryFactory.forCurrentUser).toHaveBeenCalled();
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
              name: subscriptionServiceConstants.defaultChannelName,
              priceInUsCentsPerWeek: basePrice,
              description: subscriptionServiceConstants.defaultChannelDescription,
              isDefault: true,
              isVisibleToNonSubscribers: true,
              collections: []
            }
          ]
        }]
      ]);

      expect(subscriptionRepository.setSubscription).toHaveBeenCalledWith({
        subscriptionId: subscriptionId,
        creatorId: userId,
        introduction: subscriptionServiceConstants.defaultSubscriptionIntroduction,
        creationDate: date
      });
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
