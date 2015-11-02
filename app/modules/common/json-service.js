angular.module('webApp').factory('jsonService',
  function() {
    'use strict';

    var service = {};

    service.toJson = function(input){
      if(!input){
        return '';
      }

      return JSON.stringify(input);
    };

    service.fromJson = function(input){
      if(!input){
        return undefined;
      }

      return JSON.parse(input);
    };

    service.toSirTrevor = function(blocks, files){
      return {
        serializedBlocks: service.toJson(blocks),
        files: files
      };
    };

    return service;
  });
