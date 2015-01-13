angular.module('webApp').controller(
  'faqCtrl', [ '$scope', '$location', '$anchorScroll',
  function($scope, $location, $anchorScroll) {
    'use strict';

    $scope.onEnter = function anchorScroll(){
      $location.hash('learn-more');
      $anchorScroll();
    };

  }
]);

