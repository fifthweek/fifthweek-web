describe('new queue controller', function () {
  'use strict';

  var $q;
  var $scope;
  var $state;
  var states;
  var $controller;
  var target;

  var queueService;

  beforeEach(function() {
    queueService = jasmine.createSpyObj('queueService', ['createQueueFromName']);
    $state = jasmine.createSpyObj('$state', ['go']);

    module('webApp', 'errorFacadeMock');
    module(function($provide) {
      $provide.value('$state', $state);
      $provide.value('queueService', queueService);
    });

    inject(function ($injector) {
      $q = $injector.get('$q');
      $scope = $injector.get('$rootScope').$new();
      $controller = $injector.get('$controller');
      states = $injector.get('states');
    });

    queueService.createQueueFromName.and.returnValue($q.when());
  });

  var initializeTarget = function() {
    target = $controller('newQueueCtrl', { $scope: $scope });
    $scope.$apply();
  };

  it('should expose the state to return to on completion', function() {
    initializeTarget();

    expect($scope.previousState).toBe(states.creator.queues.name);
  });

  it('should expose a queue with default values', function() {
    initializeTarget();

    expect($scope.model.queue.name).toBe('');
  });

  it('should create the new queue', function() {
    initializeTarget();

    $scope.model.queue.name = 'name';

    $scope.createQueue();
    $scope.$apply();

    expect(queueService.createQueueFromName).toHaveBeenCalledWith('name');
  });

  it('should return to the previous state on save', function() {
    initializeTarget();

    $scope.createQueue();
    $scope.$apply();

    expect($state.go).toHaveBeenCalledWith($scope.previousState);
  });
});
