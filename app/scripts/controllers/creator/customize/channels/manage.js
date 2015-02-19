angular.module('webApp').controller('manageChannelCtrl', function($scope, $state, states) {
  'use strict';

  $scope.delete = function() {
    $state.go(states.creators.customize.channels.name);
  };
});
