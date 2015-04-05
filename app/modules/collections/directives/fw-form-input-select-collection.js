angular.module('webApp').directive('fwFormInputSelectCollection', function () {
  'use strict';

  return {
    restrict: 'E',
    scope: {
      items:'=',
      selectedItem:'=',
      createNewCollectionDisabled:'=',
      createNewCollection:'&',
      id:'@'
    },
    templateUrl:'modules/collections/directives/form-input-select-collection.html'
  };
});
