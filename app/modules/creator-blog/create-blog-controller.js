angular.module('webApp').controller('createBlogCtrl',
  function($scope, $state, calculatedStates, blogService) {
    'use strict';

    $scope.newBlogData = {
       name: '',
       tagline: '',
       basePrice: '1.00'
    };

    var buildDTO = function() {
      var newBlogData = _.cloneDeep($scope.newBlogData);
      newBlogData.basePrice = Math.round(newBlogData.basePrice * 100);
      return newBlogData;
    };

    $scope.continue = function() {
      return blogService.createFirstBlog(buildDTO()).then(function() {
        $state.go(calculatedStates.getDefaultState());
      });
    };
  }
);
