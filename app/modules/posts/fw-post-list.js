angular.module('webApp')
  .constant('fwPostListConstants', {
    sources: {
      creatorBacklog: 'creator-backlog',
      creatorTimeline: 'creator-timeline'
    }
  })
  .directive('fwPostList', function (fwPostListConstants) {
  'use strict';

  return {
    restrict: 'E',
    scope: {
      source: '@'
    },
    require: ['fwPostList'],
    templateUrl: 'modules/posts/fw-post-list.html',
    controller: 'fwPostListCtrl',
    link: function(scope, element, attrs, ctrls) {

      scope.sourceName = _.startCase(scope.source);
      scope.sources = fwPostListConstants.sources;

      var controller = ctrls[0];
      controller.initialize();
    }
  };
});
