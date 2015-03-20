'use strict';

var HomePage = require('./pages/home.page.js');
var SignInPage = require('./pages/sign-in.page.js');
var CreateSubscriptionPage = require('./pages/creators/create-subscription.page.js');
var RegisterPage = require('./pages/register.page.js');
var SignOutPage = require('./pages/sign-out.page.js');
var SidebarPage = require('./pages/sidebar.page.js');
var HeaderCustomizePage = require('./pages/header-customize.page.js');
var ChannelListPage = require('./pages/creators/customize/channel-list.page.js');
var ChannelAddPage = require('./pages/creators/customize/channel-add.page.js');
var CollectionListPage = require('./pages/creators/customize/collection-list.page.js');
var CollectionAddPage = require('./pages/creators/customize/collection-add.page.js');

var signOutPage = new SignOutPage();
var registerPage = new RegisterPage();
var createSubscriptionPage = new CreateSubscriptionPage();
var homePage = new HomePage();
var signInPage = new SignInPage();
var sidebar = new SidebarPage();
var headerCustomize = new HeaderCustomizePage();
var channelListPage = new ChannelListPage();
var channelAddPage = new ChannelAddPage();
var collectionListPage = new CollectionListPage();
var collectionAddPage = new CollectionAddPage();

var CommonWorkflows = function() {};

CommonWorkflows.prototype = Object.create({}, {
  createSubscription: { value: function() {
    signOutPage.signOutAndGoHome();
    var registration = registerPage.registerSuccessfully();
    var subscription = createSubscriptionPage.submitSuccessfully();

    return {
      registration: registration,
      subscription: subscription
    };
  }},

  reSignIn: { value: function(registration) {
    signOutPage.signOutAndGoHome();
    homePage.signInLink.click();
    signInPage.signInSuccessfully(registration.username, registration.password);
  }},

  createChannel: { value: function() {
    sidebar.customizeLink.click();
    headerCustomize.channelsLink.click();
    channelListPage.addChannelButton.click();
    return channelAddPage.submitSuccessfully();
  }},

  createCollection: { value: function(channelNames) {
    sidebar.customizeLink.click();
    headerCustomize.collectionsLink.click();
    collectionListPage.addCollectionButton.click();
    return collectionAddPage.submitSuccessfully(channelNames || [channelListPage.defaultChannelName]);
  }},

  createNamedCollection: { value: function(channelName, newCollectionName) {
    sidebar.customizeLink.click();
    headerCustomize.collectionsLink.click();
    collectionListPage.addCollectionButton.click();
    return collectionAddPage.submitCollectionSuccessfully(channelName || channelListPage.defaultChannelName, newCollectionName);
  }}
});

module.exports = CommonWorkflows;
