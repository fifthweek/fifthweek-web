angular.module('webApp').controller('editChannelCtrl', function($scope, $state, aggregateUserStateUtilities, errorFacade) {
  'use strict';

  var channelId = $state.params.id;
  $scope.model = {};

  aggregateUserStateUtilities.getChannelsAndCollections()
    .then(function(channels) {
      $scope.model.savedChannel = _.find(channels, { channelId: channelId });
      if (!$scope.model.savedChannel) {
        throw new FifthweekError('Channel does not exist');
      }

      $scope.model.channel = _.cloneDeep($scope.model.savedChannel);

      // Map price.
      $scope.model.channel.price = ($scope.model.channel.priceInUsCentsPerWeek / 100).toFixed(2);
      delete $scope.model.channel.priceInUsCentsPerWeek;

      // Map visibility.
      $scope.model.channel.hidden = !$scope.model.channel.isVisibleToNonSubscribers;
      delete $scope.model.channel.isVisibleToNonSubscribers;
    })
    .catch(function(error) {
      return errorFacade.handleError(error, function(message) {
        $scope.model.errorMessage = message;
      });
    });

  $scope.delete = function() {
    $state.go(states.creators.customize.channels.name);
  };
});
