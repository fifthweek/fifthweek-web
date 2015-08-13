angular.module('webApp')
  .controller('SignOutCtrl',
  	function($state, states, authenticationService) {
		'use strict';

			return authenticationService.signOut()
        .then(function(){
          $state.go(states.signIn.signIn.name, {}, { location: 'replace' });
        });
  	}
  );
