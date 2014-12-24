angular.module('webApp')
  .controller('SignOutCtrl', ['$rootScope', '$location', 'authenticationService', 'fifthweekConstants',
  	function( $location, authenticationService, fifthweekConstants) {
		'use strict';

			authenticationService.signOut();
			$location.path(fifthweekConstants.signInPage);
  	}
  ]);
