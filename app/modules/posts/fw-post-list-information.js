angular.module('webApp')
  .directive('fwPostListInformation', function (fwPostListConstants, fifthweekConstants) {
    'use strict';

    return {
      restrict: 'E',
      scope: {
        source: '@',
        userId: '@?'
      },
      require: ['fwPostListInformation'],
      templateUrl: 'modules/posts/fw-post-list-information.html',
      controller: 'fwPostListInformationCtrl',
      link: function(scope, element, attrs, ctrls) {

        scope.fifthweekConstants = fifthweekConstants;
        scope.sources = fwPostListConstants.sources;

        var controller = ctrls[0];
        controller.initialize();
      }
    };
  });
