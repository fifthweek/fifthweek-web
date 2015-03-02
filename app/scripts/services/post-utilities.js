/// <reference path='../angular.module('webApp')js' />

angular.module('webApp')
  .factory('postUtilities',
  function($q, aggregateUserState) {
    'use strict';

    var service = {};

    var getChannels = function(){
      if(!aggregateUserState.currentValue){
        return $q.reject(new FifthweekError('No aggregate state found.'));
      }

      var channels = aggregateUserState.currentValue.createdChannelsAndCollections.channels;

      if(channels.length === 0) {
        return $q.reject(new DisplayableError('You must create a subscription before posting.'));
      }

      return $q.when(channels);
    };

    var getChannelsForSelectionInner = function(channels){
      channels = _.clone(channels);
      channels[0].name = 'Share with everyone';

      for(var i = 1; i < channels.length; ++i){
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
            var collection = _.clone(channel.collections[collectionIndex]);
            if(channelIndex !== 0){
              collection.name = collection.name + ' (' + channel.name + ')';
            }
            collections.push(collection);
          }
        }
      }

      return collections;
    };

    service.getChannelsForSelection = function(){
      try{
        return getChannels().then(function(channels){
          return $q.when(getChannelsForSelectionInner(channels));
        });
      }
      catch(error){
        return $q.reject(new FifthweekError(error));
      }
    };

    service.getCollectionsForSelection = function(){
      try{
        return getChannels().then(function(channels){
          return $q.when(getCollectionsForSelectionInner(channels));
        });
      }
      catch(error){
        return $q.reject(new FifthweekError(error));
      }
    };

    service.getChannelsAndCollectionsForSelection = function(){
      try{
        return getChannels().then(function(channels){
          return $q.when({
            channels: getChannelsForSelectionInner(channels),
            collections: getCollectionsForSelectionInner(channels)
          });
        });
      }
      catch(error){
        return $q.reject(new FifthweekError(error));
      }
    };

    return service;
  }
);
