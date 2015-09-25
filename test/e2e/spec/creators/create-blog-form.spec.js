var TestKit = require('../../test-kit.js');
var CommonWorkflows = require('../../common-workflows.js');
var RegisterPage = require('../../pages/register.page.js');
var SignOutPage = require('../../pages/sign-out.page.js');
var BlogNameInputPage = require('../../pages/blog-name-input.page.js');
var ChannelPriceInputPage = require('../../pages/channel-price-input.page.js');
var CreateBlogPage = require('../../pages/creators/create-blog.page.js');

describe('create blog form', function() {
  'use strict';

  var commonWorkflows = new CommonWorkflows();
  var testKit = new TestKit();
  var signOutPage = new SignOutPage();
  var registerPage = new RegisterPage();
  var nameInputPage = new BlogNameInputPage();
  var channelPriceInputPage = new ChannelPriceInputPage();
  var page = new CreateBlogPage();

  describe('happy path', function () {

    beforeEach(function() {
      commonWorkflows.registerAsCreator();
    });

    afterEach(function() {
      page.submitButton.click();
      expect(browser.getCurrentUrl()).toContain(page.nextPageUrl);
    });

    it('should allow a new blog to be created', function(){
      testKit.setValue(page.nameTextBoxId, nameInputPage.newName());
      testKit.setValue(page.basePriceTextBoxId, channelPriceInputPage.newPrice());
    });

    it('should not require base price to be entered', function(){
      testKit.setValue(page.nameTextBoxId, nameInputPage.newName());
    });

    testKit.includeHappyPaths(page, nameInputPage, 'nameTextBox', page.inputs);
    testKit.includeHappyPaths(page, channelPriceInputPage, 'basePriceTextBox', page.inputs);
  });

  describe('sad path', function () {

    it('should run once before all', function() {
      registerPage.signOutAndGoToRegistration();
      registerPage.registerSuccessfully();
    });

    afterEach(function() {
      // Reset form state.
      commonWorkflows.fastRefresh();
    });

    testKit.includeSadPaths(page, page.submitButton, page.helpMessages, nameInputPage, 'nameTextBox', page.inputs);
    testKit.includeSadPaths(page, page.submitButton, page.helpMessages, channelPriceInputPage, 'basePriceTextBox', page.inputs);
  });
});
