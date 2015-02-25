angular.module('webApp').factory('postInteractions', function($modal, deleteVerification) {
    'use strict';

    var service = {};

    service.viewImage = function (imagePath) {
      $modal.open({
        controller: 'fullSizeImageModalCtrl',
        templateUrl: 'views/full-size-image-modal.html',
        windowClass: 'modal-fw-large-image',
        resolve: {
          imagePath: function() {
            return imagePath;
          }
        }
      });
    };

    service.edit = function(postId) {
      $modal.open({
        controller: 'backlogPostEditCtrl',
        templateUrl: 'views/creators/backlog/post-edit.html',
        resolve: {
          postId: function() {
            return postId;
          }
        }
      });
    };

    service.delete = function(postId, isBacklog) {
      var performDelete = function() {

      };

      deleteVerification.verifyDelete(
        performDelete,
        'Post deleted',
        isBacklog ? 'Backlog' : 'News Feed',
        'Post');
    };

    return service;
  }
);
