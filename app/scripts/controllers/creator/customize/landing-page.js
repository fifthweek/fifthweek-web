angular.module('webApp').controller(
  'customizeLandingPageCtrl', ['$scope',
  function($scope, $analytics) {
    'use strict';

    $scope.isSubmitting = false;

    $scope.landingPageData = {
      url:'https://www.fifthweek.com/marc-holmes',
      subscriptionName:'',
      tagline:'',
      introduction:'',
      headerImage:'images/creator/landing-page/header-default.jpg',
      videoUrl:'',
      subscriptionAbout:''
    };

    $scope.saveTheDataTempFunctionName = function() {
      $scope.isSubmitting = true;

      /*
      var eventCategory = function() {
        return {category: 'Customize Landing Page'};
      };

      $analytics.eventTrack('Landing Page Form submitted', eventCategory());
      */


    };

  }
]);
