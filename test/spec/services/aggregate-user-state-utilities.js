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
});
