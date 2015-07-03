angular.module('webApp')
  .constant('fwRegisterInterestButtonConstants',{
    defaultTitle: 'Let\'s get started!',
    defaultButtonText: 'Register',
    defaultCallToAction: 'Create free account'
  })
  .directive('fwRegisterInterestButton',
  function ($modal, fwRegisterInterestButtonConstants) {
    'use strict';

    return {
      restrict: 'E',
      scope: {
        title: '@?',
        buttonText: '@?',
        callToAction: '@?',
        template: '@?'
      },
      replace: true,
      templateUrl: 'modules/information/fw-register-interest-button.html',
      link: function(scope) {

        var modalAttributes = {
          title: scope.title || fwRegisterInterestButtonConstants.defaultTitle,
          buttonText: scope.buttonText || fwRegisterInterestButtonConstants.defaultButtonText,
          template: scope.template
        };

        scope.callToAction = scope.callToAction || fwRegisterInterestButtonConstants.defaultCallToAction;

        scope.click = function(){
          return $modal
            .open({
              controller: 'registerInterestDialogCtrl',
              templateUrl: 'modules/information/register-interest-dialog.html',
              size: 'sm',
              animation: false,
              resolve: {
                attributes: function() { return modalAttributes; }
              }
            }).result;
        };
      }
    };
  });
