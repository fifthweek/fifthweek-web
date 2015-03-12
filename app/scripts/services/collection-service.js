angular.module('webApp')
  .factory('collectionService',
  function(collectionRepositoryFactory, collectionStub) {
    'use strict';

    var service = {};

    service.createCollectionFromName = function(channelId, collectionName) {
      var collectionRepository = collectionRepositoryFactory.forCurrentUser();
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
          return collectionRepository.createCollection(channelId, collection)
            .then(function(){
              return collection.collectionId;
            }
          );
        }
      );
    };

    service.deleteCollection = function(collectionId) {
      var collectionRepository = collectionRepositoryFactory.forCurrentUser();
      return collectionStub.deleteCollection(collectionId).then(function() {
        return collectionRepository.deleteCollection(collectionId);
      });
    };

    return service;
  }
);
