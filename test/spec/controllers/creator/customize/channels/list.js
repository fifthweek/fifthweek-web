describe('channel list controller', function () {
  'use strict';

  var $q;
  var $scope;
  var $controller;
  var target;

  var aggregateUserStateUtilities;
  var errorFacade;

  beforeEach(function() {
    aggregateUserStateUtilities = jasmine.createSpyObj('aggregateUserStateUtilities', ['getChannelsAndCollections']);

    module('webApp', 'errorFacadeMock');
    module(function($provide) {
      $provide.value('aggregateUserStateUtilities', aggregateUserStateUtilities);
    });

    inject(function ($injector) {
      $q = $injector.get('$q');
      $scope = $injector.get('$rootScope').$new();
      $controller = $injector.get('$controller');
      errorFacade = $injector.get('errorFacade');
    });
  });

  var initializeTarget = function() {
    target = $controller('listChannelsCtrl', { $scope: $scope });
  };

  it('should return channels from user state', function() {
    aggregateUserStateUtilities.getChannelsAndCollections.and.returnValue($q.when([
      {
        channelId: 'A',
        name: 'channel A',
        priceInUsCentsPerWeek: 50,
        description: 'Hello\nWorld'
      },
      {
        channelId: 'B',
        name: 'channel B',
        priceInUsCentsPerWeek: 101,
        description: 'Foo'
      }
    ]));
    initializeTarget();
    $scope.$apply();
    expect($scope.model.channels).toEqual([
      {
        id: 'A',
        name: 'channel A',
        price: '0.50',
        description: ['Hello', 'World']
      },
      {
        id: 'B',
        name: 'channel B',
        price: '1.01',
        description: ['Foo']
      }
    ]);
  });

  it('should display any error messages', function() {
    aggregateUserStateUtilities.getChannelsAndCollections.and.returnValue($q.reject('error'));
    initializeTarget();
    $scope.$apply();
    expect($scope.model.errorMessage).toBe(errorFacade.expectedMessage('error'));
  });
});
