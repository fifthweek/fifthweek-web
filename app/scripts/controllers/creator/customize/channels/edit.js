angular.module('webApp').controller('editChannelCtrl', function($scope, $state, states) {
  'use strict';

  $scope.delete = function() {
    $state.go(states.creators.customize.channels.name);
  };
});
