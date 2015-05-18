angular.module('webApp')
  .constant('fwRegisterInterestButtonConstants',{
    defaultTitle: 'Getting Started',
    defaultMessage: 'Please enter your details below:',
    defaultCallToAction: 'Get started for FREE'
  })
  .directive('fwRegisterInterestButton',
  function ($modal, fwRegisterInterestButtonConstants) {
    'use strict';

    return {
      restrict: 'E',
      scope: {
        title: '@?',
        message: '@?',
        callToAction: '@?'
      },
      replace: true,
      templateUrl: 'modules/information/fw-register-interest-button.html',
      link: function(scope) {

        scope.title = scope.title || fwRegisterInterestButtonConstants.defaultTitle;
        scope.message = scope.message || fwRegisterInterestButtonConstants.defaultMessage;
        scope.callToAction = scope.callToAction || fwRegisterInterestButtonConstants.defaultCallToAction;

        scope.click = function(){
          return $modal
            .open({
              controller: 'registerInterestDialogCtrl',
              templateUrl: 'modules/information/register-interest-dialog.html',
              size: 'sm',
              resolve: {
                title: function(){ return scope.title; },
                message: function(){ return scope.message; }
              }
            }).result;
        };
      }
    };
  });
