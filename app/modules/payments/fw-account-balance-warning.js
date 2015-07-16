angular.module('webApp')
  .directive('fwAccountBalanceWarning', function (fifthweekConstants) {
    'use strict';

    return {
      restrict: 'E',
      scope: {
        displayingAccountBalanceWarning: '='
      },
      require: ['fwAccountBalanceWarning'],
      templateUrl: 'modules/payments/fw-account-balance-warning.html',
      controller: 'fwAccountBalanceWarningCtrl',
      link: function(scope, element, attrs, ctrls) {

        scope.fifthweekConstants = fifthweekConstants;

        var controller = ctrls[0];
        controller.initialize();
      }
    };
  });
