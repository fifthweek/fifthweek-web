'use strict';

describe('creator landing page controller', function () {

  it('should contain subscription prices', function(){
    expect(scope.channels.basic.price).toEqual('0.50');
    expect(scope.channels.extras.price).toEqual('0.75');
    //expect(scope.channels.superExtras.price).toEqual('9.25');
  });

  it('should have basic subscription checked by default', function(){
    expect(scope.channels.basic.checked).toBe(true);
  });

  it('should have extras subscription unchecked by default', function(){
    expect(scope.channels.extras.checked).toBe(false);
  });

  it('should add subscriptions correctly', function(){
    var totalBasicExtras = +scope.channels.basic.price + +scope.channels.extras.price;
    expect(totalBasicExtras).toEqual(1.25);
  });



  ////////
  //
  //test watch with check switching
  //
  ////////




  // load the controller's module
  beforeEach(module('webApp'));

  var landingPageCtrl,
      $rootScope,
      scope,
      $q;

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$rootScope_, $controller, _$q_) {
    $rootScope = _$rootScope_;
    scope = $rootScope.$new();
    $q = _$q_;
    landingPageCtrl = $controller('landingPageCtrl', {
      $scope: scope
    });
  }));

});