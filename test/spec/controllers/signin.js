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

  it('should display a message on unsuccessful sign in', function() {
    authenticationService.signIn = function() {
      var deferred = $q.defer();
      deferred.reject(new ApiError('bad'));
      return deferred.promise;
    };

    spyOn($location, 'path').and.callThrough();

    scope.signIn();
    $rootScope.$apply();

    expect($location.path).not.toHaveBeenCalled();
    expect(scope.message).toBe('bad');
  });

  it('should display a generic message and log the error on unexpected error', function() {
    authenticationService.signIn = function() {
      var deferred = $q.defer();
      deferred.reject('Bad');
      return deferred.promise;
    };

    spyOn($location, 'path').and.callThrough();

    $httpBackend.expectPOST(fifthweekConstants.apiBaseUri + 'log', { level: 'error', payload: 'Bad' }).respond(200, {});

    scope.signIn();
    $rootScope.$apply();

    expect($location.path).not.toHaveBeenCalled();
    expect(scope.message).toEqual(fifthweekConstants.unexpectedErrorText);
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
  var $httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, _$rootScope_, _$q_, _$location_, _$httpBackend_, _fifthweekConstants_) {
    $rootScope = _$rootScope_;
    scope = $rootScope.$new();
    $q = _$q_;
    $location = _$location_;
    $httpBackend = _$httpBackend_;
    fifthweekConstants = _fifthweekConstants_;

    authenticationService = function() {};

    SignInCtrl = $controller('SignInCtrl', {
      $scope: scope,
      $location: $location,
      authenticationService: authenticationService,
      fifthweekConstants: fifthweekConstants
    });
  }));
});
