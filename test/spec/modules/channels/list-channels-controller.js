describe('channel list controller', function () {
  'use strict';

  var $q;
  var $scope;
  var $controller;
  var target;

  var channelRepositoryFactory;
  var channelRepository;
  var errorFacade;

  beforeEach(function() {
    channelRepository = jasmine.createSpyObj('channelRepository', ['getChannelsSorted']);
    channelRepositoryFactory = { forCurrentUser: function() { return channelRepository; }};

    module('webApp', 'errorFacadeMock');
    module(function($provide) {
      $provide.value('channelRepositoryFactory', channelRepositoryFactory);
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

  it('should expose channels from user state', function() {
    channelRepository.getChannelsSorted.and.returnValue($q.when([
      {
        channelId: 'A',
        name: 'channel A',
        priceInUsCentsPerWeek: 50,
        description: 'Hello\nWorld',
        isDefault: true
      },
      {
        channelId: 'B',
        name: 'channel B',
        priceInUsCentsPerWeek: 101,
        description: 'Foo',
        isDefault: false
      }
    ]));

    initializeTarget();
    $scope.$apply();

    expect($scope.model.channels).toEqual([
      {
        id: 'A',
        name: 'channel A',
        price: '0.50',
        description: ['Hello', 'World'],
        isDefault: true
      },
      {
        id: 'B',
        name: 'channel B',
        price: '1.01',
        description: ['Foo'],
        isDefault: false
      }
    ]);
  });

  it('should display any error messages', function() {
    channelRepository.getChannelsSorted.and.returnValue($q.reject('error'));

    initializeTarget();
    $scope.$apply();

    expect($scope.model.errorMessage).toBe(errorFacade.expectedMessage('error'));
  });
});
