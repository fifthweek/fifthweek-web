'use strict';

describe('sign in forgot controller', function() {

  var $rootScope;
  var $scope;
  var $q;
  var membershipStub;
  var target;

  beforeEach(function() {
    membershipStub = jasmine.createSpyObj('membershipStub', ['postPasswordResetRequest']);

    module('webApp');
    module(function($provide) {
      $provide.value('membershipStub', membershipStub);
    });

    inject(function($injector, $controller) {
      $rootScope = $injector.get('$rootScope');
      $q = $injector.get('$q');
      $scope = $rootScope.$new();
      target = $controller('SignInForgotCtrl', { $scope: $scope });
    });
  });

  it('should initialise with appropriate defaults', function() {
    expect($scope.passwordResetRequestData.message).toBeUndefined();
    expect($scope.passwordResetRequestData.username).toBe('');
    expect($scope.passwordResetRequestData.email).toBe('');
  });

  it('should not allow both username and password to be omitted', function() {
    var result = $scope.requestPasswordReset();

    $rootScope.$apply();

    result
      .catch(function(error) {
        expect(error instanceof InputValidationError).toBe(true);
      })
      .then(function() {
        fail();
      });
  });

  it('should allow only username to be provided', function() {
    $scope.passwordResetRequestData.username = 'username';

    membershipStub.postPasswordResetRequest.and.returnValue($q.when());

    $scope.requestPasswordReset();
    $rootScope.$apply();

    expect(membershipStub.postPasswordResetRequest).toHaveBeenCalledWith($scope.passwordResetRequestData);
  });


  it('should allow only email to be provided', function() {
    $scope.passwordResetRequestData.email = 'captain@phil.com';

    membershipStub.postPasswordResetRequest.and.returnValue($q.when());

    $scope.requestPasswordReset();
    $rootScope.$apply();

    expect(membershipStub.postPasswordResetRequest).toHaveBeenCalledWith($scope.passwordResetRequestData);
  });
});
