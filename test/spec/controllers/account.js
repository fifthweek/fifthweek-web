'use strict';

describe('account controller', function () {

  // load the controller's module
  beforeEach(module('webApp'));

  var $q;

  var $scope;
  var $state;
  var target;

  beforeEach(function() {
    $state = jasmine.createSpyObj('$state', ['go']);

    module('webApp');
    module(function($provide) {
      $provide.value('$state', $state);
    });

    inject(function ($injector, $controller) {
      $q = $injector.get('$q');
      $scope = $injector.get('$rootScope').$new();
      target = $controller('AccountCtrl', { $scope: $scope });
    });

  });

  it('should contain default account settings data', function(){
    expect($scope.accountSettingsData).toBeDefined();
    expect($scope.accountSettingsData.emailDefault).toEqual('marc@example.com');
    expect($scope.accountSettingsData.usernameDefault).toEqual('marc-holmes');
    expect($scope.accountSettingsData.photoDefault).toEqual('images/avatar-default.png');
  });

});
