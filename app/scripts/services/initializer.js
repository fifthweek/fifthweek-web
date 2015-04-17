angular.module('webApp').factory('initializer',  function() {
    'use strict';

  // The purpose of this service is to make unit testing easier
  // when a controller initializes itself during construction.
  // If it initializes itself using this service we can mock it out
  // and test the initialization separately.
  // There is probably a better way of doing this....
  return {
    initialize: function(delegate) {
      delegate();
    }
  };
});
