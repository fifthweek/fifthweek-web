describe('account settings repository factory', function(){
  'use strict';

  var $q;
  var $rootScope;
  var masterRepositoryFactory;
  var masterRepository;
  var accountSettingsRepositoryFactoryConstants;
  var targetFactory;
  var target;

  beforeEach(function() {
    module('webApp');

    masterRepository = jasmine.createSpyObj('masterRepository', ['get', 'getUserId', 'set']);
    masterRepositoryFactory = { forCurrentUser: function() { return masterRepository; } };

    module(function($provide) {
      $provide.value('masterRepositoryFactory', masterRepositoryFactory);
    });

    inject(function($injector) {
      $q = $injector.get('$q');
      $rootScope = $injector.get('$rootScope');
      accountSettingsRepositoryFactoryConstants = $injector.get('accountSettingsRepositoryFactoryConstants');
      targetFactory = $injector.get('accountSettingsRepositoryFactory');
    });

    target = targetFactory.forCurrentUser();
  });

  describe('getAccountSettings', function() {
    it('should get settings from the master repository at the correct location', function() {
      var expected = { username: 'phil' };
      var actual;
      masterRepository.get.and.returnValue($q.when(expected));

      target.getAccountSettings().then(function(settings) {
        actual = settings;
      });
      $rootScope.$apply();

      expect(masterRepository.get).toHaveBeenCalledWith(accountSettingsRepositoryFactoryConstants.accountSettingsKey);
      expect(expected).toBe(actual);
    });
  });

  describe('tryGetAccountSettings', function() {
    describe('when logged out', function(){
      it('should get settings from the master repository at the correct location', function() {
        var actual;
        masterRepository.getUserId.and.returnValue(undefined);
        masterRepository.get.and.returnValue($q.when(undefined));

        target.tryGetAccountSettings().then(function(settings) {
          actual = settings;
        });
        $rootScope.$apply();

        expect(masterRepository.get).not.toHaveBeenCalled();
        expect(actual).toBeUndefined();
      });
    });

    describe('when logged in', function(){
      it('should get settings from the master repository at the correct location', function() {
        var expected = { username: 'phil' };
        var actual;
        masterRepository.getUserId.and.returnValue('userId');
        masterRepository.get.and.returnValue($q.when(expected));

        target.tryGetAccountSettings().then(function(settings) {
          actual = settings;
        });
        $rootScope.$apply();

        expect(masterRepository.get).toHaveBeenCalledWith(accountSettingsRepositoryFactoryConstants.accountSettingsKey, true);
        expect(actual).toBe(expected);
      });
    });
  });

  describe('setAccountSettings', function() {
    it('should set settings into the master repository at the correct location', function() {
      var settings = { username: 'phil' };

      target.setAccountSettings(settings);

      expect(masterRepository.set).toHaveBeenCalledWith(accountSettingsRepositoryFactoryConstants.accountSettingsKey, settings);
    });
  });
});
