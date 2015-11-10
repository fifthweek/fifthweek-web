var TestKit = require('../test-kit.js');
var CommonWorkflows = require('../common-workflows.js');
var UsernameInputPage = require('../pages/username-input.page.js');
var PasswordInputPage = require('../pages/password-input.page.js');
var CreatorLandingPagePage = require('../pages/creators/creator-landing-page.page.js');
var SignInWorkflowPage = require('../pages/sign-in-workflow.page.js');

describe("registration form", function() {
  'use strict';

  var creatorRegistration;
  var email;
  var username;

  var testKit = new TestKit();
  var commonWorkflows = new CommonWorkflows();
  var usernameInputPage = new UsernameInputPage();
  var passwordInputPage = new PasswordInputPage();
  var page = new SignInWorkflowPage();
  var creatorLandingPage = new CreatorLandingPagePage();

  var navigateToPage = function() {
    commonWorkflows.signOut();
    commonWorkflows.getPage('/' + creatorRegistration.username);
    var userRegistration = page.newRegistrationData();
    email = userRegistration.email;
    username = userRegistration.username;
    creatorLandingPage.getSubscribeButton(0).click();
    testKit.waitForElementToDisplay(page.registrationUsernameTextBox);
  };

  it('should run once before all', function() {
    var context = commonWorkflows.createBlog();
    creatorRegistration = context.registration;
  });

  describe('when validating against good input', function() {

    beforeEach(navigateToPage);

    afterEach(function() {
      page.registerButton.click();
      testKit.waitForElementToBeRemoved(page.registerButton);

      creatorLandingPage.expectSubscribedSuccessfully();
      //page.expectGuestListOnlyDisplayed();
    });

    it('should allow a new user to register', function(){
      testKit.setValue(page.registrationUsernameTextBoxId, username);
      testKit.setValue(page.registrationPasswordTextBoxId, 'password1');
      testKit.setValue(page.registrationEmailTextBoxId, email);
    });

    usernameInputPage.includeHappyPaths(page.registrationUsernameTextBoxId, function() {
      testKit.setValue(page.registrationPasswordTextBoxId, 'password1');
      testKit.setValue(page.registrationEmailTextBoxId, email);
    });

    passwordInputPage.includeHappyPaths(page.registrationPasswordTextBoxId, function() {
      testKit.setValue(page.registrationUsernameTextBoxId, username);
      testKit.setValue(page.registrationEmailTextBoxId, email);
    });
  });

  describe('when validating against bad input', function() {

    it('should run once before all', function() {
      navigateToPage();
    });

    afterEach(function() {
      // Reset form state.
      page.cancelButton.click();
      creatorLandingPage.getSubscribeButton(0).click();
    });

    it('requires email address', function(){
      testKit.setValue(page.registrationUsernameTextBoxId, username);
      testKit.setValue(page.registrationPasswordTextBoxId, 'password1');
      page.registerButton.click();

      testKit.assertSingleValidationMessage(page.helpMessages,
        'A valid email address is required.');
    });

    usernameInputPage.includeSadPaths(page.registrationUsernameTextBoxId, page.registerButton, page.helpMessages, function() {
      testKit.setValue(page.registrationPasswordTextBoxId, 'password1');
      testKit.setValue(page.registrationEmailTextBoxId, email);
    });

    passwordInputPage.includeSadPaths(page.registrationPasswordTextBoxId, page.registerButton, page.helpMessages, function() {
      testKit.setValue(page.registrationUsernameTextBoxId, username);
      testKit.setValue(page.registrationEmailTextBoxId, email);
    });
  });
});
