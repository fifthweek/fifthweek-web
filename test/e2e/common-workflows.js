(function(){
  'use strict';

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
  var QueueListPage = require('./pages/creators/queue-list.page.js');
  var QueueAddPage = require('./pages/creators/queue-add.page.js');
  var ComposePostPage = require('./pages/creators/compose/compose-post.page.js');
  var CreatorLandingPagePage = require('./pages/creators/creator-landing-page.page.js');

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
  var queueListPage = new QueueListPage();
  var queueAddPage = new QueueAddPage();
  var composePostPage = new ComposePostPage();
  var creatorLandingPage = new CreatorLandingPagePage();

  var CommonWorkflows = function() {};

  CommonWorkflows.prototype = Object.create({}, {
    getRoot: { value: function() {
      return this.getPage('/');
    }},
    getPage: { value: function(url) {
      browser.get(url);
      browser.waitForAngular();
      return browser.controlFlow().execute(function() {
        return browser.executeScript('angular.element(document.body).addClass("disable-animations")');
      });
    }},
    fastRefresh: { value: function() {
      browser.waitForAngular();
      browser.controlFlow().execute(function() {
        var script =
          'angular.element(document.body).injector().get(\'$state\').reload(); ' +
          'angular.element(document.body).injector().get(\'$rootScope\').$digest(); ';
        return browser.executeScript(script);
      });
      browser.waitForAngular();
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

      result.hidden.push(this.createChannel({hiddenCheckbox: true, nameTextBox: 'ZZZ1'}));
      result.hidden.push(this.createChannel({hiddenCheckbox: true, nameTextBox: 'ZZZ2'}));
      result.visible.push(this.createChannel({hiddenCheckbox: false, nameTextBox: 'ZZZ3'}));
      result.visible.push(this.createChannel({hiddenCheckbox: false, nameTextBox: 'ZZZ4'}));

      return result;
    }},

    createQueue: { value: function() {
      sidebar.queuesLink.click();
      queueListPage.addQueueButton.click();
      browser.waitForAngular();

      return queueAddPage.submitSuccessfully();
    }},

    createNamedQueue: { value: function(newQueueName) {
      sidebar.queuesLink.click();
      queueListPage.addQueueButton.click();
      browser.waitForAngular();

      return queueAddPage.submitQueueSuccessfully(newQueueName);
    }},

    postNoteNow: { value: function(channelIndex) {
      sidebar.postsLink.click();
      composeOptionsPage.postLink.click();
      return composePostPage.postNow(true, undefined, undefined, channelIndex);
    }},

    postNoteOnDate: { value: function(channelIndex) {
      sidebar.postsLink.click();
      composeOptionsPage.postLink.click();
      return composePostPage.postOnDate(true, undefined, undefined, channelIndex);
    }},

    postNoteOnPastDate: { value: function(channelIndex) {
      sidebar.postsLink.click();
      composeOptionsPage.postLink.click();
      return composePostPage.postOnPastDate(true, undefined, undefined, channelIndex);
    }},

    postFileNow: { value: function(filePath, channelIndex) {
      sidebar.postsLink.click();
      composeOptionsPage.postLink.click();
      return composePostPage.postNow(true, filePath, undefined, channelIndex);
    }},

    postFileOnDate: { value: function(filePath, channelIndex) {
      sidebar.postsLink.click();
      composeOptionsPage.postLink.click();
      return composePostPage.postOnDate(true, filePath, undefined, channelIndex);
    }},

    postFileToQueue: { value: function(filePath, channelIndex, queueIndex) {
      sidebar.postsLink.click();
      composeOptionsPage.postLink.click();
      return composePostPage.postToQueue(true, filePath, undefined, channelIndex, queueIndex);
    }},

    postImageNow: { value: function(filePath, channelIndex) {
      sidebar.postsLink.click();
      composeOptionsPage.postLink.click();
      return composePostPage.postNow(true, undefined, filePath, channelIndex);
    }},

    postImageOnDate: { value: function(filePath, channelIndex) {
      sidebar.postsLink.click();
      composeOptionsPage.postLink.click();
      return composePostPage.postOnDate(true, undefined, filePath, channelIndex);
    }},

    postImageToQueue: { value: function(filePath, channelIndex, queueIndex) {
      sidebar.postsLink.click();
      composeOptionsPage.postLink.click();
      return composePostPage.postToQueue(true, undefined, filePath, channelIndex, queueIndex);
    }},

    postImageAndFileNow: { value: function(filePath, imagePath, channelIndex) {
      sidebar.postsLink.click();
      composeOptionsPage.postLink.click();
      return composePostPage.postNow(true, filePath, imagePath, channelIndex);
    }},

    postImageAndFileToQueue: { value: function(filePath, imagePath, channelIndex, queueIndex) {
      sidebar.postsLink.click();
      composeOptionsPage.postLink.click();
      return composePostPage.postToQueue(true, filePath, imagePath, channelIndex, queueIndex);
    }}
  });

  module.exports = CommonWorkflows;
})();
