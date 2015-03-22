describe('fw-check-username-availability directive', function(){
  'use strict';

  var html = '<form name="form"><input type="text" name="usernameInput" ng-model="usernameValue" fw-check-username-availability></form>';

  var $q;
  var $rootScope;
  var scope;
  var $compile;
  var membershipStub;
  var logService;

  beforeEach(function() {
    module('webApp');

    membershipStub = jasmine.createSpyObj('membershipStub', ['getUsernameAvailability']);
    logService = jasmine.createSpyObj('logService', ['error']);

    module(function($provide){
      $provide.value('membershipStub', membershipStub);
      $provide.value('logService', logService);
    });

    inject(function($injector) {
      $rootScope = $injector.get('$rootScope');
      scope = $rootScope.$new();
      $compile = $injector.get('$compile');
      $q = $injector.get('$q');
    });
  });

  describe('when initialized with a value', function() {
    var initialValue = 'initial value';

    beforeEach(function() {
      scope.usernameValue = initialValue;
      var element = angular.element(html);
      $compile(element)(scope);
      scope.$apply();
    });

    it('should treat available values as valid', function() {
      membershipStub.getUsernameAvailability.and.returnValue($q.when());

      scope.form.usernameInput.$setViewValue('something else');
      scope.$apply();

      expect(scope.form.usernameInput.$error.username).toBeFalsy();
    });

    it('should treat unavailable values as invalid', function() {
      membershipStub.getUsernameAvailability.and.returnValue($q.reject(new ApiError('', {status: 404})));

      scope.form.usernameInput.$setViewValue('something else');
      scope.$apply();

      expect(scope.form.usernameInput.$error.username).toBe(true);
    });

    it('should treat initial value as valid', function() {
      membershipStub.getUsernameAvailability.and.returnValue($q.reject(new ApiError('', {status: 404})));

      expect(scope.form.usernameInput.$error.username).toBeFalsy();

      scope.form.usernameInput.$setViewValue('something else');
      scope.$apply();

      expect(scope.form.usernameInput.$error.username).toBe(true);

      scope.form.usernameInput.$setViewValue(initialValue);
      scope.$apply();

      expect(scope.form.usernameInput.$error.username).toBeFalsy();
    });
  });

  describe('when initialized without a value', function() {
    beforeEach(function() {
      var element = angular.element(html);
      $compile(element)(scope);
      scope.$apply();
    });

    it('should treat available values as valid', function() {
      membershipStub.getUsernameAvailability.and.returnValue($q.when());

      scope.form.usernameInput.$setViewValue('something else');
      scope.$apply();

      expect(scope.form.usernameInput.$error.username).toBeFalsy();
    });

    it('should treat unavailable values as invalid', function() {
      membershipStub.getUsernameAvailability.and.returnValue($q.reject(new ApiError('', {status: 404})));

      scope.form.usernameInput.$setViewValue('something else');
      scope.$apply();

      expect(scope.form.usernameInput.$error.username).toBe(true);
    });
  });

  describe('when checking availability', function() {
    beforeEach(function() {
      var element = angular.element(html);
      $compile(element)(scope);
      scope.$apply();
    });

    it('should not check initial value via the API', function() {
      expect(membershipStub.getUsernameAvailability).not.toHaveBeenCalled();
    });

    it('should check availability via the API', function() {
      membershipStub.getUsernameAvailability.and.returnValue($q.defer().promise);

      scope.form.usernameInput.$setViewValue('something else');
      scope.$apply();

      expect(membershipStub.getUsernameAvailability).toHaveBeenCalledWith('something else');
    });

    it('should flag validity as pending', function() {
      var deferred = $q.defer();
      membershipStub.getUsernameAvailability.and.returnValue(deferred.promise);

      expect(scope.form.usernameInput.$pending).toBeFalsy();

      scope.form.usernameInput.$setViewValue('something else');
      scope.$apply();

      expect(scope.form.usernameInput.$pending.username).toBe(true);

      deferred.resolve();
      scope.$apply();

      expect(scope.form.usernameInput.$pending).toBeFalsy();
    });
  });
});
