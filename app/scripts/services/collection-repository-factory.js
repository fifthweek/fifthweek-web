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

        service.findChannel = function(channels, channelId) {
          var channel = _.find(channels, { channelId: channelId });

          if (!channel) {
            throw new DisplayableError('Channel not found.');
          }

          return channel;
        };

        service.removeCollectionFromChannels = function(channels, collectionId) {
          var channel = service.tryFindChannelForCollection(channels, collectionId);

          if (channel) {
            _.remove(channel.collections, { collectionId: collectionId });
          }
        };

        // 'Unchecked' as this method will not verify the collection is unique: the
        // caller is responsible for this.
        service.addCollectionToChannelUnchecked = function(channels, channelId, collection) {
          service.findChannel(channels, channelId)
            .collections.push(collection);
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

            try {
              service.addCollectionToChannelUnchecked(channels, channelId, collection);
            }
            catch(error) {
              return $q.reject(error);
            }

            return $q.when();
          });
        };

        service.updateCollection = function(channelId, collection) {
          return channelRepository.updateChannels(function(channels) {
            service.removeCollectionFromChannels(channels, collection.collectionId);

            try {
              service.addCollectionToChannelUnchecked(channels, channelId, collection);
            }
            catch(error) {
              return $q.reject(error);
            }

            return $q.when();
          });
        };

        service.deleteCollection = function(collectionId) {
          return channelRepository.updateChannels(function(channels) {
            service.removeCollectionFromChannels(channels, collectionId);

            return $q.when();
          });
        };

        return service;
      }
    };
  }
);
