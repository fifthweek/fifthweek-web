angular.module('webApp').directive('username', function($q, $timeout) {
  'use strict';

  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$asyncValidators.username = function(modelValue) {

        if (ctrl.$isEmpty(modelValue)) {
          // consider empty model valid
          return $q.when();
        }

        var def = $q.defer();

        $timeout(function() {
          // Mock a delayed response
          //if (usernames.indexOf(modelValue) === -1) {
            // The username is available
            def.resolve();
          //} else {
          //  def.reject();
          //}

        }, 100);

        return def.promise;
      };
    }
  };
});
