
angular.module('webApp')
  .controller('SignOutCtrl', ['$location', 'authService', 'webSettings',
  	function($location, authService, webSettings) {
		'use strict';
			authService.signOut();
			$location.path(webSettings.successfulSignOutPath);
  	}
  ]);
