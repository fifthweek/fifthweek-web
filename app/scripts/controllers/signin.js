angular.module('webApp').controller(
  'SignInCtrl', ['$scope', '$location', 'authService', 'webSettings',
    function($scope, $location, authService, webSettings) {
      'use strict';

      $scope.signInData = {
        username: '',
        password: '',
      };

      $scope.message = '';

      $scope.signIn = function() {
        return authService.signIn($scope.signInData).then(
          function() {
            $location.path(webSettings.successfulSignInPath);
          },
          function(err) {
            $scope.message = err.error_description;
          });
      };

      $scope.authExternalProvider = function(provider) {
        var redirectUri = location.protocol + '//' + location.host + '/authcomplete.html';

        var externalProviderUrl = webSettings.apiBaseUri +
          'api/account/initiateExternalSignIn?provider=' +
          provider +
          '&response_type=token&client_id=' +
          webSettings.clientId +
          '&redirect_uri=' +
          redirectUri;

        window.$windowScope = $scope;
        window.open(
          externalProviderUrl,
          'Authenticate Account',
          'location=0,status=0,width=600,height=750');
      };

      $scope.authCompletedCallback = function(fragment) {
        $scope.$apply(function() {
          if (fragment.hasLocalAccount === 'False') {

            authService.signOut();

            authService.externalAuthData = {
              provider: fragment.provider,
              username: fragment.externalUsername,
              externalAccessToken: fragment.externalAccessToken
            };

            $location.path('/associate');
          } else {
            //Obtain access token and redirect to orders
            var externalData = {
              provider: fragment.provider,
              externalAccessToken: fragment.externalAccessToken
            };
            authService.obtainAccessToken(externalData).then(
              function() {
                $location.path('/orders');
              },
              function(err) {
                $scope.message = err.error_description;
              });
          }
        });
      };
    }
  ]);