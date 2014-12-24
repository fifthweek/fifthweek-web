angular.module('webApp')
  .controller('AccountCtrl', function ($rootScope, $scope) {
		'use strict';

    //temporary page title solution
    //this should be coming from a service
    var brandName = 'Fifthweek';
    var pageTitle = 'My Account';
    $scope.pageTitle = pageTitle;
    $rootScope.headTitle = brandName + ' - ' + pageTitle;

  });
