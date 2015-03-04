angular.module('webApp')
  .factory('aggregateUserStateUtilities',
  function($q, aggregateUserState) {
    'use strict';

    var service = {};

    service.updateChannel = function(userId, channelId, collectionId, collectionName){
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

    service.getChannelsAndCollections = function(){
      try {
        if (!aggregateUserState.currentValue) {
          return $q.reject(new FifthweekError('No aggregate state found.'));
        }

        var channels = aggregateUserState.currentValue.createdChannelsAndCollections.channels;

        if (channels.length === 0) {
          return $q.reject(new DisplayableError('You must create a subscription.'));
        }

        channels = _.cloneDeep(channels);

        return $q.when(channels);
      }
      catch(error){
        return $q.reject(new FifthweekError(error));
      }
    };

    return service;
  }
);
