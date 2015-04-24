angular.module('webApp')
  .constant('blogRepositoryFactoryConstants', {
    blogKey: 'blog',
    channelsKey: 'blog.channels'
  })
  .factory('blogRepositoryFactory',
  function($q, masterRepositoryFactory, blogRepositoryFactoryConstants) {
    'use strict';

    return {
      forCurrentUser: function() {

        var blogKey = blogRepositoryFactoryConstants.blogKey;
        var channelsKey = blogRepositoryFactoryConstants.channelsKey;
        var masterRepository = masterRepositoryFactory.forCurrentUser();

        var service = {};

        service.getUserId = function(){
          return masterRepository.getUserId();
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

        service.getChannelsSorted = function() {
          return service.getChannels().then(function(channels) {
            return _.sortByOrder(channels, ['isDefault', 'name'], [false, true]);
          });
        };

        service.getChannelMap = function() {
          return masterRepository.get(blogKey).then(function(blog) {
            if (!blog) {
              return $q.reject(new DisplayableError('You must create a blog.'));
            }

            blog.channels = _.reduce(blog.channels, function(channelResult, channel){

              channel.collections = _.reduce(channel.collections, function(collectionResult, collection){
                collectionResult[collection.collectionId] = collection;
                return collectionResult;
              }, {});

              channelResult[channel.channelId] = channel;
              return channelResult;
            }, {});

            return $q.when(blog);
          });
        };

        service.updateChannels = function(applyChanges) {
          return masterRepository.update(channelsKey, function(channels) {
            return $q.when(applyChanges(channels));
          });
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

        service.updateChannel = function(channelId, applyChanges) {
          return service.updateChannels(function(channels) {
            var channel = _.find(channels, { channelId: channelId });
            if (!channel) {
              return $q.reject(new DisplayableError('Channel not found.'));
            }

            return $q.when(applyChanges(channel));
          });
        };

        service.deleteChannel = function(channelId) {
          return service.updateChannels(function(channels) {
            _.remove(channels, { channelId: channelId });
            return $q.when();
          });
        };

        return service;
      }
    };
  }
);
