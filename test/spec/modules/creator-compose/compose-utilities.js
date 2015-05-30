describe('compose utilities', function(){
  'use strict';

  var collectionId = 'collectionId';

  var $q;
  var $rootScope;
  var logService;
  var utilities;
  var channelNameFormatter;
  var blogRepositoryFactory;
  var blogRepository;
  var authenticationService;
  var collectionStub;
  var collectionService;
  var $modal;
  var target;

  beforeEach(function() {
    module('webApp');

    authenticationService = {};
    $modal = jasmine.createSpyObj('$modal', ['open']);
    logService = jasmine.createSpyObj('logService', ['error']);
    utilities = jasmine.createSpyObj('utilities', ['getFriendlyErrorMessage']);
    collectionService = jasmine.createSpyObj('collectionService', ['createCollectionFromName']);
    channelNameFormatter = jasmine.createSpyObj('channelNameFormatter', ['shareWith']);
    blogRepository = jasmine.createSpyObj('blogRepository', ['getChannelsSorted']);
    blogRepositoryFactory = { forCurrentUser: function() { return blogRepository; }};
    collectionStub = jasmine.createSpyObj('collectionStub', ['getLiveDateOfNewQueuedPost']);

    module(function($provide) {
      $provide.value('$modal', $modal);
      $provide.value('logService', logService);
      $provide.value('utilities', utilities);
      $provide.value('collectionService', collectionService);
      $provide.value('channelNameFormatter', channelNameFormatter);
      $provide.value('blogRepositoryFactory', blogRepositoryFactory);
      $provide.value('authenticationService', authenticationService);
      $provide.value('collectionStub', collectionStub);
    });

    inject(function($injector) {
      $q = $injector.get('$q');
      $rootScope = $injector.get('$rootScope');
      target = $injector.get('composeUtilities');
    });

    collectionService.createCollectionFromName.and.returnValue($q.when(collectionId));
    channelNameFormatter.shareWithResult = function(channel) {
      return '!' + channel.name;
    };
    channelNameFormatter.shareWith.and.callFake(channelNameFormatter.shareWithResult);
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

    describe('when getChannelsSorted fails', function(){
      it('should return the error', function(){
        blogRepository.getChannelsSorted.and.returnValue($q.reject('error'));
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

        blogRepository.getChannelsSorted.and.returnValue($q.when(inputChannels));

        target.getChannelsForSelection()
          .then(function(r){
            result = r;
          });

        $rootScope.$apply();
      });

      it('should return a list with an element for each channel', function(){
        expect(result.length).toBe(3);
      });

      it('should keep other properties on the channel', function(){
        expect(result[0].someKey).toBe('someValue1');
        expect(result[1].someKey).toBe('someValue2');
        expect(result[2].someKey).toBe('someValue3');
      });
    });

  });

  describe('when calling getCollectionsForSelection', function(){

    describe('when getChannelsSorted fails', function(){
      it('should return the error', function(){
        blogRepository.getChannelsSorted.and.returnValue($q.reject('error'));
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

    describe('when getChannelsSorted succeeds', function(){

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

        blogRepository.getChannelsSorted.and.returnValue($q.when(inputChannels));

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

    describe('when getChannelsSorted fails', function(){
      it('should return the error', function(){
        blogRepository.getChannelsSorted.and.returnValue($q.reject('error'));
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
      var inputChannelsOriginal;
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

        inputChannelsOriginal = _.cloneDeep(inputChannels);
        blogRepository.getChannelsSorted.and.returnValue($q.when(inputChannels));

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

        it('should format the channel names for sharing', function(){
          expect(result.channels[0].name).toBe(channelNameFormatter.shareWithResult(inputChannelsOriginal[0]));
          expect(result.channels[1].name).toBe(channelNameFormatter.shareWithResult(inputChannelsOriginal[1]));
          expect(result.channels[2].name).toBe(channelNameFormatter.shareWithResult(inputChannelsOriginal[2]));
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
    });

    describe('when an existing collection is selected', function() {
      var result;

      beforeEach(function(){
        model.createCollection = false;
        model.input = {
          newCollectionName: 'newCollection',
          selectedCollection: {
            collectionId: 'existingCollectionId',
            channelId: 'channelId',
            channelName: 'channelName',
            originalName: 'existingCollectionName',
            isDefaultChannel: 'isDefault'
          },
          selectedChannel: {
            channelId: 'channelId2'
          }
        };

        target.getCommittedCollection(model).then(function(r){ result = r; });
        $rootScope.$apply();
      });

      it('should not create a new collection', function(){
        expect(collectionService.createCollectionFromName).not.toHaveBeenCalled();
      });

      it('should return the existing collection information', function(){
        expect(result).toEqual({
          channelId: 'channelId',
          collectionId: 'existingCollectionId',
          channelName: 'channelName',
          collectionName: 'existingCollectionName',
          isDefaultChannel: 'isDefault'
        });
      });
    });

    describe('when createCollection is true', function() {
      var result;

      beforeEach(function(){
        model.createCollection = true;
        model.input = {
          newCollectionName: 'newCollection',
          selectedChannel: {
            channelId: 'channelId',
            originalName: 'channelName',
            isDefault: 'isDefault'
          }
        };

        target.getCommittedCollection(model).then(function(r){ result = r; });
        $rootScope.$apply();
      });

      it('should create a new collection', function(){
        expect(collectionService.createCollectionFromName).toHaveBeenCalledWith('channelId', 'newCollection');
      });

      it('should return the new collection information', function(){
        expect(result).toEqual({
          channelId: 'channelId',
          collectionId: collectionId,
          channelName: 'channelName',
          collectionName: 'newCollection',
          isDefaultChannel: 'isDefault'
        });
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
            channelId: 'channelId',
            originalName: 'channelName',
            isDefault: 'isDefault'
          }
        };

        target.getCommittedCollection(model).then(function(r){ result = r; });
        $rootScope.$apply();
      });

      it('should post a new collection', function(){
        expect(collectionService.createCollectionFromName).toHaveBeenCalledWith('channelId', 'newCollection');
      });

      it('should return the new collection id', function(){
        expect(result).toEqual({
          channelId: 'channelId',
          collectionId: collectionId,
          channelName: 'channelName',
          collectionName: 'newCollection',
          isDefaultChannel: 'isDefault'
        });
      });
    });


    describe('when creating a collection fails', function() {
      var error;

      beforeEach(function(){
        model.createCollection = true;
        model.input = {
          newCollectionName: 'newCollection',
          selectedChannel: {
            channelId: 'channelId'
          }
        };

        collectionService.createCollectionFromName.and.returnValue($q.reject('error'));

        target.getCommittedCollection(model).catch(function(e){ error = e; });
        $rootScope.$apply();
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

  describe('when calling updateEstimatedLiveDate', function(){

    var model;

    beforeEach(function(){
      model = {
        queuedLiveDate: 'something',
        input: {}
      };
    });

    describe('when selectedCollection is undefined', function(){
      beforeEach(function(){
        target.updateEstimatedLiveDate(model);
        $rootScope.$apply();
      });

      it('should not call getLiveDateOfNewQueuedPost', function(){
        expect(collectionStub.getLiveDateOfNewQueuedPost).not.toHaveBeenCalled();
      });

      it('should set queuedLiveDate to undefined', function(){
        expect(model.queuedLiveDate).toBeUndefined();
      });
    });

    describe('when the selected collection is a new collection', function(){
      beforeEach(function(){
        model.input.selectedCollection  = { isNewCollection: true };
        target.updateEstimatedLiveDate(model);
        $rootScope.$apply();
      });

      it('should not call getLiveDateOfNewQueuedPost', function(){
        expect(collectionStub.getLiveDateOfNewQueuedPost).not.toHaveBeenCalled();
      });

      it('should set queuedLiveDate to undefined', function(){
        expect(model.queuedLiveDate).toBeUndefined();
      });
    });

    describe('when the selected collection is an existing collection', function(){
      beforeEach(function(){
        collectionStub.getLiveDateOfNewQueuedPost.and.returnValue($q.when({ data:'2015-06-01T12:00:00Z' }));
        model.input.selectedCollection  = { collectionId: collectionId };
        target.updateEstimatedLiveDate(model);
        $rootScope.$apply();
      });

      it('should call getLiveDateOfNewQueuedPost', function(){
        expect(collectionStub.getLiveDateOfNewQueuedPost).toHaveBeenCalledWith(collectionId);
      });

      it('should update queuedLiveDate', function(){
        expect(model.queuedLiveDate).toEqual(new Date('2015-06-01T12:00:00Z'));
      });
    });

    describe('when getLiveDateOfNewQueuedPost fails', function(){
      beforeEach(function(){
        model.input.selectedCollection  = { collectionId: collectionId };
        collectionStub.getLiveDateOfNewQueuedPost.and.returnValue($q.reject('error'));
        utilities.getFriendlyErrorMessage.and.returnValue('friendly');
        target.updateEstimatedLiveDate(model);
        $rootScope.$apply();
      });

      it('should log the error', function(){
        expect(logService.error).toHaveBeenCalledWith('error');
      });

      it('should display a friendly error message', function(){
        expect(model.errorMessage).toBe('friendly');
      });

      it('should set queuedLiveDate to undefined', function(){
        expect(model.queuedLiveDate).toBeUndefined();
      });
    });
  });
});
