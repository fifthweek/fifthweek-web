angular.module('webApp').controller('listChannelsCtrl', function($scope, $state, states) {
  'use strict';

  $scope.model = {
    channels: [
      {id:'a', name:'Base Channel', price:'0.99', description:['Backstage News Feed', 'Eternal Gratitude']},
      {id:'b', name:'Extras Channel', price:'0.75', description:['Weekly exclusive wallpapers', 'New side comic']},
      {id:'c', name:'HD Channel', price:'0.25', description:['Signed digital prints', 'Behind the scenes production videos', 'Behind the scenes photos']}
    ]
  }
});
