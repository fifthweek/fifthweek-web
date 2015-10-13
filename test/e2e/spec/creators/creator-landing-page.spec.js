(function(){
  'use strict';

  var _ = require('lodash');
  var TestKit = require('../../test-kit.js');
  var CommonWorkflows = require('../../common-workflows.js');
  var SidebarPage = require('../../pages/sidebar.page.js');
  var HeaderPage = require('../../pages/header.page.js');
  var HeaderViewProfilePage = require('../../pages/header-view-profile.page.js');
  var CustomizeLandingPagePage = require('../../pages/creators/customize-landing-page.page.js');
  var CreatorLandingPagePage = require('../../pages/creators/creator-landing-page.page.js');
  var AccountSettingsPage = require('../../pages/account-settings.page.js');
  var ChannelListPage = require('../../pages/creators/channel-list.page.js');
  var PostPage = require('../../pages/post-preview.page.js');

  describe('creator landing page', function() {

    var blog;
    var creatorRegistration;
    var userRegistration;
    var visibleChannels = [];

    var testKit = new TestKit();
    var commonWorkflows = new CommonWorkflows();
    var sidebar = new SidebarPage();
    var headerStandard = new HeaderPage();
    var headerViewProfile = new HeaderViewProfilePage();
    var customizeLandingPage = new CustomizeLandingPagePage();
    var accountSettings = new AccountSettingsPage();
    var channelList = new ChannelListPage();
    var post = new PostPage();
    var page = new CreatorLandingPagePage();

    var navigateToPage = function() {
      sidebar.viewProfileLink.click();
    };

    var runForCreatorAndUserAndLoggedOutUser = function(delegate){
      delegate();
      commonWorkflows.signOut();
      commonWorkflows.getPage('/' + creatorRegistration.username);
      delegate();
      commonWorkflows.signIn(userRegistration);
      commonWorkflows.getPage('/' + creatorRegistration.username);
      delegate();
      commonWorkflows.reSignIn(creatorRegistration);
      navigateToPage();
    };

    var describeForCreatorAndUserAndLoggedOutUser = function(delegate){
      describe('when creator', function(){
        delegate();
      });

      describe('when user', function(){
        it('should run once before all', function(){
          commonWorkflows.signOut();
          commonWorkflows.getPage('/' + creatorRegistration.username);
        });
        delegate();
      });

      describe('when logged out user', function(){
        it('should run once before all', function(){
          commonWorkflows.signIn(userRegistration);
          commonWorkflows.getPage('/' + creatorRegistration.username);
        });
        delegate();
      });

      it('should run once after all', function(){
        commonWorkflows.reSignIn(creatorRegistration);
        navigateToPage();
      });
    };

    it('should run once before all', function() {
      userRegistration = commonWorkflows.registerAsCreator();
      var context = commonWorkflows.createBlog();
      blog = context.blog;
      creatorRegistration = context.registration;
    });

    it('should not contain the standard sidebar or header', function() {
      navigateToPage();
      runForCreatorAndUserAndLoggedOutUser(function(){
        //expect(sidebar.sidebar.isDisplayed()).toBe(false);
        expect(headerStandard.navbar.isDisplayed()).toBe(false);
      });
    });

    describe('after creating a blog', function() {
      describeForCreatorAndUserAndLoggedOutUser(function(){
        headerViewProfile.includeTests(function() { return blog; }, function() { return ''; });
      });
    });

    describe('after signing back in', function() {
      it('should run once before all', function() {
        commonWorkflows.reSignIn(creatorRegistration);
        navigateToPage();
      });

      headerViewProfile.includeTests(function() { return blog; }, function() { return ''; });
    });
/*
    it('should contain valid edit links', function() {
      page.editHeaderImageLink.click();
      expect(browser.getCurrentUrl()).toContain(customizeLandingPage.pageUrl);
      navigateToPage();

      page.editTitleLink.click();
      expect(browser.getCurrentUrl()).toContain(customizeLandingPage.pageUrl);
      navigateToPage();

      page.editAvatarLink.click();
      expect(browser.getCurrentUrl()).toContain(accountSettings.pageUrl);
      navigateToPage();

      page.editIntroductionLink.click();
      expect(browser.getCurrentUrl()).toContain(customizeLandingPage.pageUrl);
      navigateToPage();

      page.editChannelsLink.click();
      expect(browser.getCurrentUrl()).toContain(channelList.pageUrl);
      navigateToPage();

      page.editVideoLink.click();
      expect(browser.getCurrentUrl()).toContain(customizeLandingPage.pageUrl);
      navigateToPage();

      page.editDescriptionLink.click();
      expect(browser.getCurrentUrl()).toContain(customizeLandingPage.pageUrl);
      navigateToPage();
    });

    describe('more info', function() {
      var fullDescription = customizeLandingPage.newFullDescription();
      var videoUrlDomain = 'vimeo.com';
      var videoUrlId = '114229222';

      it('should display full description when provided', function() {
        page.editDescriptionLink.click();
        testKit.waitForElementToDisplay(element(by.id(customizeLandingPage.descriptionTextBoxId)));
        testKit.setContentEditableValue(customizeLandingPage.descriptionTextBoxId, fullDescription);
        customizeLandingPage.submitButton.click();
        navigateToPage();

        runForCreatorAndUserAndLoggedOutUser(function(){
          expect(page.video.isPresent()).toBe(false);
          expect(page.fullDescription.getText()).toBe(fullDescription);
        });
      });

      it('should display video when provided', function() {
        page.editVideoLink.click();
        testKit.waitForElementToDisplay(element(by.id(customizeLandingPage.descriptionTextBoxId)));
        testKit.clearContentEditable(customizeLandingPage.descriptionTextBoxId);
        testKit.setValue(customizeLandingPage.videoTextBoxId, 'https://' + videoUrlDomain + '/' + videoUrlId);
        customizeLandingPage.submitButton.click();
        navigateToPage();

        runForCreatorAndUserAndLoggedOutUser(function(){
          expect(page.video.isPresent()).toBe(true);
          expect(page.video.getAttribute('src')).toContain(videoUrlDomain);
          expect(page.video.getAttribute('src')).toContain(videoUrlId);
        });
      });

      it('should display full description and video when both are provided', function() {
        page.editDescriptionLink.click();
        testKit.waitForElementToDisplay(element(by.id(customizeLandingPage.descriptionTextBoxId)));
        testKit.setContentEditableValue(customizeLandingPage.descriptionTextBoxId, fullDescription);
        customizeLandingPage.submitButton.click();
        navigateToPage();

        runForCreatorAndUserAndLoggedOutUser(function(){
          expect(page.video.isPresent()).toBe(true);
          expect(page.video.getAttribute('src')).toContain(videoUrlDomain);
          expect(page.video.getAttribute('src')).toContain(videoUrlId);
          expect(page.fullDescription.getText()).toBe(fullDescription);
        });
      });
    });
*/
    describe('channel list', function() {
      it('should display the default channel', function() {
        visibleChannels.push({
          name: blog.name,
          price: blog.basePrice
        });

        expectVisibleChannels();
      });

      it('should display other channels below the default channel', function() {
        createHiddenAndVisibleChannels();
        expectVisibleChannels();
      });

      var expectVisibleChannels = function() {
        runForCreatorAndUserAndLoggedOutUser(function(){
          expect(page.channelCount).toBe(visibleChannels.length);
          for (var i = 0; i < visibleChannels.length; i++) {
            var channel = page.getChannel(i);
            var channelName = channel.element(by.css('.channel-name'));
            var channelPrice = channel.element(by.css('.channel-price'));

            expect(channelName.getText()).toContain(visibleChannels[i].name);
            expect(channelPrice.getText()).toContain('$' + visibleChannels[i].price);
          }
        });
      };

      var createHiddenAndVisibleChannels = function() {
        page.fifthweekLink.click();
        var newVisibleChannels = commonWorkflows.createHiddenAndVisibleChannels().visible;
        var newVisibleChannelsSorted = _.sortBy(newVisibleChannels, 'name');
        visibleChannels = visibleChannels.concat(newVisibleChannelsSorted);
        navigateToPage();
      };
    });

    describeForCreatorAndUserAndLoggedOutUser(function(){
      describe('total price', function() {
        var priceSum;

        it('should equal the sum of all channel prices by default', function() {
          priceSum = _.sum(visibleChannels, function(v){ return parseFloat(v.price); }).toFixed(2);
          expectPrice(priceSum);
        });

        it('should sum all selected channels as they are deselected', function() {
          for (var i = 0; i < visibleChannels.length; i++) {
            priceSum = (parseFloat(priceSum) - parseFloat(visibleChannels[i].price)).toFixed(2);
            page.getChannelPrice(i).click();
            expectPrice(priceSum);
          }
        });

        it('should sum all selected channels as they are selected', function() {
          priceSum = 0;
          for (var i = 0; i < visibleChannels.length; i++) {
            priceSum = (parseFloat(priceSum) + parseFloat(visibleChannels[i].price)).toFixed(2);
            page.getChannelPrice(i).click();
            expectPrice(priceSum);
          }
        });

        var expectPrice = function(price) {
          expect(page.subscribeButton.getText()).toContain('$' + price);
          expect(page.channelListTotalPrice.getText()).toContain('$' + price);
        }
      });
    });

    describe('when testing peeking at post previews', function(){

      it('should run once after all', function(){
        commonWorkflows.reSignIn(creatorRegistration);
      });

      it('should navigate to and from the preview page', function(){
        navigateToPage();
        page.previewButton.click();
        expect(browser.getCurrentUrl()).toContain('/' + creatorRegistration.username + '/preview-all');
        page.cancelPreviewButton.click();
        expect(browser.getCurrentUrl()).toContain('/' + creatorRegistration.username + '/manage');
      });

      it('should not show any post previews after posting note on date', function(){
        page.fifthweekLink.click();
        commonWorkflows.postNoteOnDate(0);

        runForCreatorAndUserAndLoggedOutUser(function(){
          page.previewButton.click();
          expect(post.noPostsMessage.isDisplayed()).toBe(true);
        });
      });

      it('should not show any post previews after posting note hidden channel', function(){
        page.fifthweekLink.click();
        commonWorkflows.postNoteNow(1);

        runForCreatorAndUserAndLoggedOutUser(function(){
          page.previewButton.click();
          expect(post.noPostsMessage.isDisplayed()).toBe(true);
        });
      });

      it('should show post previews after posting now', function(){
        page.fifthweekLink.click();
        var postData = commonWorkflows.postNoteNow(0);

        runForCreatorAndUserAndLoggedOutUser(function(){
          page.previewButton.click();
          expect(post.allPosts.count()).toBe(1);
          post.expectPost(blog, postData, creatorRegistration, function() { page.previewButton.click(); });
        });
      });

      it('should show post previews after posting to other channel', function(){
        page.fifthweekLink.click();
        var postData = commonWorkflows.postNoteNow(3);
        postData.channelName = visibleChannels[1].name;

        runForCreatorAndUserAndLoggedOutUser(function(){
          page.previewButton.click();
          expect(post.allPosts.count()).toBe(2);
          post.expectPost(blog, postData, creatorRegistration, function() { page.previewButton.click(); });
        });
      });
    });
  });
})();
