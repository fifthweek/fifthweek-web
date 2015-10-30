angular.module('webApp')
  .constant('blogRepositoryFactoryConstants', {
    blogKey: 'blog',
    channelsKey: 'blog.channels',
    queuesKey: 'blog.queues'
  })
  .factory('blogRepositoryFactory',
  function($q, masterRepositoryFactory, blogRepositoryFactoryConstants) {
    'use strict';

    return {
      forCurrentUser: function() {

        var blogKey = blogRepositoryFactoryConstants.blogKey;
        var channelsKey = blogRepositoryFactoryConstants.channelsKey;
        var queuesKey = blogRepositoryFactoryConstants.queuesKey;
        var masterRepository = masterRepositoryFactory.forCurrentUser();

        var service = {};

        service.getUserId = function(){
          return masterRepository.getUserId();
        };

        service.tryGetBlog = function(){
          if(!masterRepository.getUserId())
          {
            return $q.when();
          }

          return masterRepository.get(blogKey);
        };

        service.getBlog = function(){
          return masterRepository.get(blogKey)
            .then(function(data){
              if(data){
                return $q.when(data);
              }

              return $q.reject(new DisplayableError('You do not have a blog.'));
            });
        };

        service.setBlog = function(newBlog){
          return masterRepository.set(blogKey, newBlog);
        };

        service.getChannels = function() {
          return masterRepository.get(channelsKey).then(function(channels) {
            if (!channels || channels.length === 0) {
              return $q.reject(new DisplayableError('You must create a blog.'));
            }

            return $q.when(channels);
          });
        };

        service.getQueues = function() {
          return masterRepository.get(queuesKey).then(function(queues) {
            return $q.when(queues);
          });
        };

        service.getChannelsSorted = function() {
          return service.getChannels().then(function(channels) {
            return _.sortByOrder(channels, ['name'], [true]);
          });
        };

        service.getQueuesSorted = function() {
          return service.getQueues().then(function(queues) {
            return _.sortByOrder(queues, ['name'], [true]);
          });
        };

        service.getBlogMap = function() {
          return masterRepository.get(blogKey).then(function(blog) {
            if (!blog) {
              return $q.reject(new DisplayableError('You must create a blog.'));
            }

            blog.channels = _.reduce(blog.channels, function(channelResult, channel){

              channelResult[channel.channelId] = channel;
              return channelResult;
            }, {});

            blog.queues = _.reduce(blog.queues, function(queueResult, queue){
              queueResult[queue.queueId] = queue;
              return queueResult;
            }, {});

            return $q.when(blog);
          });
        };

        service.tryGetBlogMap = function() {
          if(!masterRepository.getUserId())
          {
            return $q.when();
          }

          return service.getBlogMap();
        };

        service.updateChannels = function(applyChanges) {
          return masterRepository.update(channelsKey, applyChanges);
        };

        service.updateQueues = function(applyChanges) {
          return masterRepository.update(queuesKey, applyChanges);
        };

        service.getChannel = function(channelId) {
          return service.getChannels().then(function(channels) {
            var channel = _.find(channels, {channelId: channelId});
            if (!channel) {
              return $q.reject(new DisplayableError('Channel not found.'));
            }

            return channel;
          });
        };

        service.createChannel = function(newChannel) {
          return service.updateChannels(function(channels) {
            if (_.some(channels, { channelId: newChannel.channelId })) {
              return $q.reject(new DisplayableError('Channel already exists.'));
            }

            channels.push(newChannel);
            return $q.when();
          });
        };

        service.createQueue = function(newQueue) {
          return service.updateQueues(function(queues) {
            if (_.some(queues, { queueId: newQueue.queueId })) {
              return $q.reject(new DisplayableError('Queue already exists.'));
            }

            queues.push(newQueue);
            return $q.when();
          });
        };

        service.updateChannel = function(channelId, applyChanges) {
          return service.updateChannels(function(channels) {
            var channel = _.find(channels, { channelId: channelId });
            if (!channel) {
              return $q.reject(new DisplayableError('Channel not found.'));
            }

            return $q.when(applyChanges(channel));
          });
        };

        service.updateQueue = function(queueId, applyChanges) {
          return service.updateQueues(function(queues) {
            var queue = _.find(queues, { queueId: queueId });
            if (!queue) {
              return $q.reject(new DisplayableError('Queue not found.'));
            }

            return $q.when(applyChanges(queue));
          });
        };

        service.deleteChannel = function(channelId) {
          return service.updateChannels(function(channels) {
            _.remove(channels, { channelId: channelId });
            return $q.when();
          });
        };

        service.deleteQueue = function(queueId) {
          return service.updateQueues(function(queues) {
            _.remove(queues, { queueId: queueId });
            return $q.when();
          });
        };

        return service;
      }
    };
  }
);
