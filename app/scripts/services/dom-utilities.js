angular.module('webApp')
  .factory('domUtilities', function() {
  'use strict';

    var service = {};

    // tag must be uppercase
    service.ancestor = function(tag, element, searchDepth) {
      if (isNaN(searchDepth)) {
        searchDepth = 10;
      }
      else if (searchDepth-- <= 0) {
        return null;
      }

      var parent = element.parent();
      if (parent.prop('tagName') !== tag) {
        return service.ancestor(tag, parent, searchDepth);
      }

      return parent;
    };

    return service;
  });
