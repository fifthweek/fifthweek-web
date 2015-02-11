angular.module('webApp')
  .factory('domUtilities', function() {
  'use strict';

    var service = {};

    service.closest = function(tag, element, searchDepth) {
      if (isNaN(searchDepth)) {
        searchDepth = 5;
      }
      else if (searchDepth > 10) {
        throw new FifthweekError('Search depth too high; operation would be inefficient.');
      }
      else if (searchDepth-- <= 0) {
        throw new FifthweekError('Failed to locate ' + tag);
      }

      var parent = element.parent();
      var result = parent.find('input');
      if (result.length === 0) {
        return service.closest(tag, parent, searchDepth);
      }

      return result;
    };

    return service;
  });
