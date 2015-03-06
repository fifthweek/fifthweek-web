describe('edit channel controller', function () {
  'use strict';

  var currentChannelId = 'B';
  var currentChannel;
  var channels;

  var $q;
  var $scope;
  var $state;
  var $controller;
  var target;

  var channelRepositoryFactory;
  var channelRepository;
  var errorFacade;

  beforeEach(function() {
    channelRepository = jasmine.createSpyObj('channelRepository', ['getChannels']);
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
    channels = [
      {
        channelId: 'A',
        name: 'channel A',
        priceInUsCentsPerWeek: 50,
        description: 'Hello\nWorld'
      },
      currentChannel
    ];

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

  it('should expose the specified channel from user state', function() {
    channelRepository.getChannels.and.returnValue($q.when(channels));

    initializeTarget();
    $scope.$apply();

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

  it('should expose the specified channel from user state, as a clone', function() {
    channelRepository.getChannels.and.returnValue($q.when(channels));

    initializeTarget();
    $scope.$apply();

    var currentChannelPreChange = _.cloneDeep(currentChannel);
    $scope.model.channel.name = 'Something else';
    expect(currentChannel).toEqual(currentChannelPreChange);
  });

  it('should display an error when no channels match the one specified', function() {
    channelRepository.getChannels.and.returnValue($q.when([]));

    initializeTarget();
    $scope.$apply();

    expect($scope.model.errorMessage).toBe(errorFacade.expectedMessage('Error: Channel does not exist'));
  });

  it('should display any error messages', function() {
    channelRepository.getChannels.and.returnValue($q.reject('error'));

    initializeTarget();
    $scope.$apply();

    expect($scope.model.errorMessage).toBe(errorFacade.expectedMessage('error'));
  });
});
