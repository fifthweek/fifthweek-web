angular.module('webApp').controller('createBlogCtrl',
  function($scope, $state, blogService, states) {
    'use strict';

    $scope.newBlogData = {
       name: '',
       basePrice: '0.50'
    };

    var buildDTO = function() {
      var newBlogData = _.cloneDeep($scope.newBlogData);
      newBlogData.basePrice = Math.round(newBlogData.basePrice * 100);
      return newBlogData;
    };

    $scope.continue = function() {
      return blogService.createFirstBlog(buildDTO()).then(function() {
        $state.go(states.creator.posts.live.name);
      });
    };
  }
);
