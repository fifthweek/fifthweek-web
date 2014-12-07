
angular.module('webApp')
  .controller('SignOutCtrl', ['$location', 'authenticationService', 'webSettings',
  	function($location, authenticationService, webSettings) {
		'use strict';
			authenticationService.signOut();
			$location.path(webSettings.successfulSignOutPath);
  	}
  ]);
