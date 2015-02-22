angular.module('webApp').controller('backlogCtrl',
  function($scope) {
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
        liveIn:'1 day',
        dayOfWeek:'Wed',
        date:'21st Jan',
        bodyText:'Hang in there folks, nearly ready!',
        collection:'Side Comic',
        queued:true
      },
      {
        liveIn:'3 days',
        dayOfWeek:'Fri',
        date:'23rd Jan',
        bodyText:'Looking good :-)',
        collection:'Blog',
        queued:true
      },
      {
        liveIn:'5 days',
        dayOfWeek:'Sun',
        date:'25th Jan',
        bodyText:'Almost there',
        channel:'Everyone',
        queued:false
      },
      {
        liveIn:'6 days',
        dayOfWeek:'Mon',
        date:'26th Jan',
        bodyText:'Very nearly there',
        channel:'HD Channel',
        queued:true
      }
    ];
  }
);
