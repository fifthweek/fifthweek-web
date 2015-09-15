angular.module('webApp')
  .factory('composeUtilities',
  function($q, $modal, blogRepositoryFactory, utilities, errorFacade, queueStub) {
    'use strict';

    var service = {};

    service.updateEstimatedLiveDate = function(model){
      model.queuedLiveDate = undefined;
      if(model.input.selectedQueue) {
        queueStub.getLiveDateOfNewQueuedPost(model.input.selectedQueue.queueId)
          .then(function(result){
            model.queuedLiveDate = new Date(result.data);
          })
          .catch(function(error){
            model.queuedLiveDate = undefined;
            return errorFacade.handleError(error, function(message) {
              model.errorMessage = message;
            });
          });
      }
    };

    return service;
  }
);
