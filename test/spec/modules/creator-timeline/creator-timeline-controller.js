describe('creator timeline controller', function () {
  'use strict';

  var channelPrice0 = 69;
  var channelPrice1 = 45;
  var channelPrice2 = 99;

  var $q;
  var $scope;
  var $sce;
  var accountSettingsRepositoryFactory;
  var accountSettingsRepository;
  var channelRepositoryFactory;
  var channelRepository;
  var blogRepositoryFactory;
  var blogRepository;
  var $controller;
  var target;

  beforeEach(function() {
    $sce = jasmine.createSpyObj('$sce', ['trustAsResourceUrl']);
    accountSettingsRepository = jasmine.createSpyObj('accountSettingsRepository', ['getAccountSettings']);
    accountSettingsRepositoryFactory = { forCurrentUser: function() { return accountSettingsRepository; }};
    channelRepository = jasmine.createSpyObj('channelRepository', ['getChannels']);
    channelRepositoryFactory = { forCurrentUser: function() { return channelRepository; }};
    blogRepository = jasmine.createSpyObj('blogRepository', ['getBlog']);
    blogRepositoryFactory = { forCurrentUser: function() { return blogRepository; }};

    module('webApp');
    module(function($provide) {
      $provide.value('$sce', $sce);
      $provide.value('accountSettingsRepositoryFactory', accountSettingsRepositoryFactory);
      $provide.value('channelRepositoryFactory', channelRepositoryFactory);
      $provide.value('blogRepositoryFactory', blogRepositoryFactory);
    });

    inject(function ($injector) {
      $q = $injector.get('$q');
      $scope = $injector.get('$rootScope').$new();
      $controller = $injector.get('$controller');
    });

    accountSettingsRepository.getAccountSettings.and.returnValue($q.defer().promise);
    channelRepository.getChannels.and.returnValue($q.defer().promise);
    blogRepository.getBlog.and.returnValue($q.defer().promise);
  });

  var initializeTarget = function() {
    target = $controller('timelineCtrl', { $scope: $scope });
    $scope.$apply();
  };

  var initializeChannels = function() {
    var channels = [
      {
        channelId: 'C',
        name: 'channel C',
        priceInUsCentsPerWeek: channelPrice2,
        description: 'foo\nbar',
        isDefault: false,
        isVisibleToNonSubscribers: true
      },
      {
        channelId: 'B',
        name: 'channel B',
        priceInUsCentsPerWeek: channelPrice0,
        description: 'ooh\nyeah\nbaby',
        isDefault: true,
        isVisibleToNonSubscribers: true
      },
      {
        channelId: 'A',
        name: 'channel A',
        priceInUsCentsPerWeek: channelPrice1,
        description: 'hello',
        isDefault: false,
        isVisibleToNonSubscribers: true
      },
      {
        channelId: 'Z',
        name: 'channel Z',
        priceInUsCentsPerWeek: 15,
        description: 'world',
        isDefault: false,
        isVisibleToNonSubscribers: false
      }
    ];
    channelRepository.getChannels.and.returnValue($q.when(channels));
  };

  it('should expose tracking information', function() {
    initializeTarget();

    expect($scope.model.tracking.title).toBe('Subscribed');
    expect($scope.model.tracking.category).toBe('Timeline');
  });

  it('should expose a default blog state of "unsubscribed"', function() {
    initializeTarget();

    expect($scope.model.subscribed).toBe(false);
  });

  it('should expose account settings', function() {
    accountSettingsRepository.getAccountSettings.and.returnValue($q.when('account settings'));

    initializeTarget();

    expect($scope.model.accountSettings).toBe('account settings');
  });

  it('should expose blog', function() {
    blogRepository.getBlog.and.returnValue($q.when('blog settings'));

    initializeTarget();

    expect($scope.model.blog).toBe('blog settings');
  });

  it('should expose video as a trusted resource', function() {
    blogRepository.getBlog.and.returnValue($q.when({ video: 'http://url' }));
    $sce.trustAsResourceUrl.and.returnValue('trusted url');

    initializeTarget();

    expect($sce.trustAsResourceUrl).toHaveBeenCalledWith('//url');
    expect($scope.model.videoUrl).toBe('trusted url');
  });

  it('should expose all visible channels from user state', function() {
    initializeChannels();
    initializeTarget();

    expect($scope.model.channels).toEqual([
      {
        id: 'B',
        name: 'channel B',
        price: '0.69',
        description: ['ooh', 'yeah', 'baby'],
        isDefault: true,
        checked: true
      },
      {
        id: 'A',
        name: 'channel A',
        price: '0.45',
        description: ['hello'],
        isDefault: false,
        checked: false
      },
      {
        id: 'C',
        name: 'channel C',
        price: '0.99',
        description: ['foo', 'bar'],
        isDefault: false,
        checked: false
      }
    ]);
  });

  it('should set total price to reflect sum of selected channels', function() {
    initializeChannels();
    initializeTarget();

    expect($scope.model.totalPrice).toBe((channelPrice0 / 100).toFixed(2));

    $scope.model.channels[1].checked = true;
    $scope.$apply();

    expect($scope.model.totalPrice).toBe(((channelPrice0 + channelPrice1) / 100).toFixed(2));

    $scope.model.channels[2].checked = true;
    $scope.$apply();

    expect($scope.model.totalPrice).toBe(((channelPrice0 + channelPrice1 + channelPrice2) / 100).toFixed(2));

    $scope.model.channels[1].checked = false;
    $scope.$apply();

    expect($scope.model.totalPrice).toBe(((channelPrice0 + channelPrice2) / 100).toFixed(2));
  });
});
