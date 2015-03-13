angular.module('webApp').factory('blobImageControlFactory', function($q) {
    'use strict';

    var service = {};

    service.createControl = function(){

      var state = {
        deferred: $q.defer(),
        updateHandler: undefined
      };

      var control = {
        update: function(uri, containerName, availableImmediately){
          return state.deferred.promise.then(function(){
            return state.updateHandler(uri, containerName, availableImmediately);
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
