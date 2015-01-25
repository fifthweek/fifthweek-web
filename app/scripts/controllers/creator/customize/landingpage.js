angular.module('webApp').controller(
  'customizeLandingPageCtrl', ['$scope',
  function($scope) {
    'use strict';

    $scope.landingPageData = {
      url:'https://www.fifthweek.com/marc-holmes',
      subscriptionName:'',
      tagline:'',
      introduction:'',
      headerImage:'images/creator/landing-page/header-default.jpg',
      videoUrl:'',
      subscriptionAbout:''
    };


  }
]);
