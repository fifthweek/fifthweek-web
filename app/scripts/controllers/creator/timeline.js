angular.module('webApp').controller('timelineCtrl',
  function($scope, $sanitize, postInteractions) {
    'use strict';

    $scope.model = {
      subscribed: false,
      channels: {
        basic: {
          title:'Basic',
          price:'0.50',
          checked:true
        },
        extras: {
          title:'Extras',
          price:'0.75',
          checked:false
        },
        superExtras: {
          title:'Super Extras',
          price:'9.25',
          checked:false
        }
      },
      posts: [
        {
          postId: 'a',
          liveIn:'1 day',
          dayOfWeek:'Wed',
          comment:'Caused by what? What else - the government’s brilliant decision to close down, for 16 hours, a section of our already perennially-clogged main thoroughfare EDSA in order to commemorate the anniversary of the 1986 People Power Revolution that overthrew the dictator Ferdinand Marcos. Without actually canceling work. The irony is so obvious and on so many levels, it’s hard to start writing about. Meanwhile, millions of workers around the city are either stuck on the road or have given up and returned or stayed home.' +
          '\n\nOccasionally a vision of that corner would come back. A tall building on the left, a hill down out from the busy plazas, the Royal Palace, the cathedral and churches, the Gran Via, Sol. Another Madrid, a place it might better to live than visit.' +
          '\n\nI needed to work out where and began looking at maps, driving round the city on Google Street View from The Palace, through the area round what was then the building site of San Miguel Market, down Calle Atocha, never finding the right hill. I began to think I’d imagined the whole thing, perhaps I’d seen my corner in a dream.' +
          '\n\nThis Madrid trip, I stayed in a little flat high above Calle Mayor and my first morning decided to turn right towards an area I didn’t know rather than left towards an area I did. Crossing the high glass walled Viaducto de Segovia in search of breakfast I looked down on a street I was sure was the right one, even though it was a quarter of a mile from where I thought it should be. After a breakfast I worked my way slowly round and here is the corner, on Calle Segovia, on a hill steeper than the photo looks but exactly as I drove in my memory. You can scroll/look back up now.' +
          '\n\nSinge line...' +
          '\n... spacing.' +
          '\n\n**Strong** *emphasized* `code`...' +
          '\n<script>alert("hey");</script>',
          channel:'HD Channel',
          dayGrouping:'Sunday, Mar 1'
        },
        {
          postId: 'b',
          liveIn:'3 days',
          dayOfWeek:'Fri',
          date:'23rd Jan',
          comment:'Looking good :-)',
          channel:'Everyone',
          dayGrouping:'Saturday, Feb 28'
        },
        {
          postId: 'c',
          liveIn:'5 days',
          dayOfWeek:'Sun',
          date:'25th Jan',
          comment:'Almost there',
          collection:'Blog',
          collectionId:'a',
          imagePath:'images/home/bg/2048.jpg'
        },
        {
          postId: 'c',
          liveIn:'5 days',
          dayOfWeek:'Sun',
          date:'25th Jan',
          collection:'Side Comic',
          collectionId:'b',
          imagePath:'images/creator/landing-page/header-default.jpg',
          dayGrouping:'Friday, Feb 27'
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
          dayGrouping:'Thursday, Feb 26'
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
          dayGrouping:'Wednesday, Feb 25'
        }
      ]
    };


    $scope.viewImage = function (post) {
      postInteractions.viewImage(post.imagePath, true);
    };

    $scope.edit = function(postId) {
      postInteractions.edit(postId, true);
    };

    $scope.delete = function(postId) {
      postInteractions.delete(postId, true);
    };

    $scope.subscribe = function() {
      $scope.model.subscribed = true;
    };

    $scope.$watch('modal.channels', function() {

      $scope.model.totalPrice = _($scope.model.channels)
        .filter(function(channel) {
          return channel.checked === true;
        })
        .reduce(function(sum, channel) {
          return sum + parseFloat(channel.price); },
        0)
        .toFixed(2);

    }, true);
  }
);
