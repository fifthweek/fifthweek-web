describe('landing page redirect controller', function () {
  'use strict';

  var $controller;
  var $q;
  var $scope;
  var target;

  var accountSettingsRepositoryFactory;
  var accountSettingsRepository;
  var $state;
  var states;

  beforeEach(function () {
    accountSettingsRepository = jasmine.createSpyObj('accountSettingsRepository', ['getAccountSettings']);
    accountSettingsRepositoryFactory = { forCurrentUser: function () { return accountSettingsRepository; }};
    $state = jasmine.createSpyObj('$state', ['go']);

    module('webApp');
    module(function ($provide) {
      $provide.value('accountSettingsRepositoryFactory', accountSettingsRepositoryFactory);
      $provide.value('$state', $state);
    });

    inject(function ($injector) {
      $q = $injector.get('$q');
      $scope = $injector.get('$rootScope').$new();
      $controller = $injector.get('$controller');
      states = $injector.get('states');
    });
  });

  var initializeTarget = function () {
    target = $controller('landingPageRedirectCtrl', {$scope: $scope});
    $scope.$apply();
  };

  describe('when creating', function(){
    beforeEach(function(){
      accountSettingsRepository.getAccountSettings.and.returnValue($q.when({ username: 'username' }));
      initializeTarget();
    });

    it('should get account settings', function(){
      expect(accountSettingsRepository.getAccountSettings).toHaveBeenCalled();
    });

    it('should redirect to the user landing page', function(){
      expect($state.go).toHaveBeenCalledWith(states.landingPage.name, { username: 'username' });
    });
  });
});

