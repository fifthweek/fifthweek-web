'use strict';

describe('Service: routeChangeAuthorizationHandler', function () {

  // load the controller's module
  beforeEach(module('webApp'));

  var authorizationService;
  var routeChangeAuthorizationHandler;
  var $location;
  var $rootScope;
  var webSettings;
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
    webSettings = $injector.get('webSettings');
    authorizationServiceConstants = $injector.get('authorizationServiceConstants');
  }));

  describe('handleRouteChangeStart', function() {

    var next;
    var testPath = '/test';

    beforeEach(function(){
      next = {
        originalPath: testPath
      };
    });

    it('should not alter the path if the page has no access requirements', function(){
      spyOn($location, 'path').and.callThrough();

      routeChangeAuthorizationHandler.handleRouteChangeStart(next);

      expect($location.path).not.toHaveBeenCalled();
    });

    it('should redirect to the sign in page if login is required and then return to the original page', function(){
      spyOn($location, 'path').and.callThrough();

      next.access = {};
      authorizationService.authorize = function(){
        return authorizationServiceConstants.authorizationResult.loginRequired;
      };
      routeChangeAuthorizationHandler.handleRouteChangeStart(next);

      expect($location.path).toHaveBeenCalledWith(webSettings.signInPage);

      routeChangeAuthorizationHandler.handleRouteChangeStart(next);

      expect($location.path).toHaveBeenCalledWith(testPath);
    });

    it('should redirect to the not authorized page if the user is not authorized', function(){
      spyOn($location, 'path').and.callThrough();

      next.access = {};
      authorizationService.authorize = function(){
        return authorizationServiceConstants.authorizationResult.notAuthorized;
      };
      routeChangeAuthorizationHandler.handleRouteChangeStart(next);

      expect($location.path).toHaveBeenCalledWith(webSettings.notAuthorizedPage);
    });
  });
});
