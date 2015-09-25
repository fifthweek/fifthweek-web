angular.module('webApp')
  .controller('becomeCreatorCtrl',
  function ($scope, $q, accountSettingsRepositoryFactory, accountSettingsStub, $state, states, authenticationService, fetchAggregateUserState) {
    'use strict';

    var model = {
      errorMessage: undefined
    };
    $scope.model = model;

    var internal = this.internal = {};

    var accountSettingsRepository = accountSettingsRepositoryFactory.forCurrentUser();

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
        .putCreatorInformation(userId, {})
        .then(function() {
          return accountSettingsRepository.setAccountSettings(model.accountSettings);
        })
        .then(function(){
          return internal.onAccountSettingsSaved(userId);
        });
    };
  });
