angular.module('webApp')
  .controller('AccountCtrl', function ($rootScope) {
		'use strict';

    //temporary page title solution
    //this should be coming from a service
    var brandName = 'Fifthweek';
    var pageTitle = 'My Account';
    $rootScope.pageTitle = pageTitle;
    $rootScope.headTitle = brandName + ' - ' + pageTitle;

  });
