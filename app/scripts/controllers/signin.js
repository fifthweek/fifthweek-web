angular.module('webApp').controller(
  'SignInCtrl',
    function($rootScope, $scope, $location, authenticationService, fifthweekConstants, logService, utilities) {
      'use strict';

      //temporary page title solution
      //this should be coming from a service
      var brandName = 'Fifthweek';
      var pageTitle = 'Sign In';
      $scope.pageTitle = pageTitle;
      $rootScope.headTitle = brandName + ' - ' + pageTitle;

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
