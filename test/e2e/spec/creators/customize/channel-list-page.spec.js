var CommonWorkflows = require('../../../common-workflows.js');
var HeaderPage = require('../../../pages/header.page.js');
var SidebarPage = require('..././../pages/sidebar.page.js');

describe('channel list page', function() {
  'use strict';

  var commonWorkflows = new CommonWorkflows();
  var sidebar = new SidebarPage();
  var header = new HeaderCustomizePage();
  var page = new ChannelListPage();

  it('should run once before all', function() {
    commonWorkflows.createSubscription();
    sidebar.customizeLink.click();
    header.channelsLink.click();
  });

  describe('header', function() {

    it('should contain title', function() {
      expect(header.title.getText()).toContain('About Your Subscription'.toUpperCase());
    });
  });

  describe('sidebar', function() {

    it('should contain 3 links', function () {
      expect(sidebar.links.count()).toBe(3);
    });

    it('should contain highlighted link for current page', function () {
      expect(sidebar.createSubscriptionLink.getAttribute('class')).toContain('active');
    });

    it('should contain "Settings" link', function () {
      expect(sidebar.settingsLink.isDisplayed()).toBe(true);
    });

    it('should contain "Help" link', function () {
      expect(sidebar.helpLink.isDisplayed()).toBe(true);
    });
  });
});
