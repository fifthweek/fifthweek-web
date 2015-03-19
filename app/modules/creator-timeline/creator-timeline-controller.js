angular.module('webApp').controller('timelineCtrl',
  function($scope, $sce, authenticationService, accountSettingsRepositoryFactory, channelRepositoryFactory, subscriptionRepositoryFactory) {
    'use strict';

    var accountSettingsRepository = accountSettingsRepositoryFactory.forCurrentUser();
    var channelRepository = channelRepositoryFactory.forCurrentUser();
    var subscriptionRepository = subscriptionRepositoryFactory.forCurrentUser();

    var model = {
      subscribed: false,
      profileImageUrl: '',
      headerImageUrl: '',
      fullDescription: 'Hello there!'
    };

    $scope.model = model;

    accountSettingsRepository.getAccountSettings().then(function(accountSettings){
      $scope.model.accountSettings = accountSettings;
    });

    channelRepository.getChannels().then(function(channels) {
      $scope.model.channels = _.chain(channels)
        .filter({isVisibleToNonSubscribers: true})
        .map(function(channel) {
          return {
            id: channel.channelId,
            name: channel.name,
            price: (channel.priceInUsCentsPerWeek / 100).toFixed(2),
            description: channel.description.split('\n'),
            isDefault: channel.isDefault,
            checked: channel.isDefault
          };
        })
        .sortByOrder(['isDefault', 'name'], [false, true])
        .value();
    });

    subscriptionRepository.getSubscription().then(function(data) {
      $scope.model.subscription = data;

      if (data.video) {
        $scope.model.videoUrl = $sce.trustAsResourceUrl(data.video.replace('http://', '//').replace('https://', '//'));
      }
    });

    $scope.subscribe = function() {
      $scope.model.subscribed = true;
    };

    $scope.$watch('model.channels', function() {

      $scope.model.totalPrice = _($scope.model.channels)
        .filter(function(channel) {
          return channel.checked === true;
        })
        .reduce(function(sum, channel) {
          return sum + parseFloat(channel.price); },
        0)
        .toFixed(2);

    }, true);
  }
);
