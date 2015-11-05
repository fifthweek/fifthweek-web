angular.module('webApp')
  .controller('fwAccountBalanceWarningCtrl',
  function($scope, accountSettingsRepositoryFactory, subscriptionRepositoryFactory, aggregateUserStateConstants, errorFacade) {
    'use strict';

    var accountSettingsRepository = accountSettingsRepositoryFactory.forCurrentUser();
    var subscriptionRepository = subscriptionRepositoryFactory.forCurrentUser();

    var model = {
      isLoaded: false,
      errorMessage: undefined
    };

    $scope.model = model;

    var internal = this.internal = {};

    internal.updateModel = function(accountSettings, blogs){

      if(!accountSettings){
        model.accountBalance = 0;
        model.isRetryingPayment = false;
        model.paymentFailed = false;
        model.hasPaymentInformation = false;
      }
      else{
        model.accountBalance = accountSettings.accountBalance;
        model.isRetryingPayment = accountSettings.isRetryingPayment;
        model.paymentFailed = accountSettings.paymentStatus === 'Failed';
        model.hasPaymentInformation = accountSettings.hasPaymentInformation;
      }

      if(!blogs){
        model.hasFreeAccessBlogs = false;
        model.hasPaidBlogs = false;
      }
      else{
        model.hasFreeAccessBlogs = _.some(blogs, 'freeAccess');
        model.hasPaidBlogs = _.some(blogs, 'freeAccess', false);
      }

      // Two way scope binding.
      $scope.displayingAccountBalanceWarning = model.accountBalance <= 0 && !model.isRetryingPayment && model.hasPaidBlogs;
    };

    internal.reload = function(){
      accountSettingsRepository = accountSettingsRepositoryFactory.forCurrentUser();
      subscriptionRepository = subscriptionRepositoryFactory.forCurrentUser();

      return internal.load();
    };

    internal.load = function(){
      model.isLoaded = false;
      var accountSettings;
      return accountSettingsRepository.tryGetAccountSettings()
        .then(function(accountSettingsResult) {
          accountSettings = accountSettingsResult;
          return subscriptionRepository.tryGetBlogs();
        })
        .then(function(blogs){
          return internal.updateModel(accountSettings, blogs);
        })
        .catch(function(error){
          return errorFacade.handleError(error, function(message) {
            model.errorMessage = message;
          });
        })
        .finally(function(){
          model.isLoaded = true;
        });
    };

    this.initialize = function() {
      $scope.$on(aggregateUserStateConstants.updatedEvent, internal.reload);

      return internal.load();
    };
  });
