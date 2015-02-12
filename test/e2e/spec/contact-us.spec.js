var HomePage = require('../pages/home.page.js');
var SignOutPage = require('../pages/sign-out.page.js');
var SidebarPage = require('../pages/sidebar.page.js');
var HeaderHelpPage = require('../pages/header-help.page.js');
var ContactUsPage = require('../pages/contact-us.page.js');

describe('contact us', function() {
  'use strict';

  var page = new ContactUsPage();
  var homePage = new HomePage();
  var signOutPage = new SignOutPage();
  var sidebar = new SidebarPage();
  var header = new HeaderHelpPage();

  it('should run once before all', function() {
    signOutPage.signOutAndGoHome();
    homePage.signInLink.click();
    sidebar.helpLink.click();
    header.contactLink.click();
  });

  it('should contain a link to email Fifthweek', function() {
    expect(page.mailtoLink.getAttribute('href')).toContain('mailto:hello@fifthweek.com');
  });
});
