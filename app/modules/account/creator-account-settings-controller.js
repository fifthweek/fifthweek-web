angular.module('webApp')
  .controller('creatorAccountSettingsCtrl',
  function ($scope, $q, initializer, accountSettingsRepositoryFactory, accountSettingsStub, $state, states, errorFacade, authorizationService, authorizationServiceConstants, authenticationService, authenticationServiceConstants, fetchAggregateUserState) {
    'use strict';

    var model = {
      isCreator: false,
      accountSettings: undefined,
      errorMessage: undefined
    };
    $scope.model = model;

    var internal = this.internal = {};

    var accountSettingsRepository = accountSettingsRepositoryFactory.forCurrentUser();

    internal.setIsCreator = function(){
      var creatorAuthorization = authorizationService.authorize(true, [authenticationServiceConstants.roles.creator]);
      model.isCreator = creatorAuthorization === authorizationServiceConstants.authorizationResult.authorized;
    };

    internal.loadForm = function(){
      internal.setIsCreator();

      return accountSettingsRepository.getAccountSettings()
        .then(function(data){
          model.accountSettings = data;
        })
        .catch(function(error){
          model.accountSettings = undefined;
          return errorFacade.handleError(error, function(message) {
            model.errorMessage = message;
          });
        });
    };

    internal.updateCreatorStatus = function(userId){
      return fetchAggregateUserState.updateInParallel(userId, authenticationService.refreshToken)
        .then(function(){
          $state.go(states.creator.createBlog.name);
        });
    };

    internal.onAccountSettingsSaved = function(userId){
      if(model.isCreator){
        $scope.form.$setPristine();
        return $q.when();
      }
      else {
        return internal.updateCreatorStatus(userId);
      }
    };

    $scope.submitForm = function() {
      var userId = accountSettingsRepository.getUserId();
      return accountSettingsStub
        .putCreatorInformation(userId, {
          name: model.accountSettings.name
        })
        .then(function() {
          return accountSettingsRepository.setAccountSettings(model.accountSettings);
        })
        .then(function(){
          return internal.onAccountSettingsSaved(userId);
        });
    };

    initializer.initialize(internal.loadForm);
  });
