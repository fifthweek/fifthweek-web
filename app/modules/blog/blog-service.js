angular.module('webApp')
  .factory('blogService',
  function($rootScope, $q, blogStub, aggregateUserState, authenticationService, blogRepositoryFactory) {
    'use strict';

    var service = Object.create({}, {
      blogId: { get: function () { return (aggregateUserState.currentValue && aggregateUserState.currentValue.blog) ? aggregateUserState.currentValue.blog.blogId : undefined; }},
      hasBlog: { get: function () { return !!service.blogId; }}
    });

    service.createFirstBlog = function(blogData) {
      if (service.hasBlog) {
        return $q.reject(new FifthweekError('Blog already created'));
      }

      var blogRepository = blogRepositoryFactory.forCurrentUser();
      return blogStub.postBlog(blogData)
        .then(function(response) {
          var newBlogIds = response.data;

          var localBlog =
          {
            blogId: newBlogIds.blogId,
            name: blogData.name,
            introduction: blogData.introduction,
            creationDate: new Date(),
            channels:
            [
              {
                channelId: newBlogIds.channelId,
                name: blogData.name,
                price: blogData.basePrice,
                isVisibleToNonSubscribers: true
              }
            ],
            queues: []
          };
          return blogRepository.setBlog(localBlog);
      });
    };

    return service;
  }
);
