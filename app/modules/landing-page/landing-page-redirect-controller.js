angular.module('webApp').controller('landingPageRedirectCtrl',
  function($scope, $state, states, accountSettingsRepositoryFactory) {
    'use strict';
    var accountSettingsRepository = accountSettingsRepositoryFactory.forCurrentUser();

    accountSettingsRepository.getAccountSettings()
      .then(function(accountSettings) {
        $state.go(states.landingPage.name, { username: accountSettings.username });
      });
  });
