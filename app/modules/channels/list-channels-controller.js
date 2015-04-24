angular.module('webApp').controller('listChannelsCtrl', function($scope, blogRepositoryFactory, errorFacade) {
  'use strict';

  var blogRepository = blogRepositoryFactory.forCurrentUser();
  $scope.model = {};

  blogRepository.getChannelsSorted()
    .then(function(channels) {
      $scope.model.channels = _.map(channels, function (channel) {
        return {
          id: channel.channelId,
          name: channel.name,
          price: (channel.priceInUsCentsPerWeek / 100).toFixed(2),
          description: channel.description.split('\n'),
          isDefault: channel.isDefault
        };
      });
    })
    .catch(function(error) {
      return errorFacade.handleError(error, function(message) {
        $scope.model.errorMessage = message;
      });
    });
});
