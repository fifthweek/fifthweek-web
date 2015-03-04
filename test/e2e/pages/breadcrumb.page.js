'use strict';

var BreadcrumbPage = function() {};

BreadcrumbPage.prototype = Object.create({}, {
  includeTests: { value: function(pageTitles, returnToPage) {
    var expectBreadcrumbText = function(count) {
      expect(element.all(by.css('#breadcrumb .item')).count()).toBe(count);
      for (var i = 0; i < count; i++) {
        var item = element(by.css('#breadcrumb .item:nth-child(' + (i + 1) + ')'));
        expect(item.getText()).toBe(pageTitles[i]);
      }
    };

    describe('breadcrumb', function() {
      afterEach(returnToPage);

      it('should contain the correct text', function() {
        expectBreadcrumbText(pageTitles.length);
      });

      for (var i = 0; i < pageTitles.length - 1; i++) {
        var index = i;
        var pageTitle = pageTitles[i];

        it('should contain "' + pageTitle + '" link', function() {
          var link = element(by.css('#breadcrumb a.item:nth-child(' + (index + 1) + ')'));

          expect(link.getText()).toBe(pageTitle);
        });

        if (index === 0) {
          it('should contain "' + pageTitle + '" link, that navigates to the root ancestor', function() {
            var link = element(by.css('#breadcrumb a.item:nth-child(' + (index + 1) + ')'));
            link.click();

            expect(element.all(by.css('#breadcrumb')).count()).toBe(0);
          });
        }
        else {
          it('should contain "' + pageTitle + '" link, that navigates to a non-root ancestor', function() {
            var link = element(by.css('#breadcrumb a.item:nth-child(' + (index + 1) + ')'));
            link.click();

            expectBreadcrumbText(index + 1);
          });
        }
      }
    });
  }}
});

module.exports = BreadcrumbPage;
