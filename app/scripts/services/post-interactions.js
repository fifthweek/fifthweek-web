angular.module('webApp').factory('postInteractions', function($modal) {
    'use strict';

    var service = {};

    var performDelete = function() {

    };

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
      $modal.open({
        controller: 'deleteVerificationCtrl',
        templateUrl: 'views/partials/delete-verification.html',
        size: 'sm',
        resolve: {
          deleteContext: function() {
            return {
              itemType: 'Post',
              dataEventTitle: 'Post deleted',
              dataEventCategory: isBacklog ? 'Backlog' : 'News Feed',
              action: function() {
                performDelete(postId);
              }
            };
          }
        }
      });
    };

    return service;
  }
);
