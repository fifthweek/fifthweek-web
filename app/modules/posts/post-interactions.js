angular.module('webApp').factory('postInteractions', function($q, $modal, accessSignatures, postsStub) {
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
          var uriWithSignature = data.uri + '/' + file.fileId + data.signature;
          window.open(uriWithSignature, '_blank');
        });
    };

    service.editPost = function(post) {
      return $modal.open({
        controller: 'postEditDialogCtrl',
        templateUrl: 'modules/posts/post-edit-dialog.html',
        resolve: {
          post: function() {
            return post;
          }
        }
      });
    };

    service.deletePost = function(postId) {
        return postsStub.deletePost(postId);
    };

    return service;
  }
);
