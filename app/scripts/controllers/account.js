angular.module('webApp')
  .controller('AccountCtrl', function ($scope, $rootScope) {
		'use strict';
    $rootScope.secondaryNav = true;
    $scope.test = 1;
  });
