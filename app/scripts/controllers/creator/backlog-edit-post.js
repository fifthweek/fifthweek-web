angular.module('webApp').controller('backlogEditPostCtrl',
  function($scope, postId) {
    'use strict';

    var channels = [
      {
        name:'Everyone',
        value:'channel1' // Default channel
      },
      {
        name:'"Extras Channel" Only',
        value:'channel2'
      },
      {
        name:'"HD Channel" Only',
        value:'channel3'
      }
    ];

    var collections = [
      {
        name:'Blog',
        value:'collection1'
      },
      {
        name:'Wallpapers (HD Channel)',
        value:'collection2'
      },
      {
        name:'Side Comic (Extras Channel)',
        value:'collection3'
      }
    ];

    $scope.model = {
      isNote: false,
      isImage: false,
      isFile: false,
      note: 'Hang in there folks, nearly ready!',
      comment: 'Nearly there guys!',
      collections: collections,
      channels: channels,
      selectedCollection: collections[0],
      selectedChannel: channels[0]
    };

    if (postId === 'a') {
      $scope.model.isNote = true;
    }
    else if (postId === 'b') {
      $scope.model.isImage = true;
    }
    else {
      $scope.model.isFile = true;
    }
  }
);
