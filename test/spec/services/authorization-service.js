describe('authorization service', function() {
  'use strict';

  describe('when authorizing the user against a page', function(){

    it('should return authorized for a public page with no roles', function(){
      var result = authorizationService.authorize(false);
      expect(result).toBe(authorizationServiceConstants.authorizationResult.authorized);

      authenticationService.currentUser.authenticated = true;
      result = authorizationService.authorize(false);
      expect(result).toBe(authorizationServiceConstants.authorizationResult.authorized);
    });

    it('should return notAuthorized for a public page that requires roles when not logged in', function(){
      var result = authorizationService.authorize(false, ['Test']);
      expect(result).toBe(authorizationServiceConstants.authorizationResult.notAuthorized);

      result = authorizationService.authorize(false, ['Test', 'Test2'], authorizationServiceConstants.fwRoleCheckType.atLeastOne);
      expect(result).toBe(authorizationServiceConstants.authorizationResult.notAuthorized);

      result = authorizationService.authorize(false, ['Test', 'Test2'], authorizationServiceConstants.fwRoleCheckType.all);
      expect(result).toBe(authorizationServiceConstants.authorizationResult.notAuthorized);
    });

    it('should return loginRequired for a page that requires authentication when not logged in', function(){
      var result = authorizationService.authorize(true);
      expect(result).toBe(authorizationServiceConstants.authorizationResult.loginRequired);

      result = authorizationService.authorize(true, ['Test', 'Test2'], authorizationServiceConstants.fwRoleCheckType.atLeastOne);
      expect(result).toBe(authorizationServiceConstants.authorizationResult.loginRequired);

      result = authorizationService.authorize(true, ['Test', 'Test2'], authorizationServiceConstants.fwRoleCheckType.all);
      expect(result).toBe(authorizationServiceConstants.authorizationResult.loginRequired);
    });

    it('should return authorized for a page that requires authentication and no roles when logged in', function(){
      authenticationService.currentUser.authenticated = true;

      authenticationService.currentUser.roles = undefined;
      var result = authorizationService.authorize(true);
      expect(result).toBe(authorizationServiceConstants.authorizationResult.authorized);

      authenticationService.currentUser.roles = [];
      result = authorizationService.authorize(true);
      expect(result).toBe(authorizationServiceConstants.authorizationResult.authorized);
    });

    it('should return authorized for a page that requires authentication and no roles when logged in with no roles', function(){
      authenticationService.currentUser.authenticated = true;

      var result = authorizationService.authorize(false, ['Test']);
      expect(result).toBe(authorizationServiceConstants.authorizationResult.notAuthorized);

      result = authorizationService.authorize(true, ['Test', 'Test2'], authorizationServiceConstants.fwRoleCheckType.atLeastOne);
      expect(result).toBe(authorizationServiceConstants.authorizationResult.notAuthorized);

      result = authorizationService.authorize(true, ['Test', 'Test2'], authorizationServiceConstants.fwRoleCheckType.all);
      expect(result).toBe(authorizationServiceConstants.authorizationResult.notAuthorized);
    });

    it('should return authorized for a page that requires roles when logged in with those roles', function(){
      authenticationService.currentUser.authenticated = true;
      authenticationService.currentUser.roles = ['Test'];

      var result = authorizationService.authorize(false, ['Test']);
      expect(result).toBe(authorizationServiceConstants.authorizationResult.authorized);

      result = authorizationService.authorize(true, ['Test']);
      expect(result).toBe(authorizationServiceConstants.authorizationResult.authorized);

      result = authorizationService.authorize(true, ['Test', 'Test2'], authorizationServiceConstants.fwRoleCheckType.atLeastOne);
      expect(result).toBe(authorizationServiceConstants.authorizationResult.authorized);

      result = authorizationService.authorize(true, ['Test', 'Test2'], authorizationServiceConstants.fwRoleCheckType.all);
      expect(result).toBe(authorizationServiceConstants.authorizationResult.notAuthorized);

      result = authorizationService.authorize(true, ['Test2', 'Test3'], authorizationServiceConstants.fwRoleCheckType.atLeastOne);
      expect(result).toBe(authorizationServiceConstants.authorizationResult.notAuthorized);

      result = authorizationService.authorize(true, ['Test2']);
      expect(result).toBe(authorizationServiceConstants.authorizationResult.notAuthorized);

      result = authorizationService.authorize(false, ['Test2']);
      expect(result).toBe(authorizationServiceConstants.authorizationResult.notAuthorized);

      authenticationService.currentUser.roles = ['Test', 'Test2'];

      result = authorizationService.authorize(true, ['Test', 'Test2'], authorizationServiceConstants.fwRoleCheckType.all);
      expect(result).toBe(authorizationServiceConstants.authorizationResult.authorized);

      result = authorizationService.authorize(true, ['Test2']);
      expect(result).toBe(authorizationServiceConstants.authorizationResult.authorized);
    });
  });

  // load the service's module
  beforeEach(module('webApp'));

  var authorizationService;
  var authorizationServiceConstants;
  var authenticationService;

  beforeEach(function() {
    authenticationService = {
      currentUser: {
        authenticated: false,
        username: undefined,
        roles: undefined
      }
    };

    module(function($provide) {
      $provide.value('authenticationService', authenticationService);
    });
  });

  beforeEach(inject(function($injector) {
    authorizationService = $injector.get('authorizationService');
    authorizationServiceConstants = $injector.get('authorizationServiceConstants');
  }));
});
