angular.module('webApp')
  .constant('fwUpdatePaymentInformationConstants', {
    modes: {
      paymentInformation: 'paymentInformation',
      countryVerification: 'countryVerification',
      transactionVerification: 'transactionVerification',
      countryFailure: 'countryFailure',
      success: 'success'
    }
  })
  .directive('fwUpdatePaymentInformation', function (fifthweekConstants, fwUpdatePaymentInformationConstants) {
    'use strict';

    return {
      restrict: 'E',
      scope: {
      },
      require: ['fwUpdatePaymentInformation'],
      templateUrl: 'modules/payments/fw-update-payment-information.html',
      controller: 'fwUpdatePaymentInformationCtrl',
      link: function(scope, element, attrs, ctrls) {

        scope.fifthweekConstants = fifthweekConstants;
        scope.modes = fwUpdatePaymentInformationConstants.modes;

        var controller = ctrls[0];
        controller.initialize();
      }
    };
  });
