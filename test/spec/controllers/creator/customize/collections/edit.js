describe('edit collection controller', function () {
  'use strict';

  var collectionId = 'collectionId';
  var collectionName = 'collectionName';
  var channelId = 'channelId';
  var formattedReleaseTimes;
  var channel;
  var channels;

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
  var collectionRepositoryFactory;
  var collectionRepository;
  var errorFacade;
  var releaseTimeFormatter;

  beforeEach(function() {
    channel = {
      channelId: channelId,
      collections: [
        {
          collectionId: collectionId,
          name: collectionName,
          weeklyReleaseSchedule: [1, 2, 3]
        }
      ]
    };
    channels = [
      {
        channelId: 'A',
        name: 'channel A'
      },
      channel
    ];
    formattedReleaseTimes = ['a', 'b', 'c'];

    collectionService = jasmine.createSpyObj('collectionService', ['updateCollection', 'deleteCollection']);
    releaseTimeFormatter = jasmine.createSpyObj('releaseTimeFormatter', ['getDayAndTimesOfWeek']);
    $state = jasmine.createSpyObj('$state', ['go']);
    $state.params = { id: collectionId };
    channelRepository = jasmine.createSpyObj('channelRepository', ['getChannels']);
    channelRepositoryFactory = { forCurrentUser: function() { return channelRepository; }};
    collectionRepository = jasmine.createSpyObj('collectionRepository', ['getChannelForCollection']);
    collectionRepositoryFactory = { forCurrentUser: function() { return collectionRepository; }};

    module('webApp', 'errorFacadeMock', 'channelNameFormatterMock');
    module(function($provide) {
      $provide.value('$state', $state);
      $provide.value('releaseTimeFormatter', releaseTimeFormatter);
      $provide.value('channelRepositoryFactory', channelRepositoryFactory);
      $provide.value('collectionRepositoryFactory', collectionRepositoryFactory);
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
    collectionRepository.getChannelForCollection.and.returnValue($q.when(channel));
    collectionService.updateCollection.and.returnValue($q.when());
    collectionService.deleteCollection.and.returnValue($q.when());
    releaseTimeFormatter.getDayAndTimesOfWeek.and.returnValue(formattedReleaseTimes);
  });

  var initializeTarget = function() {
    target = $controller('editCollectionCtrl', { $scope: $scope });
    $scope.$apply();
  };

  it('should expose the state to return to on completion', function() {
    initializeTarget();

    expect($scope.previousState).toBe(states.creators.customize.collections.name);
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

  it('should expose the collection\'s current values', function() {
    initializeTarget();

    expect($scope.model.name).toBe(collectionName);
    expect($scope.model.savedName).toBe(collectionName);
    expect($scope.model.schedule).toEqual(formattedReleaseTimes);
    expect($scope.model.selectedChannel.value).toBe(channelId);
  });

  it('should display any error messages in getting these values', function() {
    collectionRepository.getChannelForCollection.and.returnValue($q.reject('error'));

    initializeTarget();

    expect($scope.model.errorMessage).toBe(errorFacade.expectedMessage('error'));
  });

  it('should save the collection', function() {
    initializeTarget();

    $scope.model.name = 'name';
    $scope.model.selectedChannel.value = channels[1].channelId;
    $scope.model.schedule = [ { hourOfWeek:10 }, { hourOfWeek:20 } ];

    $scope.save();
    $scope.$apply();

    expect(collectionService.updateCollection).toHaveBeenCalledWith(collectionId, {
      name: 'name',
      channelId: channels[1].channelId,
      weeklyReleaseSchedule: [10, 20]
    });
  });

  it('should return to the previous state on save', function() {
    initializeTarget();

    $scope.save();
    $scope.$apply();

    expect($state.go).toHaveBeenCalledWith($scope.previousState);
  });

  it('should delete the collection', function() {
    initializeTarget();

    $scope.delete();
    $scope.$apply();

    expect(collectionService.deleteCollection).toHaveBeenCalledWith(collectionId);
  });

  it('should return to the previous state on delete', function() {
    initializeTarget();

    $scope.delete();
    $scope.$apply();

    expect($state.go).toHaveBeenCalledWith($scope.previousState);
  });
});
