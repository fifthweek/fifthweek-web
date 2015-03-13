describe('collection list controller', function () {
  'use strict';

  var $q;
  var $scope;
  var $controller;
  var target;

  var releaseTimeFormatter;
  var channelRepositoryFactory;
  var channelRepository;
  var errorFacade;

  beforeEach(function() {
    releaseTimeFormatter = jasmine.createSpyObj('releaseTimeFormatter', ['getDayAndTimesOfWeek']);
    channelRepository = jasmine.createSpyObj('channelRepository', ['getChannels']);
    channelRepositoryFactory = { forCurrentUser: function() { return channelRepository; }};

    releaseTimeFormatter.getDayAndTimesOfWeek.and.callFake(function(inputs) {
      return _.map(inputs, function(input) { return 'day ' + input; });
    });

    module('webApp', 'errorFacadeMock');
    module(function($provide) {
      $provide.value('releaseTimeFormatter', releaseTimeFormatter);
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
    target = $controller('listCollectionsCtrl', { $scope: $scope });
  };

  it('should expose collections from user state', function() {

    channelRepository.getChannels.and.returnValue($q.when([
      {
        name: 'channel A',
        isDefault: true,
        collections: [
          {
            collectionId: 'X',
            name: 'collection X',
            weeklyReleaseSchedule: [1, 2, 3]
          }
        ]
      },
      {
        channelId: 'B',
        name: 'channel B',
        isDefault: false,
        collections: [
          {
            collectionId: 'Y',
            name: 'collection Y',
            weeklyReleaseSchedule: [4]
          },
          {
            collectionId: 'Z',
            name: 'collection Z',
            weeklyReleaseSchedule: [5, 6]
          }
        ]
      },
      {
        channelId: 'C',
        name: 'channel C',
        isDefault: false,
        collections: []
      }
    ]));

    initializeTarget();
    $scope.$apply();

    expect($scope.model.collections).toEqual([
      {
        id: 'X',
        name: 'collection X',
        schedule: ['day 1', 'day 2', 'day 3'],
        channel: 'channel A',
        isDefaultChannel: true
      },
      {
        id: 'Y',
        name: 'collection Y',
        schedule: ['day 4'],
        channel: 'channel B',
        isDefaultChannel: false
      },
      {
        id: 'Z',
        name: 'collection Z',
        schedule: ['day 5', 'day 6'],
        channel: 'channel B',
        isDefaultChannel: false
      }
    ]);
  });

  it('should display any error messages', function() {
    channelRepository.getChannels.and.returnValue($q.reject('error'));

    initializeTarget();
    $scope.$apply();

    expect($scope.model.errorMessage).toBe(errorFacade.expectedMessage('error'));
  });
});
