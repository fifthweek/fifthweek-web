'use strict';

describe('Service: ordersService', function() {

  // load the service's module
  beforeEach(module('webApp'));

  // instantiate service
  var ordersService;
  var $httpBackend;
  var webSettings;
  var $rootScope;

  beforeEach(inject(function($injector) {
    ordersService = $injector.get('ordersService');
    $httpBackend = $injector.get('$httpBackend');
    webSettings = $injector.get('webSettings');
    $rootScope = $injector.get('$rootScope');
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('getOrders', function() {
    it('should call the API and return results', function() {
      $httpBackend.expectGET(webSettings.apiBaseUri + 'api/orders').respond(200, 'testresults');

      var data;
      ordersService.getOrders().then(function(response){
        data = response.data;
      });

      $httpBackend.flush();
      $rootScope.$apply();

      expect(data).toBe('testresults');
    });
  });

});