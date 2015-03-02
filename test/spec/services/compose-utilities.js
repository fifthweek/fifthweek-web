describe('compose utilities', function(){
  'use strict';

  var $q;
  var $rootScope;
  var aggregateUserState;
  var $modal;
  var target;

  beforeEach(function() {
    module('webApp');

    aggregateUserState = {};
    $modal = jasmine.createSpyObj('$modal', ['open']);

    module(function($provide) {
      $provide.value('aggregateUserState', aggregateUserState);
      $provide.value('$modal', $modal);
    });

    inject(function($injector) {
      $q = $injector.get('$q');
      $rootScope = $injector.get('$rootScope');
      target = $injector.get('composeUtilities');
    });
  });

  describe('when calling getCollectionNameForSelection', function(){
    it('should return the collection name if channel does not have a name', function(){
      var result = target.getCollectionNameForSelection({}, {name: 'collection'});
      expect(result).toBe('collection');
    });

    it('should return the collection name and channel name if channel does have a name', function(){
      var result = target.getCollectionNameForSelection({name: 'channel'}, {name: 'collection'});
      expect(result).toBe('collection (channel)');
    });
  });

  describe('when calling getChannelsForSelection', function(){

    describe('when an unexpected error occurs', function(){
      it('should convert the error into a rejected promise', function(){
        // This structure should not occur, so the service will trip up and throw an exception.
        aggregateUserState.currentValue = { createdChannelsAndCollections: undefined };

        target.getChannelsForSelection()
          .then(function(){
            fail('this should not occur');
          })
          .catch(function(error){
            expect(error instanceof FifthweekError).toBeTruthy();
          });

        $rootScope.$apply();
      });
    });

    describe('when there is no current aggregate state', function(){
      it('should return the error', function(){
        aggregateUserState.currentValue = undefined;

        target.getChannelsForSelection()
          .then(function(){
            fail('this should not occur');
          })
          .catch(function(error){
            expect(error instanceof FifthweekError).toBeTruthy();
            expect(error.message).toBe('No aggregate state found.');
          });

        $rootScope.$apply();
      });
    });

    describe('when there are no channels', function(){
      it('should return a displayable error', function(){
        aggregateUserState.currentValue = { createdChannelsAndCollections: { channels: [] }};

        target.getChannelsForSelection()
          .then(function(){
            fail('this should not occur');
          })
          .catch(function(error){
            expect(error instanceof DisplayableError).toBeTruthy();
            expect(error.message).toBe('You must create a subscription before posting.');
          });

        $rootScope.$apply();
      });
    });

    describe('when the aggregate state is valid', function(){

      var inputChannels;
      var inputChannelsClone;

      var result;

      beforeEach(function(){
        inputChannels = [
          {
            name: 'one',
            someKey: 'someValue1'
          },
          {
            name: 'two',
            someKey: 'someValue2'
          },
          {
            name: 'three',
            someKey: 'someValue3'
          }
        ];
        inputChannelsClone = _.cloneDeep(inputChannels);
        aggregateUserState.currentValue = { createdChannelsAndCollections: { channels: inputChannels }};

        target.getChannelsForSelection()
          .then(function(r){
            result = r;
          });

        $rootScope.$apply();
      });

      it('should return a list with an element for each channel', function(){
        expect(result.length).toBe(3);
      });

      it('should set the first channel name to be "Share with everyone"', function(){
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

      it('should not modify the input channels', function(){
        expect(inputChannels).toEqual(inputChannelsClone);
        expect(inputChannels).not.toEqual(result);
      });
    });

  });

  describe('when calling getCollectionsForSelection', function(){

    describe('when an unexpected error occurs', function(){
      it('should convert the error into a rejected promise', function(){
        // This structure should not occur, so the service will trip up and throw an exception.
        aggregateUserState.currentValue = { createdChannelsAndCollections: undefined };

        target.getCollectionsForSelection()
          .then(function(){
            fail('this should not occur');
          })
          .catch(function(error){
            expect(error instanceof FifthweekError).toBeTruthy();
          });

        $rootScope.$apply();
      });
    });

    describe('when there is no current aggregate state', function(){
      it('should return the error', function(){
        aggregateUserState.currentValue = undefined;

        target.getCollectionsForSelection()
          .then(function(){
            fail('this should not occur');
          })
          .catch(function(error){
            expect(error instanceof FifthweekError).toBeTruthy();
            expect(error.message).toBe('No aggregate state found.');
          });

        $rootScope.$apply();
      });
    });

    describe('when there are no channels', function(){
      it('should return a displayable error', function(){
        aggregateUserState.currentValue = { createdChannelsAndCollections: { channels: [] }};

        target.getCollectionsForSelection()
          .then(function(){
            fail('this should not occur');
          })
          .catch(function(error){
            expect(error instanceof DisplayableError).toBeTruthy();
            expect(error.message).toBe('You must create a subscription before posting.');
          });

        $rootScope.$apply();
      });
    });

    describe('when the aggregate state is valid', function(){

      var inputChannels;
      var inputChannelsClone;

      var result;

      beforeEach(function(){
        inputChannels = [
          {
            name: 'one',
            someKey: 'someValue1',
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
            collections: [
              {
                name: 'twoA',
                someKey: 'someValueTwoA'
              }
            ]
          },
          {
            name: 'three',
            someKey: 'someValue3'
          }
        ];
        inputChannelsClone = _.cloneDeep(inputChannels);
        aggregateUserState.currentValue = { createdChannelsAndCollections: { channels: inputChannels }};

        target.getCollectionsForSelection()
          .then(function(r){
            result = r;
          });

        $rootScope.$apply();
      });

      it('should return a list with an element for each collection', function(){
        expect(result.length).toBe(3);
      });

      it('should set the name of collections on the default channel to the collection name', function(){
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

      it('should not modify the input channels', function(){
        expect(inputChannels).toEqual(inputChannelsClone);
      });
    });

  });

  describe('when calling getChannelsAndCollectionsForSelection', function(){

    describe('when an unexpected error occurs', function(){
      it('should convert the error into a rejected promise', function(){
        // This structure should not occur, so the service will trip up and throw an exception.
        aggregateUserState.currentValue = { createdChannelsAndCollections: undefined };

        target.getChannelsAndCollectionsForSelection()
          .then(function(){
            fail('this should not occur');
          })
          .catch(function(error){
            expect(error instanceof FifthweekError).toBeTruthy();
          });

        $rootScope.$apply();
      });
    });

    describe('when there is no current aggregate state', function(){
      it('should return the error', function(){
        aggregateUserState.currentValue = undefined;

        target.getChannelsAndCollectionsForSelection()
          .then(function(){
            fail('this should not occur');
          })
          .catch(function(error){
            expect(error instanceof FifthweekError).toBeTruthy();
            expect(error.message).toBe('No aggregate state found.');
          });

        $rootScope.$apply();
      });
    });

    describe('when there are no channels', function(){
      it('should return a displayable error', function(){
        aggregateUserState.currentValue = { createdChannelsAndCollections: { channels: [] }};

        target.getChannelsAndCollectionsForSelection()
          .then(function(){
            fail('this should not occur');
          })
          .catch(function(error){
            expect(error instanceof DisplayableError).toBeTruthy();
            expect(error.message).toBe('You must create a subscription before posting.');
          });

        $rootScope.$apply();
      });
    });

    describe('when the aggregate state is valid', function(){

      var inputChannels;
      var inputChannelsClone;

      var result;

      beforeEach(function(){
        inputChannels = [
          {
            name: 'one',
            someKey: 'someValue1',
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
            collections: [
              {
                name: 'twoA',
                someKey: 'someValueTwoA'
              }
            ]
          },
          {
            name: 'three',
            someKey: 'someValue3'
          }
        ];
        inputChannelsClone = _.cloneDeep(inputChannels);
        aggregateUserState.currentValue = { createdChannelsAndCollections: { channels: inputChannels }};

        target.getChannelsAndCollectionsForSelection()
          .then(function(r){
            result = r;
          });

        $rootScope.$apply();
      });

      it('should not modify the input channels', function(){
        expect(inputChannels).toEqual(inputChannelsClone);
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

        it('should set the first channel name to be "Share with everyone"', function(){
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

  describe('when calling createCollection', function(){
    it('should open a modal dialog', function(){
      var scope = {};
      target.createCollection(scope);
      expect($modal.open).toHaveBeenCalled();
      expect($modal.open.calls.first().args[0].scope).toBe(scope);
    });
  });
});
