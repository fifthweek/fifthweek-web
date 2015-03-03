describe('aggregate user state utilities', function(){
  'use strict';

  var $q;
  var $rootScope;
  var aggregateUserState;
  var target;

  beforeEach(function() {
    module('webApp');

    aggregateUserState = jasmine.createSpyObj('aggregateUserState', ['updateFromDelta']);

    module(function($provide) {
      $provide.value('aggregateUserState', aggregateUserState);
    });

    inject(function($injector) {
      $q = $injector.get('$q');
      $rootScope = $injector.get('$rootScope');
      target = $injector.get('aggregateUserStateUtilities');
    });
  });

  describe('when mergeNewCollection is called', function(){

    var userId;
    var channelId;
    var collectionId;
    var collectionName;

    var initialState;
    var initialStateClone;

    beforeEach(function(){
      userId = 'user1';
      channelId = 'channel1';
      collectionId = 'collection99';
      collectionName = 'collection-name';
    });

    describe('when called with no channels', function(){
      var error;
      beforeEach(function(){

        initialState = {
          createdChannelsAndCollections: {
            channels: []
          }
        };
        initialStateClone = _.cloneDeep(initialState);

        aggregateUserState.currentValue = initialState;

        target.mergeNewCollection(userId, channelId, collectionId, collectionName).catch(function(e){ error = e; });
        $rootScope.$apply();
      });

      it('should not modify the aggregate user state', function(){
        expect(initialState).toEqual(initialStateClone);
      });

      it('should not call updateFromDelta', function(){
        expect(aggregateUserState.updateFromDelta).not.toHaveBeenCalled();
      });

      it('should return a rejected promise', function(){
        expect(error).toBeDefined();
      });

      it('should return a FifthweekError', function(){
        expect(error instanceof FifthweekError).toBeTruthy();
      });
    });

    describe('when called with no matching channels', function(){
      var error;
      beforeEach(function(){

        initialState = {
          createdChannelsAndCollections: {
            channels: [
              {
                channelId: 'channel0',
                collections: [
                  {
                    collectionId: 'collection01'
                  }
                ]
              },
              {
                channelId: 'channel2',
                collections: [
                  {
                    collectionId: 'collection21'
                  }
                ]
              }
            ]
          }
        };
        initialStateClone = _.cloneDeep(initialState);

        aggregateUserState.currentValue = initialState;

        target.mergeNewCollection(userId, channelId, collectionId, collectionName).catch(function(e){ error = e; });
        $rootScope.$apply();
      });

      it('should not modify the aggregate user state', function(){
        expect(initialState).toEqual(initialStateClone);
      });

      it('should not call updateFromDelta', function(){
        expect(aggregateUserState.updateFromDelta).not.toHaveBeenCalled();
      });

      it('should return a rejected promise', function(){
        expect(error).toBeDefined();
      });

      it('should return a FifthweekError', function(){
        expect(error instanceof FifthweekError).toBeTruthy();
      });
    });

    describe('when called with one channel and no initial collections', function(){
      beforeEach(function(){

        initialState = {
          createdChannelsAndCollections: {
            channels: [
              {
                channelId: 'channel1',
                collections: []
              }
            ]
          }
        };
        initialStateClone = _.cloneDeep(initialState);

        aggregateUserState.currentValue = initialState;

        target.mergeNewCollection(userId, channelId, collectionId, collectionName);
      });

      it('should not modify the aggregate user state directly', function(){
        expect(initialState).toEqual(initialStateClone);
      });

      it('should call updateFromDelta with the new structure', function(){
        expect(aggregateUserState.updateFromDelta).toHaveBeenCalledWith(
          'user1',
          {
            createdChannelsAndCollections: {
              channels: [
                {
                  channelId: 'channel1',
                  collections: [
                    {
                      collectionId: 'collection99',
                      name: 'collection-name'
                    }
                  ]
                }
              ]
            }
          });
      });
    });

    describe('when called with one channel and an initial collection', function(){
      beforeEach(function(){

        initialState = {
          createdChannelsAndCollections: {
            channels: [
              {
                channelId: 'channel1',
                collections: [
                  {
                    collectionId: 'collection1'
                  }
                ]
              }
            ]
          }
        };
        initialStateClone = _.cloneDeep(initialState);

        aggregateUserState.currentValue = initialState;

        target.mergeNewCollection(userId, channelId, collectionId, collectionName);
      });

      it('should not modify the aggregate user state directly', function(){
        expect(initialState).toEqual(initialStateClone);
      });

      it('should call updateFromDelta with the new structure', function(){
        expect(aggregateUserState.updateFromDelta).toHaveBeenCalledWith(
          'user1',
          {
            createdChannelsAndCollections: {
              channels: [
                {
                  channelId: 'channel1',
                  collections: [
                    {
                      collectionId: 'collection1'
                    },
                    {
                      collectionId: 'collection99',
                      name: 'collection-name'
                    }
                  ]
                }
              ]
            }
          });
      });
    });

    describe('when called with multiple channels and and multiple collections', function(){
      beforeEach(function(){

        initialState = {
          createdChannelsAndCollections: {
            channels: [
              {
                channelId: 'channel0',
                collections: [
                  {
                    collectionId: 'collection01'
                  }
                ]
              },
              {
                channelId: 'channel1',
                collections: [
                  {
                    collectionId: 'collection11'
                  },
                  {
                    collectionId: 'collection12'
                  }
                ]
              },
              {
                channelId: 'channel2',
                collections: [
                  {
                    collectionId: 'collection21'
                  }
                ]
              }
            ]
          }
        };
        initialStateClone = _.cloneDeep(initialState);

        aggregateUserState.currentValue = initialState;

        target.mergeNewCollection(userId, channelId, collectionId, collectionName);
      });

      it('should not modify the aggregate user state directly', function(){
        expect(initialState).toEqual(initialStateClone);
      });

      it('should call updateFromDelta with the new structure', function(){
        expect(aggregateUserState.updateFromDelta).toHaveBeenCalledWith(
          'user1',
          {
            createdChannelsAndCollections: {
              channels: [
                {
                  channelId: 'channel0',
                  collections: [
                    {
                      collectionId: 'collection01'
                    }
                  ]
                },
                {
                  channelId: 'channel1',
                  collections: [
                    {
                      collectionId: 'collection11'
                    },
                    {
                      collectionId: 'collection12'
                    },
                    {
                      collectionId: 'collection99',
                      name: 'collection-name'
                    }
                  ]
                },
                {
                  channelId: 'channel2',
                  collections: [
                    {
                      collectionId: 'collection21'
                    }
                  ]
                }
              ]
            }
          });
      });
    });
  });

  describe('when getChannelsAndCollections is called', function(){

    describe('when an unexpected error occurs', function(){
      it('should convert the error into a rejected promise', function(){
        // This structure should not occur, so the service will trip up and throw an exception.
        aggregateUserState.currentValue = { createdChannelsAndCollections: undefined };

        target.getChannelsAndCollections()
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

        target.getChannelsAndCollections()
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

        target.getChannelsAndCollections()
          .then(function(){
            fail('this should not occur');
          })
          .catch(function(error){
            expect(error instanceof DisplayableError).toBeTruthy();
            expect(error.message).toBe('You must create a subscription.');
          });

        $rootScope.$apply();
      });
    });

    describe('when the aggregate state is valid', function(){

      var result;

      beforeEach(function(){
        var inputChannels = [
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
          }
        ];

        aggregateUserState.currentValue = { createdChannelsAndCollections: { channels: inputChannels }};

        target.getChannelsAndCollections()
          .then(function(r){
            result = r;
          });

        $rootScope.$apply();
      });

      it('should return a list of channels that matches the aggregate state', function(){
        expect(result).toEqual(aggregateUserState.currentValue.createdChannelsAndCollections.channels);
      });

      it('should return a deep clone of the channels in the aggregate user state', function(){
        expect(result).not.toBe(aggregateUserState.currentValue.createdChannelsAndCollections.channels);

        result[0].collections[0].name = 'new';
        expect(aggregateUserState.currentValue.createdChannelsAndCollections.channels[0].collections[0].name).toBe('oneA');
      });
    });
  });
});
