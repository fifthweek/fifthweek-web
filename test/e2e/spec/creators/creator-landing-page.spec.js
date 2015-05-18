(function(){
  'use strict';

  var _ = require('lodash');
  var Defaults = require('../../defaults.js');
  var TestKit = require('../../test-kit.js');
  var CommonWorkflows = require('../../common-workflows.js');
  var SidebarPage = require('../../pages/sidebar.page.js');
  var HeaderPage = require('../../pages/header.page.js');
  var HeaderCreatorPage = require('../../pages/header-creator.page.js');
  var CustomizeLandingPagePage = require('../../pages/creators/customize-landing-page.page.js');
  var CreatorTimelinePage = require('../../pages/creators/creator-timeline.page.js');
  var CreatorLandingPagePage = require('../../pages/creators/creator-landing-page.page.js');
  var SignInWorkflowPage = require('../../pages/sign-in-workflow.page.js');
  var GuestListPage = require('../../pages/creators/guest-list.page.js');
  var SubscribersHeaderPage = require('../../pages/header-subscribers.page.js');

  describe('creator landing page', function() {

    var blog;
    var creatorRegistration;
    var userRegistration;
    var visibleChannels = [];

    var defaults = new Defaults();
    var testKit = new TestKit();
    var commonWorkflows = new CommonWorkflows();
    var sidebar = new SidebarPage();
    var headerStandard = new HeaderPage();
    var headerCreator = new HeaderCreatorPage();
    var customizeLandingPagePage = new CustomizeLandingPagePage();
    var creatorTimelinePage = new CreatorTimelinePage();
    var page = new CreatorLandingPagePage();
    var signInWorkflow = new SignInWorkflowPage();
    var guestListPage = new GuestListPage();
    var subscribersHeader = new SubscribersHeaderPage();

    var navigateToPage = function() {
      sidebar.landingPageLink.click();
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
      userRegistration = commonWorkflows.register();
      var context = commonWorkflows.createBlog();
      blog = context.blog;
      creatorRegistration = context.registration;
    });

    it('should not contain the standard sidebar or header', function() {
      navigateToPage();
      runForCreatorAndUserAndLoggedOutUser(function(){
        expect(sidebar.sidebar.isDisplayed()).toBe(false);
        expect(headerStandard.navbar.isDisplayed()).toBe(false);
      });
    });

    describe('after creating a blog', function() {
      describeForCreatorAndUserAndLoggedOutUser(function(){
        headerCreator.includeTests(function() { return blog; }, function() { return defaults.introduction });
      });
    });

    describe('after signing back in', function() {
      it('should run once before all', function() {
        commonWorkflows.reSignIn(creatorRegistration);
        navigateToPage();
      });

      headerCreator.includeTests(function() { return blog; }, function() { return defaults.introduction });
    });

    describe('more info', function() {
      var fullDescription = customizeLandingPagePage.newFullDescription();
      var videoUrlDomain = 'vimeo.com';
      var videoUrlId = '114229222';

      it('should be hidden in absence of a full description and video', function() {
        runForCreatorAndUserAndLoggedOutUser(function(){
          expect(page.moreInfo.isPresent()).toBe(false);
        });
      });

      it('should display full description when provided', function() {
        page.editPageLink.click();
        customizeLandingPagePage.fullDescriptionTabLink.click();
        testKit.setValue(customizeLandingPagePage.descriptionTextBoxId, fullDescription);
        customizeLandingPagePage.fullDescriptionSubmitButton.click();
        navigateToPage();

        runForCreatorAndUserAndLoggedOutUser(function(){
          expect(page.moreInfo.isPresent()).toBe(true);
          expect(page.video.isPresent()).toBe(false);
          expect(page.fullDescription.getText()).toBe(fullDescription);
        });
      });

      it('should display video when provided', function() {
        page.editPageLink.click();
        customizeLandingPagePage.fullDescriptionTabLink.click();
        testKit.clear(customizeLandingPagePage.descriptionTextBoxId);
        testKit.setValue(customizeLandingPagePage.videoTextBoxId, 'https://' + videoUrlDomain + '/' + videoUrlId);
        customizeLandingPagePage.fullDescriptionSubmitButton.click();
        navigateToPage();

        runForCreatorAndUserAndLoggedOutUser(function(){
          expect(page.moreInfo.isPresent()).toBe(true);
          expect(page.video.isPresent()).toBe(true);
          expect(page.video.getAttribute('src')).toContain(videoUrlDomain);
          expect(page.video.getAttribute('src')).toContain(videoUrlId);
        });
      });

      it('should display full description and video when both are provided', function() {
        page.editPageLink.click();
        customizeLandingPagePage.fullDescriptionTabLink.click();
        testKit.setValue(customizeLandingPagePage.descriptionTextBoxId, fullDescription);
        customizeLandingPagePage.fullDescriptionSubmitButton.click();
        navigateToPage();

        runForCreatorAndUserAndLoggedOutUser(function(){
          expect(page.moreInfo.isPresent()).toBe(true);
          expect(page.video.isPresent()).toBe(true);
          expect(page.video.getAttribute('src')).toContain(videoUrlDomain);
          expect(page.video.getAttribute('src')).toContain(videoUrlId);
          expect(page.fullDescription.getText()).toBe(fullDescription);
        });
      });
    });

    describe('channel list', function() {
      it('should display the default channel', function() {
        visibleChannels.push({
          name: defaults.channelName,
            description: defaults.channelDescription,
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
            var channelDescription = channel.element(by.css('.channel-description'));
            var channelPrice = channel.element(by.css('.channel-price'));

            expect(channelName.getText()).toContain(visibleChannels[i].name);
            expect(channelDescription.getText()).toContain(visibleChannels[i].description);
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

        it('should equal the default channel price by default', function() {
          expectPrice(blog.basePrice);
        });

        it('should always include the default channel price (it may not be deselected)', function() {
          page.getChannelPrice(0).click();
          expectPrice(blog.basePrice);
        });

        it('should sum all selected channels as they are selected', function() {
          priceSum = blog.basePrice;
          for (var i = 1; i < visibleChannels.length; i++) {
            priceSum = (parseFloat(priceSum) + parseFloat(visibleChannels[i].price)).toFixed(2);
            page.getChannelPrice(i).click();
            expectPrice(priceSum);
          }
        });

        it('should sum all selected channels as they are deselected', function() {
          for (var i = 1; i < visibleChannels.length; i++) {
            priceSum = (parseFloat(priceSum) - parseFloat(visibleChannels[i].price)).toFixed(2);
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

    describe('subscribing', function() {

       describe('subscribing when creator', function(){
        afterEach(function() {
          // The timeline is tested as part of another spec. We just want to ensure that all routes to subscribe
          // take the user to the timeline.
          expect(creatorTimelinePage.subscribedButton.isPresent()).toBe(true);
          page.fifthweekLink.click();
          navigateToPage();
        });

        it('should be possible via the "subscribe" button', function() {
          page.subscribeButton.click();
        });

        it('should be possible via the "subscribe now" link', function() {
          page.channelListSubscribeLink.click();
        });
      });
      describe('when not on guest list', function(){
        afterEach(function() {
          signInWorkflow.expectGuestListOnlyDisplayed();
          signInWorkflow.guestListOnlyDismissButton.click();
        });

        describe('subscribing as signed-in user not on guest-list', function(){
          it('should be possible via the "subscribe" button', function(){
            commonWorkflows.reSignIn(userRegistration);
            commonWorkflows.getPage('/' + creatorRegistration.username);
            page.subscribeButton.click();
          });

          it('should be possible via the "subscribe now" link', function() {
            page.channelListSubscribeLink.click();
          });
        });

        describe('subscribing as signed-out user not on guest-list', function(){
          beforeEach(function(){
            commonWorkflows.signOut();
            commonWorkflows.getPage('/' + creatorRegistration.username);
          });

          afterEach(function(){
            signInWorkflow.expectRegisterDisplayed();
            signInWorkflow.signInSuccessfully(userRegistration);
          });

          it('should be possible via the "subscribe" button', function(){
            page.subscribeButton.click();
          });

          it('should be possible via the "subscribe now" link', function() {
            page.channelListSubscribeLink.click();
          });
        });

        describe('subscribing as new user not on guest-list', function(){
          beforeEach(function(){
            commonWorkflows.signOut();
            commonWorkflows.getPage('/' + creatorRegistration.username);
          });

          afterEach(function(){
            signInWorkflow.expectRegisterDisplayed();
            signInWorkflow.registerSuccessfully();
          });

          it('should be possible via the "subscribe" button', function(){
            page.subscribeButton.click();
          });

          it('should be possible via the "subscribe now" link', function() {
            page.channelListSubscribeLink.click();
          });
        });
      });

      describe('when on guest list', function(){
        var userRegistration2;
        var userRegistration3;
        it('should run once before all', function(){
          userRegistration2 = signInWorkflow.newRegistrationData();
          userRegistration3 = signInWorkflow.newRegistrationData();

          commonWorkflows.reSignIn(creatorRegistration);
          sidebar.subscribersLink.click();
          subscribersHeader.guestListLink.click();
          guestListPage.setNewGuestList([userRegistration.email, userRegistration2.email, userRegistration3.email]);
        });

        describe('when subscribing on guest list', function(){
          afterEach(function() {
            expect(creatorTimelinePage.subscribedButton.isPresent()).toBe(true);
            page.unsubscribeButton.click();
          });

          describe('subscribing as signed-in user on guest-list', function(){
            beforeEach(function(){
              commonWorkflows.reSignIn(userRegistration);
              commonWorkflows.getPage('/' + creatorRegistration.username);
            });

            afterEach(function(){
            });

            it('should be possible via the "subscribe" button', function(){
              page.subscribeButton.click();
            });

            it('should be possible via the "subscribe now" link', function() {
              page.channelListSubscribeLink.click();
            });
          });

          describe('subscribing as signed-out user on guest-list', function(){
            beforeEach(function(){
              commonWorkflows.signOut();
              commonWorkflows.getPage('/' + creatorRegistration.username);
            });

            afterEach(function(){
              signInWorkflow.expectRegisterDisplayed();
              signInWorkflow.signInSuccessfully(userRegistration);
            });

            it('should be possible via the "subscribe" button', function(){
              page.subscribeButton.click();
            });

            it('should be possible via the "subscribe now" link', function() {
              page.channelListSubscribeLink.click();
            });
          });

          describe('subscribing as new user on guest-list', function(){
            beforeEach(function(){
              commonWorkflows.signOut();
              commonWorkflows.getPage('/' + creatorRegistration.username);
            });

            afterEach(function(){
            });

            it('should be possible via the "subscribe" button', function(){
              page.subscribeButton.click();
              signInWorkflow.expectRegisterDisplayed();
              signInWorkflow.registerSuccessfullyWithData(userRegistration2);
            });

            it('should be possible via the "subscribe now" link', function() {
              page.channelListSubscribeLink.click();
              signInWorkflow.expectRegisterDisplayed();
              signInWorkflow.registerSuccessfullyWithData(userRegistration3);
            });
          });
        });
      });
    });
  });
})();
