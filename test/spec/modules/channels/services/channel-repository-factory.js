describe('channel repository factory', function(){
  'use strict';

  var channelId = 'channelId';

  var $q;
  var $rootScope;
  var masterRepositoryFactory;
  var masterRepository;
  var targetFactory;
  var target;

  beforeEach(function() {
    module('webApp');

    masterRepository = jasmine.createSpyObj('masterRepository', ['get', 'update']);
    masterRepositoryFactory = { forCurrentUser: function() { return masterRepository; } };

    module(function($provide) {
      $provide.value('masterRepositoryFactory', masterRepositoryFactory);
    });

    inject(function($injector) {
      $q = $injector.get('$q');
      $rootScope = $injector.get('$rootScope');
      targetFactory = $injector.get('channelRepositoryFactory');
    });

    target = targetFactory.forCurrentUser();
  });

  describe('when getting channels', function() {
    it('should get channels from the master repository at the correct location', function() {
      var expectedChannels = [{}];
      var actualChannels;
      masterRepository.get.and.returnValue($q.when(expectedChannels));

      target.getChannels().then(function(channels) {
        actualChannels = channels;
      });
      $rootScope.$apply();

      expect(masterRepository.get).toHaveBeenCalledWith('createdChannelsAndCollections.channels');
      expect(expectedChannels).toBe(actualChannels);
    });

    it('should throw an error if there are no channels', function() {
      var noChannels = [];
      masterRepository.get.and.returnValue($q.when(noChannels));

      target.getChannels().catch(function(error) {
        expect(error instanceof DisplayableError).toBeTruthy();
        expect(error.message).toBe('You must create a subscription.');
      });
      $rootScope.$apply();
    });
  });

  describe('when getting channels sorted', function() {
    it('should return them sorted by default, then by name', function() {
      spyOn(target, 'getChannels').and.returnValue($q.when([
        {
          isDefault: false,
          name: 'b'
        },
        {
          isDefault: false,
          name: 'a'
        },
        {
          isDefault: true,
          name: 'd'
        },
        {
          isDefault: true,
          name: 'c'
        }
      ]));

      var continuation = jasmine.createSpy('continuation');
      target.getChannelsSorted().then(continuation);
      $rootScope.$apply();

      expect(continuation).toHaveBeenCalledWith([
        {
          isDefault: true,
          name: 'c'
        },
        {
          isDefault: true,
          name: 'd'
        },
        {
          isDefault: false,
          name: 'a'
        },
        {
          isDefault: false,
          name: 'b'
        }
      ]);
    });
  });

  describe('when updating channels', function() {
    it('should set changes into the master repository at the correct location', function() {
      var channels = [];
      var applyChanges = jasmine.createSpy('applyChanges');

      masterRepository.update.and.callFake(function(key, apply) {
        apply(channels);
      });

      target.updateChannels(applyChanges);

      expect(applyChanges).toHaveBeenCalledWith(channels);
      expect(masterRepository.update).toHaveBeenCalledWith('createdChannelsAndCollections.channels', jasmine.any(Function));
    });
  });

  describe('when creating a channel', function() {
    var channels;
    var existingChannel = {channelId: 'existingId'};

    // Swap own implementation for spy.
    beforeEach(function() {
      channels = [existingChannel];
      spyOn(target, 'updateChannels').and.callFake(function(applyChanges) {
        return applyChanges(channels);
      });
    });

    it('should throw an error if channel already exists', function() {
      var newChannel = {channelId: 'existingId'};

      target.createChannel(newChannel).catch(function(error) {
        expect(error instanceof DisplayableError).toBeTruthy();
        expect(error.message).toBe('Channel already exists.');
      });
      $rootScope.$apply();

      expect(channels).toEqual([existingChannel]);
    });

    it('should append the new channel onto the channel list', function() {
      var newChannel = {channelId: 'channelId'};

      target.createChannel(newChannel);
      $rootScope.$apply();

      expect(channels).toEqual([existingChannel, newChannel]);
    });
  });

  describe('when updating a channel', function() {
    var channels;
    var existingChannel = {channelId: 'existingId'};

    // Swap own implementation for spy.
    beforeEach(function() {
      channels = [existingChannel];
      spyOn(target, 'updateChannels').and.callFake(function(applyChanges) {
        return applyChanges(channels);
      });
    });

    it('should throw an error if channel does not exist', function() {
      var applyChanges = jasmine.createSpy('applyChanges');

      target.updateChannel(channelId, applyChanges).catch(function(error) {
        expect(error instanceof DisplayableError).toBeTruthy();
        expect(error.message).toBe('Channel not found.');
      });
      $rootScope.$apply();

      expect(applyChanges).not.toHaveBeenCalled();
    });

    it('should apply the changes if the channel exists', function() {
      var applyChanges = jasmine.createSpy('applyChanges');

      target.updateChannel('existingId', applyChanges);
      $rootScope.$apply();

      expect(applyChanges).toHaveBeenCalled();
    });
  });

  describe('when deleting a channel', function() {
    var channels;
    var existingChannel = {channelId: 'existingId'};

    // Swap own implementation for spy.
    beforeEach(function() {
      channels = [existingChannel];
      spyOn(target, 'updateChannels').and.callFake(function(applyChanges) {
        return applyChanges(channels);
      });
    });

    it('should delete the channel from the channel list', function() {
      target.deleteChannel('existingId');
      $rootScope.$apply();

      expect(channels).toEqual([]);
    });

    it('should have no effect when channel does not exist', function() {
      target.deleteChannel('already been deleted');
      $rootScope.$apply();

      expect(channels).toEqual([existingChannel]);
    });
  });

  describe('when getting a channel', function() {
    var channels;
    var existingChannel = {channelId: 'existingId'};

    // Swap own implementation for spy.
    beforeEach(function() {
      channels = [existingChannel];
      spyOn(target, 'getChannels').and.callFake(function() {
        return $q.when(channels);
      });
    });

    it('should throw an error if channel does not exist', function() {
      target.getChannel(channelId).catch(function(error) {
        expect(error instanceof DisplayableError).toBeTruthy();
        expect(error.message).toBe('Channel not found.');
      });
      $rootScope.$apply();
    });

    it('should apply the changes if the channel exists', function() {
      var actualChannel;
      target.getChannel('existingId').then(function(channel) {
        actualChannel = channel;
      });
      $rootScope.$apply();

      expect(actualChannel).toBe(existingChannel);
    });
  });

  describe('when getting a channel map', function(){
    describe('when no channels exist', function(){

      var error;
      beforeEach(function(){
        masterRepository.get.and.returnValue($q.when([]));
        target.getChannelMap().catch(function(e){error = e;});
        $rootScope.$apply();
      });

      it('should fail with a displayable error', function(){
        expect(error instanceof DisplayableError).toBe(true);
        expect(error.message).toBe('You must create a subscription.');
      });
    });

    describe('when channels exist', function(){

      var result;
      beforeEach(function(){
        masterRepository.get.and.returnValue($q.when([
          {
            channelId: 'a',
            collections: [
              { collectionId: 'x' },
              { collectionId: 'y' }
            ]
          },
          {
            channelId: 'b',
            collections: [
              { collectionId: 'xx' },
              { collectionId: 'yy' }
            ]
          }
        ]));

        target.getChannelMap().then(function(r){result = r;});
        $rootScope.$apply();
      });

      it('should return a map of channels and collections', function(){
        expect(result).toEqual({
          a: {
            channelId: 'a',
            collections: {
              x: { collectionId: 'x' },
              y: { collectionId: 'y' }
            }
          },
          b: {
            channelId: 'b',
            collections: {
              xx: { collectionId: 'xx' },
              yy: { collectionId: 'yy' }
            }
          }
        });
      });
    });
  });
});
