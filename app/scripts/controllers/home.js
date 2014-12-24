angular.module('webApp').controller(
  'HomeCtrl', function ($rootScope) {
    'use strict';

    //temporary page title solution
    //this should be coming from a service
    var brandName = 'Fifthweek';
    $rootScope.headTitle = brandName;

  });