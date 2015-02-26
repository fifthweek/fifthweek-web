angular.module('webApp').controller('backlogPostListCtrl',
  function($scope, $sanitize, postInteractions, $sce) {
    'use strict';

    $scope.posts = [
      {
        postId: 'a',
        liveIn:'1 day',
        dayOfWeek:'Wed',
        date:'21st Jan',
        comment:'Driving out of Madrid, on my last visit two years ago, I got a glimpse of a corner and an overwhelming feeling I’d like to come here again, not just to Madrid but to that exact spot. Just something about it.' +
          '\nOccasionally a vision of that corner would come back. A tall building on the left, a hill down out from the busy plazas, the Royal Palace, the cathedral and churches, the Gran Via, Sol. Another Madrid, a place it might better to live than visit.' +
          '\nI needed to work out where and began looking at maps, driving round the city on Google Street View from The Palace, through the area round what was then the building site of San Miguel Market, down Calle Atocha, never finding the right hill. I began to think I’d imagined the whole thing, perhaps I’d seen my corner in a dream.' +
          '\nThis Madrid trip, I stayed in a little flat high above Calle Mayor and my first morning decided to turn right towards an area I didn’t know rather than left towards an area I did. Crossing the high glass walled Viaducto de Segovia in search of breakfast I looked down on a street I was sure was the right one, even though it was a quarter of a mile from where I thought it should be. After a breakfast I worked my way slowly round and here is the corner, on Calle Segovia, on a hill steeper than the photo looks but exactly as I drove in my memory. You can scroll/look back up now.' +
          '\n<em>This should be correctly escaped!</em>',
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
        collectionId:'a',
        imagePath:'images/home/bg/2048.jpg',
        queued:true
      },
      {
        postId: 'c',
        liveIn:'5 days',
        dayOfWeek:'Sun',
        date:'25th Jan',
        collection:'Side Comic',
        collectionId:'b',
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
        collectionId:'a',
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
        collectionId:'b',
        filePath:'images/avatar-default.png',
        fileName:'comic-ebook.pdf',
        queued:true
      }
    ];

    var convertMarkdownToTrustedHtml = function(markdown) {
      if (!markdown) {
        return;
      }

      var sanitizedMarkdown = $sanitize(markdown);
      var html = '<p>' + sanitizedMarkdown.replace(/\n/g, '</p><p>') + '</p>';
      return $sce.trustAsHtml(html);
    };

    _.forEach($scope.posts, function(post) {
      post.trustedCommentHtml = convertMarkdownToTrustedHtml(post.comment);
    });

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
