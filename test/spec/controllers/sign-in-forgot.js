'use strict';

describe('sign in forgot controller', function() {

  var $rootScope;
  var $scope;
  var $q;
  var membershipStub;
  var target;

  // Initialize the controller and a mock scope
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
    expect($scope.requestSucceeded).toBe(false);
  });

  it('should not allow both username and password to be omitted', function() {
    $scope.requestPasswordReset();
    $rootScope.$apply();

    expect($scope.message).not.toBeUndefined();
    expect($scope.requestSucceeded).toBe(false);
  });

  it('should allow only username to be provided', function() {
    $scope.passwordResetRequestData.username = 'username';

    membershipStub.postPasswordResetRequest.and.returnValue($q.when());

    $scope.requestPasswordReset();
    $rootScope.$apply();

    expect($scope.requestSucceeded).toBe(true);
  });


  it('should allow only email to be provided', function() {
    $scope.passwordResetRequestData.email = 'captain@phil.com';

    membershipStub.postPasswordResetRequest.and.returnValue($q.when());

    $scope.requestPasswordReset();
    $rootScope.$apply();

    expect($scope.requestSucceeded).toBe(true);
  });
});
