'use strict';

var composeNotePage = function() {};

composeNotePage.prototype = Object.create({}, {
  pageUrl: { get: function () { return '/creators/compose/note'; }}
});

module.exports = composeNotePage;
