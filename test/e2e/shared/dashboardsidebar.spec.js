'use strict';

var SidebarPage = require('../pages/sidebar.page.js');

var DashboardSidebarSpec = function() {};

DashboardSidebarSpec.prototype = {
  includeTests: function() {

    describe('sidebar', function() {

      it('should link to dashboard pages', function() {
        sidebar.navigationLinks.then(function(actualLinks) {

          expect(actualLinks.length).toBe(expectedLinks.length);

          for (var i = 0; i < actualLinks.length; i++) {
            var expectedLink = expectedLinks[i];
            var actualLink = actualLinks[i];

            expect(actualLink.getText()).toEqual(expectedLink.title);
            expect(actualLink.getAttribute('href')).toMatch(new RegExp(expectedLink.href + "$"));
          }
        });
      });

      it('should highlight the current page only', function() {
        sidebar.navigationLinks.then(function(actualLinks) {
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

      var expectedLinks = [
        {title: 'Quick demo', href: '/dashboard'},
        {title: 'Provide feedback', href: '/dashboard/feedback'}]
    });

  }
};

module.exports = DashboardSidebarSpec;
