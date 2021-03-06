var CommonWorkflows = require('../../common-workflows.js');
var SidebarPage = require('../../pages/sidebar.page.js');
var ChannelListPage = require('../../pages/creators/channel-list.page.js');
var HeaderPage = require('../../pages/header-edit-profile.page.js');

describe('channel list form', function() {
  'use strict';

  // NOTE:
  // Tests for listing non-default channels are covered by the add/edit queue specs.

  var registration;
  var blog;

  var commonWorkflows = new CommonWorkflows();
  var sidebar = new SidebarPage();
  var header = new HeaderPage();
  var page = new ChannelListPage();

  it('should run once before all', function() {
    var context = commonWorkflows.createBlog();
    registration = context.registration;
    blog = context.blog;
    navigateToPage();
  });

  it('should allow new channels to be created', function () {
    expect(page.addChannelButton.isDisplayed()).toBe(true);
  });

  it('should contain the default channel after registering', function () {
    expectBaseChannel();
  });

  it('should contain the default channel after registering, after signing back in', function () {
    commonWorkflows.reSignIn(registration);
    navigateToPage();
    expectBaseChannel();
  });

  it('should allow default channel to be edited', function () {
    expect(page.getEditChannelButton(blog.name).isDisplayed()).toBe(true);
  });

  var navigateToPage = function() {
    sidebar.editProfileLink.click();
    header.channelsLink.click();
  };

  var expectBaseChannel = function() {
    expect(page.channels.count()).toBe(1);
    page.expectChannel({
      name: blog.name,
      price: blog.basePrice
    });
  };
});
