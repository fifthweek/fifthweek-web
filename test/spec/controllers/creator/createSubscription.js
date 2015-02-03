'use strict';

describe('creator - create subscription page controller', function () {


  // load the controller's module
  beforeEach(module('webApp'));

  var createSubscriptionCtrl,
      $rootScope,
      scope,
      $q;

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$rootScope_, $controller, _$q_) {
    $rootScope = _$rootScope_;
    scope = $rootScope.$new();
    $q = _$q_;
    createSubscriptionCtrl = $controller('createSubscriptionCtrl', {
      $scope: scope
    });
  }));

});