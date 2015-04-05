angular.module('webApp')
  .controller('SignOutCtrl',
  	function($state, states, authenticationService) {
		'use strict';

			authenticationService.signOut();
			$state.go(states.signIn.name, {}, { location: 'replace' });
  	}
  );
