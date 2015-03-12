angular.module('webApp')
  .factory('collectionRepositoryFactory',
  function($q, channelRepositoryFactory) {
    'use strict';

    return {
      forCurrentUser: function() {

        var channelRepository = channelRepositoryFactory.forCurrentUser();

        var service = {};

        service.tryFindChannelForCollection = function(channels, collectionId) {
          return _.find(channels, function(channel) {
            return _.some(channel.collections, {collectionId: collectionId});
          });
        };

        service.findChannelForCollection = function(channels, collectionId) {
          var channel = service.tryFindChannelForCollection(channels, collectionId);

          if (!channel) {
            throw new DisplayableError('Channel not found.');
          }

          return channel;
        };

        service.getChannelForCollection = function(collectionId) {
          return channelRepository.getChannels().then(function(channels) {
            try {
              return $q.when(service.findChannelForCollection(channels, collectionId));
            }
            catch(error) {
              return $q.reject(error);
            }
          });
        };

        service.createCollection = function(channelId, collection) {
          return channelRepository.updateChannels(function(channels) {

            if (service.tryFindChannelForCollection(channels, collection.collectionId)) {
              return $q.reject(new DisplayableError('Collection already exists.'));
            }

            var channel = _.find(channels, { channelId: channelId });
            if (!channel) {
              return $q.reject(new DisplayableError('Channel not found.'));
            }

            channel.collections.push(collection);
            return $q.when();
          });
        };

        service.deleteCollection = function(collectionId) {
          return channelRepository.updateChannels(function(channels) {
            var channel;
            try {
              channel = service.findChannelForCollection(channels, collectionId);
            }
            catch(error) {
              return $q.reject(error);
            }

            _.remove(channel.collections, { collectionId: collectionId });

            return $q.when();
          });
        };

        return service;
      }
    };
  }
);
