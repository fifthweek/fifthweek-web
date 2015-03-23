describe('account settings repository factory', function(){
  'use strict';


  var $q;
  var $rootScope;
  var masterRepositoryFactory;
  var masterRepository;
  var subscriptionRepositoryFactoryConstants;
  var targetFactory;
  var target;

  beforeEach(function() {
    module('webApp');

    masterRepository = jasmine.createSpyObj('masterRepository', ['get', 'set']);
    masterRepositoryFactory = { forCurrentUser: function() { return masterRepository; } };

    module(function($provide) {
      $provide.value('masterRepositoryFactory', masterRepositoryFactory);
    });

    inject(function($injector) {
      $q = $injector.get('$q');
      $rootScope = $injector.get('$rootScope');
      subscriptionRepositoryFactoryConstants = $injector.get('subscriptionRepositoryFactoryConstants');
      targetFactory = $injector.get('subscriptionRepositoryFactory');
    });

    target = targetFactory.forCurrentUser();
  });

  describe('when getting account settings', function() {
    it('should get settings from the master repository at the correct location', function() {
      var expected = { name: 'phil' };
      var actual;
      masterRepository.get.and.returnValue($q.when(expected));

      target.getSubscription().then(function(settings) {
        actual = settings;
      });
      $rootScope.$apply();

      expect(masterRepository.get).toHaveBeenCalledWith(subscriptionRepositoryFactoryConstants.subscriptionKey);
      expect(expected).toBe(actual);
    });

    it('should fail if there is no subscription data', function() {
      var error;
      masterRepository.get.and.returnValue($q.when(undefined));

      target.getSubscription().catch(function(e) {
        error = e;
      });
      $rootScope.$apply();

      expect(masterRepository.get).toHaveBeenCalledWith(subscriptionRepositoryFactoryConstants.subscriptionKey);
      expect(error instanceof DisplayableError).toBe(true);
      expect(error.message).toBe('You do not have a subscription.');
    });
  });

  describe('when setting account settings', function() {
    it('should set settings into the master repository at the correct location', function() {
      var settings = { name: 'phil' };

      target.setSubscription(settings);

      expect(masterRepository.set).toHaveBeenCalledWith(subscriptionRepositoryFactoryConstants.subscriptionKey, settings);
    });
  });
});
