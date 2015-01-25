var DashboardSidebarSpec = require('./shared/dashboardsidebar.spec.js');
var HeaderPage = require('./pages/header.page.js');
var RegisterPage = require('./pages/register.page.js');
var SignInPage = require('./pages/signin.page.js');
var SidebarPage = require('./pages/sidebar.page.js');
var DemonstrationPage = require('./pages/demonstration.page.js');
var FeedbackPage = require('./pages/feedback.page.js');

describe('fifthweek', function() {
  'use strict';

  describe('header', function() {

    it('should have a register link', function() {
      expect(header.registerLink.getText()).toContain('Register');
      header.registerLink.click();
      expect(browser.getCurrentUrl()).toContain('/register');
    });

    it('should have a sign-in link', function() {
      expect(header.signInLink.getText()).toContain('Sign In');
      header.signInLink.click();
      expect(browser.getCurrentUrl()).toContain('/signin');
    });
  });

  describe("homepage", function() {

    it('should have a "Become a creator" link', function() {
      var becomeACreatorLink = element(by.id('becomeACreatorLink'));
      expect(becomeACreatorLink.getText()).toContain('Become a creator');
      becomeACreatorLink.click();
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
      expect(browser.getCurrentUrl()).toContain('/dashboard');
    });

    xit('should disable button after submission', function(){
      page.exampleWorkTextBox.sendKeys(username);
      page.usernameTextBox.sendKeys(username);
      page.passwordTextBox.sendKeys('password1');
      page.emailTextBox.sendKeys(email);
      page.registerButton.click();

      // Faulty assertion: http://stackoverflow.com/questions/27740867/assert-button-disabled-on-click-with-protractor-in-angular
      expect(page.registerButton.getAttribute('disabled')).toContain('true');

      expect(browser.getCurrentUrl()).toContain('/dashboard');
    });

    it('requires example work', function(){
      page.emailTextBox.sendKeys(email);
      page.usernameTextBox.sendKeys(username);
      page.passwordTextBox.sendKeys('password1');
      page.registerButton.click();

      var messages = page.helpMessages;

      expect(messages.count()).toBe(1);
      expect(messages.get(0).getText()).toContain('A valid URL is required.')
    });

    it('requires email address', function(){
      page.exampleWorkTextBox.sendKeys(username);
      page.usernameTextBox.sendKeys(username);
      page.passwordTextBox.sendKeys('password1');
      page.registerButton.click();

      var messages = page.helpMessages;

      expect(messages.count()).toBe(1);
      expect(messages.get(0).getText()).toContain('A valid email address is required.')
    });

    it('requires username', function(){
      page.exampleWorkTextBox.sendKeys(username);
      page.emailTextBox.sendKeys(email);
      page.passwordTextBox.sendKeys('password1');
      page.registerButton.click();

      var messages = page.helpMessages;

      expect(messages.count()).toBe(1);
      expect(messages.get(0).getText()).toContain('A username is required.')
    });

    it('requires password', function(){
      page.exampleWorkTextBox.sendKeys(username);
      page.emailTextBox.sendKeys(email);
      page.usernameTextBox.sendKeys(username);
      page.registerButton.click();

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

      var messages = page.helpMessages;

      expect(messages.count()).toBe(1);
      expect(messages.get(0).getText()).toContain('Letters, numbers and underscores only.')
    });

    it('should not allow forbidden characters in username', function(){
      page.exampleWorkTextBox.sendKeys(username);
      page.emailTextBox.sendKeys(email);
      page.usernameTextBox.sendKeys('a!#' + username);
      page.passwordTextBox.sendKeys('password1');
      page.registerButton.click();

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

      expect(browser.getCurrentUrl()).toContain('/dashboard');
    });

    it('should not allow usernames with fewer than 6 characters', function(){
      page.exampleWorkTextBox.sendKeys(username);
      page.emailTextBox.sendKeys(email);
      page.usernameTextBox.sendKeys('abc');
      page.passwordTextBox.sendKeys('password1');
      page.registerButton.click();

      var messages = page.helpMessages;

      expect(messages.count()).toBe(1);
      expect(messages.get(0).getText()).toContain('Must be at least 6 characters.')
    });

    it('should not allow usernames with over than 20 characters', function(){
      page.exampleWorkTextBox.sendKeys(username);
      page.emailTextBox.sendKeys(email);
      page.usernameTextBox.sendKeys('12345678901234567890ThisIsTooLong');
      page.passwordTextBox.sendKeys('password1');

      // Some browsers don't honor maxlength attribute with protractor's sendKeys
      // so we also check the ng-maxlength error as a backup.
      var messages = page.helpMessages;
      messages.count().then(function(count){
        if(count){
          expect(messages.get(0).getText()).toContain('Must be fewer than 20 characters.')
        }
        else{
          expect(page.usernameTextBox.getAttribute('value')).toBe('12345678901234567890');
        }
      });
    });

    it('should not allow passwords with fewer than 6 characters', function(){
      page.exampleWorkTextBox.sendKeys(username);
      page.emailTextBox.sendKeys(email);
      page.usernameTextBox.sendKeys(username);
      page.passwordTextBox.sendKeys('pass');
      page.registerButton.click();

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

      expect(browser.getCurrentUrl()).toContain('/dashboard');
    });

    it('should allow underscores in username', function(){
      page.exampleWorkTextBox.sendKeys(username);
      page.emailTextBox.sendKeys(email);
      page.usernameTextBox.sendKeys('a_A' + username);
      page.passwordTextBox.sendKeys('password1');
      page.registerButton.click();

      expect(browser.getCurrentUrl()).toContain('/dashboard');
    });

    it('should allow leading and trailing spaces in username', function(){
      page.exampleWorkTextBox.sendKeys(username);
      page.emailTextBox.sendKeys(email);
      page.usernameTextBox.sendKeys(' ' + username + ' ');
      page.passwordTextBox.sendKeys('password1');
      page.registerButton.click();

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

  describe('sign-in page', function(){

    describe('when a user is registered', function(){

      it('should allow the existing user to sign in', function(){
        page.usernameTextBox.sendKeys(username);
        page.passwordTextBox.sendKeys(password);
        page.signInButton.click();
        expect(browser.getCurrentUrl()).toContain('/dashboard');
      });

      xit('should disable button after submission', function(){
        page.usernameTextBox.sendKeys(username);
        page.passwordTextBox.sendKeys(password);
        page.signInButton.click();

        // Faulty assertion: http://stackoverflow.com/questions/27740867/assert-button-disabled-on-click-with-protractor-in-angular
        expect(page.signInButton.getAttribute('disabled')).toContain('true');

        expect(browser.getCurrentUrl()).toContain('/dashboard');
      });

      it('should require a valid password', function(){
        page.usernameTextBox.sendKeys(username);
        page.passwordTextBox.sendKeys(password + 'X');
        page.signInButton.click();
        expect(page.message.getText()).toContain('Invalid username or password');
      });

      it('should require a valid username', function(){
        page.usernameTextBox.sendKeys(username + 'X');
        page.passwordTextBox.sendKeys(password);
        page.signInButton.click();
        expect(page.message.getText()).toContain('Invalid username or password');
      });

      it('should be case insensitive for the username', function(){
        // Change the first letter to upper case, and check the result.
        var username2 = username.charAt(0).toUpperCase() + username.substring(1);
        expect(username.length === username2.length).toBeTruthy();
        expect(username !== username2).toBeTruthy();

        page.usernameTextBox.sendKeys(username2);
        page.passwordTextBox.sendKeys(password);
        page.signInButton.click();

        expect(browser.getCurrentUrl()).toContain('/dashboard');
      });

      it('should case sensitive for the password', function(){
        // Change the first letter to upper case, and check the result.
        var password2 = password.charAt(0).toUpperCase() + password.substring(1);
        expect(password.length === password2.length).toBeTruthy();
        expect(password !== password2).toBeTruthy();

        page.usernameTextBox.sendKeys(username);
        page.passwordTextBox.sendKeys(password2);
        page.signInButton.click();

        expect(page.message.getText()).toContain('Invalid username or password');
      });

      var username;
      var password;

      beforeEach(function() {
        var signInData = registerSuccessfully();
        username = signInData.username;
        password = signInData.password;

        // Wait for angular here because getting a new page doesn't wait.
        browser.waitForAngular();
        reset();

        header.signInLink.click();
      });
    });

    describe('when a user is not registered', function() {

      it('should not allow the existing user to sign in', function(){
        var username = newUsername();
        var password = username + '123';

        page.usernameTextBox.sendKeys(username);
        page.passwordTextBox.sendKeys(password);
        page.signInButton.click();

        expect(page.message.getText()).toContain('Invalid username or password');
      });

      beforeEach(function() {
        header.signInLink.click();
      });
    });

    var page = new SignInPage();
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

  var header = new HeaderPage();

  beforeEach(function() {
    reset();
  });

  function reset(){
    browser.get('/#/signout');

    // `waitForAngular` is unreliable for the first test. We frequently receive a 0ms timeout with that approach.
    // Instead, we wait for the sign-in page to be loaded, which is where we get redirected after signing out.
    var signInPage = new SignInPage();
    browser.wait(function(){
      return signInPage.signInButton.isPresent();
    });

    browser.get('/');
    browser.waitForAngular();
  };

  function registerSuccessfully() {
    var registerPage = new RegisterPage();
    var username = newUsername();
    var email = newEmailAddress(username);
    var password = 'password1';

    header.registerLink.click();

    registerPage.exampleWorkTextBox.sendKeys(username);
    registerPage.usernameTextBox.sendKeys(username);
    registerPage.passwordTextBox.sendKeys(password);
    registerPage.emailTextBox.sendKeys(email);

    registerPage.registerButton.click();

    var result = {
      username: username,
      password: password
    };

    return result;
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
