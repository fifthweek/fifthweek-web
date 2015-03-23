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

  describe('when finding a channel', function() {
    it('should return channel if it exists', function() {
      var result = target.findChannel(channels, channelId);

      expect(result).toBe(channel);
    });

    it('should throw an error if channel does not exist', function() {
      expect(function() {
        target.findChannel(channels, 'does not exists');
      }).toThrowError(DisplayableError);
    });
  });

  describe('when removing a collection from a set of channels', function() {
    it('should remove the collection if the collection exists', function() {
      spyOn(target, 'tryFindChannelForCollection').and.returnValue(channel);

      target.removeCollectionFromChannels(channels, collectionId);

      expect(target.tryFindChannelForCollection).toHaveBeenCalledWith(channels, collectionId);
      expect(channel.collections).toEqual([collection2]);
    });

    it('should have no effect if the collection does not exist', function() {
      spyOn(target, 'tryFindChannelForCollection').and.returnValue(undefined);

      target.removeCollectionFromChannels(channels, collectionId);

      expect(channel.collections).toEqual([collection, collection2]);
    });
  });

  describe('when adding a collection to a set of channels (unchecked)', function() {
    it('should attempt to add the collection to its located channel', function() {
      var channel = {collections:[collection2]};
      spyOn(target, 'findChannel').and.returnValue(channel);

      target.addCollectionToChannelUnchecked(channels, channelId, collection);

      expect(target.findChannel).toHaveBeenCalledWith(channels, channelId);
      expect(channel.collections).toEqual([collection2, collection]);
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
      spyOn(target, 'tryFindChannelForCollection');
      spyOn(target, 'addCollectionToChannelUnchecked');
      target.tryFindChannelForCollection.and.returnValue(undefined);

      channelRepository.updateChannels.and.callFake(function(applyChange) {
        return $q.when(applyChange(channels));
      });
    });

    it('should add the new collection to the channel', function() {
      target.createCollection(channelId, collection);
      $rootScope.$apply();

      expect(target.tryFindChannelForCollection).toHaveBeenCalledWith(channels, collectionId);
      expect(target.addCollectionToChannelUnchecked).toHaveBeenCalledWith(channels, channelId, collection);
    });

    it('should throw an error if collection already exists', function() {
      target.tryFindChannelForCollection.and.returnValue({});

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
      target.addCollectionToChannelUnchecked.and.throwError(expectedError);

      target.createCollection('absent channel', collection)
        .then(function() {
          throw 'Failure expected';
        })
        .catch(function(error) {
          expect(error).toBe(expectedError);
        });

      $rootScope.$apply();
    });
  });

  describe('when updating a collection', function() {
    beforeEach(function() {
      spyOn(target, 'removeCollectionFromChannels');
      spyOn(target, 'addCollectionToChannelUnchecked');

      channelRepository.updateChannels.and.callFake(function(applyChange) {
        return $q.when(applyChange(channels));
      });
    });

    it('should remove the existing collection', function() {
      target.updateCollection(channelId, collection);
      $rootScope.$apply();

      expect(target.removeCollectionFromChannels).toHaveBeenCalledWith(channels, collectionId);
    });

    it('should add the new collection to the channel', function() {
      target.updateCollection(channelId, collection);
      $rootScope.$apply();

      expect(target.addCollectionToChannelUnchecked).toHaveBeenCalledWith(channels, channelId, collection);
    });

    it('should throw an error if channel does not exist', function() {
      target.addCollectionToChannelUnchecked.and.throwError(expectedError);

      target.updateCollection('absent channel', collection)
        .then(function() {
          throw 'Failure expected';
        })
        .catch(function(error) {
          expect(error).toBe(expectedError);
        });

      $rootScope.$apply();
    });
  });

  describe('when deleting a collection', function() {
    beforeEach(function() {
      channel = { collections:[ collection, 'something else' ] };

      spyOn(target, 'removeCollectionFromChannels');

      channelRepository.updateChannels.and.callFake(function(applyChange) {
        return $q.when(applyChange(channels));
      });
    });

    it('should remove the collection from its channel', function() {
      target.deleteCollection(collectionId);
      $rootScope.$apply();

      expect(target.removeCollectionFromChannels).toHaveBeenCalledWith(channels, collectionId);
    });
  });
});
