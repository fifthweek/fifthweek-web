var HomePage = require('./pages/home.page.js');
var SignOutPage = require('./pages/sign-out.page.js');
var NavigationPage = require('./pages/navigation.page.js');
var NavigationHelpPage = require('./pages/navigation-help.page.js');
var ContactUsPage = require('./pages/contact-us.page.js');

describe('contact us', function() {
  'use strict';

  var page = new ContactUsPage();
  var homePage = new HomePage();
  var signOutPage = new SignOutPage();
  var navigation = new NavigationPage();
  var navigationHelp = new NavigationHelpPage();

  beforeEach(function() {
    signOutPage.signOutAndGoHome();
    homePage.signInLink.click();
    navigation.helpButton.click();
    navigationHelp.contactButton.click();
  });

  it('should contain a link to email Fifthweek', function() {
    expect(page.mailtoLink.getAttribute('href')).toContain('mailto:hello@fifthweek.com');
  });
});
