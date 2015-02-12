var SignOutPage = require('../../pages/sign-out.page.js');
var CreateSubscriptionPage = require('../../pages/creators/create-subscription.page.js');
var HeaderPage = require('../../pages/header.page.js');
var SidebarPage = require('../../pages/sidebar.page.js');

describe('create subscription page', function() {
  'use strict';

  var header = new HeaderPage();
  var sidebar = new SidebarPage();
  var signOutPage = new SignOutPage();
  var page = new CreateSubscriptionPage();

  signOutPage.signOutAndGoHome();
  page.submitSuccessfully();

  describe('header', function() {

    iit('should contain title', function() {
      expect(header.title.getText()).toContain('Create Your Subscription');
    });
  });

  describe('sidebar', function() {

    it('should contain 3 links', function () {
      expect(sidebar.links.count()).toBe(3);
    });

    it('should contain current page, highlighted', function () {

    });

    it('should contain "Settings"', function () {

    });

    it('should contain "Help"', function () {

    });
  });
});
