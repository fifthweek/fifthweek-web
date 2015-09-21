describe('edit queue controller', function () {
  'use strict';

  var queueId = 'queueId';
  var queueName = 'queueName';
  var formattedReleaseTimes;
  var queue;
  var queues;

  var $q;
  var $scope;
  var $state;
  var states;
  var $controller;
  var target;

  var queueService;
  var blogRepositoryFactory;
  var blogRepository;
  var errorFacade;
  var releaseTimeFormatter;

  beforeEach(function() {
    queue = {
      queueId: queueId,
      name: queueName,
      weeklyReleaseSchedule: [1, 2, 3]
    };
    queues = [
      {
        queueId: 'A',
        name: 'queue A'
      },
      queue
    ];
    formattedReleaseTimes = ['a', 'b', 'c'];

    queueService = jasmine.createSpyObj('queueService', ['updateQueue', 'deleteQueue']);
    releaseTimeFormatter = jasmine.createSpyObj('releaseTimeFormatter', ['getDayAndTimesOfWeek']);
    $state = jasmine.createSpyObj('$state', ['go']);
    $state.params = { id: queueId };
    blogRepository = jasmine.createSpyObj('blogRepository', ['getQueues']);
    blogRepositoryFactory = { forCurrentUser: function() { return blogRepository; }};

    module('webApp', 'errorFacadeMock');
    module(function($provide) {
      $provide.value('$state', $state);
      $provide.value('releaseTimeFormatter', releaseTimeFormatter);
      $provide.value('blogRepositoryFactory', blogRepositoryFactory);
      $provide.value('queueService', queueService);
    });

    inject(function ($injector) {
      $q = $injector.get('$q');
      $scope = $injector.get('$rootScope').$new();
      $controller = $injector.get('$controller');
      errorFacade = $injector.get('errorFacade');
      states = $injector.get('states');
    });

    blogRepository.getQueues.and.returnValue($q.when(queues));
    queueService.updateQueue.and.returnValue($q.when());
    queueService.deleteQueue.and.returnValue($q.when());
    releaseTimeFormatter.getDayAndTimesOfWeek.and.returnValue(formattedReleaseTimes);
  });

  var initializeTarget = function() {
    target = $controller('editQueueCtrl', { $scope: $scope });
    $scope.$apply();
  };

  it('should expose the state to return to on completion', function() {
    initializeTarget();

    expect($scope.previousState).toBe(states.creator.queues.name);
  });

  it('should display any error messages in getting queues', function() {
    blogRepository.getQueues.and.returnValue($q.reject('error'));

    initializeTarget();

    expect($scope.model.errorMessage).toBe(errorFacade.expectedMessage('error'));
  });

  it('should expose the queue\'s current values', function() {
    initializeTarget();

    expect($scope.model.name).toBe(queueName);
    expect($scope.model.savedName).toBe(queueName);
    expect($scope.model.schedule).toEqual(formattedReleaseTimes);
  });

  it('should save the queue', function() {
    initializeTarget();

    $scope.model.name = 'name';
    $scope.model.schedule = [ { hourOfWeek:10 }, { hourOfWeek:20 } ];

    $scope.save();
    $scope.$apply();

    expect(queueService.updateQueue).toHaveBeenCalledWith(
      queueId,
      {
        name: 'name',
        weeklyReleaseSchedule: [10, 20]
      },
      blogRepository);
  });

  it('should return to the previous state on save', function() {
    initializeTarget();

    $scope.save();
    $scope.$apply();

    expect($state.go).toHaveBeenCalledWith($scope.previousState);
  });

  it('should delete the queue', function() {
    initializeTarget();

    $scope.delete();
    $scope.$apply();

    expect(queueService.deleteQueue).toHaveBeenCalledWith(queueId, blogRepository);
  });

  it('should return to the previous state on delete', function() {
    initializeTarget();

    $scope.delete();
    $scope.$apply();

    expect($state.go).toHaveBeenCalledWith($scope.previousState);
  });
});
