'use strict';

describe('Service: tokensManagerService', function() {

  // load the service's module
  beforeEach(module('webApp'));

  // instantiate service
  var tokensManagerService;
  var $httpBackend;
  var webSettings;
  var $rootScope;

  beforeEach(inject(function($injector) {
    tokensManagerService = $injector.get('tokensManagerService');
    $httpBackend = $injector.get('$httpBackend');
    webSettings = $injector.get('webSettings');
    $rootScope = $injector.get('$rootScope');
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should request refresh tokens when getRefreshTokens is called', function() {
    $httpBackend.expectGET(webSettings.apiBaseUri + 'api/refreshTokens').respond(200, 'testresult');

    var data;
    tokensManagerService.getRefreshTokens().then(function(response){
      data = response.data;
    });

    $httpBackend.flush();
    $rootScope.$apply();

    expect(data).toBe('testresult');
  });

  it('should request refresh tokens when getRefreshTokens is called', function() {
    var tokenId = 'ABC';
    $httpBackend.expectDELETE(webSettings.apiBaseUri + 'api/refreshTokens/?tokenid=' + tokenId).respond(200, 'testresult');

    var data;
    tokensManagerService.deleteRefreshTokens(tokenId).then(function(response){
      data = response.data;
    });

    $httpBackend.flush();
    $rootScope.$apply();

    expect(data).toBe('testresult');
  });

});