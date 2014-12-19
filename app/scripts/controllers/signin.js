angular.module('webApp').controller(
  'SignInCtrl',
    function($scope, $location, authenticationService, fifthweekConstants, logService) {
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
          }).catch(function(err) {
            if(err instanceof ApiError)
            {
              $scope.message = err.message;
            }
            else
            {
              $scope.message = fifthweekConstants.unexpectedErrorText;
              return logService.log('error', err);
            }
          });
      };
    }
  );
