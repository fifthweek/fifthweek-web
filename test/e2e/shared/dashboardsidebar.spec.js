'use strict';

var SidebarPage = require('../pages/sidebar.page.js');

var DashboardSidebarSpec = function() {};

DashboardSidebarSpec.prototype = {
  includeTests: function() {

    describe('sidebar', function() {

      it('should link to dashboard pages', function() {
        sidebar.links.then(function(actualLinks) {

          expect(actualLinks.length).toBe(sidebar.linkedPages.length);

          for (var i = 0; i < actualLinks.length; i++) {
            var expectedLink = sidebar.linkedPages[i];
            var actualLink = actualLinks[i];

            expect(actualLink.getText()).toEqual(expectedLink.title);
            expect(actualLink.getAttribute('href')).toMatch(new RegExp(expectedLink.pageUrl + "$"));
          }
        });
      });

      it('should highlight the current page only', function() {
        sidebar.links.then(function(actualLinks) {
          for (var i = 0; i < actualLinks.length; i++) {
            (function(){
              var actualLink = actualLinks[i];
              actualLink.getAttribute('href').then(function(linkHref) {
                browser.getCurrentUrl().then(function(currentUrl) {
                  var isLinkToCurrentPage = new RegExp(linkHref + "$").test(currentUrl);

                  if (isLinkToCurrentPage) {
                    expect(actualLink.getAttribute('class')).toContain('active');
                  }
                  else {
                    expect(actualLink.getAttribute('class')).not.toContain('active');
                  }
                });
              });
            })();
          }
        });
      });

      var sidebar = new SidebarPage();
    });

  }
};

module.exports = DashboardSidebarSpec;
