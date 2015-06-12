angular.module('webApp')
  .directive('fwPostListHeader', function (fifthweekConstants)
   {
    'use strict';

    return {
      restrict: 'E',
      scope: {
        source: '@',
        userId: '@?',
        collectionId: '@?',
        channelId: '@?'
      },
      require: ['fwPostListHeader'],
      templateUrl: 'modules/posts/fw-post-list-header.html',
      controller: 'fwPostListHeaderCtrl',
      link: function(scope, element, attrs, ctrls) {

        scope.fifthweekConstants = fifthweekConstants;

        var controller = ctrls[0];
        controller.initialize();
      }
    };
  });
