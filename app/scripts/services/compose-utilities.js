angular.module('webApp')
  .factory('composeUtilities',
  function($q, $modal, channelRepositoryFactory, utilities, logService, collectionStub) {
    'use strict';

    var service = {};

    var getOriginalName = function(target){
      if(_.has(target, 'originalName')){
        return target.originalName;
      }

      return target.name;
    };

    var getCollectionNameForSelection = function(channel, collection){
      var collectionName = getOriginalName(collection);

      if(channel.isDefault){
        return collectionName;
      }
      else {
        var channelName = getOriginalName(channel);
        return collectionName + ' (' + channelName + ')';
      }
    };

    var getChannelsForSelectionInner = function(channels){
      for(var i = 0; i < channels.length; ++i){
        var channel = channels[i];
        channel.originalName = channel.name;
        channel.name = channel.isDefault ? 'Share with everyone' : '"' + channel.name + '" Only';
      }

      return channels;
    };

    var getCollectionsForSelectionInner = function(channels){
      var collections = [];

      for(var channelIndex = 0; channelIndex < channels.length; ++channelIndex){
        var channel = channels[channelIndex];
        for(var collectionIndex = 0; collectionIndex < channel.collections.length; ++collectionIndex){
          var collection = channel.collections[collectionIndex];
          collection.originalName = collection.name;
          collection.name = getCollectionNameForSelection(channel, collection);
          collections.push(collection);
        }
      }

      return collections;
    };

    service.getCollectionNameForSelection = function(channel, collection){
      return getCollectionNameForSelection(channel, collection);
    };

    service.getChannelsForSelection = function(){
      var channelRepository = channelRepositoryFactory.forCurrentUser();
      return channelRepository.getChannels()
        .then(function(channels){
          return $q.when(getChannelsForSelectionInner(channels));
        });
    };

    service.getCollectionsForSelection = function(){
      var channelRepository = channelRepositoryFactory.forCurrentUser();
      return channelRepository.getChannels()
        .then(function(channels){
          return $q.when(getCollectionsForSelectionInner(channels));
        });
    };

    service.getChannelsAndCollectionsForSelection = function(){
      var channelRepository = channelRepositoryFactory.forCurrentUser();
      return channelRepository.getChannels()
        .then(function(channels){
          return $q.when({
            channels: getChannelsForSelectionInner(channels),
            collections: getCollectionsForSelectionInner(channels)
          });
      });
    };

    service.loadChannelsAndCollectionsIntoModel = function(model){
      return service.getChannelsAndCollectionsForSelection()
        .then(function(result){
          model.collections = result.collections;
          model.channels = result.channels;

          model.input.selectedChannel = result.channels[0];

          if (model.collections.length > 0) {
            model.input.selectedCollection = model.collections[0];
            model.createCollection = false;
          }
          else {
            model.createCollection = true;
          }
        })
        .catch(function(error){
          logService.error(error);
          model.errorMessage = utilities.getFriendlyErrorMessage(error);
        });
    };

    var shouldCreateCollection = function(model){
      if(model.createCollection) {
        return true;
      }

      return model.input.selectedCollection.isNewCollection;
    };

    service.getCollectionIdAndCreateCollectionIfRequired = function(model){
      if(shouldCreateCollection(model)) {
        var channelRepository = channelRepositoryFactory.forCurrentUser();
        var channelId = model.input.selectedChannel.channelId;
        var collectionName = model.input.newCollectionName;
        var collectionId;
        return collectionStub
          .postCollection({
            channelId: channelId,
            name: collectionName
          })
          .then(function(response){
            collectionId = response.data;
            return channelRepository.createCollection(channelId, collectionId, collectionName);
          })
          .then(function(){
            return collectionId;
          });
      }

      return $q.when(model.input.selectedCollection.collectionId);
    };

    service.showCreateCollectionDialog = function($scope) {
      return $modal.open({
        controller: 'composeCreateCollectionCtrl',
        templateUrl: 'views/creators/compose/create-collection.html',
        scope: $scope
      });
    };

    return service;
  }
);
