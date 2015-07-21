angular.module('webApp')
  .controller('updatePaymentInformationCtrl',
  function($scope, initializer, accountSettingsRepositoryFactory, paymentsStub, errorFacade, fetchAggregateUserState, aggregateUserStateConstants) {
    'use strict';

    var accountSettingsRepository = accountSettingsRepositoryFactory.forCurrentUser();
    var model = {
      errorMessage: undefined,
      hasPaymentInformation: true,
      userId: accountSettingsRepository.getUserId()
    };
    $scope.model = model;

    var internal = this.internal = {};

    internal.loadForm = function(){

      return accountSettingsRepository.getAccountSettings()
        .then(function(data){
          model.hasPaymentInformation = data.hasPaymentInformation;
        })
        .catch(function(error){
          model.hasPaymentInformation = true;
          return errorFacade.handleError(error, function(message) {
            model.errorMessage = message;
          });
        });
    };

    internal.initialize = function(){
      $scope.$on(aggregateUserStateConstants.updatedEvent, internal.loadForm);

      return internal.loadForm();
    };

    $scope.deletePaymentInformation = function(){
      return paymentsStub.deletePaymentInformation(model.userId)
        .then(function(){
          return fetchAggregateUserState.updateFromServer(model.userId);
        })
        .catch(function(error){
          model.hasPaymentInformation = true;
          return errorFacade.handleError(error, function(message) {
            model.errorMessage = message;
          });
        });
    };

    initializer.initialize(internal.initialize);

  });
