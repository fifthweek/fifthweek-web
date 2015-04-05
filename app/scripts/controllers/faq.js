angular.module('webApp').controller(
  'faqCtrl', [ '$scope', '$location', '$anchorScroll',
  function($scope, $location, $anchorScroll) {
    'use strict';

    $scope.learnMore = 'learn-more';

    $scope.onEnter = function anchorScroll(){
      $location.hash($scope.learnMore);
      $anchorScroll();
    };

  }
]);