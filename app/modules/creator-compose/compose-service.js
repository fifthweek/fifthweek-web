angular.module('webApp')
  .factory('composeService',
  function($modal) {
    'use strict';

    var service = {};

    service.compose = function() {
      return $modal.open({
        controller: 'composePostCtrl',
        size: 'lg',
        templateUrl: 'modules/creator-compose/compose-post.html'
      });
    };

    return service;
  }
);
