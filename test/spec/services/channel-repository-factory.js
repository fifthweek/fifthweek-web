describe('channel repository factory', function(){
  'use strict';

  var userId = 'userId';
  var channelId = 'channel0';

  var $q;
  var $rootScope;
  var aggregateUserState;
  var authenticationService;
  var targetFactory;
  var target;

  beforeEach(function() {
    module('webApp');

    authenticationService = { currentUser: { userId: userId } };
    aggregateUserState = jasmine.createSpyObj('aggregateUserState', ['updateFromDelta']);

    module(function($provide) {
      $provide.value('authenticationService', authenticationService);
      $provide.value('aggregateUserState', aggregateUserState);
    });

    inject(function($injector) {
      $q = $injector.get('$q');
      $rootScope = $injector.get('$rootScope');
      targetFactory = $injector.get('channelRepositoryFactory');
    });

    target = targetFactory.forCurrentUser();
  });

  describe('when user ID has changed', function() {
    beforeEach(function() {
      seedChannels([channelId]);
    });

    it('should not update state', function() {
      var channelRepository = targetFactory.forCurrentUser();
      aggregateUserState.currentValue = { userId: 'changed' };
      channelRepository.updateChannel(channelId, function() {});
      expect(aggregateUserState.updateFromDelta).not.toHaveBeenCalled();
    });

    it('should throw an error when reading state', function() {
      var channelRepository = targetFactory.forCurrentUser();
      aggregateUserState.currentValue = { userId: 'changed' };
      channelRepository.getChannelsAndCollections().catch(function(error){
        expect(error instanceof FifthweekError).toBeTruthy();
        expect(error.message).toBe('User has changed: channel repository no longer valid.');
      });
    });
  });

  describe('when updating a channel', function(){

    var initialState;
    var initialStateClone;

    describe('when no channels exist', function(){
      var error;
      beforeEach(function(){

        seedChannels([]);
        initialState = aggregateUserState.currentValue;
        initialStateClone = _.cloneDeep(initialState);

        target.updateChannel('non-existent channel', function(){}).catch(function(e){ error = e; });
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

        seedChannels([channelId, 'channel2']);
        initialState = aggregateUserState.currentValue;
        initialStateClone = _.cloneDeep(initialState);

        target.updateChannel('non-existent channel', function(){}).catch(function(e){ error = e; });
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

    describe('when called and one channel matches', function(){
      beforeEach(function(){

        seedChannels([channelId, 'channel2']);
        initialState = aggregateUserState.currentValue;
        initialStateClone = _.cloneDeep(initialState);

        target.updateChannel(channelId, function(channel) {
          channel.name = 'new value';
        });
      });

      it('should not modify the aggregate user state directly', function(){
        expect(initialState).toEqual(initialStateClone);
      });

      it('should call updateFromDelta with the new structure', function(){
        expect(aggregateUserState.updateFromDelta).toHaveBeenCalledWith(
          userId,
          {
            createdChannelsAndCollections: {
              channels: [
                {
                  channelId: channelId,
                  name: 'new value'
                },
                {
                  channelId: 'channel2'
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
        aggregateUserState.currentValue = { userId: userId, createdChannelsAndCollections: undefined };

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
        aggregateUserState.currentValue = { userId: userId, createdChannelsAndCollections: { channels: [] }};

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

        aggregateUserState.currentValue = { userId: userId, createdChannelsAndCollections: { channels: inputChannels }};

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

  var seedChannels = function(channelIds) {
    aggregateUserState.currentValue = {
      userId: userId,
      createdChannelsAndCollections: {
        channels: _.map(channelIds, function(channelId) {
          return { channelId: channelId };
        })
      }
    };
  };
});
