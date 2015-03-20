(function(){
  'use strict';

  var CreatorTimelinePage = function() {};

  CreatorTimelinePage.prototype = Object.create({}, {
    fifthweekLink: { get: function() { return element(by.css('.fifthweek-logo-sm a')); }},
    subscribeButton: { get: function() { return element(by.id('subscribe-button')); }}
  });

  module.exports = CreatorTimelinePage;

})();
