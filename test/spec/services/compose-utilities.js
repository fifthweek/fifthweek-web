describe('compose utilities', function(){
  'use strict';

  var $q;
  var $rootScope;
  var logService;
  var utilities;
  var channelRepositoryFactory;
  var channelRepository;
  var authenticationService;
  var collectionStub;
  var $modal;
  var target;

  beforeEach(function() {
    module('webApp');

    authenticationService = {};
    $modal = jasmine.createSpyObj('$modal', ['open']);
    logService = jasmine.createSpyObj('logService', ['error']);
    utilities = jasmine.createSpyObj('utilities', ['getFriendlyErrorMessage']);
    channelRepository = jasmine.createSpyObj('channelRepository', ['createCollection', 'getChannels']);
    channelRepositoryFactory = { forCurrentUser: function() { return channelRepository; }};
    collectionStub = jasmine.createSpyObj('collectionStub', ['postCollection']);

    module(function($provide) {
      $provide.value('$modal', $modal);
      $provide.value('logService', logService);
      $provide.value('utilities', utilities);
      $provide.value('channelRepositoryFactory', channelRepositoryFactory);
      $provide.value('authenticationService', authenticationService);
      $provide.value('collectionStub', collectionStub);
    });

    inject(function($injector) {
      $q = $injector.get('$q');
      $rootScope = $injector.get('$rootScope');
      target = $injector.get('composeUtilities');
    });
  });

  describe('when calling getCollectionNameForSelection', function(){
    it('should return the collection name if channel is default', function(){
      var result = target.getCollectionNameForSelection({isDefault: true}, {name: 'collection'});
      expect(result).toBe('collection');
    });

    it('should return the collection name and channel name if channel is not default', function(){
      var result = target.getCollectionNameForSelection({isDefault: false, name: 'channel'}, {name: 'collection'});
      expect(result).toBe('collection (channel)');
    });
  });

  describe('when calling getChannelsForSelection', function(){

    describe('when getChannels fails', function(){
      it('should return the error', function(){
        channelRepository.getChannels.and.returnValue($q.reject('error'));
        target.getChannelsForSelection()
          .then(function(){
            fail('this should not occur');
          })
          .catch(function(error){
            expect(error).toBe('error');
          });

        $rootScope.$apply();
      });
    });

    describe('when the aggregate state is valid', function(){

      var inputChannels;
      var result;

      beforeEach(function(){
        inputChannels = [
          {
            name: 'one',
            someKey: 'someValue1',
            isDefault: true
          },
          {
            name: 'two',
            someKey: 'someValue2',
            isDefault: false
          },
          {
            name: 'three',
            someKey: 'someValue3',
            isDefault: false
          }
        ];

        channelRepository.getChannels.and.returnValue($q.when(inputChannels));

        target.getChannelsForSelection()
          .then(function(r){
            result = r;
          });

        $rootScope.$apply();
      });

      it('should return a list with an element for each channel', function(){
        expect(result.length).toBe(3);
      });

      it('should set the default channel name to be "Share with everyone"', function(){
        expect(result[0].name).toBe('Share with everyone');
      });

      it('should set the other channel names to be "[channelName] Only"', function(){
        expect(result[1].name).toBe('"two" Only');
        expect(result[2].name).toBe('"three" Only');
      });

      it('should keep other properties on the channel', function(){
        expect(result[0].someKey).toBe('someValue1');
        expect(result[1].someKey).toBe('someValue2');
        expect(result[2].someKey).toBe('someValue3');
      });
    });

  });

  describe('when calling getCollectionsForSelection', function(){

    describe('when getChannels fails', function(){
      it('should return the error', function(){
        channelRepository.getChannels.and.returnValue($q.reject('error'));
        target.getCollectionsForSelection()
          .then(function(){
            fail('this should not occur');
          })
          .catch(function(error){
            expect(error).toBe('error');
          });

        $rootScope.$apply();
      });
    });

    describe('when getChannels succeeds', function(){

      var inputChannels;
      var result;

      beforeEach(function(){
        inputChannels = [
          {
            name: 'one',
            someKey: 'someValue1',
            isDefault: true,
            collections: [
              {
                name: 'oneA',
                someKey: 'someValueOneA'
              },
              {
                name: 'oneB',
                someKey: 'someValueOneB'
              }
            ]
          },
          {
            name: 'two',
            someKey: 'someValue2',
            isDefault: false,
            collections: [
              {
                name: 'twoA',
                someKey: 'someValueTwoA'
              }
            ]
          },
          {
            name: 'three',
            someKey: 'someValue3',
            isDefault: false,
            collections: []
          }
        ];

        channelRepository.getChannels.and.returnValue($q.when(inputChannels));

        target.getCollectionsForSelection()
          .then(function(r){
            result = r;
          });

        $rootScope.$apply();
      });

      it('should return a list with an element for each collection', function(){
        expect(result.length).toBe(3);
      });

      it('should set the name of collections in the default channel to the collection name', function(){
        expect(result[0].name).toBe('oneA');
        expect(result[1].name).toBe('oneB');
      });

      it('should set the other collection names to contain the channel name', function(){
        expect(result[2].name).toBe('twoA (two)');
      });

      it('should keep other properties on the channel', function(){
        expect(result[0].someKey).toBe('someValueOneA');
        expect(result[1].someKey).toBe('someValueOneB');
        expect(result[2].someKey).toBe('someValueTwoA');
      });
    });

  });

  describe('when calling getChannelsAndCollectionsForSelection', function(){

    describe('when getChannels fails', function(){
      it('should return the error', function(){
        channelRepository.getChannels.and.returnValue($q.reject('error'));
        target.getChannelsAndCollectionsForSelection()
          .then(function(){
            fail('this should not occur');
          })
          .catch(function(error){
            expect(error).toBe('error');
          });

        $rootScope.$apply();
      });
    });

    describe('when the aggregate state is valid', function(){

      var inputChannels;
      var result;

      beforeEach(function(){
        inputChannels = [
          {
            name: 'one',
            someKey: 'someValue1',
            isDefault: true,
            collections: [
              {
                name: 'oneA',
                someKey: 'someValueOneA'
              },
              {
                name: 'oneB',
                someKey: 'someValueOneB'
              }
            ]
          },
          {
            name: 'two',
            someKey: 'someValue2',
            isDefault: false,
            collections: [
              {
                name: 'twoA',
                someKey: 'someValueTwoA'
              }
            ]
          },
          {
            name: 'three',
            isDefault: false,
            someKey: 'someValue3',
            collections: []
          }
        ];

        channelRepository.getChannels.and.returnValue($q.when(inputChannels));

        target.getChannelsAndCollectionsForSelection()
          .then(function(r){
            result = r;
          });

        $rootScope.$apply();
      });

      describe('when testing collections', function(){

        it('should return a list with an element for each collection', function(){
          expect(result.collections.length).toBe(3);
        });

        it('should set the name of collections on the default channel to the collection name', function(){
          expect(result.collections[0].name).toBe('oneA');
          expect(result.collections[1].name).toBe('oneB');
        });

        it('should set the other collection names to contain the channel name', function(){
          expect(result.collections[2].name).toBe('twoA (two)');
        });

        it('should keep other properties on the channel', function(){
          expect(result.collections[0].someKey).toBe('someValueOneA');
          expect(result.collections[1].someKey).toBe('someValueOneB');
          expect(result.collections[2].someKey).toBe('someValueTwoA');
        });
      });

      describe('when testing channels', function(){
        it('should return a list with an element for each channel', function(){
          expect(result.channels.length).toBe(3);
        });

        it('should set the default channel name to be "Share with everyone"', function(){
          expect(result.channels[0].name).toBe('Share with everyone');
        });

        it('should set the other channel names to be "[channelName] Only"', function(){
          expect(result.channels[1].name).toBe('"two" Only');
          expect(result.channels[2].name).toBe('"three" Only');
        });

        it('should keep other properties on the channel', function(){
          expect(result.channels[0].someKey).toBe('someValue1');
          expect(result.channels[1].someKey).toBe('someValue2');
          expect(result.channels[2].someKey).toBe('someValue3');
        });
      });
    });
  });

  describe('when calling loadChannelsAndCollectionsIntoModel', function(){
    var model;

    beforeEach(function(){
      model = { input: {} };
      target.getChannelsAndCollectionsForSelection = jasmine.createSpy('getChannelsAndCollectionsForSelection');
    });

    describe('when getChannelsAndCollectionsForSelection succeeds', function(){
      var channelsAndCollections;

      beforeEach(function(){
        channelsAndCollections = {channels: [{name: 'a'}, {name: 'b'}], collections: [{name: 'x'}, {name: 'y'}]};
        target.getChannelsAndCollectionsForSelection.and.returnValue($q.when(channelsAndCollections));
        target.loadChannelsAndCollectionsIntoModel(model);
        $rootScope.$apply();
      });

      it('should populate the channels in the model', function(){
        expect(model.channels).toEqual(channelsAndCollections.channels);
      });

      it('should populate the collections in the model', function(){
        expect(model.collections).toEqual(channelsAndCollections.collections);
      });

      it('should select the first channel', function(){
        expect(model.input.selectedChannel).toEqual(channelsAndCollections.channels[0]);
      });

      it('should select the first collection', function(){
        expect(model.input.selectedCollection).toEqual(channelsAndCollections.collections[0]);
      });

      it('should set createCollection to false', function(){
        expect(model.createCollection).toBe(false);
      });
    });

    describe('when getChannelsAndCollectionsForSelection succeeds with no collections', function(){
      var channelsAndCollections;

      beforeEach(function(){
        channelsAndCollections = {channels: [{name: 'a'}, {name: 'b'}], collections: []};
        target.getChannelsAndCollectionsForSelection.and.returnValue($q.when(channelsAndCollections));
        target.loadChannelsAndCollectionsIntoModel(model);
        $rootScope.$apply();
      });

      it('should populate the channels in the model', function(){
        expect(model.channels).toEqual(channelsAndCollections.channels);
      });

      it('should populate the collections in the model', function(){
        expect(model.collections).toEqual(channelsAndCollections.collections);
      });

      it('should select the first channel', function(){
        expect(model.input.selectedChannel).toEqual(channelsAndCollections.channels[0]);
      });

      it('should set the selected collection to undefined', function(){
        expect(model.input.selectedCollection).toBeUndefined();
      });

      it('should set createCollection to true', function(){
        expect(model.createCollection).toBe(true);
      });
    });

    describe('when getChannelsAndCollectionsForSelection fails', function(){
      beforeEach(function(){
        target.getChannelsAndCollectionsForSelection.and.returnValue($q.reject('error'));
        utilities.getFriendlyErrorMessage.and.returnValue('friendly');
        target.loadChannelsAndCollectionsIntoModel(model);
        $rootScope.$apply();
      });

      it('should log the error', function(){
        expect(logService.error).toHaveBeenCalledWith('error');
      });

      it('should display a friendly error message', function(){
        expect(model.errorMessage).toBe('friendly');
      });
    });
  });

  describe('when calling getCollectionIdAndCreateCollectionIfRequired', function(){
    var model;

    beforeEach(function(){
      model = {};

      authenticationService.currentUser = { userId: 'userId' };
      collectionStub.postCollection.and.returnValue($q.when({ data: 'collectionId' }));
    });

    describe('when an existing collection is selected', function() {
      var result;

      beforeEach(function(){
        model.createCollection = false;
        model.input = {
          newCollectionName: 'newCollection',
          selectedCollection: {
            collectionId: 'existingCollectionId'
          },
          selectedChannel: {
            channelId: 'channelId'
          }
        };

        target.getCollectionIdAndCreateCollectionIfRequired(model).then(function(r){ result = r; });
        $rootScope.$apply();
      });

      it('should not post a new collection', function(){
        expect(collectionStub.postCollection).not.toHaveBeenCalled();
      });

      it('should not merge the data into the new collection', function(){
        expect(channelRepository.createCollection).not.toHaveBeenCalled();
      });

      it('should return the existing collection id', function(){
        expect(result).toBe('existingCollectionId');
      });
    });

    describe('when createCollection is true', function() {
      var result;

      beforeEach(function(){
        model.createCollection = true;
        model.input = {
          newCollectionName: 'newCollection',
          selectedChannel: {
            channelId: 'channelId'
          }
        };

        target.getCollectionIdAndCreateCollectionIfRequired(model).then(function(r){ result = r; });
        $rootScope.$apply();
      });

      it('should post a new collection', function(){
        expect(collectionStub.postCollection.calls.count()).toBe(1);
        expect(collectionStub.postCollection).toHaveBeenCalledWith({
          channelId: 'channelId',
          name: 'newCollection'
        });
      });

      it('should merge the data into the new collection', function(){
        expect(channelRepository.createCollection.calls.count()).toBe(1);
        expect(channelRepository.createCollection).toHaveBeenCalledWith('channelId', 'collectionId', 'newCollection');
      });

      it('should return the new collection id', function(){
        expect(result).toBe('collectionId');
      });
    });

    describe('when the selected collection is a new collection', function() {
      var result;

      beforeEach(function(){
        model.input = {
          newCollectionName: 'newCollection',
          selectedCollection: {
            isNewCollection: true
          },
          selectedChannel: {
            channelId: 'channelId'
          }
        };

        target.getCollectionIdAndCreateCollectionIfRequired(model).then(function(r){ result = r; });
        $rootScope.$apply();
      });

      it('should post a new collection', function(){
        expect(collectionStub.postCollection.calls.count()).toBe(1);
        expect(collectionStub.postCollection).toHaveBeenCalledWith({
          channelId: 'channelId',
          name: 'newCollection'
        });
      });

      it('should merge the data into the new collection', function(){
        expect(channelRepository.createCollection.calls.count()).toBe(1);
        expect(channelRepository.createCollection).toHaveBeenCalledWith('channelId', 'collectionId', 'newCollection');
      });

      it('should return the new collection id', function(){
        expect(result).toBe('collectionId');
      });
    });


    describe('when postCollection fails', function() {
      var error;

      beforeEach(function(){
        model.createCollection = true;
        model.input = {
          newCollectionName: 'newCollection',
          selectedChannel: {
            channelId: 'channelId'
          }
        };

        channelRepository.createCollection.and.returnValue($q.reject('error'));

        target.getCollectionIdAndCreateCollectionIfRequired(model).catch(function(e){ error = e; });
        $rootScope.$apply();
      });

      it('should propagate the error', function(){
        expect(error).toBe('error');
      });
    });

    describe('when mergeNewCollection fails', function() {
      var error;

      beforeEach(function(){
        model.createCollection = true;
        model.input = {
          newCollectionName: 'newCollection',
          selectedChannel: {
            channelId: 'channelId'
          }
        };

        collectionStub.postCollection.and.returnValue($q.reject('error'));

        target.getCollectionIdAndCreateCollectionIfRequired(model).catch(function(e){ error = e; });
        $rootScope.$apply();
      });

      it('should not merge the data into the new collection', function(){
        expect(channelRepository.createCollection).not.toHaveBeenCalled();
      });

      it('should propagate the error', function(){
        expect(error).toBe('error');
      });
    });
  });

  describe('when calling createCollection', function(){

    var scope;
    var result;
    beforeEach(function(){
      scope = {};
      $modal.open.and.returnValue('result');
      result = target.showCreateCollectionDialog(scope);
    });

    it('should open a modal dialog', function(){
      expect($modal.open).toHaveBeenCalled();
      expect($modal.open.calls.first().args[0].scope).toBe(scope);
    });

    it('should result the modal object', function(){
      expect(result).toBe('result');
    });
  });
});
