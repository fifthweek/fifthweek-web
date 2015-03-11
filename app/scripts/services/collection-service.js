angular.module('webApp')
  .factory('collectionService',
  function(channelRepositoryFactory, collectionStub) {
    'use strict';

    var service = {};

    service.createCollectionFromName = function(channelId, collectionName) {
      var channelRepository = channelRepositoryFactory.forCurrentUser();
      return collectionStub
        .postCollection({
          channelId: channelId,
          name: collectionName
        })
        .then(function(response){
          var collection = {
            collectionId: response.data.collectionId,
            name: collectionName,
            weeklyReleaseSchedule: [ response.data.defaultWeeklyReleaseTime ]
          };
          return channelRepository.createCollection(channelId, collection)
            .then(function(){
              return collection.collectionId;
            }
          );
        }
      );
    };

    return service;
  }
);
