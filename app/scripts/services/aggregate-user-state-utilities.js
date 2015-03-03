angular.module('webApp')
  .factory('aggregateUserStateUtilities',
  function($q, aggregateUserState) {
    'use strict';

    var service = {};

    service.mergeNewCollection = function(userId, channelId, collectionId, collectionName){
      var newChannels = _.cloneDeep(aggregateUserState.currentValue.createdChannelsAndCollections.channels);
      var channel = _.find(newChannels, { 'channelId': channelId });
      if(!channel){
        return $q.reject(new FifthweekError('Channel not found in aggregate state.'));
      }

      channel.collections.push({
        collectionId: collectionId,
        name: collectionName
      });

      aggregateUserState.updateFromDelta(
        userId,
        {
          createdChannelsAndCollections: {
            channels: newChannels
          }
        });

      return $q.when();
    };

    return service;
  }
);
