angular.module('webApp')
  .controller('fwUpdatePaymentInformationCtrl',
  function($scope, $state, $q, accountSettingsRepositoryFactory, stripeService, paymentsStub, fetchAggregateUserState, fwUpdatePaymentInformationConstants, errorFacade, authenticationService, authenticationServiceConstants) {
    'use strict';

    var accountSettingsRepository = accountSettingsRepositoryFactory.forCurrentUser();

    var model = {
      isLoaded: false,
      errorMessage: undefined,
      userId: accountSettingsRepository.getUserId(),
      mode: fwUpdatePaymentInformationConstants.modes.paymentInformation,
      input: {
        creditCardNumber: '',
        expiry: '',
        cvc: ''
      },
      creditRequestSummary: undefined
    };

    $scope.model = model;

    var internal = this.internal = {
      token: undefined,
      paymentOrigin: undefined
    };

    internal.createFailedToDetermineCountryError = function(){
      return new FifthweekError(
        'Failed to determine country with three pieces of evidence: ' +
        internal.paymentOrigin.countryCode + ', ' +
        internal.paymentOrigin.creditCardPrefix + ', ' +
        internal.paymentOrigin.ipAddress + ', for user ' +
        model.userId);
    };

    internal.getCreditRequestSummary = function(selfCertifiedCountryCode){
      internal.paymentOrigin = {
        stripeToken: internal.token.id,
        countryCode: selfCertifiedCountryCode,
        creditCardPrefix: model.input.creditCardNumber.substring(0, 6),
        ipAddress: internal.token.client_ip
      };

      return paymentsStub.getCreditRequestSummary(
        model.userId,
        internal.paymentOrigin.countryCode,
        internal.paymentOrigin.creditCardPrefix,
        internal.paymentOrigin.ipAddress)
        .then(function(response){
          model.creditRequestSummary = response.data;

          if(model.creditRequestSummary.calculation.countryName){
            model.mode = fwUpdatePaymentInformationConstants.modes.transactionVerification;
          }
          else if(!selfCertifiedCountryCode){
            model.mode = fwUpdatePaymentInformationConstants.modes.countryVerification;
          }
          else{
            return $q.reject(internal.createFailedToDetermineCountryError());
          }

          return $q.when();
        });
    };

    internal.handleError = function(error) {
      model.input.cvc = '';
      model.creditRequestSummary = undefined;
      internal.token = undefined;
      internal.paymentOrigin = undefined;
      model.mode = fwUpdatePaymentInformationConstants.modes.paymentInformation;
      return errorFacade.handleError(error, function(message) {
        model.errorMessage = message;
      });
    };

    internal.stripeResponseHandler = function(status, response){
      if (response.error){
        model.errorMessage = response.error.message;
        return $q.when();
      }

      internal.token = response;
      return internal.getCreditRequestSummary(undefined)
        .catch(internal.handleError);
    };

    internal.isStandardUser = function(){
      var currentUser = authenticationService.currentUser;
      return !_.includes(currentUser.roles, authenticationServiceConstants.roles.testUser);
    };

    $scope.confirmCountry = function(countryCode) {
      return internal.getCreditRequestSummary(countryCode)
        .catch(internal.handleError);
    };

    $scope.failConfirmCountry = function() {
      model.mode = fwUpdatePaymentInformationConstants.modes.countryFailure;
    };

    $scope.confirmTransaction = function(){
      return paymentsStub.putPaymentOrigin(model.userId, internal.paymentOrigin)
        .then(function(){
          var data = {
            amount: model.creditRequestSummary.calculation.amount,
            expectedTotalAmount: model.creditRequestSummary.calculation.totalAmount
          };

          return paymentsStub.postCreditRequest(model.userId, data);
        })
        .then(function(){
          return fetchAggregateUserState.updateFromServer(model.userId);
        })
        .catch(internal.handleError);
    };

    $scope.cancel = function(){
      $state.reload();
    };

    $scope.submit = function() {
      var isStandardUser = internal.isStandardUser();

      var expiryParts = model.input.expiry.split('/');
      return stripeService.createToken(
        isStandardUser,
        model.input.creditCardNumber,
        model.input.cvc,
        expiryParts[0],
        expiryParts[1],
        internal.stripeResponseHandler)
        .catch(internal.handleError);
    };

    this.initialize = function() {
      return accountSettingsRepository.getAccountSettings()
        .then(function(accountSettings){
          model.hasPaymentInformation = accountSettings.hasPaymentInformation;
          model.hasPaymentFailed = accountSettings.paymentStatus === 'Failed';
          model.email = accountSettings.email;
        })
        .finally(function(){
          model.isLoaded = true;
        });
    };
  });
