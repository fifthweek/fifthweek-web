angular.module('webApp')
  .factory('queueService',
  function(queueStub) {
    'use strict';

    var service = {};

    service.createQueueFromName = function(queueName, blogRepository) {
      return blogRepository.getBlog()
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
          return blogRepository.createQueue(queue)
            .then(function(){
              return queue.queueId;
            }
          );
        }
      );
    };

    service.updateQueue = function(queueId, queueData, blogRepository) {
      return queueStub.putQueue(queueId, queueData)
        .then(function() {
          return blogRepository.updateQueue(queueId, function(queue) {
            queue.name = queueData.name;
            queue.weeklyReleaseSchedule = queueData.weeklyReleaseSchedule;
          });
        });
    };

    service.deleteQueue = function(queueId, blogRepository) {
      return queueStub.deleteQueue(queueId)
        .then(function() {
          return blogRepository.deleteQueue(queueId);
        });
    };

    return service;
  }
);
