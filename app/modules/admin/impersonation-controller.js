angular.module('webApp')
  .controller('impersonationCtrl',
  function($scope, initializer, paymentsStub, errorFacade, impersonationService) {
    'use strict';


    var model = $scope.model = {
      input: {
        userId: undefined
      }
    };

    var internal = this.internal = {};

    internal.initialize = function(){
    };

    $scope.stopImpersonating = function(){
      impersonationService.impersonate(undefined);
    };

    $scope.startImpersonating = function(){
      if(model.input.userId){
        impersonationService.impersonate(model.input.userId);
      }
    };

    initializer.initialize(internal.initialize);
  });
