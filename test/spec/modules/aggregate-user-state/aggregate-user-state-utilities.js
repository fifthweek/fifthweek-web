describe('aggregate user state utilities', function(){
  'use strict';

  var aggregateUserState;
  var target;

  beforeEach(function() {
    module('webApp');

    aggregateUserState = {};

    module(function($provide) {
      $provide.value('aggregateUserState', aggregateUserState);
    });

    inject(function($injector) {
      target = $injector.get('aggregateUserStateUtilities');
    });
  });

  describe('when calling getUsername', function(){
    it('should return the username if it exists', function(){
      aggregateUserState.currentValue = { accountSettings: { username: 'username' }};
      var username = target.getUsername();
      expect(username).toBe('username');
    });

    it('should return undefined there is no aggregate state', function(){
      aggregateUserState.currentValue = undefined;
      var username = target.getUsername();
      expect(username).toBeUndefined();
    });

    it('should return undefined there is account settings', function(){
      aggregateUserState.currentValue = { accountSettings: undefined };
      var username = target.getUsername();
      expect(username).toBeUndefined();
    });
  });
});
