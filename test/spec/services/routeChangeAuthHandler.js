'use strict';

describe('Service: routeChangeAuthHandler', function () {

  // load the controller's module
  beforeEach(module('webApp'));

  var authService;
  var routeChangeAuthHandler;
  var $location;
  var $rootScope;

  beforeEach(function() {
    authService = {};

    module(function($provide) {
      $provide.value('authService', authService);
    });
  });

  beforeEach(inject(function($injector) {
    routeChangeAuthHandler = $injector.get('routeChangeAuthHandler');
    $location = $injector.get('$location');
    $rootScope = $injector.get('$rootScope');
  }));

  describe('handleRouteChangeStart', function() {

    var next;

    beforeEach(function(){
      next = {
        originalPath: '/test'
      };
    });

    it('should not alter the path if the page has no access requirements', function(){

      spyOn($location, 'path').and.callThrough();

      routeChangeAuthHandler.handleRouteChangeStart(next);

      expect($location.path).not.toHaveBeenCalled();
    });
  });
});
