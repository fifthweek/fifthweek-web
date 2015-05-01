var TestKit = require('../test-kit.js');
var CommonWorkflows = require('../common-workflows.js');
var UsernameInputPage = require('../pages/username-input.page.js');
var CreatorLandingPagePage = require('../pages/creators/creator-landing-page.page.js');
var SignInWorkflowPage = require('../pages/sign-in-workflow.page.js');
var SignInForgotPage = require('../pages/sign-in-forgot.page.js');

describe('sign-in form', function() {
  'use strict';

  var creatorRegistration;

  var testKit = new TestKit();
  var commonWorkflows = new CommonWorkflows();
  var usernameInputPage = new UsernameInputPage();
  var page = new SignInWorkflowPage();
  var creatorLandingPage = new CreatorLandingPagePage();
  var signInForgotPage = new SignInForgotPage();

  var navigateToPage = function() {
    commonWorkflows.signOut();
    commonWorkflows.getPage('/' + creatorRegistration.username);
    creatorLandingPage.subscribeButton.click();
    page.showSignInLink.click();
  };

  it('should run once before all', function() {
    var context = commonWorkflows.createBlog();
    creatorRegistration = context.registration;
  });

  describe('when a user is not registered', function() {

    it('should not allow the existing user to sign in', function(){
      navigateToPage();

      var username = usernameInputPage.newUsername();
      var password = username + '123';

      testKit.setValue(page.signInUsernameTextBoxId, username);
      testKit.setValue(page.signInPasswordTextBoxId, password);
      page.signInButton.click();

      expect(page.signInFormMessage.getText()).toContain('Invalid username or password');
    });

    it('should allow the user to navigate to the recover password page', function(){
      navigateToPage();

      page.forgotDetailsLink.click();

      page.expectNotDisplayed();
      expect(browser.getCurrentUrl()).toContain(signInForgotPage.pageUrl);
    });

    it('should allow the user to navigate to return to the register page', function(){
      navigateToPage();

      page.showRegisterLink.click();

      page.expectRegisterDisplayed();
    });
  });

  describe('when a user is registered', function(){
    var username;
    var password;

    it('should run once before all', function() {
      commonWorkflows.getRoot();
      var userRegistration = commonWorkflows.register();
      username = userRegistration.username;
      password = userRegistration.password;
    });

    afterEach(navigateToPage);

    it('should allow the existing user to sign in', function(){
      testKit.setValue(page.signInUsernameTextBoxId, username);
      testKit.setValue(page.signInPasswordTextBoxId, password);
      page.signInButton.click();
      page.expectGuestListOnlyDisplayed();
    });

    it('should be case insensitive for the username', function(){
      // Change the first letter to upper case, and check the result.
      var username2 = username.charAt(0).toUpperCase() + username.substring(1);
      expect(username.length === username2.length).toBeTruthy();
      expect(username !== username2).toBeTruthy();

      testKit.setValue(page.signInUsernameTextBoxId, username2);
      testKit.setValue(page.signInPasswordTextBoxId, password);
      page.signInButton.click();

      page.expectGuestListOnlyDisplayed();
    });

    it('should require a valid password', function(){
      testKit.setValue(page.signInUsernameTextBoxId, username);
      testKit.setValue(page.signInPasswordTextBoxId, password + 'X');
      page.signInButton.click();
      expect(page.signInFormMessage.getText()).toContain('Invalid username or password');
    });

    it('should require a valid username', function(){
      testKit.setValue(page.signInUsernameTextBoxId, username + 'X');
      testKit.setValue(page.signInPasswordTextBoxId, password);
      page.signInButton.click();
      expect(page.signInFormMessage.getText()).toContain('Invalid username or password');
    });

    it('should case sensitive for the password', function(){
      // Change the first letter to upper case, and check the result.
      var password2 = password.charAt(0).toUpperCase() + password.substring(1);
      expect(password.length === password2.length).toBeTruthy();
      expect(password !== password2).toBeTruthy();

      testKit.setValue(page.signInUsernameTextBoxId, username);
      testKit.setValue(page.signInPasswordTextBoxId, password2);
      page.signInButton.click();

      expect(page.signInFormMessage.getText()).toContain('Invalid username or password');
    });
  });
});
