angular.module('webApp').controller('backlogPostListCtrl',
  function($scope, postInteractions) {
    'use strict';

    $scope.posts = [
      {
        postId: 'a',
        liveIn:'1 day',
        dayOfWeek:'Wed',
        date:'21st Jan',
        comment:'Certain internet providers exploit the fact that fill text cannot be recognized by automatic search engines - meaningful information cannot be distinguished from meaningless: Target-generated dummy text mixed with a certain combination of search terms can lead to an increased frequency of visits by search machine users. As a consequence, advertising revenues, which rely on website hits, are increased.',
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
        fileName:'comic-ebook.pdf',
        queued:true
      },
      {
        postId: 'e',
        liveIn:'6 days',
        dayOfWeek:'Mon',
        date:'26th Jan',
        collection:'Side Comic',
        filePath:'images/avatar-default.png',
        fileName:'comic-ebook.pdf',
        queued:true
      }
    ];

    $scope.viewImage = function (post) {
      postInteractions.viewImage(post.imagePath, true);
    };

    $scope.edit = function(postId) {
      postInteractions.edit(postId, true);
    };

    $scope.delete = function(postId) {
      postInteractions.delete(postId, true);
    };
  }
);