angular.module('webApp').directive('fwCheckUsernameAvailability', function($q, membershipStub, logService) {
  'use strict';

  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      var currentUsername;

      ctrl.$asyncValidators.username = function(modelValue) {

        if (ctrl.$pristine) {
          currentUsername = modelValue;
          return $q.when();
        }

        if (modelValue === currentUsername) {
          return $q.when();
        }

        if (ctrl.$isEmpty(modelValue)) {
          // consider empty model valid
          return $q.when();
        }

        var def = $q.defer();

        membershipStub.getUsernameAvailability(modelValue)
          .then(function() {
            def.resolve();
          })
          .catch(function(error) {
            if (error instanceof ApiError && error.response.status === 404) {
              def.reject();
            }
            else {
              logService.error(error);
              def.resolve();
            }
          });

        return def.promise;
      };
    }
  };
});
