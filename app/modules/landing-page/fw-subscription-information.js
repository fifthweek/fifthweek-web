angular.module('webApp')
  .directive('fwSubscriptionInformation', function () {
    'use strict';

    return {
      restrict: 'E',
      scope: {
        username: '@',
        landingPageData: '=?'
      },
      require: ['fwSubscriptionInformation'],
      templateUrl: 'modules/landing-page/fw-subscription-information.html',
      controller: 'fwSubscriptionInformationCtrl',
      link: function(scope, element, attrs, ctrls) {
        var controller = ctrls[0];
        controller.initialize();
      }
    };
  });
