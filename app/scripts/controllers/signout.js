angular.module('webApp')
  .controller('SignOutCtrl', ['$rootScope', '$location', 'authenticationService', 'fifthweekConstants',
  	function($rootScope, $location, authenticationService, fifthweekConstants) {
		'use strict';

      //temporary page title solution
      //this should be coming from a service
      var brandName = 'Fifthweek';
      var pageTitle = 'Sign Out';
      $rootScope.headTitle = brandName + ' - ' + pageTitle;

			authenticationService.signOut();
			$location.path(fifthweekConstants.signInPage);
  	}
  ]);
