'use strict';

describe('Controller: TokensmanagerCtrl', function() {

  // load the controller's module
  beforeEach(module('webApp'));

  var TokensmanagerCtrl;
  var scope;
  var $rootScope;
  var tokensManagerService;
  var $q;
  var $controller;
  var toaster;

  // Initialize the controller and a mock scope
  beforeEach(inject(function(_$controller_, _$rootScope_, _$q_, _toaster_) {
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $q = _$q_;
    toaster = _toaster_;

    scope = $rootScope.$new();

    tokensManagerService = {};
  }));

  it('should get refresh tokens on creation', function() {

    tokensManagerService.getRefreshTokens = function() {
      var deferred = $q.defer();
      deferred.resolve({
        data: ['One', 'Two', 'Three']
      });
      return deferred.promise;
    };

    createController();

    expect(scope.refreshTokens.length).toBe(0);
    $rootScope.$apply();
    expect(scope.refreshTokens.length).toBe(3);
  });

  it('should display a message if it fails to get refresh tokens on creation', function() {

    tokensManagerService.getRefreshTokens = function() {
      var deferred = $q.defer();
      deferred.reject({
        data: {
          message: 'Bad'
        }
      });
      return deferred.promise;
    };

    spyOn(toaster, 'pop');

    createController();
    $rootScope.$apply();

    expect(scope.refreshTokens.length).toBe(0);
    expect(toaster.pop).toHaveBeenCalled();
  });

  describe('Controller: TokensmanagerCtrl Created', function() {

    // Initialize the controller and a mock scope
    beforeEach(function() {
      tokensManagerService.getRefreshTokens = function() {
        var deferred = $q.defer();
        deferred.resolve({
          data: ['One', 'Two', 'Three']
        });
        return deferred.promise;
      };

      createController();
      $rootScope.$apply();
    });

    it('should remove the specified refresh token if successfully deletes refresh token from server', function(){
      
      tokensManagerService.deleteRefreshTokens = function(){
        var deferred = $q.defer();
        deferred.resolve();
        return deferred.promise;
      };

      spyOn(tokensManagerService, 'deleteRefreshTokens').and.callThrough();

      expect(scope.refreshTokens.length).toBe(3);

      scope.deleteRefreshTokens(1, 'Two');
      $rootScope.$apply();

      expect(tokensManagerService.deleteRefreshTokens).toHaveBeenCalledWith('Two');
      expect(scope.refreshTokens.length).toBe(2);
    });

    it('should display a message if it fails to delete a refresh token from server', function(){
      
      tokensManagerService.deleteRefreshTokens = function(){
        var deferred = $q.defer();
        deferred.reject({
          data: {
            message: 'Bad'
          }
        });
        return deferred.promise;
      };

      spyOn(tokensManagerService, 'deleteRefreshTokens').and.callThrough();
      spyOn(toaster, 'pop');

      expect(scope.refreshTokens.length).toBe(3);

      scope.deleteRefreshTokens(1, 'Two');
      $rootScope.$apply();

      expect(tokensManagerService.deleteRefreshTokens).toHaveBeenCalledWith('Two');
      expect(toaster.pop).toHaveBeenCalled();
      expect(scope.refreshTokens.length).toBe(3);
    });
  });

  var createController = function() {
    TokensmanagerCtrl = $controller('TokensManagerCtrl', {
      $scope: scope,
      tokensManagerService: tokensManagerService,
      toaster: toaster
    });
  };
});

