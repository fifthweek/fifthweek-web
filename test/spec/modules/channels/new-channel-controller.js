describe('new channel controller', function () {
  'use strict';

  var blogId = 'blogId';
  var channelId = 'channelId';

  var boundaryRoundingValue = '2.51'; // 2.51 * 100 = 250.99999999999997
  var price = boundaryRoundingValue;
  var priceInCents = 251;

  var $q;
  var $scope;
  var $state;
  var states;
  var target;

  var fetchAggregateUserState;
  var authenticationService;
  var channelStub;
  var blogService;

  beforeEach(function() {
    blogService = { blogId: blogId };
    $state = jasmine.createSpyObj('$state', ['go']);
    channelStub = jasmine.createSpyObj('channelStub', ['postChannel']);
    fetchAggregateUserState = jasmine.createSpyObj('fetchAggregateUserState', ['updateFromServer']);

    authenticationService = { currentUser: { userId: 'userId' }};

    module('webApp');
    module(function($provide) {
      $provide.value('blogService', blogService);
      $provide.value('$state', $state);
      $provide.value('channelStub', channelStub);
      $provide.value('fetchAggregateUserState', fetchAggregateUserState);
      $provide.value('authenticationService', authenticationService);
    });

    inject(function ($injector, $controller) {
      $q = $injector.get('$q');
      $scope = $injector.get('$rootScope').$new();
      states = $injector.get('states');
      target = $controller('newChannelCtrl', { $scope: $scope });
    });

    channelStub.postChannel.and.returnValue($q.defer().promise);
    fetchAggregateUserState.updateFromServer.and.returnValue($q.defer().promise);
  });

  it('should expose the state to return to on completion', function() {
    expect($scope.previousState).toBe(states.creator.channels.name);
  });

  it('should expose a channel with default values', function() {
    expect($scope.model.channel.name).toBe('');
    expect($scope.model.channel.description).toBe('');
    expect($scope.model.channel.hidden).toBe(false);
    expect($scope.model.channel.price).toBe('1.00');
  });

  it('should create the new channel via the API', function() {
    $scope.model.channel.name = 'name';
    $scope.model.channel.description = 'description';
    $scope.model.channel.hidden = false;
    $scope.model.channel.price = price;

    $scope.create();
    $scope.$apply();

    expect(channelStub.postChannel).toHaveBeenCalledWith({
      blogId: blogId,
      name: 'name',
      description: 'description',
      price: priceInCents,
      isVisibleToNonSubscribers: true
    });
  });

  it('should save the new channel to the client-side repository', function() {
    $scope.model.channel.name = 'name';
    $scope.model.channel.description = 'description';
    $scope.model.channel.hidden = false;
    $scope.model.channel.price = price;
    channelStub.postChannel.and.returnValue($q.when({ data: channelId }));

    $scope.create();
    $scope.$apply();

    expect(fetchAggregateUserState.updateFromServer).toHaveBeenCalledWith('userId');
  });

  it('should return to the previous state on save', function() {
    channelStub.postChannel.and.returnValue($q.when({ data: channelId }));
    fetchAggregateUserState.updateFromServer.and.returnValue($q.when());

    $scope.create();
    $scope.$apply();

    expect($state.go).toHaveBeenCalledWith($scope.previousState);
  });
});
