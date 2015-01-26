
'use strict';

describe('creator landing page controller', function () {

  it('should have a default totalPrice of nothing', function(){
    expect(scope.totalPrice).toEqual('');
  });

  it('should contain subscription prices', function(){
    expect(scope.subscriptions.basic.price).toEqual('0.50');
    expect(scope.subscriptions.extras.price).toEqual('0.75');
  });

  it('should have basic subscription checked by default', function(){
    expect(scope.subscriptions.basic.checked).toBe(true);
  });

  it('should have extras subscription unchecked by default', function(){
    expect(scope.subscriptions.extras.checked).toBe(false);
  });

  // load the controller's module
  beforeEach(module('webApp'));

  var landingPageCtrl,
      scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    landingPageCtrl = $controller('landingPageCtrl', {
      $scope: scope
    });
  }));

});