'use strict';

describe('creator - compose note controller', function () {

  // load the controller's module
  beforeEach(module('webApp'));

  var composeNoteCtrl,
      scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    composeNoteCtrl = $controller('composeNoteCtrl', {
      $scope: scope
    });
  }));

});