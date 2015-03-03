var RegisterPage = require('../../../pages/register.page.js');
var SignOutPage = require('../../../pages/sign-out.page.js');
var SidebarPage = require('../../../pages/sidebar.page.js');
var HeaderCustomizePage = require('../../../pages/header-customize.page.js');
var CreateSubscriptionPage = require('../../../pages/creators/create-subscription.page.js');
var ChannelAddPage = require('../../../pages/creators/customize/channel-add.page.js');
var ChannelListPage = require('../../../pages/creators/customize/channel-list.page.js');

describe('channel list form', function() {
  'use strict';

  var signOutPage = new SignOutPage();
  var registerPage = new RegisterPage();
  var createSubscriptionPage = new CreateSubscriptionPage();
  var channelAddPage = new ChannelAddPage();
  var sidebar = new SidebarPage();
  var header = new HeaderCustomizePage();
  var page = new ChannelListPage();

  var navigateToPage = function() {
    sidebar.customizeLink.click();
    header.channelsLink.click();
  };

  it('should run once before all', function() {
    signOutPage.signOutAndGoHome();
    registerPage.registerSuccessfully();
    createSubscriptionPage.submitSuccessfully();
    navigateToPage();
  });

  afterEach(navigateToPage);

  it('should allow new channels to be created', function () {
    page.addChannelButton.click();
    expect(browser.getCurrentUrl()).toContain(channelAddPage.pageUrl);
  });
});
