angular.module('webApp')
  .factory('composeUtilities',
  function($q, $modal, aggregateUserStateUtilities, utilities, logService, authenticationService, collectionStub) {
    'use strict';

    var service = {};

    var getOriginalName = function(target){
      if(_.has(target, 'originalName')){
        return target.originalName;
      }

      return target.name;
    };

    var getCollectionNameForSelection = function(channel, collection){
      var channelName = getOriginalName(channel);
      var collectionName = getOriginalName(collection);

      if(!channelName){
        return collectionName;
      }
      else{
        return collectionName + ' (' + channelName + ')';
      }
    };

    var getChannelsForSelectionInner = function(channels){
      channels[0].originalName = channels[0].name;
      channels[0].name = 'Share with everyone';

      for(var i = 1; i < channels.length; ++i){
        channels[i].originalName = channels[i].name;
        channels[i].name = '"' + channels[i].name + '" Only';
      }

      return channels;
    };

    var getCollectionsForSelectionInner = function(channels){
      var collections = [];

      for(var channelIndex = 0; channelIndex < channels.length; ++channelIndex){
        var channel = channels[channelIndex];
        if(channel.collections){
          for(var collectionIndex = 0; collectionIndex < channel.collections.length; ++collectionIndex){
            var collection = channel.collections[collectionIndex];
            collection.originalName = collection.name;
            if(channelIndex !== 0){
              collection.name = getCollectionNameForSelection(channel, collection);
            }
            collections.push(collection);
          }
        }
      }

      return collections;
    };

    service.getCollectionNameForSelection = function(channel, collection){
      return getCollectionNameForSelection(channel, collection);
    };

    service.getChannelsForSelection = function(){
      return aggregateUserStateUtilities.getChannelsAndCollections()
        .then(function(channels){
          return $q.when(getChannelsForSelectionInner(channels));
        });
    };

    service.getCollectionsForSelection = function(){
      return aggregateUserStateUtilities.getChannelsAndCollections()
        .then(function(channels){
          return $q.when(getCollectionsForSelectionInner(channels));
        });
    };

    service.getChannelsAndCollectionsForSelection = function(){
      return aggregateUserStateUtilities.getChannelsAndCollections()
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
        var userId = authenticationService.currentUser.userId;
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
            return aggregateUserStateUtilities.mergeNewCollection(userId, channelId, collectionId, collectionName);
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
