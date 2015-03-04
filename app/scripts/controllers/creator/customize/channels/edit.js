angular.module('webApp').controller('editChannelCtrl', function($scope, $q, $state, aggregateUserState, channelRepositoryFactory, channelStub, errorFacade) {
  'use strict';

  var channelRepository = channelRepositoryFactory.forCurrentUser();
  var channelId = $state.params.id;
  $scope.model = {};

  channelRepository.getChannelsAndCollections()
    .then(function(channels) {
      $scope.model.savedChannel = _.find(channels, { channelId: channelId });
      if (!$scope.model.savedChannel) {
        return $q.reject(new FifthweekError('Channel does not exist'));
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

  //$scope.save = function() {
  //  var channelData = {};
  //  return channelStub.putChannel(channelId, channelData)
  //    .then(function() {
  //
  //      var newChannels = _.cloneDeep(aggregateUserState.currentValue.createdChannelsAndCollections.channels);
  //      var channel = _.find(newChannels, { 'channelId': channelId });
  //      if(!channel){
  //        return $q.reject(new FifthweekError('Channel not found in aggregate state.'));
  //      }
  //    });
  //};

  $scope.delete = function() {
    $state.go(states.creators.customize.channels.name);
  };
});
