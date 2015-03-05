angular.module('webApp')
  .factory('channelRepositoryFactory',
  function($q, aggregateUserState, authenticationService) {
    'use strict';

    return {
      forCurrentUser: function() {

        var service = {};

        // The ID must be scoped to the lifetime of this repository, since this repository represents channels for a
        // particular user.
        var currentUserId = authenticationService.currentUser.userId;

        var userChanged = function() {
          return aggregateUserState.currentValue.userId !== currentUserId;
        };

        service.createChannel = function(newChannel){
          if (userChanged()) {
            return $q.when();
          }

          var newChannels = _.cloneDeep(aggregateUserState.currentValue.createdChannelsAndCollections.channels);
          var exitingChannel = _.find(newChannels, { 'channelId': newChannel.channelId });
          if(exitingChannel){
            return $q.reject(new FifthweekError('Channel already exists in aggregate state.'));
          }

          newChannels.push(newChannel);

          aggregateUserState.updateFromDelta(
            currentUserId,
            {
              createdChannelsAndCollections: {
                channels: newChannels
              }
            });

          return $q.when();
        };

        service.updateChannel = function(channelId, applyChanges){
          if (userChanged()) {
            return $q.when();
          }

          var newChannels = _.cloneDeep(aggregateUserState.currentValue.createdChannelsAndCollections.channels);
          var channel = _.find(newChannels, { 'channelId': channelId });
          if(!channel){
            return $q.reject(new FifthweekError('Channel not found in aggregate state.'));
          }

          applyChanges(channel);

          aggregateUserState.updateFromDelta(
            currentUserId,
            {
              createdChannelsAndCollections: {
                channels: newChannels
              }
            });

          return $q.when();
        };

        service.createCollection = function(channelId, collectionId, collectionName){
          return service.updateChannel(channelId, function(channel) {
            channel.collections.push({
              collectionId: collectionId,
              name: collectionName
            });
          });
        };

        service.getChannelsAndCollections = function(){
          try {
            if (!aggregateUserState.currentValue) {
              return $q.reject(new FifthweekError('No aggregate state found.'));
            }

            if (userChanged()) {
              return $q.reject(new FifthweekError('User has changed: channel repository no longer valid.'));
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
    };
  }
);
