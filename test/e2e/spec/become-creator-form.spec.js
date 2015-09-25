var CommonWorkflows = require('../common-workflows.js');
var CreatorAccountSettingsPage = require('../pages/become-creator.page.js');
var SidebarPage = require('../pages/sidebar.page.js');
var CreateBlogPage = require('../pages/creators/create-blog.page.js');

describe('creator account settings form', function() {
  'use strict';

  var registration;

  var commonWorkflows = new CommonWorkflows();
  var page = new CreatorAccountSettingsPage();
  var sidebar = new SidebarPage();
  var createBlogPage = new CreateBlogPage();

  describe('when not a creator', function(){
    var navigateToPage = function() {
      registration = commonWorkflows.registerAsConsumer();
      sidebar.publishLink.click();
    };

    describe('when validating page behaviour', function(){

      it('should run once before all', function() {
        navigateToPage();
      });

      describe('when persisting new settings', function(){

        it('should add user to creator role', function() {
          page.becomeCreatorButton.click();
          expect(browser.getCurrentUrl()).toContain(createBlogPage.pageUrl);
        });

        it('should persist new settings between sessions', function(){
          commonWorkflows.fastRefresh();
          commonWorkflows.reSignIn(registration);
          sidebar.createChannelLink.click();
        });
      });
    });
  });
});
