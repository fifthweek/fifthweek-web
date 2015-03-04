'use strict';

var HeaderPage = function() {};

HeaderPage.prototype = Object.create({}, {
  title: { get: function () { return element(by.id('header-title')); }},
  navigationList: { get: function () { return element(by.id('header-navbar')); }},
  navigationLinks: { get: function () { return element.all(by.css('#header-navbar a')); }},
  includeBasicTestsBase: { value: function(highlightedLink, links) {
    var self = this;

    describe('header', function() {
      it('should contain the correct number of links', function() {
        expect(self.navigationLinks.count()).toBe(links.length);
      });

      for (var i = 0; i < links.length; i++) {
        var link = links[i];
        it('should link to ' + link.name, function() {
          expect(link.element.isDisplayed()).toBe(true);
        });
      }

      if(highlightedLink){
        it('should highlight the current page', function() {
          expect(highlightedLink.getAttribute('class')).toContain('active');
        });
      }
    });
  }}

});

module.exports = HeaderPage;
