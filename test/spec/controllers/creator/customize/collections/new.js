describe('new collection controller', function () {
  'use strict';

  var channels = [
    {
      channelId: 'A',
      name: 'channel A'
    },
    {
      channelId: 'B',
      name: 'channel B'
    }
  ];

  var $q;
  var $scope;
  var $state;
  var states;
  var $controller;
  var target;

  var channelNameFormatter;
  var collectionService;
  var channelRepositoryFactory;
  var channelRepository;
  var errorFacade;

  beforeEach(function() {
    collectionService = jasmine.createSpyObj('collectionService', ['createCollectionFromName']);
    $state = jasmine.createSpyObj('$state', ['go']);
    channelRepository = jasmine.createSpyObj('channelRepository', ['getChannels']);
    channelRepositoryFactory = { forCurrentUser: function() { return channelRepository; }};

    module('webApp', 'errorFacadeMock', 'channelNameFormatterMock');
    module(function($provide) {
      $provide.value('$state', $state);
      $provide.value('channelRepositoryFactory', channelRepositoryFactory);
      $provide.value('collectionService', collectionService);
    });

    inject(function ($injector) {
      $q = $injector.get('$q');
      $scope = $injector.get('$rootScope').$new();
      $controller = $injector.get('$controller');
      errorFacade = $injector.get('errorFacade');
      states = $injector.get('states');
      channelNameFormatter = $injector.get('channelNameFormatter');
    });

    channelRepository.getChannels.and.returnValue($q.when(channels));
    collectionService.createCollectionFromName.and.returnValue($q.when());
  });

  var initializeTarget = function() {
    target = $controller('newCollectionCtrl', { $scope: $scope });
    $scope.$apply();
  };

  it('should expose the state to return to on completion', function() {
    initializeTarget();

    expect($scope.previousState).toBe(states.creators.customize.collections.name);
  });

  it('should expose a collection with default values', function() {
    initializeTarget();

    expect($scope.model.collection.name).toBe('');
    expect($scope.model.selectedChannel.value).toBe(channels[0].channelId);
  });

  it('should create the new collection', function() {
    initializeTarget();

    $scope.model.collection.name = 'name';
    $scope.model.selectedChannel.value = channels[1].channelId;

    $scope.createCollection();
    $scope.$apply();

    expect(collectionService.createCollectionFromName).toHaveBeenCalledWith(channels[1].channelId, 'name');
  });

  it('should return to the previous state on save', function() {
    initializeTarget();

    $scope.createCollection();
    $scope.$apply();

    expect($state.go).toHaveBeenCalledWith($scope.previousState);
  });

  it('should expose channels from user state', function() {
    initializeTarget();

    expect($scope.model.channels).toEqual([
      {
        value: channels[0].channelId,
        name: channelNameFormatter.shareWithResult(channels[0])
      },
      {
        value: channels[1].channelId,
        name: channelNameFormatter.shareWithResult(channels[1])
      }
    ]);
  });

  it('should display any error messages in getting these channels', function() {
    channelRepository.getChannels.and.returnValue($q.reject('error'));

    initializeTarget();

    expect($scope.model.errorMessage).toBe(errorFacade.expectedMessage('error'));
  });
});
