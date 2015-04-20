describe('ui state provider', function() {
  'use strict';

  var $q;
  var states;
  var blogService;
  var authenticationService;
  var authenticationServiceConstants;
  var target;

  beforeEach(function() {
    module('webApp');
    module(function($provide) {
      blogService = {};
      authenticationService = { currentUser: {}};

      $provide.value('blogService', blogService);
      $provide.value('authenticationService', authenticationService);
    });

    inject(function($injector) {
      $q = $injector.get('$q');
      states = $injector.get('states');
      authenticationServiceConstants = $injector.get('authenticationServiceConstants');
      target = $injector.get('calculatedStates');
    });
  });

  describe('when calculating default state', function() {

    it('it should return "home" for unauthenticated users', function() {
      authenticationService.currentUser.authenticated = false;

      var result = target.getDefaultState();

      expect(result).toBe(states.home.name);
    });

    it('it should return "compose note" for non-creators', function() {
      authenticationService.currentUser.authenticated = true;
      authenticationService.currentUser.roles = [];

      var result = target.getDefaultState();

      expect(result).toBe(states.user.name);
    });

    it('it should return "create your blog" for creators without a blog', function() {
      authenticationService.currentUser.authenticated = true;
      authenticationService.currentUser.roles = [ authenticationServiceConstants.roles.creator ];
      blogService.hasBlog = false;

      var result = target.getDefaultState();

      expect(result).toBe(states.creator.createBlog.name);
    });

    it('it should return "compose note" for creators with a blog', function() {
      authenticationService.currentUser.authenticated = true;
      authenticationService.currentUser.roles = [ authenticationServiceConstants.roles.creator ];
      blogService.hasBlog = true;

      var result = target.getDefaultState();

      expect(result).toBe(states.user.name);
    });
  });
});
