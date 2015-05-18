'use strict';

var FeaturesPage = function() {};

FeaturesPage.prototype = Object.create({}, {
  getStartedTopLink: { get: function(){ return element(by.id('get-started-top'))}},
  getStartedBottomLink: { get: function(){ return element(by.id('get-started-bottom'))}}
});

module.exports = FeaturesPage;
