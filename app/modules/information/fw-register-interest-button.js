angular.module('webApp').directive('fwRegisterInterestButton',
  function ($modal) {
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

        scope.message = scope.message || 'Please enter your details below:';
        scope.title = scope.title || 'Getting Started';
        scope.callToAction = scope.callToAction || 'Get started for FREE';

        scope.click = function(){
          return $modal
            .open({
              controller: 'registerInterestDialogCtrl',
              templateUrl: 'modules/information/register-interest-dialog.html',
              size: 'sm',
              scope: scope,
              resolve: {
                title: function(){ return scope.title; },
                message: function(){ return scope.message; }
              }
            }).result;
        };
      }
    };
  });
