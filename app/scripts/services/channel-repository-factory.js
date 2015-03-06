angular.module('webApp')
  .factory('channelRepositoryFactory',
  function($q, masterRepositoryFactory) {
    'use strict';

    return {
      forCurrentUser: function() {

        var channelsKey = 'createdChannelsAndCollections.channels';
        var masterRepository = masterRepositoryFactory.forCurrentUser();

        var service = {};

        service.getChannels = function() {
          return masterRepository.get(channelsKey).then(function(channels) {
            if (channels.length === 0) {
              return $q.reject(new DisplayableError('You must create a subscription.'));
            }

            return $q.when(channels);
          });
        };

        service.updateChannels = function(applyChanges) {
          return masterRepository.set(channelsKey, function(channels) {
            return $q.when(applyChanges(channels));
          });
        };

        service.getChannel = function(channelId) {
          return service.getChannels().then(function(channels) {
            var channel = _.find(channels, {channelId: channelId});
            if (!channel) {
              return $q.reject(new DisplayableError('Channel not found.'));
            }

            return channel;
          });
        };

        service.createChannel = function(newChannel) {
          return service.updateChannels(function(channels) {
            if (_.some(channels, { channelId: newChannel.channelId })) {
              return $q.reject(new DisplayableError('Channel already exists.'));
            }

            channels.push(newChannel);
            return $q.when();
          });
        };

        service.updateChannel = function(channelId, applyChanges) {
          return service.updateChannels(function(channels) {
            var channel = _.find(channels, { channelId: channelId });
            if (!channel) {
              return $q.reject(new DisplayableError('Channel not found.'));
            }

            return $q.when(applyChanges(channel));
          });
        };

        service.deleteChannel = function(channelId) {
          return service.updateChannels(function(channels) {
            _.remove(channels, { channelId: channelId });
            return $q.when();
          });
        };

        service.createCollection = function(channelId, collectionId, collectionName) {
          return service.updateChannel(channelId, function(channel) {
            channel.collections.push({
              collectionId: collectionId,
              name: collectionName
            });
          });
        };

        return service;
      }
    };
  }
);
