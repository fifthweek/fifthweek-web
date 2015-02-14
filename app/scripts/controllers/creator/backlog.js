angular.module('webApp').controller('backlogCtrl',
  function($scope) {
    'use strict';

    $scope.posts = [
      {
        scheduledDate:'Wednesday 21st Jan',
        bodyText:'Hang in there folks, nearly ready!',
        stored:{
          calendar:true,
          funnel:false
        }
      },
      {
        scheduledDate:'Friday 23rd Jan',
        bodyText:'Looking good :-)',
        stored:{
          calendar:false,
          funnel:true
        }
      },
      {
        scheduledDate:'Sunday 25th Jan',
        bodyText:'Almost there',
        stored:{
          calendar:true,
          funnel:false
        }
      }
    ];

  }
);
