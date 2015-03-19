angular.module('webApp').controller('timelineCtrl',
  function($scope, $sce, accountSettingsRepositoryFactory, subscriptionRepositoryFactory, channelRepositoryFactory) {
    'use strict';

    var accountSettingsRepository = accountSettingsRepositoryFactory.forCurrentUser();
    var subscriptionRepository = subscriptionRepositoryFactory.forCurrentUser();
    var channelRepository = channelRepositoryFactory.forCurrentUser();

    $scope.model = {
      tracking: {
        title: 'Subscribed',
        category: 'Timeline'
      },
      subscribed: false
    };

    accountSettingsRepository.getAccountSettings().then(function(accountSettings){
      $scope.model.accountSettings = accountSettings;
    });

    subscriptionRepository.getSubscription().then(function(data) {
      $scope.model.subscription = data;

      if (data.video) {
        $scope.model.videoUrl = $sce.trustAsResourceUrl(data.video.replace('http://', '//').replace('https://', '//'));
      }
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

    $scope.subscribe = function() {
      $scope.model.subscribed = true;
    };

    $scope.$watch('model.channels', function() {

      $scope.model.totalPrice = _($scope.model.channels)
        .filter({checked: true})
        .reduce(function(sum, channel) {
          return sum + parseFloat(channel.price); },
        0)
        .toFixed(2);

    }, true);
  }
);
