angular.module('webApp').controller('informationHeaderCtrl',
  function($q, $scope, authenticationService, initializer, aggregateUserStateConstants) {
    'use strict';


    var internal = this.internal = {};

    internal.update = function(){
      $scope.isAuthenticated = authenticationService.currentUser.authenticated;
    };

    internal.initialize = function(){
      $scope.$on(aggregateUserStateConstants.updatedEvent, internal.update);

      internal.update();
    };

    initializer.initialize(internal.initialize);
  }
);
