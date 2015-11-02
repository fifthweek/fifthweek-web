describe('blog repository factory', function(){
  'use strict';

  var channelId = 'channelId';

  var $q;
  var $rootScope;
  var masterRepositoryFactory;
  var masterRepository;
  var blogRepositoryFactoryConstants;
  var targetFactory;
  var target;

  beforeEach(function() {
    module('webApp');

    masterRepository = jasmine.createSpyObj('masterRepository', ['get', 'set', 'update', 'getUserId']);
    masterRepositoryFactory = { forCurrentUser: function() { return masterRepository; } };

    module(function($provide) {
      $provide.value('masterRepositoryFactory', masterRepositoryFactory);
    });

    inject(function($injector) {
      $q = $injector.get('$q');
      $rootScope = $injector.get('$rootScope');
      blogRepositoryFactoryConstants = $injector.get('blogRepositoryFactoryConstants');
      targetFactory = $injector.get('blogRepositoryFactory');
    });

    target = targetFactory.forCurrentUser();
  });

  describe('calling getUserId', function(){
    var result;
    beforeEach(function(){
      masterRepository.getUserId.and.returnValue('result');
      result = target.getUserId();
    });

    it('should return the result', function(){
      expect(result).toBe('result');
    });
  });

  describe('when calling getBlog', function() {
    it('should get settings from the master repository at the correct location', function() {
      var expected = { name: 'phil' };
      var actual;
      masterRepository.get.and.returnValue($q.when(expected));

      target.getBlog().then(function(settings) {
        actual = settings;
      });
      $rootScope.$apply();

      expect(masterRepository.get).toHaveBeenCalledWith(blogRepositoryFactoryConstants.blogKey);
      expect(expected).toBe(actual);
    });

    it('should fail if there is no blog data', function() {
      var error;
      masterRepository.get.and.returnValue($q.when(undefined));

      target.getBlog().catch(function(e) {
        error = e;
      });
      $rootScope.$apply();

      expect(masterRepository.get).toHaveBeenCalledWith(blogRepositoryFactoryConstants.blogKey);
      expect(error instanceof DisplayableError).toBe(true);
      expect(error.message).toBe('You do not have a blog.');
    });
  });

  describe('calling tryGetBlog', function() {
    var expected;
    var actual;
    beforeEach(function(){
      expected = 'data';
      actual = undefined;

      masterRepository.get.and.returnValue($q.when(expected));
    });

    describe('when the user is logged in', function(){
      beforeEach(function(){
        masterRepository.getUserId.and.returnValue('userId');
        target.tryGetBlog().then(function(result) { actual = result; });
        $rootScope.$apply();
      });

      it('should call the master repository', function(){
        expect(masterRepository.get).toHaveBeenCalledWith(blogRepositoryFactoryConstants.blogKey);
      });

      it('should return the expected data', function(){
        expect(actual).toBe(expected);
      });
    });

    describe('when the user is not logged in', function(){
      beforeEach(function(){
        masterRepository.getUserId.and.returnValue(undefined);
        target.tryGetBlog().then(function(result) { actual = result; });
        $rootScope.$apply();
      });

      it('should not call the master repository', function(){
        expect(masterRepository.get).not.toHaveBeenCalled();
      });

      it('should return the expected data', function(){
        expect(actual).toBeUndefined();
      });
    });
  });

  describe('when calling setBlog', function() {
    it('should set settings into the master repository at the correct location', function() {
      var settings = { name: 'phil' };

      target.setBlog(settings);

      expect(masterRepository.set).toHaveBeenCalledWith(blogRepositoryFactoryConstants.blogKey, settings);
    });
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

      expect(masterRepository.get).toHaveBeenCalledWith('blog.channels');
      expect(expectedChannels).toBe(actualChannels);
    });

    it('should throw an error if there are no channels', function() {
      var noChannels = [];
      masterRepository.get.and.returnValue($q.when(noChannels));

      target.getChannels().catch(function(error) {
        expect(error instanceof DisplayableError).toBeTruthy();
        expect(error.message).toBe('You must create a blog.');
      });
      $rootScope.$apply();
    });
  });

  describe('when getting queues', function() {
    it('should get queues from the master repository at the correct location', function() {
      var expectedQueues = [{}];
      var actualQueues;
      masterRepository.get.and.returnValue($q.when(expectedQueues));

      target.getQueues().then(function(queues) {
        actualQueues = queues;
      });
      $rootScope.$apply();

      expect(masterRepository.get).toHaveBeenCalledWith('blog.queues');
      expect(expectedQueues).toBe(actualQueues);
    });

    it('should throw an error if there are no channels', function() {
      var noChannels = [];
      masterRepository.get.and.returnValue($q.when(noChannels));

      target.getChannels().catch(function(error) {
        expect(error instanceof DisplayableError).toBeTruthy();
        expect(error.message).toBe('You must create a blog.');
      });
      $rootScope.$apply();
    });
  });

  describe('when getting channels sorted', function() {
    it('should return them sorted by name', function() {
      spyOn(target, 'getChannels').and.returnValue($q.when([
        {
          name: 'b'
        },
        {
          name: 'a'
        },
        {
          name: 'd'
        },
        {
          name: 'c'
        }
      ]));

      var continuation = jasmine.createSpy('continuation');
      target.getChannelsSorted().then(continuation);
      $rootScope.$apply();

      expect(continuation).toHaveBeenCalledWith([
        {
          name: 'a'
        },
        {
          name: 'b'
        },
        {
          name: 'c'
        },
        {
          name: 'd'
        }
      ]);
    });
  });

  describe('when getting queues sorted', function() {
    it('should return them sorted by name', function() {
      spyOn(target, 'getQueues').and.returnValue($q.when([
        {
          name: 'b'
        },
        {
          name: 'a'
        },
        {
          name: 'd'
        },
        {
          name: 'c'
        }
      ]));

      var continuation = jasmine.createSpy('continuation');
      target.getQueuesSorted().then(continuation);
      $rootScope.$apply();

      expect(continuation).toHaveBeenCalledWith([
        {
          name: 'a'
        },
        {
          name: 'b'
        },
        {
          name: 'c'
        },
        {
          name: 'd'
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
      expect(masterRepository.update).toHaveBeenCalledWith('blog.channels', jasmine.any(Function));
    });
  });

  describe('when updating queues', function() {
    it('should set changes into the master repository at the correct location', function() {
      var queues = [];
      var applyChanges = jasmine.createSpy('applyChanges');

      masterRepository.update.and.callFake(function(key, apply) {
        apply(queues);
      });

      target.updateQueues(applyChanges);

      expect(applyChanges).toHaveBeenCalledWith(queues);
      expect(masterRepository.update).toHaveBeenCalledWith('blog.queues', jasmine.any(Function));
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

  describe('when creating a queue', function() {
    var queues;
    var existingQueue = {queueId: 'existingId'};

    // Swap own implementation for spy.
    beforeEach(function() {
      queues = [existingQueue];
      spyOn(target, 'updateQueues').and.callFake(function(applyChanges) {
        return applyChanges(queues);
      });
    });

    it('should throw an error if queue already exists', function() {
      var newQueue = {queueId: 'existingId'};

      target.createQueue(newQueue).catch(function(error) {
        expect(error instanceof DisplayableError).toBeTruthy();
        expect(error.message).toBe('Queue already exists.');
      });
      $rootScope.$apply();

      expect(queues).toEqual([existingQueue]);
    });

    it('should append the new queue onto the queue list', function() {
      var newQueue = {queueId: 'queueId'};

      target.createQueue(newQueue);
      $rootScope.$apply();

      expect(queues).toEqual([existingQueue, newQueue]);
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

  describe('when updating a queue', function() {
    var queues;
    var existingQueue = {queueId: 'existingId'};

    // Swap own implementation for spy.
    beforeEach(function() {
      queues = [existingQueue];
      spyOn(target, 'updateQueues').and.callFake(function(applyChanges) {
        return applyChanges(queues);
      });
    });

    it('should throw an error if queue does not exist', function() {
      var applyChanges = jasmine.createSpy('applyChanges');

      target.updateQueue('someQueueId', applyChanges).catch(function(error) {
        expect(error instanceof DisplayableError).toBeTruthy();
        expect(error.message).toBe('Queue not found.');
      });
      $rootScope.$apply();

      expect(applyChanges).not.toHaveBeenCalled();
    });

    it('should apply the changes if the queue exists', function() {
      var applyChanges = jasmine.createSpy('applyChanges');

      target.updateQueue('existingId', applyChanges);
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

  describe('when deleting a queue', function() {
    var queues;
    var existingQueue = {queueId: 'existingId'};

    // Swap own implementation for spy.
    beforeEach(function() {
      queues = [existingQueue];
      spyOn(target, 'updateQueues').and.callFake(function(applyChanges) {
        return applyChanges(queues);
      });
    });

    it('should delete the queue from the queue list', function() {
      target.deleteQueue('existingId');
      $rootScope.$apply();

      expect(queues).toEqual([]);
    });

    it('should have no effect when queue does not exist', function() {
      target.deleteQueue('already been deleted');
      $rootScope.$apply();

      expect(queues).toEqual([existingQueue]);
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
        masterRepository.get.and.returnValue($q.when());
        target.getBlogMap().catch(function(e){error = e;});
        $rootScope.$apply();
      });

      it('should fail with a displayable error', function(){
        expect(error instanceof DisplayableError).toBe(true);
        expect(error.message).toBe('You must create a blog.');
      });
    });

    describe('when channels exist', function(){

      var result;
      beforeEach(function(){
        masterRepository.get.and.returnValue($q.when(
        {
          channels: [
            {
              channelId: 'a'
            },
            {
              channelId: 'b'
            }
          ],
          queues: [
            { queueId: 'x' },
            { queueId: 'y' }
          ]

        }));

        target.getBlogMap().then(function(r){result = r;});
        $rootScope.$apply();
      });

      it('should return a map of channels and queues', function(){
        expect(result).toEqual({
          channels: {
            a: {
              channelId: 'a'
            },
            b: {
              channelId: 'b'
            }
          },
          queues: {
            x: { queueId: 'x' },
            y: { queueId: 'y' }
          }
        });
      });
    });
  });

  describe('when calling tryGetBlogMap', function(){
    describe('when no user exist', function(){

      var result;
      var success;
      beforeEach(function(){
        masterRepository.getUserId.and.returnValue(undefined);

        target.tryGetBlogMap().then(function(r){result = r; success = true;});
        $rootScope.$apply();
      });

      it('should succeed with no result', function(){
        expect(success).toBe(true);
        expect(result).toBeUndefined();
      });
    });

    describe('when channels exist', function(){

      var result;
      beforeEach(function(){
        masterRepository.getUserId.and.returnValue('userId');
        masterRepository.get.and.returnValue($q.when(
          {
            channels: [
              {
                channelId: 'a'
              },
              {
                channelId: 'b'
              }
            ],
            queues: [
              { queueId: 'x' },
              { queueId: 'y' }
            ]

          }));

        target.tryGetBlogMap().then(function(r){result = r;});
        $rootScope.$apply();
      });

      it('should return a map of channels and queues', function(){
        expect(result).toEqual({
          channels: {
            a: {
              channelId: 'a'
            },
            b: {
              channelId: 'b'
            }
          },
          queues: {
            x: { queueId: 'x' },
            y: { queueId: 'y' }
          }
        });
      });
    });
  });
});
