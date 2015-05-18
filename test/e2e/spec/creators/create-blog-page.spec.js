var SignOutPage = require('../../pages/sign-out.page.js');
var RegisterPage = require('../../pages/register.page.js');
var CreateBlogPage = require('../../pages/creators/create-blog.page.js');
var HeaderPage = require('../../pages/header.page.js');
var SidebarPage = require('../../pages/sidebar.page.js');

describe('create blog page', function() {
  'use strict';

  var header = new HeaderPage();
  var sidebar = new SidebarPage();
  var signOutPage = new SignOutPage();
  var registerPage = new RegisterPage();

  it('should run once before all', function() {
    registerPage.signOutAndGoToRegistration();
    registerPage.registerSuccessfully();
  });

  describe('header', function() {

    it('should contain title', function() {
      expect(header.title.getText()).toContain('About Your Blog'.toUpperCase());
    });
  });

  sidebar.includeConsumerTests(sidebar.createBlogLink);
});
