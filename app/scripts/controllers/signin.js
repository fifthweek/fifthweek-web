angular.module('webApp').controller(
  'SignInCtrl',
    function($scope, $location, authenticationService, fifthweekConstants, logService, utilities) {
      'use strict';

      $scope.signInData = {
        username: '',
        password: ''
      };

      $scope.message = '';

      $scope.signIn = function() {
        return authenticationService.signIn($scope.signInData).then(
          function() {
            $location.path(fifthweekConstants.dashboardPage);
          }).catch(function(error) {
            $scope.message = utilities.getFriendlyErrorMessage(error);
            return logService.error(error);
          });
      };
    }
  );
