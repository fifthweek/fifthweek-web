'use strict';

describe('sign in reset controller', function() {

  var userId = 'userId';
  var token = 'token';
  var newPassword = 'newPassword';

  var $controller;
  var $rootScope;
  var $scope;
  var $state;
  var $q;
  var errorFacade;
  var membershipStub;
  var target;

  beforeEach(function() {
    errorFacade = {};
    membershipStub = jasmine.createSpyObj('membershipStub', ['postPasswordResetConfirmation', 'getPasswordResetTokenValidity']);
    $state = {
      params: {
        userId: userId,
        token: token
      }
    };

    module('webApp');
    module(function($provide) {
      $provide.value('errorFacade', errorFacade);
      $provide.value('membershipStub', membershipStub);
      $provide.value('$state', $state);
    });

    inject(function($injector) {
      $rootScope = $injector.get('$rootScope');
      $q = $injector.get('$q');
      $scope = $rootScope.$new();
      $controller = $injector.get('$controller');
    });

    errorFacade.handleError = function(error, setMessage) {
      setMessage('friendly error message');
      return $q.when();
    };
    spyOn(errorFacade, 'handleError').and.callThrough();

    membershipStub.getPasswordResetTokenValidity.and.returnValue($q.when());
  });

  var initializeTarget = function() {
    target = $controller('SignInResetCtrl', { $scope: $scope });
  };

  describe('when initializing against invalid state', function() {

    it('should require token param', function() {
      $state.params.token = undefined;

      initializeTarget();

      expect($scope.tokenInvalid).toBe(true);
    });

    it('should require userId param', function() {
      $state.params.userId = undefined;

      initializeTarget();

      expect($scope.tokenInvalid).toBe(true);
    });
  });

  describe('when initializing against valid state', function() {

    beforeEach(initializeTarget);

    it('should initialise with appropriate defaults', function() {
      expect($scope.passwordResetConfirmationData.message).toBeUndefined();
      expect($scope.passwordResetConfirmationData.newPassword).toBe('');
      expect($scope.passwordResetConfirmationData.userId).toBe(userId);
      expect($scope.passwordResetConfirmationData.token).toBe(token);
      expect($scope.tokenInvalid).toBe(false);
    });

    it('should reset password', function() {
      $scope.passwordResetConfirmationData.newPassword = newPassword;

      membershipStub.postPasswordResetConfirmation.and.returnValue($q.when());

      $scope.confirmPasswordReset();
      $rootScope.$apply();

      expect(membershipStub.postPasswordResetConfirmation).toHaveBeenCalledWith($scope.passwordResetConfirmationData);
    });

    it('should check if link has expired', function() {
      $rootScope.$apply();

      expect(membershipStub.getPasswordResetTokenValidity).toHaveBeenCalledWith(userId, token);
    });
  });

  describe('when checking token', function() {

    it('should flag invalid token', function() {
      var notFoundError = new ApiError('', { status: 404 });
      membershipStub.getPasswordResetTokenValidity.and.returnValue($q.reject(notFoundError));

      initializeTarget();
      $rootScope.$apply();

      expect(membershipStub.getPasswordResetTokenValidity).toHaveBeenCalledWith(userId, token);
      expect(errorFacade.handleError).not.toHaveBeenCalled();
      expect($scope.tokenInvalid).toBe(true);
    });

    it('should report potential errors when checking if link has expired', function() {
      membershipStub.getPasswordResetTokenValidity.and.returnValue($q.reject('error'));

      initializeTarget();
      $rootScope.$apply();

      expect(membershipStub.getPasswordResetTokenValidity).toHaveBeenCalledWith(userId, token);
      expect(errorFacade.handleError).toHaveBeenCalledWith('error', jasmine.any(Function));
      expect($scope.tokenInvalid).toBe(false);
    });

    it('should report potential errors when checking if link has expired 2', function() {
      var unknownApiError = new ApiError('', { status: 400 });
      membershipStub.getPasswordResetTokenValidity.and.returnValue($q.reject(unknownApiError));

      initializeTarget();
      $rootScope.$apply();

      expect(membershipStub.getPasswordResetTokenValidity).toHaveBeenCalledWith(userId, token);
      expect(errorFacade.handleError).toHaveBeenCalledWith(unknownApiError, jasmine.any(Function));
      expect($scope.tokenInvalid).toBe(false);
    });
  });
});
