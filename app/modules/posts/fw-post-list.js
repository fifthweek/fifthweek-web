angular.module('webApp')
  .constant('fwPostListConstants', {
    sources: {
      creatorBacklog: 'creator-backlog',
      creatorTimeline: 'creator-timeline'
    }
  })
  .directive('fwPostList', function (fwPostListConstants, fifthweekConstants) {
  'use strict';

  return {
    restrict: 'E',
    scope: {
      source: '@',
      userId: '@?'
    },
    require: ['fwPostList'],
    templateUrl: 'modules/posts/fw-post-list.html',
    controller: 'fwPostListCtrl',
    link: function(scope, element, attrs, ctrls) {

      scope.fifthweekConstants = fifthweekConstants;
      scope.sourceName = _.startCase(scope.source);
      scope.sources = fwPostListConstants.sources;

      var controller = ctrls[0];
      controller.initialize();
    }
  };
});
