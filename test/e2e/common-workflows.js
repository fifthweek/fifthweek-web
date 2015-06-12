(function(){
  'use strict';

  var Defaults = require('./defaults.js');
  var HomePage = require('./pages/home.page.js');
  var SignInPage = require('./pages/sign-in.page.js');
  var CreateBlogPage = require('./pages/creators/create-blog.page.js');
  var RegisterPage = require('./pages/register.page.js');
  var SignInWorkflowPage = require('./pages/sign-in-workflow.page.js');
  var SignOutPage = require('./pages/sign-out.page.js');
  var SidebarPage = require('./pages/sidebar.page.js');
  var ComposeOptionsPage = require('./pages/creators/compose/compose-options.page.js');
  var ChannelListPage = require('./pages/creators/channel-list.page.js');
  var ChannelAddPage = require('./pages/creators/channel-add.page.js');
  var ChannelEditPage = require('./pages/creators/channel-edit.page.js');
  var CollectionListPage = require('./pages/creators/collection-list.page.js');
  var CollectionAddPage = require('./pages/creators/collection-add.page.js');
  var ComposeNotePage = require('./pages/creators/compose/compose-note.page.js');
  var ComposeFilePage = require('./pages/creators/compose/compose-file.page.js');
  var ComposeImagePage = require('./pages/creators/compose/compose-image.page.js');
  var CreatorLandingPagePage = require('./pages/creators/creator-landing-page.page.js');

  var defaults = new Defaults();
  var signOutPage = new SignOutPage();
  var registerPage = new RegisterPage();
  var createBlogPage = new CreateBlogPage();
  var homePage = new HomePage();
  var signInWorkflowPage = new SignInWorkflowPage();
  var signInPage = new SignInPage();
  var sidebar = new SidebarPage();
  var composeOptionsPage = new ComposeOptionsPage();
  var channelListPage = new ChannelListPage();
  var channelAddPage = new ChannelAddPage();
  var channelEditPage = new ChannelEditPage();
  var collectionListPage = new CollectionListPage();
  var collectionAddPage = new CollectionAddPage();
  var composeNotePage = new ComposeNotePage();
  var composeFilePage = new ComposeFilePage();
  var composeImagePage = new ComposeImagePage();
  var creatorLandingPage = new CreatorLandingPagePage();

  var CommonWorkflows = function() {};

  CommonWorkflows.prototype = Object.create({}, {
    getRoot: { value: function() {
      this.getPage('/');
    }},
    getPage: { value: function(url) {
      browser.get(url);
      browser.waitForAngular();
      browser.controlFlow().execute(function() {
        browser.executeScript('angular.element(document.body).addClass("disable-animations")');
      });
    }},
    fastRefresh: { value: function() {
      browser.controlFlow().execute(function() {
        var script =
          'angular.element(document.body).injector().get(\'$state\').reload(); ' +
          'angular.element(document.body).injector().get(\'$rootScope\').$digest(); ';
        browser.executeScript(script);
      });
    }},
    rebaseLinkAndClick: { value: function(linkElement) {
      var self = this;
      return linkElement.getAttribute('href').then(function(href) {
        var pathArray = href.split( '/' );
        var protocol = pathArray[0];
        var host = pathArray[2];
        var baseUrl = protocol + '//' + host;
        var path = href.substring(baseUrl.length);

        self.getPage(path);
        return path;
      });
    }},

    createBlog: { value: function() {
      registerPage.signOutAndGoToRegistration();
      var registration = registerPage.registerSuccessfully();
      var blog = createBlogPage.submitSuccessfully();

      return {
        registration: registration,
        blog: blog
      };
    }},

    setChannelPrice: { value: function(price, channelName){
      channelName = channelName || defaults.channelName;
      sidebar.channelsLink.click();
      channelListPage.getEditChannelButton(channelName).click();
      channelEditPage.setPrice(price);
      channelEditPage.saveButton.click();
    }},

    register: { value: function() {
      registerPage.signOutAndGoToRegistration();
      return registerPage.registerSuccessfully();
    }},

    registerAsConsumer: { value: function() {
      var context = this.createBlog();
      var creatorRegistration = context.registration;

      this.signOut();
      this.getPage('/' + creatorRegistration.username);

      creatorLandingPage.subscribeButton.click();
      var registration = signInWorkflowPage.registerSuccessfully();

      this.getPage('/user');

      return registration;
    }},

    signOut: { value: function() {
      signOutPage.signOutAndGoHome();
    }},

    signIn: { value: function(registration) {
      this.getRoot();
      homePage.signInLink.click();
      signInPage.signInSuccessfully(registration.username, registration.password);
    }},

    reSignIn: { value: function(registration) {
      signOutPage.signOutAndGoHome();
      homePage.signInLink.click();
      signInPage.signInSuccessfully(registration.username, registration.password);
    }},

    createChannel: { value: function(values) {
      sidebar.channelsLink.click();
      channelListPage.addChannelButton.click();
      browser.waitForAngular();

      return channelAddPage.submitSuccessfully(values);
    }},

    createHiddenAndVisibleChannels: { value: function() {
      var result = {
        visible: [],
        hidden: []
      };

      result.hidden.push(this.createChannel({hiddenCheckbox: true}));
      result.hidden.push(this.createChannel({hiddenCheckbox: true}));
      result.visible.push(this.createChannel({hiddenCheckbox: false}));
      result.visible.push(this.createChannel({hiddenCheckbox: false}));

      return result;
    }},

    createCollection: { value: function(channelNames) {
      sidebar.collectionsLink.click();
      collectionListPage.addCollectionButton.click();
      browser.waitForAngular();

      return collectionAddPage.submitSuccessfully(channelNames || [defaults.channelName]);
    }},

    createNamedCollection: { value: function(channelName, newCollectionName) {
      sidebar.collectionsLink.click();
      collectionListPage.addCollectionButton.click();
      browser.waitForAngular();

      return collectionAddPage.submitCollectionSuccessfully(channelName || defaults.channelName, newCollectionName);
    }},

    postNoteNow: { value: function(channelName) {
      sidebar.postsLink.click();
      composeOptionsPage.noteLink.click();
      return composeNotePage.postNow(channelName);
    }},

    postNoteOnDate: { value: function(channelName) {
      sidebar.postsLink.click();
      composeOptionsPage.noteLink.click();
      return composeNotePage.postOnDate(channelName);
    }},

    postNoteOnPastDate: { value: function(channelName) {
      sidebar.postsLink.click();
      composeOptionsPage.noteLink.click();
      return composeNotePage.postOnPastDate(channelName);
    }},

    postFileNow: { value: function(filePath, collectionName, channelName, createCollection, isFirstCollection) {
      sidebar.postsLink.click();
      composeOptionsPage.fileLink.click();
      return composeFilePage.postNow(filePath, collectionName, channelName, createCollection, isFirstCollection);
    }},

    postFileOnDate: { value: function(filePath, collectionName, channelName, createCollection, isFirstCollection) {
      sidebar.postsLink.click();
      composeOptionsPage.fileLink.click();
      return composeFilePage.postOnDate(filePath, collectionName, channelName, createCollection, isFirstCollection);
    }},

    postFileToQueue: { value: function(filePath, collectionName, channelName, createCollection, isFirstCollection) {
      sidebar.postsLink.click();
      composeOptionsPage.fileLink.click();
      return composeFilePage.postToQueue(filePath, collectionName, channelName, createCollection, isFirstCollection);
    }},

    postImageNow: { value: function(filePath, collectionName, channelName, createCollection, isFirstCollection) {
      sidebar.postsLink.click();
      composeOptionsPage.imageLink.click();
      return composeImagePage.postNow(filePath, collectionName, channelName, createCollection, isFirstCollection);
    }},

    postImageOnDate: { value: function(filePath, collectionName, channelName, createCollection, isFirstCollection) {
      sidebar.postsLink.click();
      composeOptionsPage.imageLink.click();
      return composeImagePage.postOnDate(filePath, collectionName, channelName, createCollection, isFirstCollection);
    }},

    postImageToQueue: { value: function(filePath, collectionName, channelName, createCollection, isFirstCollection) {
      sidebar.postsLink.click();
      composeOptionsPage.imageLink.click();
      return composeImagePage.postToQueue(filePath, collectionName, channelName, createCollection, isFirstCollection);
    }}
  });

  module.exports = CommonWorkflows;
})();
