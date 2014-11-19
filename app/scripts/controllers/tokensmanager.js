angular.module('webApp').controller(
  'TokensManagerCtrl', ['$scope', 'tokensManagerService', 'ngToast',
    function($scope, tokensManagerService, ngToast) {
      'use strict';

      $scope.refreshTokens = [];

      tokensManagerService.getRefreshTokens().then(
        function(results) {
          $scope.refreshTokens = results.data;
        },
        function(error) {
          ngToast.create({ content: error.data.message, class: 'danger' });
        });

      $scope.deleteRefreshTokens = function(index, tokenid) {
        tokenid = window.encodeURIComponent(tokenid);
        tokensManagerService.deleteRefreshTokens(tokenid).then(
          function() {
            $scope.refreshTokens.splice(index, 1);
          }, 
          function(error) {
            ngToast.create({ content: error.data.message, class: 'danger' });
          });
      };
    }
  ]);