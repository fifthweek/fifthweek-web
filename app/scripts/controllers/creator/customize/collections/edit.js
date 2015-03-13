angular.module('webApp').controller('editCollectionCtrl', function(
  $scope,
  $state,
  states,
  collectionService,
  collectionRepositoryFactory,
  channelRepositoryFactory,
  channelNameFormatter,
  releaseTimeFormatter,
  errorFacade) {
  'use strict';

  var defaultHourOfWeek = 0;
  $scope.previousState = states.creators.customize.collections.name;
  $scope.model = {
    releaseTimesDirty: false,
    hourOfWeek: defaultHourOfWeek
  };

  var collectionId = $state.params.id;
  var collectionRepository = collectionRepositoryFactory.forCurrentUser();
  var channelRepository = channelRepositoryFactory.forCurrentUser();

  var sortReleaseTimes = function() {
    $scope.model.schedule = _.sortBy($scope.model.schedule, 'sortKey');
  };

  channelRepository.getChannels()
    .then(function(channels) {
      $scope.model.channels = _.map(
        channels,
        function(channel) {
          return {
            value: channel.channelId,
            name: channelNameFormatter.shareWith(channel)
          };
        }
      );
    })
    .then(function() {
      return collectionRepository.getChannelForCollection(collectionId)
        .then(function(channel) {
          var collection = _.find(channel.collections, { collectionId: collectionId });
          $scope.model.savedName = collection.name;
          $scope.model.name = collection.name;
          $scope.model.schedule = releaseTimeFormatter.getDayAndTimesOfWeek(collection.weeklyReleaseSchedule);
          $scope.model.selectedChannel = _.find($scope.model.channels, {value: channel.channelId});
          sortReleaseTimes();
        })
        .catch(function(error) {
          return errorFacade.handleError(error, function(message) {
            $scope.model.errorMessage = message;
          });
        });
    })
    .catch(function(error) {
      return errorFacade.handleError(error, function(message) {
        $scope.model.errorMessage = message;
      });
    });

  $scope.mainFormDirty = function() {
    return $scope.manageCollectionForm.$dirty || $scope.model.releaseTimesDirty;
  };

  $scope.addReleaseTime = function() {
    $scope.model.addingReleaseTime = true;
    $scope.model.hourOfWeek = defaultHourOfWeek;
  };

  $scope.manageReleaseTime = function(releaseTime) {
    $scope.model.selectedReleaseTime = releaseTime;
    $scope.model.hourOfWeek = releaseTime.hourOfWeek;
  };

  $scope.saveReleaseTime = function() {
    var releaseTime = releaseTimeFormatter.getDayAndTimeOfWeek($scope.model.hourOfWeek);
    $scope.model.releaseTimesDirty = true;
    _.merge($scope.model.selectedReleaseTime, releaseTime);
    $scope.model.selectedReleaseTime = null;
    sortReleaseTimes();
  };

  $scope.saveNewReleaseTime = function() {
    var releaseTime = releaseTimeFormatter.getDayAndTimeOfWeek($scope.model.hourOfWeek);
    $scope.model.schedule.push(releaseTime);
    $scope.model.releaseTimesDirty = true;
    $scope.model.addingReleaseTime = false;
    sortReleaseTimes();
  };

  $scope.save = function() {
    $state.go($scope.previousState);
  };

  $scope.delete = function() {
    return collectionService.deleteCollection(collectionId).then(function() {
      $state.go($scope.previousState);
    });
  };

  $scope.deleteReleaseTime = function() {
    _.remove($scope.model.schedule, $scope.model.selectedReleaseTime);
    $scope.model.selectedReleaseTime = null;
  };
});
