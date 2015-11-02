angular.module('webApp')
  .directive('fwFullPost', function () {
    'use strict';

    return {
      restrict: 'E',
      scope: {
        post: '=?',
        postId: '@?',
        updateCommentsCount: '&?',
        updateLikeStatus: '&?',
        closeDialog: '&?'
      },
      require: ['fwFullPost'],
      templateUrl: 'modules/posts/fw-full-post.html',
      controller: 'fwFullPostCtrl',
      link: function(scope, element, attrs, ctrls) {
        var controller = ctrls[0];
        controller.initialize();
      }
    };
  });
