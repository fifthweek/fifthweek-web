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

    masterRepository = jasmine.createSpyObj('masterRepository', ['get', 'set']);
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


  describe('when updating channels', function() {
    it('should set changes into the master repository at the correct location', function() {
      var channels = [];
      var applyChanges = jasmine.createSpy('applyChanges');

      masterRepository.set.and.callFake(function(key, apply) {
        apply(channels);
      });

      target.updateChannels(applyChanges);

      expect(applyChanges).toHaveBeenCalledWith(channels);
      expect(masterRepository.set.calls.mostRecent().args[0]).toBe('createdChannelsAndCollections.channels');
    });
  });

  describe('when creating a channel', function() {
    var channels;
    var updateChannels;
    var existingChannel = {channelId: 'existingId'};

    // Temporarily swap own implementation for spy.
    beforeEach(function() {
      channels = [existingChannel];
      updateChannels = target.updateChannels;
      target.updateChannels = function(applyChanges) {
        return applyChanges(channels);
      };

      spyOn(target, 'updateChannels').and.callThrough();
    });

    // Restore original implementation.
    afterEach(function() {
      target.updateChannels = updateChannels;
    });

    it('should throw an error if channel already exists', function() {
      var newChannel = {channelId: 'existingId'};

      target.createChannel(newChannel).catch(function(error) {
        expect(error instanceof FifthweekError).toBeTruthy();
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
    var updateChannels;
    var existingChannel = {channelId: 'existingId'};

    // Temporarily swap own implementation for spy.
    beforeEach(function() {
      channels = [existingChannel];
      updateChannels = target.updateChannels;
      target.updateChannels = function(applyChanges) {
        return applyChanges(channels);
      };

      spyOn(target, 'updateChannels').and.callThrough();
    });

    // Restore original implementation.
    afterEach(function() {
      target.updateChannels = updateChannels;
    });

    it('should throw an error if channel does not exist', function() {
      var applyChanges = jasmine.createSpy('applyChanges');

      target.updateChannel(channelId, applyChanges).catch(function(error) {
        expect(error instanceof FifthweekError).toBeTruthy();
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
});
