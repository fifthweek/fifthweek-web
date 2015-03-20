'use strict';

var HomePage = require('./pages/home.page.js');
var SignInPage = require('./pages/sign-in.page.js');
var CreateSubscriptionPage = require('./pages/creators/create-subscription.page.js');
var RegisterPage = require('./pages/register.page.js');
var SignOutPage = require('./pages/sign-out.page.js');
var SidebarPage = require('./pages/sidebar.page.js');
var HeaderCustomizePage = require('./pages/header-customize.page.js');
var HeaderComposePage = require('./pages/header-compose.page.js');
var ChannelListPage = require('./pages/creators/customize/channel-list.page.js');
var ChannelAddPage = require('./pages/creators/customize/channel-add.page.js');
var CollectionListPage = require('./pages/creators/customize/collection-list.page.js');
var CollectionAddPage = require('./pages/creators/customize/collection-add.page.js');
var ComposeNotePage = require('./pages/creators/compose/compose-note.page.js');
var ComposeFilePage = require('./pages/creators/compose/compose-file.page.js');
var ComposeImagePage = require('./pages/creators/compose/compose-image.page.js');

var signOutPage = new SignOutPage();
var registerPage = new RegisterPage();
var createSubscriptionPage = new CreateSubscriptionPage();
var homePage = new HomePage();
var signInPage = new SignInPage();
var sidebar = new SidebarPage();
var headerCustomize = new HeaderCustomizePage();
var headerCompose = new HeaderComposePage();
var channelListPage = new ChannelListPage();
var channelAddPage = new ChannelAddPage();
var collectionListPage = new CollectionListPage();
var collectionAddPage = new CollectionAddPage();
var composeNotePage = new ComposeNotePage();
var composeFilePage = new ComposeFilePage();
var composeImagePage = new ComposeImagePage();

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
  }},

  postNoteNow: { value: function(channelName) {
    sidebar.newPostLink.click();
    headerCompose.noteLink.click();
    composeNotePage.postNow(channelName);
  }},

  postNoteOnDate: { value: function(channelName) {
    sidebar.newPostLink.click();
    headerCompose.noteLink.click();
    composeNotePage.postOnDate(channelName);
  }},

  postFileNow: { value: function(filePath, collectionName, channelName, createCollection, isFirstCollection) {
    sidebar.newPostLink.click();
    headerCompose.fileLink.click();
    composeFilePage.postNow(filePath, collectionName, channelName, createCollection, isFirstCollection);
  }},

  postFileOnDate: { value: function(filePath, collectionName, channelName, createCollection, isFirstCollection) {
    sidebar.newPostLink.click();
    headerCompose.fileLink.click();
    composeFilePage.postOnDate(filePath, collectionName, channelName, createCollection, isFirstCollection);
  }},

  postFileToQueue: { value: function(filePath, collectionName, channelName, createCollection, isFirstCollection) {
    sidebar.newPostLink.click();
    headerCompose.fileLink.click();
    composeFilePage.postToQueue(filePath, collectionName, channelName, createCollection, isFirstCollection);
  }},

  postImageNow: { value: function(filePath, collectionName, channelName, createCollection, isFirstCollection) {
    sidebar.newPostLink.click();
    headerCompose.imageLink.click();
    composeImagePage.postNow(filePath, collectionName, channelName, createCollection, isFirstCollection);
  }},

  postImageOnDate: { value: function(filePath, collectionName, channelName, createCollection, isFirstCollection) {
    sidebar.newPostLink.click();
    headerCompose.imageLink.click();
    composeImagePage.postOnDate(filePath, collectionName, channelName, createCollection, isFirstCollection);
  }},

  postImageToQueue: { value: function(filePath, collectionName, channelName, createCollection, isFirstCollection) {
    sidebar.newPostLink.click();
    headerCompose.imageLink.click();
    composeImagePage.postToQueue(filePath, collectionName, channelName, createCollection, isFirstCollection);
  }}
});

module.exports = CommonWorkflows;
