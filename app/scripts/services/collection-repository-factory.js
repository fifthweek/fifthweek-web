angular.module('webApp')
  .factory('collectionRepositoryFactory',
  function($q, channelRepositoryFactory) {
    'use strict';

    return {
      forCurrentUser: function() {

        var channelRepository = channelRepositoryFactory.forCurrentUser();

        var service = {};

        service.findChannelForCollection = function(channels, collectionId) {
          var channel = _.find(channels, function(channel) {
            return _.some(channel.collections, {collectionId: collectionId});
          });

          if (!channel) {
            return $q.reject(new DisplayableError('Channel not found.'));
          }

          return channel;
        };

        service.getChannelForCollection = function(collectionId) {
          return channelRepository.getChannels().then(function(channels) {
            return service.findChannelForCollection(channels, collectionId);
          });
        };

        service.createCollection = function(channelId, collection) {
          return channelRepository.updateChannel(channelId, function(channel) {
            channel.collections.push(collection);
          });
        };

        service.deleteCollection = function(collectionId) {
          return channelRepository.updateChannels(function(channels) {
            var channel = service.findChannelForCollection(channels, collectionId);
            _.remove(channel.collections, { collectionId: collectionId });
          });
        };

        return service;
      }
    };
  }
);
