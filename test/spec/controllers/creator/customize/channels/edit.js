describe('edit channel controller', function () {
  'use strict';

  var currentChannelId = 'B';
  var currentChannel;

  var $q;
  var $scope;
  var $state;
  var $controller;
  var target;

  var channelRepositoryFactory;
  var channelRepository;
  var errorFacade;

  beforeEach(function() {
    channelRepository = jasmine.createSpyObj('channelRepository', ['getChannel']);
    channelRepositoryFactory = { forCurrentUser: function() { return channelRepository; }};
    $state = { params: { id: currentChannelId } };
    currentChannel = {
      channelId: currentChannelId,
      name: 'channel B',
      priceInUsCentsPerWeek: 101,
      description: 'Foo\nbar',
      isDefault: true,
      isVisibleToNonSubscribers: false
    };

    module('webApp', 'errorFacadeMock');
    module(function($provide) {
      $provide.value('channelRepositoryFactory', channelRepositoryFactory);
      $provide.value('$state', $state);
    });

    inject(function ($injector) {
      $q = $injector.get('$q');
      $scope = $injector.get('$rootScope').$new();
      $controller = $injector.get('$controller');
      errorFacade = $injector.get('errorFacade');
    });
  });

  var initializeTarget = function() {
    target = $controller('editChannelCtrl', { $scope: $scope });
  };

  it('should expose the specified channel', function() {
    channelRepository.getChannel.and.returnValue($q.when(currentChannel));

    initializeTarget();
    $scope.$apply();

    expect(channelRepository.getChannel).toHaveBeenCalledWith(currentChannelId);
    expect($scope.model.channel).toEqual(
      {
        channelId: currentChannel.channelId,
        name: currentChannel.name,
        description: currentChannel.description,
        isDefault: currentChannel.isDefault,
        price: '1.01',
        hidden: true
      });
  });

  it('should expose the channel\'s original name', function() {
    channelRepository.getChannel.and.returnValue($q.when(currentChannel));

    initializeTarget();
    $scope.$apply();

    expect($scope.model.savedChannelName).toBe(currentChannel.name);
  });

  it('should display any error messages', function() {
    channelRepository.getChannel.and.returnValue($q.reject('error'));

    initializeTarget();
    $scope.$apply();

    expect($scope.model.errorMessage).toBe(errorFacade.expectedMessage('error'));
  });
});
