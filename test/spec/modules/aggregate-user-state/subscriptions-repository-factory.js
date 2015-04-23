describe('subscription repository factory', function(){
  'use strict';

  var $q;
  var $rootScope;
  var masterRepositoryFactory;
  var masterRepository;
  var subscriptionsRepositoryFactory;
  var targetFactory;
  var target;

  beforeEach(function() {
    module('webApp');

    masterRepository = jasmine.createSpyObj('masterRepository', ['get', 'getUserId']);
    masterRepositoryFactory = { forCurrentUser: function() { return masterRepository; } };

    module(function($provide) {
      $provide.value('masterRepositoryFactory', masterRepositoryFactory);
    });

    inject(function($injector) {
      $q = $injector.get('$q');
      $rootScope = $injector.get('$rootScope');
      subscriptionsRepositoryFactory = $injector.get('subscriptionsRepositoryFactoryConstants');
      targetFactory = $injector.get('subscriptionsRepositoryFactory');
    });

    target = targetFactory.forCurrentUser();
  });

  describe('calling getSubscriptions', function() {
    var expected;
    var actual;
    beforeEach(function(){
      expected = 'data';
      actual = undefined;

      masterRepository.get.and.returnValue($q.when(expected));
    });

    describe('when the user is logged in', function(){
      beforeEach(function(){
        masterRepository.getUserId.and.returnValue('userId');
        target.getSubscriptions().then(function(result) { actual = result; });
        $rootScope.$apply();
      });

      it('should call the master repository', function(){
        expect(masterRepository.get).toHaveBeenCalledWith(subscriptionsRepositoryFactory.key);
      });

      it('should return the expected data', function(){
        expect(actual).toBe(expected);
      });
    });

    describe('when the user is not logged in', function(){
      beforeEach(function(){
        masterRepository.getUserId.and.returnValue(undefined);
        target.getSubscriptions().then(function(result) { actual = result; });
        $rootScope.$apply();
      });

      it('should call the master repository', function(){
        expect(masterRepository.get).toHaveBeenCalledWith(subscriptionsRepositoryFactory.key);
      });

      it('should return the expected data', function(){
        expect(actual).toBe(expected);
      });
    });
  });

  describe('calling tryGetSubscriptions', function() {
    var expected;
    var actual;
    beforeEach(function(){
      expected = 'data';
      actual = undefined;

      masterRepository.get.and.returnValue($q.when(expected));
    });

    describe('when the user is logged in', function(){
      beforeEach(function(){
        masterRepository.getUserId.and.returnValue('userId');
        target.tryGetSubscriptions().then(function(result) { actual = result; });
        $rootScope.$apply();
      });

      it('should call the master repository', function(){
        expect(masterRepository.get).toHaveBeenCalledWith(subscriptionsRepositoryFactory.key);
      });

      it('should return the expected data', function(){
        expect(actual).toBe(expected);
      });
    });

    describe('when the user is not logged in', function(){
      beforeEach(function(){
        masterRepository.getUserId.and.returnValue(undefined);
        target.tryGetSubscriptions().then(function(result) { actual = result; });
        $rootScope.$apply();
      });

      it('should not call the master repository', function(){
        expect(masterRepository.get).not.toHaveBeenCalled();
      });

      it('should return the expected data', function(){
        expect(actual).toBeUndefined();
      });
    });
  });
});
