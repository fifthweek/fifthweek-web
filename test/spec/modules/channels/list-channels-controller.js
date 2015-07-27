describe('channel list controller', function () {
  'use strict';

  var $q;
  var $scope;
  var $controller;
  var target;

  var blogRepositoryFactory;
  var blogRepository;
  var errorFacade;

  beforeEach(function() {
    blogRepository = jasmine.createSpyObj('blogRepository', ['getChannelsSorted']);
    blogRepositoryFactory = { forCurrentUser: function() { return blogRepository; }};

    module('webApp', 'errorFacadeMock');
    module(function($provide) {
      $provide.value('blogRepositoryFactory', blogRepositoryFactory);
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
    blogRepository.getChannelsSorted.and.returnValue($q.when([
      {
        channelId: 'A',
        name: 'channel A',
        price: 50,
        description: 'Hello\nWorld',
        isDefault: true
      },
      {
        channelId: 'B',
        name: 'channel B',
        price: 101,
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
    blogRepository.getChannelsSorted.and.returnValue($q.reject('error'));

    initializeTarget();
    $scope.$apply();

    expect($scope.model.errorMessage).toBe(errorFacade.expectedMessage('error'));
  });
});
