'use strict';

describe('Controller: OrdersCtrl', function() {

  // load the controller's module
  beforeEach(module('webApp'));

  var OrdersCtrl;
  var scope;
  var $rootScope;
  var ordersService;
  var $q;
  var $controller;

  // Initialize the controller and a mock scope
  beforeEach(inject(function(_$controller_, _$rootScope_, _$q_) {
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    scope = $rootScope.$new();
    $q = _$q_;

    ordersService = {};
  }));

  it('should contain a list of orders on construction', function() {
    ordersService.getOrders = function() {
      var deferred = $q.defer();
      var result = {
        data: ['A', 'B', 'C']
      };
      deferred.resolve(result);
      return deferred.promise;
    };

    createOrdersCtrl();

    expect(scope.orders.length).toBe(0);

    $rootScope.$apply();

    expect(scope.orders.length).toBe(3);
  });

  it('should contain no orders on construction if there was an error getting orders', function() {
    ordersService.getOrders = function() {
      var deferred = $q.defer();
      deferred.reject('error');
      return deferred.promise;
    };

    createOrdersCtrl();

    expect(scope.orders.length).toBe(0);

    $rootScope.$apply();

    expect(scope.orders.length).toBe(0);
  });

  var createOrdersCtrl = function()
  {
    OrdersCtrl = $controller('OrdersCtrl', {
      $scope: scope,
      ordersService: ordersService
    });
  };
});