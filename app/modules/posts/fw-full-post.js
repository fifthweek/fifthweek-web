angular.module('webApp')
  .directive('fwFullPost', function (landingPageConstants, fifthweekConstants) {
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

        scope.fifthweekConstants = fifthweekConstants;
        scope.landingPageConstants = landingPageConstants;

        scope.isDialog = !!scope.closeDialog;

        var controller = ctrls[0];
        controller.initialize();
      }
    };
  });
