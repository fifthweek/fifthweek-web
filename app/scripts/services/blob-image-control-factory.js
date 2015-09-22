angular.module('webApp').factory('blobImageControlFactory', function($q) {
    'use strict';

    var service = {};

    service.createControl = function(){

      var state = {
        deferred: $q.defer(),
        updateHandler: undefined
      };

      var control = {
        update: function(containerName, fileId, availableImmediately, completeCallback){
          return state.deferred.promise.then(function(){
            return state.updateHandler(containerName, fileId, availableImmediately, completeCallback);
          });
        },
        initialize: function(updateHandler){
          state.updateHandler = updateHandler;
          state.deferred.resolve();
        }
      };

      return control;
    };

    return service;
  }
);
