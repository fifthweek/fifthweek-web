angular.module('webApp')
  .controller('SignOutCtrl',
  	function($state, states, authenticationService, fetchAggregateUserState) {
		'use strict';

			return fetchAggregateUserState.waitForExistingUpdate()
        .then(function() {
          return authenticationService.signOut();
        })
        .then(function(){
          $state.go(states.signIn.signIn.name, {}, { location: 'replace' });
        });
  	}
  );
