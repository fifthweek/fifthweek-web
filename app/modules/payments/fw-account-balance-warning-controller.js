angular.module('webApp')
  .controller('fwAccountBalanceWarningCtrl',
  function($scope, accountSettingsRepositoryFactory, subscriptionRepositoryFactory, aggregateUserStateConstants) {
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
      model.accountBalance = accountSettings.accountBalance;
      model.isRetryingPayment = accountSettings.isRetryingPayment;
      model.paymentFailed = accountSettings.paymentStatus === 'Failed';
      model.hasPaymentInformation = accountSettings.hasPaymentInformation;

      model.hasFreeAccessBlogs = _.some(blogs, 'freeAccess');
      model.hasPaidBlogs = _.some(blogs, 'freeAccess', false);

      // Two way scope binding.
      $scope.displayingAccountBalanceWarning = model.accountBalance <= 0 && !model.isRetryingPayment && model.hasPaidBlogs;
    };

    internal.load = function(){
      var accountSettings;
      return accountSettingsRepository.getAccountSettings()
        .then(function(accountSettingsResult) {
          accountSettings = accountSettingsResult;
          return subscriptionRepository.getBlogs();
        })
        .then(function(blogs){
          return internal.updateModel(accountSettings, blogs);
        });
    };

    this.initialize = function() {
      $scope.$on(aggregateUserStateConstants.updatedEvent, internal.load);

      return internal.load()
        .then(function(){
          model.isLoaded = true;
        });
    };
  });
