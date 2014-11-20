angular.module('webApp').controller(
  'TokensManagerCtrl', ['$scope', 'tokensManagerService', 'toaster',
    function($scope, tokensManagerService, toaster) {
      'use strict';

      $scope.refreshTokens = [];

      tokensManagerService.getRefreshTokens().then(
        function(results) {
          $scope.refreshTokens = results.data;
        },
        function(error) {
          toaster.pop('error', 'Error', error.data.message);
        });

      $scope.deleteRefreshTokens = function(index, tokenid) {
        tokenid = window.encodeURIComponent(tokenid);
        tokensManagerService.deleteRefreshTokens(tokenid).then(
          function() {
            $scope.refreshTokens.splice(index, 1);
          }, 
          function(error) {
            toaster.pop('error', 'Error', error.data.message);
          });
      };
    }
  ]);