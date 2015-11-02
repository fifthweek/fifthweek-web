angular.module('webApp')
  .controller('postDialogCtrl',
  function($scope, post, updateLikeStatus, updateCommentsCount) {
    'use strict';

    $scope.updateLikeStatus = function(likesCount, hasLiked){
      if(updateLikeStatus){
        updateLikeStatus(likesCount, hasLiked);
      }
    };

    $scope.updateCommentsCount = function(totalComments){
      if(updateCommentsCount){
        updateCommentsCount(totalComments);
      }
    };

    $scope.post = post;
  });
