'use strict';

describe('sign in controller', function() {

  it('should navigate to the dashboard on successful sign in', function() {
    authenticationService.signIn = function() {
      var deferred = $q.defer();
      deferred.resolve('success');
      return deferred.promise;
    };

    spyOn($location, 'path').and.callThrough();

    scope.signIn();
    $rootScope.$apply();

    expect($location.path).toHaveBeenCalledWith(fifthweekConstants.dashboardPage);
  });

  it('should display an error message and log the error on unsuccessful sign in', function() {
    authenticationService.signIn = function() {
      return $q.reject();
    };

    spyOn($location, 'path');
    spyOn(logService, 'error');
    spyOn(utilities, 'getFriendlyErrorMessage').and.callThrough();

    scope.signIn();
    $rootScope.$apply();

    expect($location.path).not.toHaveBeenCalled();
    expect(logService.error).toHaveBeenCalled();
    expect(utilities.getFriendlyErrorMessage).toHaveBeenCalled();
    expect(scope.message).toEqual(errorMessage);
  });

  // load the controller's module
  beforeEach(module('webApp'));

  var SignInCtrl;
  var $rootScope;
  var scope;
  var $location;
  var $q;
  var authenticationService;
  var fifthweekConstants;
  var logService;
  var utilities;
  var errorMessage = '!';

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, _$rootScope_, _$q_, _$location_, _fifthweekConstants_) {
    $rootScope = _$rootScope_;
    scope = $rootScope.$new();
    $q = _$q_;
    $location = _$location_;
    fifthweekConstants = _fifthweekConstants_;

    authenticationService = {};
    logService = { error: function(){} };
    utilities = { getFriendlyErrorMessage: function(){ return errorMessage; } }

    SignInCtrl = $controller('SignInCtrl', {
      $scope: scope,
      $location: $location,
      authenticationService: authenticationService,
      fifthweekConstants: fifthweekConstants,
      logService: logService,
      utilities: utilities
    });
  }));
});
