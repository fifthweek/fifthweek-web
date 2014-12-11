describe('route change authorization handler', function () {
  'use strict';

  describe('when routing', function() {

    it('should not alter the path if the page has no access requirements', function(){
      spyOn($location, 'path').and.callThrough();

      routeChangeAuthorizationHandler.handleRouteChangeStart(next);

      expect($location.path).not.toHaveBeenCalled();
    });

    it('should redirect to the sign in page if login is required and then return to the original page', function(){
      spyOn($location, 'path').and.callThrough();

      next.access = { loginRequired: true };
      authorizationService.authorize = function(){
        return authorizationServiceConstants.authorizationResult.loginRequired;
      };
      routeChangeAuthorizationHandler.handleRouteChangeStart(next);

      expect($location.path).toHaveBeenCalledWith(fifthweekConstants.signInPage);

      routeChangeAuthorizationHandler.handleRouteChangeStart(next);

      expect($location.path).toHaveBeenCalledWith(testPath);
    });

    it('should redirect to the not authorized page if the user is not authorized', function(){
      spyOn($location, 'path').and.callThrough();

      next.access = { loginRequired: true };
      authorizationService.authorize = function(){
        return authorizationServiceConstants.authorizationResult.notAuthorized;
      };
      routeChangeAuthorizationHandler.handleRouteChangeStart(next);

      expect($location.path).toHaveBeenCalledWith(fifthweekConstants.notAuthorizedPage);
    });

    it('should not redirect if the user navigates to a non-secure page after initial redirection to sign in page', function(){
      spyOn($location, 'path').and.callThrough();

      next.access = { loginRequired: true };
      authorizationService.authorize = function(){
        return authorizationServiceConstants.authorizationResult.loginRequired;
      };
      routeChangeAuthorizationHandler.handleRouteChangeStart(next);

      expect($location.path).toHaveBeenCalledWith(fifthweekConstants.signInPage);

      next.access = { loginRequired: false };
      next.originalPath = testPath;

      $location.path.calls.reset();
      routeChangeAuthorizationHandler.handleRouteChangeStart(next);

      expect($location.path).not.toHaveBeenCalled();
    });

    var next;
    var testPath = '/test';

    beforeEach(function(){
      next = {
        originalPath: testPath
      };
    });
  });

  // load the controller's module
  beforeEach(module('webApp'));

  var authorizationService;
  var routeChangeAuthorizationHandler;
  var $location;
  var $rootScope;
  var fifthweekConstants;
  var authorizationServiceConstants;

  beforeEach(function() {
    authorizationService = {};

    module(function($provide) {
      $provide.value('authorizationService', authorizationService);
    });
  });

  beforeEach(inject(function($injector) {
    routeChangeAuthorizationHandler = $injector.get('routeChangeAuthorizationHandler');
    $location = $injector.get('$location');
    $rootScope = $injector.get('$rootScope');
    fifthweekConstants = $injector.get('fifthweekConstants');
    authorizationServiceConstants = $injector.get('authorizationServiceConstants');
  }));
});
