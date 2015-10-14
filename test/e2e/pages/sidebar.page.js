'use strict';

var SidebarPage = function() {};

SidebarPage.prototype = Object.create({}, {
  sidebar: { get: function () { return element(by.id('sidebar')); }},
  links: { get: function () { return element.all(by.css('#sidebar ul a')); }},

  fifthweekLogoLink: { get: function () { return element(by.id('fifthweek-logo-link')); }},

  signInLink: { get: function () { return element(by.id('sidebar-navigation-sign-in')); }},
  registerLink: { get: function () { return element(by.id('sidebar-navigation-register')); }},

  latestPostsLink: { get: function () { return element(by.id('sidebar-navigation-latest-posts')); }},
  subscriptionsLink: { get: function () { return element(by.id('sidebar-navigation-subscriptions')); }},

  publishLink: { get: function () { return element(by.id('sidebar-navigation-publish')); }},
  createChannelLink: { get: function () { return element(by.id('sidebar-navigation-create-channel')); }},

  newPostLink: { get: function () { return element(by.id('sidebar-navigation-new-post')); }},
  livePostsLink: { get: function () { return element(by.id('sidebar-navigation-live-posts')); }},
  scheduledPostsLink: { get: function () { return element(by.id('sidebar-navigation-scheduled-posts')); }},

  viewProfileLink: { get: function () { return element(by.id('sidebar-navigation-view-profile')); }},
  editProfileLink: { get: function () { return element(by.id('sidebar-navigation-edit-profile')); }},
  subscribersLink: { get: function () { return element(by.id('sidebar-navigation-subscribers')); }},
  guestListLink: { get: function () { return element(by.id('sidebar-navigation-guest-list')); }},

  accountLink: { get: function () { return element(by.id('sidebar-navigation-account')); }},
  signOutLink: { get: function () { return element(by.id('sidebar-navigation-sign-out')); }},
  sendFeedbackLink: { get: function () { return element(by.id('sidebar-navigation-send-feedback')); }},
  helpLink: { get: function () { return element(by.id('sidebar-navigation-help')); }},

  includeEstablishedCreatorTests: { value: function(highlightedLink) {
    var self = this;

    describe('creator sidebar', function() {
      it('should contain the correct number of links', function () {
        expect(self.links.count()).toBe(13);
      });

      it('should contain the expected links', function () {
        expect(self.latestPostsLink.isDisplayed()).toBe(true);
        expect(self.subscriptionsLink.isDisplayed()).toBe(true);
        expect(self.newPostLink.isDisplayed()).toBe(true);
        expect(self.livePostsLink.isDisplayed()).toBe(true);
        expect(self.scheduledPostsLink.isDisplayed()).toBe(true);
        expect(self.viewProfileLink.isDisplayed()).toBe(true);
        expect(self.editProfileLink.isDisplayed()).toBe(true);
        expect(self.subscribersLink.isDisplayed()).toBe(true);
        expect(self.guestListLink.isDisplayed()).toBe(true);
        expect(self.accountLink.isDisplayed()).toBe(true);
        expect(self.signOutLink.isDisplayed()).toBe(true);
        expect(self.sendFeedbackLink.isDisplayed()).toBe(true);
        expect(self.helpLink.isDisplayed()).toBe(true);
      });

      if(highlightedLink){
        it('should highlight the current area', function () {
          expect(highlightedLink.getAttribute('class')).toContain('active');
        });
      }
    });
  }},

  includeNewCreatorTests: { value: function(highlightedLink) {
    var self = this;

    describe('new creator sidebar', function() {
      it('should contain the correct number of links', function () {
        expect(self.links.count()).toBe(7);
      });

      it('should contain the expected links', function () {
        expect(self.latestPostsLink.isDisplayed()).toBe(true);
        expect(self.subscriptionsLink.isDisplayed()).toBe(true);
        expect(self.createChannelLink.isDisplayed()).toBe(true);
        expect(self.accountLink.isDisplayed()).toBe(true);
        expect(self.signOutLink.isDisplayed()).toBe(true);
        expect(self.sendFeedbackLink.isDisplayed()).toBe(true);
        expect(self.helpLink.isDisplayed()).toBe(true);
      });

      if(highlightedLink){
        it('should highlight the current area', function () {
          expect(highlightedLink.getAttribute('class')).toContain('active');
        });
      }
    });
  }},

  includeConsumerTests: { value: function(highlightedLink) {
    var self = this;

    describe('consumer sidebar', function() {
      it('should contain the correct number of links', function () {
        expect(self.links.count()).toBe(7);
      });

      it('should contain the expected links', function () {
        expect(self.latestPostsLink.isDisplayed()).toBe(true);
        expect(self.subscriptionsLink.isDisplayed()).toBe(true);
        expect(self.publishLink.isDisplayed()).toBe(true);
        expect(self.accountLink.isDisplayed()).toBe(true);
        expect(self.signOutLink.isDisplayed()).toBe(true);
        expect(self.sendFeedbackLink.isDisplayed()).toBe(true);
        expect(self.helpLink.isDisplayed()).toBe(true);
      });

      if(highlightedLink){
        it('should highlight the current area', function () {
          expect(highlightedLink.getAttribute('class')).toContain('active');
        });
      }
    });
  }},

  includeSignedOutTests: { value: function(highlightedLink) {
    var self = this;

    describe('consumer sidebar', function() {
      it('should contain the correct number of links', function () {
        expect(self.links.count()).toBe(3);
      });

      it('should contain the expected links', function () {
        expect(self.signInLink.isDisplayed()).toBe(true);
        expect(self.registerLink.isDisplayed()).toBe(true);
        expect(self.helpLink.isDisplayed()).toBe(true);
      });

      if(highlightedLink){
        it('should highlight the current area', function () {
          expect(highlightedLink.getAttribute('class')).toContain('active');
        });
      }
    });
  }}
});

module.exports = SidebarPage;
