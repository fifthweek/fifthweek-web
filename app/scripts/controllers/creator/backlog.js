angular.module('webApp').controller('backlogCtrl',
  function($scope, $timeout) {
    'use strict';

    $scope.posts = [
      {
        //     postId: 'a',
        //     channelId: 'Base64Guid',
        //     collectionId: 'Base64Guid', /* optional */
        //     comment: '', /* optional */
        //     fileId: 'Base64Guid', /* optional */
        //     imageId: 'Base64Guid', /* optional */
        //     scheduledByQueue: false,
        //     liveDate: '2015-12-25T14:45:05Z'
        postId: 'a',
        liveIn:'1 day',
        dayOfWeek:'Wed',
        date:'21st Jan',
        comment:'Hang in there folks, nearly ready!',
        channel:'HD Channel',
        queued:false
      },
      {
        postId: 'b',
        liveIn:'3 days',
        dayOfWeek:'Fri',
        date:'23rd Jan',
        comment:'Looking good :-)',
        channel:'Everyone',
        queued:false
      },
      {
        postId: 'c',
        liveIn:'5 days',
        dayOfWeek:'Sun',
        date:'25th Jan',
        comment:'Almost there',
        collection:'Blog',
        imagePath:'images/home/bg/2048.jpg',
        queued:true
      },
      {
        postId: 'c',
        liveIn:'5 days',
        dayOfWeek:'Sun',
        date:'25th Jan',
        collection:'Side Comic',
        imagePath:'images/creator/landing-page/header-default.jpg',
        queued:false
      },
      {
        postId: 'd',
        liveIn:'6 days',
        dayOfWeek:'Mon',
        date:'26th Jan',
        comment:'Very nearly there',
        collection:'Blog',
        filePath:'images/avatar-default.png',
        queued:true
      },
      {
        postId: 'e',
        liveIn:'6 days',
        dayOfWeek:'Mon',
        date:'26th Jan',
        collection:'Side Comic',
        filePath:'images/avatar-default.png',
        queued:true
      }
    ];

    $scope.delete = function(postId) {

    };
  }
);
