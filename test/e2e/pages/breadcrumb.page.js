'use strict';

var _ = require('lodash');
var BreadcrumbPage = function() {};

BreadcrumbPage.prototype = Object.create({}, {
  includeTests: { value: function(pageTitles, returnToPage) {
    var getPageTitle = function(pageTitle) {
      return _.isFunction(pageTitle) ? pageTitle() : pageTitle;
    };

    var expectBreadcrumbText = function(count) {
      expect(element.all(by.css('#breadcrumb .item')).count()).toBe(count);
      for (var i = 0; i < count; i++) {
        var item = element(by.css('#breadcrumb .item:nth-child(' + (i + 1) + ')'));
        expect(item.getText()).toBe(getPageTitle(pageTitles[i]));
      }
    };

    describe('breadcrumb', function() {
      afterEach(returnToPage);

      it('should contain the correct text', function() {
        expectBreadcrumbText(pageTitles.length);
      });

      _.forEach(_.initial(pageTitles), function(pageTitle, index) {
        var preRuntimePageTitle = _.isFunction(pageTitle) ? '<dynamic>' : pageTitle;

        it('should contain "' + preRuntimePageTitle + '" link', function() {
          var link = element(by.css('#breadcrumb a.item:nth-child(' + (index + 1) + ')'));

          expect(link.getText()).toBe(getPageTitle(pageTitle));
        });

        if (index === 0) {
          it('should contain "' + preRuntimePageTitle + '" link, that navigates to the root ancestor', function() {
            var link = element(by.css('#breadcrumb a.item:nth-child(' + (index + 1) + ')'));
            link.click();

            expect(element.all(by.css('#breadcrumb')).count()).toBe(0);
          });
        }
        else {
          it('should contain "' + preRuntimePageTitle + '" link, that navigates to a non-root ancestor', function() {
            var link = element(by.css('#breadcrumb a.item:nth-child(' + (index + 1) + ')'));
            link.click();

            expectBreadcrumbText(index + 1);
          });
        }
      });
    });
  }}
});

module.exports = BreadcrumbPage;
