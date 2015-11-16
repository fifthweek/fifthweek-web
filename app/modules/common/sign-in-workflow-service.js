angular.module('webApp').factory('signInWorkflowService',
  function($q, $modal) {
    'use strict';

    var service = {};
    var internal = service.internal = {};

    internal.handleDialogError = function(error){
      if(error instanceof Error){
        return $q.reject(error);
      }

      return $q.when();
    };

    service.beginSignInWorkflow = function(){
      return $modal
        .open({
          controller: 'signInWorkflowDialogCtrl',
          templateUrl: 'modules/landing-page/sign-in-workflow-dialog.html',
          size: 'sm'
        }).result
        .catch(function(error){
          return internal.handleDialogError(error);
        });
    };

    return service;
  });
