describe('roles directive', function(){
  'use strict';

  describe('when roles are passed in', function() {

    it('should call authorize with specified roles and role check type', function(){
      expect(authorizationService.authorize).toHaveBeenCalled();
      expect(authorizationService.authorize.calls.argsFor(0)).toEqual([true, ['Test1', 'Test2'], 'all']);
    });

    var element;

    beforeEach(function(){
      element = angular.element('<button roles="Test1, Test2" role-check-type="all"/>');

      authorizationService.authorize = function(){
        return authorizationServiceConstants.authorizationResult.authorized;
      };

      spyOn(authorizationService, 'authorize').and.callThrough();

      inject(function($rootScope, $compile){
        var scope = $rootScope.$new();
        scope.name = 'test';
        $compile(element)(scope);
        scope.$digest();
      });
    });
  });

  describe('when authorized', function() {

    it('should display the button', function(){
      expect(element.hasClass('hidden')).toBeFalsy();
    });

    var element;

    beforeEach(function(){
      element = angular.element('<button roles="" role-check-type=""/>');

      authorizationService.authorize = function() {
        return authorizationServiceConstants.authorizationResult.authorized;
      };

      inject(function($rootScope, $compile){
        var scope = $rootScope.$new();
        scope.name = 'test';
        $compile(element)(scope);
        scope.$digest();
      });
    });
  });

  describe('when not authorized', function() {

    it('should not display the button', function(){
      expect(element.hasClass('hidden')).toBeTruthy();
    });

    var element;

    beforeEach(function(){
      element = angular.element('<button roles="" role-check-type=""/>');

      authorizationService.authorize = function() {
        return authorizationServiceConstants.authorizationResult.notAuthorized;
      };

      inject(function($rootScope, $compile){
        var scope = $rootScope.$new();
        scope.name = 'test';
        $compile(element)(scope);
        scope.$digest();
      });
    });
  });

  describe('when login required', function() {

    it('should not display the button', function(){
      expect(element.hasClass('hidden')).toBeTruthy();
    });

    var element;

    beforeEach(function(){
      element = angular.element('<button roles="" role-check-type=""/>');

      authorizationService.authorize = function() {
        return authorizationServiceConstants.authorizationResult.loginRequired;
      };

      inject(function($rootScope, $compile){
        var scope = $rootScope.$new();
        scope.name = 'test';
        $compile(element)(scope);
        scope.$digest();
      });
    });
  });

  beforeEach(function() {
    module('webApp');
  });

  var authorizationService;
  var authorizationServiceConstants;

  beforeEach(function() {
    authorizationService = {};

    module(function($provide){
      $provide.value('authorizationService', authorizationService);
    });
  });

  beforeEach(inject(function($injector) {
    authorizationServiceConstants = $injector.get('authorizationServiceConstants');
  }));
});
