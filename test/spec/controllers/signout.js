'use strict';

describe('Controller: SignOutCtrl', function () {

  // load the controller's module
  beforeEach(module('webApp'));

  var SignoutCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SignoutCtrl = $controller('SignOutCtrl', {
      $scope: scope
    });
  }));
});
