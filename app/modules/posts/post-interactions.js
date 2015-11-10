angular.module('webApp').factory('postInteractions', function($q, $modal, accessSignatures, postStub) {
    'use strict';

    var service = {
      internal: {}
    };

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
          initialPost: function() {
            return post;
          }
        }
      });
    };

    service.viewPost = function(post) {
      var updateLikeStatus = function(totalLikes, hasLiked){
        post.likesCount = totalLikes;
        post.hasLiked = hasLiked;
      };
      var updateCommentsCount = function(totalComments){
        post.commentsCount = totalComments;
      };
      var modalResult = $modal.open({
        controller: 'postDialogCtrl',
        templateUrl: 'modules/posts/post-dialog.html',
        size: 'lg',
        resolve: {
          post: function(){
            return post;
          },
          updateLikeStatus: function(){
            return updateLikeStatus;
          },
          updateCommentsCount: function(){
            return updateCommentsCount;
          }
        }
      });

      return modalResult.result;
    };

    service.deletePost = function(postId) {
      return postStub.deletePost(postId);
    };

    service.internal.likePost = function(post){
      post.hasLiked = true;
      post.likesCount += 1;
      return postStub.postLike(post.postId)
        .catch(function(error){
          post.hasLiked = false;
          post.likesCount -= 1;
          return $q.reject(error);
        });
    };

    service.internal.unlikePost = function(post){
      post.hasLiked = false;
      post.likesCount -= 1;
      return postStub.deleteLike(post.postId)
        .catch(function(error){
          post.hasLiked = true;
          post.likesCount += 1;
          return $q.reject(error);
        });
    };

    service.toggleLikePost = function(post){
      if(post.hasLiked){
        return service.internal.unlikePost(post);
      }
      else{
        return service.internal.likePost(post);
      }
    };

    service.showComments = function(postId, isCommenting, updateCommentsCount){
      var modalResult = $modal.open({
          controller: 'commentsDialogCtrl',
          templateUrl: 'modules/comments/comments-dialog.html',
          resolve: {
            postId: function() {
              return postId;
            },
            isCommenting: function() {
              return isCommenting;
            },
            updateCommentsCount: function(){
              return updateCommentsCount;
            }
          }
        });

      return modalResult.result;
    };

    return service;
  }
);
