var HomePage = require('../../../pages/home.page.js');
var RegisterPage = require('../../../pages/register.page.js');
var SignOutPage = require('../../../pages/sign-out.page.js');
var SignInPage = require('../../../pages/sign-in.page.js');
var SidebarPage = require('../../../pages/sidebar.page.js');
var HeaderCustomizePage = require('../../../pages/header-customize.page.js');
var CreateSubscriptionPage = require('../../../pages/creators/create-subscription.page.js');
var ChannelAddPage = require('../../../pages/creators/customize/channel-add.page.js');
var ChannelListPage = require('../../../pages/creators/customize/channel-list.page.js');

describe('channel list form', function() {
  'use strict';

  var registration;
  var subscription;

  var homePage = new HomePage();
  var signOutPage = new SignOutPage();
  var signInPage = new SignInPage();
  var registerPage = new RegisterPage();
  var createSubscriptionPage = new CreateSubscriptionPage();
  var channelAddPage = new ChannelAddPage();
  var sidebar = new SidebarPage();
  var header = new HeaderCustomizePage();
  var page = new ChannelListPage();

  it('should run once before all', function() {
    signOutPage.signOutAndGoHome();
    registration = registerPage.registerSuccessfully();
    subscription = createSubscriptionPage.submitSuccessfully();
  });

  it('should allow new channels to be created', function () {
    navigateToPage();
    page.addChannelButton.click();

    expect(browser.getCurrentUrl()).toContain(channelAddPage.pageUrl);
  });

  it('should contain the base channel after registering', function () {
    navigateToPage();
    expectBaseChannel();
  });

  it('should contain the base channel after registering, after signing back in', function () {
    signOutPage.signOutAndGoHome();
    homePage.signInLink.click();
    signInPage.signInSuccessfully(registration.username, registration.password);
    navigateToPage();
    expectBaseChannel();
  });

  var navigateToPage = function() {
    sidebar.customizeLink.click();
    header.channelsLink.click();
  };

  var expectBaseChannel = function() {
    expect(page.channels.count()).toBe(1);

    var defaultChannelText = page.getChannel(0).getText();
    expect(defaultChannelText).toContain('Basic Subscription');
    expect(defaultChannelText).toContain('$' + subscription.basePrice);
    expect(defaultChannelText).toContain('Exclusive News Feed');
    expect(defaultChannelText).toContain('Early Updates on New Releases');
  };
});
