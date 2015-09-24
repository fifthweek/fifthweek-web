(function(){
  'use strict';

  var TestKit = require('../../test-kit.js');
  var CommonWorkflows = require('../../common-workflows.js');
  var SidebarPage = require('../../pages/sidebar.page.js');
  var GuestListPage = require('../../pages/creators/guest-list.page.js');

  describe('guest-list form', function() {

    var testKit = new TestKit();
    var commonWorkflows = new CommonWorkflows();
    var sidebar = new SidebarPage();
    var page = new GuestListPage();

    var navigateToPage = function () {
      sidebar.guestListLink.click();
    };

    var registration;
    var blog;

    it('should run once before all', function() {
      var context = commonWorkflows.createBlog();
      registration = context.registration;
      blog = context.blog;
      navigateToPage();
    });

    it('should not contain any guests', function(){
      expect(page.createGuestListButton.isDisplayed()).toBe(true);
    });

    it('should ignore invalid email addresses', function() {
      page.createGuestListButton.click();

      testKit.setValue(page.emailsTextBoxId, 'one\ntwo\nthree\n\n');
      page.saveGuestListButton.click();

      expect(page.createGuestListButton.isDisplayed()).toBe(true);
      expect(page.invalidEmails.count()).toBe(3);
    });

    it('should process a mix of valid, invalid and duplicate email addresses', function() {
      page.createGuestListButton.click();

      testKit.setValue(page.emailsTextBoxId, '\n\nb@b.com\n  a@a.com  \none\ntwo\na@a.com  \nc@c.com\n\ne@e.com\nthree\n\n');
      page.saveGuestListButton.click();

      expect(page.editGuestListButton.isDisplayed()).toBe(true);
      expect(page.invalidEmails.count()).toBe(3);
      expect(page.guestListRows.count()).toBe(4);
    });

    it('should render the guest list in order', function(){
      expect(page.guestListRowEmail(0).getText()).toBe('a@a.com');
      expect(page.guestListRowEmail(1).getText()).toBe('b@b.com');
      expect(page.guestListRowEmail(2).getText()).toBe('c@c.com');
      expect(page.guestListRowEmail(3).getText()).toBe('e@e.com');
    });

    it('should only display valid ordered emails when editing', function() {
      page.editGuestListButton.click();

      expect(page.emailsTextBox.getAttribute('value')).toBe('a@a.com\nb@b.com\nc@c.com\ne@e.com');
    });

    it('should render newly added items in order', function(){
      testKit.setValue(page.emailsTextBoxId, 'a@a.com\nb@b.com\nc@c.com\ne@e.com\nd@d.com\ninvalid');
      page.saveGuestListButton.click();

      expect(page.editGuestListButton.isDisplayed()).toBe(true);
      expect(page.invalidEmails.count()).toBe(1);
      expect(page.guestListRows.count()).toBe(5);

      expect(page.guestListRowEmail(0).getText()).toBe('a@a.com');
      expect(page.guestListRowEmail(1).getText()).toBe('b@b.com');
      expect(page.guestListRowEmail(2).getText()).toBe('c@c.com');
      expect(page.guestListRowEmail(3).getText()).toBe('d@d.com');
      expect(page.guestListRowEmail(4).getText()).toBe('e@e.com');
    });

    it('should not display the invalid email list on subsequent navigations', function(){
      commonWorkflows.fastRefresh();

      expect(page.invalidEmails.count()).toBe(0);
      expect(page.guestListRows.count()).toBe(5);
    });
  });
})();
