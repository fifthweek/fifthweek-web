angular.module('webApp')
  .directive('fwPostSubscriptionInformation', function () {
    'use strict';

    return {
      restrict: 'E',
      scope: {
        username: '@',
        requiredChannelId: '@'
      },
      require: ['fwPostSubscriptionInformation'],
      templateUrl: 'modules/landing-page/fw-post-subscription-information.html',
      controller: 'fwSubscriptionInformationCtrl',
      link: function(scope, element, attrs, ctrls) {
        var controller = ctrls[0];
        controller.initialize();
      }
    };
  });
