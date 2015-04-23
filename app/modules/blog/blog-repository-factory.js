angular.module('webApp')
  .constant('blogRepositoryFactoryConstants', {
    key: 'blog'
  })
  .factory('blogRepositoryFactory',
  function($q, masterRepositoryFactory, blogRepositoryFactoryConstants) {
    'use strict';

    return {
      forCurrentUser: function() {

        var blogKey = blogRepositoryFactoryConstants.key;
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

        return service;
      }
    };
  }
);
