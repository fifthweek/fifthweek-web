describe('queue list controller', function () {
  'use strict';

  var $q;
  var $scope;
  var $controller;
  var target;

  var releaseTimeFormatter;
  var blogRepositoryFactory;
  var blogRepository;
  var errorFacade;

  beforeEach(function() {
    releaseTimeFormatter = jasmine.createSpyObj('releaseTimeFormatter', ['getDayAndTimesOfWeek']);
    blogRepository = jasmine.createSpyObj('blogRepository', ['getQueues']);
    blogRepositoryFactory = { forCurrentUser: function() { return blogRepository; }};

    releaseTimeFormatter.getDayAndTimesOfWeek.and.callFake(function(inputs) {
      return _.map(inputs, function(input) { return 'day ' + input; });
    });

    module('webApp', 'errorFacadeMock');
    module(function($provide) {
      $provide.value('releaseTimeFormatter', releaseTimeFormatter);
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
    target = $controller('listQueuesCtrl', { $scope: $scope });
  };

  it('should expose queues from user state', function() {

    blogRepository.getQueues.and.returnValue($q.when([
      {
        queueId: 'X',
        name: 'queue X',
        weeklyReleaseSchedule: [1, 2, 3]
      },
      {
        queueId: 'Y',
        name: 'queue Y',
        weeklyReleaseSchedule: [4]
      },
      {
        queueId: 'Z',
        name: 'queue Z',
        weeklyReleaseSchedule: [5, 6]
      }
    ]));

    initializeTarget();
    $scope.$apply();

    expect($scope.model.queues).toEqual([
      {
        id: 'X',
        name: 'queue X',
        schedule: ['day 1', 'day 2', 'day 3']
      },
      {
        id: 'Y',
        name: 'queue Y',
        schedule: ['day 4']
      },
      {
        id: 'Z',
        name: 'queue Z',
        schedule: ['day 5', 'day 6']
      }
    ]);
  });

  it('should display any error messages', function() {
    blogRepository.getQueues.and.returnValue($q.reject('error'));

    initializeTarget();
    $scope.$apply();

    expect($scope.model.errorMessage).toBe(errorFacade.expectedMessage('error'));
  });
});
