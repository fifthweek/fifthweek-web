'use strict';

var _ = require('lodash');
var HeaderPage = function() {};

HeaderPage.prototype = Object.create({}, {
  navbar: { get: function () { return element(by.id('header-navbar')); }},
  title: { get: function () { return element(by.id('header-title')); }},
  navigationList: { get: function () { return element(by.id('header-navbar')); }},
  navigationLinks: { get: function () { return element.all(by.css('#header-navbar a')); }},
  includeBasicTestsBase: { value: function(highlightedLink, links) {
    var self = this;

    describe('header', function() {
      it('should contain the correct number of links', function() {
        expect(self.navigationLinks.count()).toBe(links.length);
      });

      _.forEach(links, function(link) {
        it('should contain "' + link.name + '" link', function() {
          expect(link.element.isDisplayed()).toBe(true);
        });
      });

      if(highlightedLink){
        it('should highlight the current page', function() {
          expect(highlightedLink.getAttribute('class')).toContain('active');
        });
      }
    });
  }}

});

module.exports = HeaderPage;
