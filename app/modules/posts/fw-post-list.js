angular.module('webApp')
  .constant('fwPostListConstants', {
    reloadEvent: 'reloadPostList',
    sources: {
      creatorBacklog: 'creator-backlog',
      creatorTimeline: 'creator-timeline',
      timeline: 'timeline',
      preview: 'preview'
    }
  })
  .directive('fwPostList', function (fwPostListConstants, fifthweekConstants, landingPageConstants) {
  'use strict';

  return {
    restrict: 'E',
    scope: {
      source: '@',
      userId: '@?',
      channelId: '@?'
    },
    require: ['fwPostList'],
    templateUrl: 'modules/posts/fw-post-list.html',
    controller: 'fwPostListCtrl',
    link: function(scope, element, attrs, ctrls) {

      scope.fifthweekConstants = fifthweekConstants;
      scope.sources = fwPostListConstants.sources;
      scope.landingPageConstants = landingPageConstants;

      var controller = ctrls[0];
      controller.initialize();
    }
  };
});
