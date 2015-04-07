angular.module('webApp').controller('queueReorderCtrl',
  function($scope, postInteractions) {
    'use strict';

    $scope.model = {
      collectionName: 'Wallpapers'
    };

    $scope.posts = [
      {
        postId: 'a',
        liveIn:'1 day',
        dayOfWeek:'Wed',
        date:'21st Jan',
        comment:'Certain internet providers exploit the fact that fill text cannot be recognized by automatic search engines - meaningful information cannot be distinguished from meaningless: Target-generated dummy text mixed with a certain combination of search terms can lead to an increased frequency of visits by search machine users. As a consequence, advertising revenues, which rely on website hits, are increased.',
        channel:'HD Channel',
      },
      {
        postId: 'b',
        liveIn:'3 days',
        dayOfWeek:'Fri',
        date:'23rd Jan',
        comment:'Looking good :-)',
        channel:'Everyone',
      },
      {
        postId: 'c',
        liveIn:'5 days',
        dayOfWeek:'Sun',
        date:'25th Jan',
        comment:'Almost there',
        collection:'Blog',
        imagePath:'/static/images/tmp-queue-thumb.jpg',
      },
      {
        postId: 'c',
        liveIn:'5 days',
        dayOfWeek:'Sun',
        date:'25th Jan',
        collection:'Side Comic',
        imagePath:'/static/images/tmp-queue-thumb-2.jpg',
      },
      {
        postId: 'd',
        liveIn:'6 days',
        dayOfWeek:'Mon',
        date:'26th Jan',
        comment:'Very nearly there',
        collection:'Blog',
        filePath:'/static/images/avatar-default.jpg',
        fileName:'comic-ebook.pdf'
      },
      {
        postId: 'd',
        liveIn:'6 days',
        dayOfWeek:'Mon',
        date:'26th Jan',
        comment:'Certain internet providers exploit the fact that fill text cannot be recognized by automatic search engines - meaningful information cannot be distinguished from meaningless: Target-generated dummy text mixed with a certain combination of search terms can lead to an increased frequency of visits by search machine users. As a consequence, advertising revenues, which rely on website hits, are increased.',
        collection:'Blog',
        filePath:'/static/images/avatar-default.jpg',
        fileName:'another-comic-ebook.pdf'
      },
      {
        postId: 'e',
        liveIn:'6 days',
        dayOfWeek:'Mon',
        date:'26th Jan',
        collection:'Side Comic',
        filePath:'/static/images/avatar-default.jpg',
        fileName:'something-different-ebook.pdf'
      }
    ];

    $scope.viewImage = function (post) {
      postInteractions.viewImage(post.image, post.imageSource);
    };

    $scope.editPost = function(post) {
      postInteractions.editPost(post);
    };

    $scope.deletePost = function(postId) {
      postInteractions.deletePost(postId);
    };
  }
);
