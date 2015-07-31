angular.module('webApp')
  .controller('objectLookupCtrl',
  function($scope, initializer, paymentsStub, errorFacade) {
    'use strict';


    var model = $scope.model = {
      isLoading: false,
      errorMessage: undefined
    };

    var internal = this.internal = {};

    internal.loadForm = function(){
      model.isLoading = true;

      return paymentsStub.getTransactions()
        .catch(function(error){
          return errorFacade.handleError(error, function(message) {
            model.errorMessage = message;
          });
        })
        .finally(function(){
          model.isLoading = false;
        });
    };

    internal.initialize = function(){
      return internal.loadForm();
    };

    initializer.initialize(internal.initialize);
  });
