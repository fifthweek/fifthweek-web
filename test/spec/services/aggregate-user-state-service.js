describe('aggregate user state service', function() {
  'use strict';

  var newUserState = 'newUserState';
  var error = 'error';

  var $q;

  var $rootScope;
  var aggregateUserStateServiceConstants;
  var userStateStub;
  var target;

  beforeEach(function() {
    module('webApp');
    module(function($provide) {
      userStateStub = jasmine.createSpyObj('userStateStub', ['get']);

      $provide.value('userStateStub', userStateStub);
    });

    inject(function($injector) {
      $q = $injector.get('$q');
      $rootScope = $injector.get('$rootScope');
      aggregateUserStateServiceConstants = $injector.get('aggregateUserStateServiceConstants');
      target = $injector.get('aggregateUserStateService');
    });
  });

  it('should contain null user state by default', function() {
    expect(target.userState).toBeNull();
  });

  describe('when refreshing user state', function() {

    it('should retain refreshed user state', function() {
      userStateStub.get.and.returnValue($q.when({ data: newUserState }));

      target.refreshUserState();
      $rootScope.$apply();

      expect(userStateStub.get).toHaveBeenCalled();
      expect(target.userState).toBe(newUserState);
    });

    it('should propagate errors', function() {
      userStateStub.get.and.returnValue($q.reject(error));

      var result = null;
      target.refreshUserState().catch(function(error) {
        result = error;
      });
      $rootScope.$apply();

      expect(result).toBe(error);
      expect(userStateStub.get).toHaveBeenCalled();
      expect(target.userState).toBe(null);
    });

    it('should raise event on success', function() {
      userStateStub.get.and.returnValue($q.when({ data: newUserState }));
      spyOn($rootScope, '$broadcast');

      target.refreshUserState();
      $rootScope.$apply();

      expect($rootScope.$broadcast)
        .toHaveBeenCalledWith(aggregateUserStateServiceConstants.userStateRefreshedEvent, newUserState);
    });
  });
});
