var DashboardSidebarSpec = require('./shared/dashboardsidebar.spec.js');
var HeaderPage = require('./pages/header.page.js');
var RegisterPage = require('./pages/register.page.js');
var SidebarPage = require('./pages/sidebar.page.js');
var DemonstrationPage = require('./pages/demonstration.page.js');
var FeedbackPage = require('./pages/feedback.page.js');

describe('fifthweek', function() {
  'use strict';

  describe('header', function() {

    it('should have a register link', function() {
      expect(header.registerLink.getText()).toContain('Register');
      header.registerLink.click();
      browser.waitForAngular();
      expect(browser.getCurrentUrl()).toContain('/register');
    });

    it('should have a sign-in link', function() {
      expect(header.signInLink.getText()).toContain('Sign In');
      header.signInLink.click();
      browser.waitForAngular();
      expect(browser.getCurrentUrl()).toContain('/signin');
    });
  });

  describe("homepage", function() {

    it('should have a "Become a creator" link', function() {
      var becomeACreatorLink = element(by.id('becomeACreatorLink'));
      expect(becomeACreatorLink.getText()).toContain('Become a creator');
      becomeACreatorLink.click();
      browser.waitForAngular();
      expect(browser.getCurrentUrl()).toContain('/register');
    });
  });

  describe('register page', function() {

    it('should allow a new user to register', function(){
      page.exampleWorkTextBox.sendKeys(username);
      page.usernameTextBox.sendKeys(username);
      page.passwordTextBox.sendKeys('password1');
      page.emailTextBox.sendKeys(email);
      page.registerButton.click();
      browser.waitForAngular();
      expect(browser.getCurrentUrl()).toContain('/dashboard');
    });

    it('requires example work', function(){
      page.emailTextBox.sendKeys(email);
      page.usernameTextBox.sendKeys(username);
      page.passwordTextBox.sendKeys('password1');
      page.registerButton.click();
      browser.waitForAngular();

      var messages = page.helpMessages;

      expect(messages.count()).toBe(1);
      expect(messages.get(0).getText()).toContain('A valid URL is required.')
    });

    it('requires email address', function(){
      page.exampleWorkTextBox.sendKeys(username);
      page.usernameTextBox.sendKeys(username);
      page.passwordTextBox.sendKeys('password1');
      page.registerButton.click();
      browser.waitForAngular();

      var messages = page.helpMessages;

      expect(messages.count()).toBe(1);
      expect(messages.get(0).getText()).toContain('A valid email address is required.')
    });

    it('requires username', function(){
      page.exampleWorkTextBox.sendKeys(username);
      page.emailTextBox.sendKeys(email);
      page.passwordTextBox.sendKeys('password1');
      page.registerButton.click();
      browser.waitForAngular();

      var messages = page.helpMessages;

      expect(messages.count()).toBe(1);
      expect(messages.get(0).getText()).toContain('A username is required.')
    });

    it('requires password', function(){
      page.exampleWorkTextBox.sendKeys(username);
      page.emailTextBox.sendKeys(email);
      page.usernameTextBox.sendKeys(username);
      page.registerButton.click();
      browser.waitForAngular();

      var messages = page.helpMessages;

      expect(messages.count()).toBe(1);
      expect(messages.get(0).getText()).toContain('A password is required.')
    });

    it('should not allow spaces in username', function(){
      page.exampleWorkTextBox.sendKeys(username);
      page.emailTextBox.sendKeys(email);
      page.usernameTextBox.sendKeys('a ' + username);
      page.passwordTextBox.sendKeys('password1');
      page.registerButton.click();
      browser.waitForAngular();

      var messages = page.helpMessages;

      expect(messages.count()).toBe(1);
      expect(messages.get(0).getText()).toContain('Letters, numbers and underscores only.')
    });

    it('should not allow forbidden characters in username', function(){
      page.exampleWorkTextBox.sendKeys(username);
      page.emailTextBox.sendKeys(email);
      page.usernameTextBox.sendKeys('a!' + username);
      page.passwordTextBox.sendKeys('password1');
      page.registerButton.click();
      browser.waitForAngular();

      var messages = page.helpMessages;

      expect(messages.count()).toBe(1);
      expect(messages.get(0).getText()).toContain('Letters, numbers and underscores only.')
    });

    it('should allow lowercase and uppercase characters in username', function(){
      page.exampleWorkTextBox.sendKeys(username);
      page.emailTextBox.sendKeys(email);
      page.usernameTextBox.sendKeys('aA' + username);
      page.passwordTextBox.sendKeys('password1');
      page.registerButton.click();
      browser.waitForAngular();
      expect(browser.getCurrentUrl()).toContain('/dashboard');
    });

    it('should not allow usernames with fewer than 6 characters', function(){
      page.exampleWorkTextBox.sendKeys(username);
      page.emailTextBox.sendKeys(email);
      page.usernameTextBox.sendKeys('abc');
      page.passwordTextBox.sendKeys('password1');
      page.registerButton.click();
      browser.waitForAngular();

      var messages = page.helpMessages;

      expect(messages.count()).toBe(1);
      expect(messages.get(0).getText()).toContain('Must be at least 6 characters.')
    });

    it('should not allow usernames with over than 20 characters', function(){
      page.exampleWorkTextBox.sendKeys(username);
      page.emailTextBox.sendKeys(email);
      page.usernameTextBox.sendKeys('12345678901234567890ThisIsTooLong');
      page.passwordTextBox.sendKeys('password1');
      browser.waitForAngular();

      expect(page.usernameTextBox.getAttribute('value')).toEqual('12345678901234567890')
    });

    it('should not allow passwords with fewer than 6 characters', function(){
      page.exampleWorkTextBox.sendKeys(username);
      page.emailTextBox.sendKeys(email);
      page.usernameTextBox.sendKeys(username);
      page.passwordTextBox.sendKeys('pass');
      page.registerButton.click();
      browser.waitForAngular();

      var messages = page.helpMessages;

      expect(messages.count()).toBe(1);
      expect(messages.get(0).getText()).toContain('Must be at least 6 characters.')
    });

    it('should allow numbers in username', function(){
      page.exampleWorkTextBox.sendKeys(username);
      page.emailTextBox.sendKeys(email);
      page.usernameTextBox.sendKeys('1' + username);
      page.passwordTextBox.sendKeys('password1');
      page.registerButton.click();
      browser.waitForAngular();
      expect(browser.getCurrentUrl()).toContain('/dashboard');
    });

    it('should allow underscores in username', function(){
      page.exampleWorkTextBox.sendKeys(username);
      page.emailTextBox.sendKeys(email);
      page.usernameTextBox.sendKeys('a_A' + username);
      page.passwordTextBox.sendKeys('password1');
      page.registerButton.click();
      browser.waitForAngular();
      expect(browser.getCurrentUrl()).toContain('/dashboard');
    });

    it('should allow leading and trailing spaces in username', function(){
      page.exampleWorkTextBox.sendKeys(username);
      page.emailTextBox.sendKeys(email);
      page.usernameTextBox.sendKeys(' ' + username + ' ');
      page.passwordTextBox.sendKeys('password1');
      page.registerButton.click();
      browser.waitForAngular();
      expect(browser.getCurrentUrl()).toContain('/dashboard');
    });

    var page = new RegisterPage();
    var username;
    var email;

    beforeEach(function() {
      username = newUsername();
      email = newEmailAddress(username);
      header.registerLink.click();
    });
  });

  describe('dashboard', function() {
    it('should contain the mockup demonstration video', function() {
      expect(page.video.getAttribute('src')).toMatch(urlRegex(page.videoUrl));
    });

    new DashboardSidebarSpec().includeTests();

    var page = new DemonstrationPage();

    beforeEach(function() {
      registerSuccessfully();
    });
  });

  describe('feedback page', function() {
    it('should contain a link to email Fifthweek', function() {
      expect(page.emailLink.getAttribute('href')).toContain('mailto:hello@fifthweek.com')
    });

    new DashboardSidebarSpec().includeTests();

    var page = new FeedbackPage();
    var sidebar = new SidebarPage();

    beforeEach(function() {
      registerSuccessfully();
      sidebar.feedbackLink.click();
    });
  });


  // describe('feedback')...

  var header = new HeaderPage();

  beforeEach(function() {
    browser.get('/#/signout');
    browser.get('/');
  });

  function registerSuccessfully() {
    var registerPage = new RegisterPage();
    var username = newUsername();
    var email = newEmailAddress(username);
    header.registerLink.click();
    registerPage.exampleWorkTextBox.sendKeys(username);
    registerPage.usernameTextBox.sendKeys(username);
    registerPage.passwordTextBox.sendKeys('password1');
    registerPage.emailTextBox.sendKeys(email);
    registerPage.registerButton.click();
  }

  function urlRegex(path) {
    return new RegExp(path.replace('.', '\\.') + '$')
  }
  function newUsername() {
    return 'wd_' + Date.now().toString().split('').reverse().join('');
  }
  function newEmailAddress(username) {
    return username + '@testing.fifthweek.com';
  }
});
