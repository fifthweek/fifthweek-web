angular.module('webApp').factory('postInteractions', function($modal, deleteVerification, accessSignatures) {
    'use strict';

    var service = {};

    service.viewImage = function (image, imageSource) {
      $modal.open({
        controller: 'fullSizeImageModalCtrl',
        templateUrl: 'modules/posts/full-size-image-modal.html',
        windowClass: 'modal-fw-large-image',
        resolve: {
          image: function() {
            return image;
          },
          imageSource: function() {
            return imageSource;
          }
        }
      });
    };

    service.openFile = function (file) {
      return accessSignatures.getContainerAccessInformation(file.containerName)
        .then(function(data) {
          var uriWithSignature = file.uri + data.signature;
          window.open(uriWithSignature, '_blank');
        });
    };

    service.edit = function(postId) {
      $modal.open({
        controller: 'postEditDialogCtrl',
        templateUrl: 'modules/creator-backlog/post-edit-dialog.html',
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
