describe('collection repository factory', function(){
  'use strict';

  var expectedError = new Error('oh dear');
  var channelId = 'channelId';
  var collectionId = 'collectionId';
  var collection;
  var collection2;
  var channel;
  var channels;

  var $q;
  var $rootScope;
  var channelRepositoryFactory;
  var channelRepository;
  var targetFactory;
  var target;

  beforeEach(function() {
    module('webApp');

    collection = { collectionId: collectionId };
    collection2 = { collectionId: 'A' };
    channel = { channelId: channelId, collections: [ collection, collection2 ]};
    channels = [channel, { collections: [ { collectionId: 'B' } ]}];

    channelRepository = jasmine.createSpyObj('channelRepository', ['getChannels', 'updateChannel', 'updateChannels']);
    channelRepositoryFactory = { forCurrentUser: function() { return channelRepository; } };

    module(function($provide) {
      $provide.value('channelRepositoryFactory', channelRepositoryFactory);
    });

    inject(function($injector) {
      $q = $injector.get('$q');
      $rootScope = $injector.get('$rootScope');
      targetFactory = $injector.get('collectionRepositoryFactory');
    });

    target = targetFactory.forCurrentUser();
  });

  describe('when trying to find the channel for a collection', function() {
    it('should return channel if collection exists', function() {
      var result = target.tryFindChannelForCollection(channels, collectionId);
      expect(result).toBe(channel);
    });

    it('should return undefined if collection does not exist', function() {
      expect(target.tryFindChannelForCollection([], collectionId)).toBeUndefined();
      expect(target.tryFindChannelForCollection([{ collections: []}], collectionId)).toBeUndefined();
      expect(target.tryFindChannelForCollection(channels, 'something else')).toBeUndefined();
    });
  });

  describe('when finding the channel for a collection', function() {
    beforeEach(function() {
      spyOn(target, 'tryFindChannelForCollection');
    });

    it('should return channel if collection exists', function() {
      target.tryFindChannelForCollection.and.returnValue(channel);

      var result = target.findChannelForCollection(channels, collectionId);

      expect(result).toBe(channel);
      expect(target.tryFindChannelForCollection).toHaveBeenCalledWith(channels, collectionId);
    });

    it('should throw an error if collection does not exist', function() {
      target.tryFindChannelForCollection.and.returnValue(undefined);

      expect(function() {
        target.findChannelForCollection(channels, collectionId);
      }).toThrowError(DisplayableError);
    });
  });

  describe('when getting the channel for a collection', function() {
    beforeEach(function() {
      spyOn(target, 'findChannelForCollection');
    });

    it('should find the channel from the channel repository', function() {
      target.findChannelForCollection.and.returnValue(channel);
      channelRepository.getChannels.and.returnValue($q.when(channels));

      var actualChannel = null;
      target.getChannelForCollection(collectionId).then(function(result) {
        actualChannel = result;
      });

      $rootScope.$apply();

      expect(actualChannel).toBe(channel);
      expect(target.findChannelForCollection).toHaveBeenCalledWith(channels, collectionId);
    });

    it('should throw an error if collection does not exist', function() {
      target.findChannelForCollection.and.throwError(expectedError);
      channelRepository.getChannels.and.returnValue($q.when(channels));

      target.getChannelForCollection(collectionId)
        .then(function() {
          throw 'Failure expected';
        })
        .catch(function(error) {
          expect(error).toBe(expectedError);
        });

      $rootScope.$apply();
    });
  });

  describe('when creating a collection', function() {
    beforeEach(function() {
      channels = [{ channelId: channelId, collections: [ 'existing collection' ]}];

      spyOn(target, 'tryFindChannelForCollection');
      target.tryFindChannelForCollection.and.returnValue(undefined);
    });

    it('should add the new collection to the channel', function() {
      channelRepository.updateChannels.and.callFake(function(applyChange) {
        return $q.when(applyChange(channels));
      });

      target.createCollection(channelId, collection);
      $rootScope.$apply();

      expect(target.tryFindChannelForCollection).toHaveBeenCalledWith(channels, collectionId);
      expect(channels[0].collections).toEqual([ 'existing collection', collection ]);
    });

    it('should throw an error if collection already exists', function() {
      target.tryFindChannelForCollection.and.returnValue({});

      channelRepository.updateChannels.and.callFake(function(applyChange) {
        return $q.when(applyChange(channels));
      });

      target.createCollection(channelId, collection)
        .then(function() {
          throw 'Failure expected';
        })
        .catch(function(error) {
          expect(error instanceof DisplayableError).toBeTruthy();
        });

      $rootScope.$apply();
    });

    it('should throw an error if channel does not exist', function() {
      channelRepository.updateChannels.and.callFake(function(applyChange) {
        return $q.when(applyChange(channels));
      });

      target.createCollection('absent channel', collection)
        .then(function() {
          throw 'Failure expected';
        })
        .catch(function(error) {
          expect(error instanceof DisplayableError).toBeTruthy();
        });

      $rootScope.$apply();
    });
  });

  describe('when deleting a collection', function() {
    beforeEach(function() {
      channel = { collections:[ collection, 'something else' ] };

      spyOn(target, 'findChannelForCollection');

      target.findChannelForCollection.and.returnValue(channel);
      channelRepository.updateChannels.and.callFake(function(applyChange) {
        return $q.when(applyChange(channels));
      });
    });

    it('should remove the collection from its channel', function() {
      target.deleteCollection(collectionId);
      $rootScope.$apply();

      expect(target.findChannelForCollection).toHaveBeenCalledWith(channels, collectionId);
      expect(channel.collections).toEqual([ 'something else' ]);
    });

    it('should have no effect when collection does not exist', function() {
      target.deleteCollection('already been deleted');
      $rootScope.$apply();

      expect(channel.collections).toEqual([ collection, 'something else' ]);
    });

    it('should throw an error if collection does not exist', function() {
      target.findChannelForCollection.and.throwError(expectedError);

      target.deleteCollection(collectionId)
        .then(function() {
          throw 'Failure expected';
        })
        .catch(function(error) {
          expect(error).toBe(expectedError);
        });

      $rootScope.$apply();
    });
  });
});
