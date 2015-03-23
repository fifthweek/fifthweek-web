(function(){
  'use strict';

  var Defaults = require('../../defaults.js');
  var CommonWorkflows = require('../../common-workflows.js');
  var SidebarPage = require('../../pages/sidebar.page.js');
  var HeaderPage = require('../../pages/header.page.js');
  var HeaderCreatorPage = require('../../pages/header-creator.page.js');
  var CreatorLandingPagePage = require('../../pages/creators/creator-landing-page.page.js');
  var CustomizeLandingPagePage = require('../../pages/creators/subscription/customize-landing-page.page.js');

  ddescribe('creator landing page', function() {

    var subscription;
    var registration;

    var defaults = new Defaults();
    var commonWorkflows = new CommonWorkflows();
    var sidebar = new SidebarPage();
    var headerStandard = new HeaderPage();
    var headerCreator = new HeaderCreatorPage();
    var customizeLandingPagePage = new CustomizeLandingPagePage();
    var page = new CreatorLandingPagePage();

    it('should not contain the standard sidebar or header', function() {
      var context = commonWorkflows.createSubscription();
      subscription = context.subscription;
      registration = context.registration;

      sidebar.usernameLink.click();
      expect(sidebar.sidebar.isDisplayed()).toBe(false);
      expect(headerStandard.navbar.isDisplayed()).toBe(false);
    });

    describe('after creating a subscription', function() {
      headerCreator.includeTests(function() { return subscription; }, function() { return defaults.introduction });
    });

    describe('after signing back in', function() {
      it('should run once before all', function() {
        commonWorkflows.reSignIn(registration);
        sidebar.usernameLink.click();
      });

      headerCreator.includeTests(function() { return subscription; }, function() { return defaults.introduction });
    });

    describe('more info', function() {
      var fullDescription = customizeLandingPagePage.newFullDescription();
      var videoUrlDomain = 'vimeo.com';
      var videoUrlId = '114229222';

      it('should be hidden in absence of a full description and video', function() {
        expect(page.moreInfo.isPresent()).toBe(false);
      });

      it('should display full description when provided', function() {
        page.fifthweekLink.click();
        sidebar.subscriptionLink.click();
        customizeLandingPagePage.fullDescriptionTabLink.click();
        customizeLandingPagePage.descriptionTextBox.clear();
        customizeLandingPagePage.descriptionTextBox.sendKeys(fullDescription);
        customizeLandingPagePage.fullDescriptionSubmitButton.click();
        sidebar.usernameLink.click();

        expect(page.moreInfo.isPresent()).toBe(true);
        expect(page.video.isPresent()).toBe(false);
        expect(page.fullDescription.getText()).toBe(fullDescription);
      });

      it('should display video when provided', function() {
        page.fifthweekLink.click();
        sidebar.subscriptionLink.click();
        customizeLandingPagePage.fullDescriptionTabLink.click();
        customizeLandingPagePage.descriptionTextBox.clear();
        customizeLandingPagePage.videoTextBox.clear();
        customizeLandingPagePage.videoTextBox.sendKeys('https://' + videoUrlDomain + '/' + videoUrlId);
        customizeLandingPagePage.fullDescriptionSubmitButton.click();
        sidebar.usernameLink.click();

        expect(page.moreInfo.isPresent()).toBe(true);
        expect(page.video.isPresent()).toBe(true);
        expect(page.video.getAttribute('src')).toContain(videoUrlDomain);
        expect(page.video.getAttribute('src')).toContain(videoUrlId);
      });

      it('should display full description and video when both are provided', function() {
        page.fifthweekLink.click();
        sidebar.subscriptionLink.click();
        customizeLandingPagePage.fullDescriptionTabLink.click();
        customizeLandingPagePage.descriptionTextBox.sendKeys(fullDescription);
        customizeLandingPagePage.fullDescriptionSubmitButton.click();
        sidebar.usernameLink.click();

        expect(page.moreInfo.isPresent()).toBe(true);
        expect(page.video.isPresent()).toBe(true);
        expect(page.video.getAttribute('src')).toContain(videoUrlDomain);
        expect(page.video.getAttribute('src')).toContain(videoUrlId);
        expect(page.fullDescription.getText()).toBe(fullDescription);
      });
    });

    it('should display the default channel', function() {

    });

    it('should display other channels below the default channel', function() {

    });

    var describeTotalPrice = function(elementName) {
      describe(elementName, function() {
        it('should contain the default channel price by default', function() {

        });

        it('should always include the default channel price (it may not be deselected)', function() {

        });

        it('should sum all selected channels as they are selected', function() {

        });

        it('should sum all selected channels as they are deselected', function() {

        });
      });
    };

    //describeTotalPrice('subscribe button', subscribeButton);
    //describeTotalPrice('channel list total', channelListTotal);
    //
    //var describeSubscribeButton = function(elementName) {
    //  describe(elementName, function() {
    //    it('should display the timeline when clicked', function() {
    //
    //    });
    //  });
    //};
    //
    //describeSubscribeButton('subscribe button', subscribeButton);
    //describeSubscribeButton('channel list subscribe link', channelListSubscribeLink);
  });
})();
