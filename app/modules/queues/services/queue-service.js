angular.module('webApp')
  .factory('queueService',
  function(blogRepositoryFactory, queueStub, initializer) {
    'use strict';

    var service = {};
    var internal = service.internal = {};

    internal.initialize = function(){
      internal.blogRepository = blogRepositoryFactory.forCurrentUser();
    };

    initializer.initialize(internal.initialize);

    service.createQueueFromName = function(queueName) {
      return internal.blogRepository.getBlog()
        .then(function(blog){
          return queueStub
            .postQueue({
              blogId: blog.blogId,
              name: queueName
            });
        })
        .then(function(response){
          var queue = {
            queueId: response.data.queueId,
            name: queueName,
            weeklyReleaseSchedule: [ response.data.defaultWeeklyReleaseTime ]
          };
          return internal.blogRepository.createQueue(queue)
            .then(function(){
              return queue.queueId;
            }
          );
        }
      );
    };

    service.updateQueue = function(queueId, queueData) {
      return queueStub.putQueue(queueId, queueData)
        .then(function() {
          var queue = {
            queueId: queueId,
            name: queueData.name,
            weeklyReleaseSchedule: queueData.weeklyReleaseSchedule
          };
          return internal.blogRepository.updateQueue(queue);
        });
    };

    service.deleteQueue = function(queueId) {
      return queueStub.deleteQueue(queueId)
        .then(function() {
          return internal.blogRepository.deleteQueue(queueId);
        });
    };

    return service;
  }
);
