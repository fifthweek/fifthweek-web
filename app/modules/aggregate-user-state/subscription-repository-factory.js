angular.module('webApp')
  .constant('subscriptionRepositoryFactoryConstants', {
    key: 'subscriptions.blogs'
  })
  .factory('subscriptionRepositoryFactory',
  function($q, masterRepositoryFactory, subscriptionRepositoryFactoryConstants) {
    'use strict';

    return {
      forCurrentUser: function() {

        var key = subscriptionRepositoryFactoryConstants.key;
        var masterRepository = masterRepositoryFactory.forCurrentUser();

        var service = {};

        service.getUserId = function(){
          return masterRepository.getUserId();
        };

        service.tryGetBlogs = function(){
          if(!masterRepository.getUserId())
          {
            return $q.when();
          }

          return masterRepository.get(key, true);
        };

        service.getBlogs = function(){
          return masterRepository.get(key);
        };

        service.getBlogMap = function() {
          return service.tryGetBlogs().then(function(blogs) {

            if(!blogs || !blogs.length){
              return $q.when({});
            }

            var blogMap = _.reduce(blogs, function(blogResult, blog){

              blog.channels = _.reduce(blog.channels, function(channelResult, channel){

                channelResult[channel.channelId] = channel;
                return channelResult;
              }, {});

              blogResult[blog.blogId] = blog;
              return blogResult;
            }, {});

            return $q.when(blogMap);
          });
        };

        return service;
      }
    };
  }
);
