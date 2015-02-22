angular.module('webApp').controller('backlogCtrl',
  function($scope) {
    'use strict';

    $scope.posts = [
      {
        scheduledDate:'Wednesday 21st Jan',
        bodyText:'Hang in there folks, nearly ready!',
        queued:false
      },
      {
        scheduledDate:'Friday 23rd Jan',
        bodyText:'Looking good :-)',
        queued:true
      },
      {
        scheduledDate:'Sunday 25th Jan',
        bodyText:'Almost there',
        queued:false
      }
    ];

  }
);
