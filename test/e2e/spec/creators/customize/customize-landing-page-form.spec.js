var CommonWorkflows = require('../../../common-workflows.js');
var TestKit = require('../../../test-kit.js');
var SidebarPage = require('../../../pages/sidebar.page.js');
var HeaderCustomizePage = require('../../../pages/header-customize.page.js');
var LandingPagePage = require('../../../pages/creators/customize/customize-landing-page.page.js');
var SubscriptionNameInputPage = require('../../../pages/subscription-name-input.page.js');
var TaglineInputPage = require('../../../pages/tagline-input.page.js');

describe('customize landing page form', function() {
  'use strict';

  var registration;
  var subscription;

  var commonWorkflows = new CommonWorkflows();
  var sidebar = new SidebarPage();
  var header = new HeaderCustomizePage();
  var page = new LandingPagePage();
  var testKit = new TestKit();
  var subscriptionNameInputPage = new SubscriptionNameInputPage();
  var taglineInputPage = new TaglineInputPage();

  var validVideo = 'https://www.youtube.com/watch?v=vEQrP3bGX8k';
  var validDescription = 'In publishing and graphic design, lorem ipsum is a filler text commonly used to demonstrate the graphic elements of a document or visual presentation. Replacing meaningful content that could be distracting with placeholder text may allow viewers to focus on graphic aspects such as font, typography, and page layout. It also reduces the need for the designer to come up with meaningful text, as they can instead use hastily generated lorem ipsum text.';

  var navigateToPage = function() {
    sidebar.customizeLink.click();
  };

  it('should run once before all', function() {
    var context = commonWorkflows.createSubscription();
    registration = context.registration;
    subscription = context.subscription;
    navigateToPage();
  });

  var testInitialContent = function(){
    it('should contain a Basics tab', function(){
      expect(page.basicsTabLink.getText()).toBe('Basics');
    });

    it('should contain a Header Image tab', function(){
      expect(page.headerImageTabLink.getText()).toBe('Header Image');
    });

    it('should contain a Header Image tab', function(){
      expect(page.fullDescriptionTabLink.getText()).toBe('Full Description');
    });

    describe('when the Basics tab is selected', function(){

      it('should activate the Basics tab by default', function(){
        expect(page.basicsTab.getAttribute('class')).toContain('active');
        expect(page.headerImageTab.getAttribute('class')).not.toContain('active');
        expect(page.fullDescriptionTab.getAttribute('class')).not.toContain('active');
      });

      it('should contain a vanity url', function(){
        expect(page.vanityUrl.getText()).toBe('https://www.fifthweek.com/' + registration.username);
        expect(page.vanityUrl.getAttribute('ui-sref')).toBe('user.timeline');
      });

      it('should contain the subscription name', function(){
        expect(page.subscriptionNameTextBox.getAttribute('value')).toBe(subscription.name);
      });

      it('should contain the tagline', function(){
        expect(page.taglineTextBox.getAttribute('value')).toBe(subscription.tagline);
      });

      it('should contain the default introduction', function(){
        expect(page.introductionTextBox.getAttribute('value')).toContain('Hello!');
      });

      it('should contain the submit button', function(){
        expect(page.basicsSubmitButton.isDisplayed()).toBe(true);
        expect(page.basicsSubmitButton.isEnabled()).toBe(false);
      });
    });

    describe('when the Header Image tab is selected', function(){

      it('should activate the Header Image tab when clicked', function(){
        page.headerImageTabLink.click();
        expect(page.basicsTab.getAttribute('class')).not.toContain('active');
        expect(page.headerImageTab.getAttribute('class')).toContain('active');
        expect(page.fullDescriptionTab.getAttribute('class')).not.toContain('active');
      });

      it('should contain a blank header image', function(){
        expect(page.noHeaderImage.isDisplayed()).toBe(true);
      });

      it('should contain a file upload button', function(){
        expect(page.fileUploadButton.isDisplayed()).toBe(true);
      });

      it('should contain the submit button', function(){
        expect(page.headerImageSubmitButton.isDisplayed()).toBe(true);
        expect(page.headerImageSubmitButton.isEnabled()).toBe(false);
      });

    });

    describe('when the Full Description tab is selected', function(){

      it('should activate the Full Description tab when clicked', function(){
        page.fullDescriptionTabLink.click();
        expect(page.basicsTab.getAttribute('class')).not.toContain('active');
        expect(page.headerImageTab.getAttribute('class')).not.toContain('active');
        expect(page.fullDescriptionTab.getAttribute('class')).toContain('active');
      });

      it('should contain the video link', function(){
        expect(page.videoTextBox.getAttribute('value')).toBe('');
      });

      it('should contain the description', function(){
        expect(page.descriptionTextBox.getAttribute('value')).toBe('');
      });

      it('should contain the submit button', function(){
        expect(page.fullDescriptionSubmitButton.isDisplayed()).toBe(true);
        expect(page.fullDescriptionSubmitButton.isEnabled()).toBe(false);
      });

    });
  };

  var populateForm = function(){
    it('should populate the form with new data', function(){
      page.basicsTabLink.click();
      expect(page.basicsSubmitButton.isEnabled()).toBe(false);

      page.subscriptionNameTextBox.sendKeys('2');
      expect(page.basicsSubmitButton.isEnabled()).toBe(true);

      page.taglineTextBox.sendKeys('2');
      page.introductionTextBox.sendKeys('2');

      page.headerImageTabLink.click();
      expect(page.headerImageSubmitButton.isEnabled()).toBe(true);

      page.setFileInput('../../../sample-image.jpg');
      browser.wait(function(){
        return page.headerImage.isPresent();
      });
      expect(page.headerImage.isDisplayed()).toBe(true);

      page.fullDescriptionTabLink.click();
      expect(page.fullDescriptionSubmitButton.isEnabled()).toBe(true);

      page.videoTextBox.sendKeys(validVideo);
      page.descriptionTextBox.sendKeys(validDescription);
    });
  };

  describe('when first loaded after creating a subscription', function(){

    testInitialContent();

    describe('when cancelling changes', function(){

      populateForm();

      it('should cancel the changes', function(){
        sidebar.helpLink.click();
        sidebar.customizeLink.click();
      });

      testInitialContent();
    });

    describe('when saving changes', function(){

      populateForm();

      it('should save successfully and display the success message on all tabs', function(){
        page.fullDescriptionSubmitButton.click();
        expect(page.fullDescriptionSuccessMessage.isDisplayed()).toBe(true);
        expect(page.fullDescriptionSubmitButton.isEnabled()).toBe(false);

        page.headerImageTabLink.click();
        expect(page.headerImageSuccessMessage.isDisplayed()).toBe(true);
        expect(page.headerImageSubmitButton.isEnabled()).toBe(false);

        page.basicsTabLink.click();
        expect(page.basicsSuccessMessage.isDisplayed()).toBe(true);
        expect(page.basicsSubmitButton.isEnabled()).toBe(false);
      });

      it('should reset the submit button and success message status on next change', function(){
        page.subscriptionNameTextBox.sendKeys('1');
        expect(page.basicsSuccessMessage.isDisplayed()).toBe(false);
        expect(page.basicsSubmitButton.isEnabled()).toBe(true);
      });

      it('should persist new settings between sessions', function(){
        commonWorkflows.reSignIn(registration);
        navigateToPage();

        expect(page.subscriptionNameTextBox.getAttribute('value')).toBe(subscription.name + '2');
        expect(page.taglineTextBox.getAttribute('value')).toBe(subscription.tagline + '2');
        expect(page.introductionTextBox.getAttribute('value')).toContain('here!2');

        page.headerImageTabLink.click();

        browser.wait(function(){
          return page.headerImage.isPresent();
        });
        expect(page.headerImage.isDisplayed()).toBe(true);

        page.fullDescriptionTabLink.click();

        expect(page.videoTextBox.getAttribute('value')).toBe(validVideo);
        expect(page.descriptionTextBox.getAttribute('value')).toBe(validDescription);
      });
    });
  });

  describe('when validating against good input', function() {

    it('should run once before all', function() {
      var context = commonWorkflows.createSubscription();
      registration = context.registration;
      subscription = context.subscription;
      navigateToPage();
    });

    describe('happy path', function(){
      afterEach(function(){
        page.basicsTabLink.click();
        page.basicsSubmitButton.click();
        expect(page.basicsSuccessMessage.isDisplayed()).toBe(true);
        expect(page.basicsSubmitButton.isEnabled()).toBe(false);

        browser.refresh();
      });

      testKit.includeHappyPaths(page, subscriptionNameInputPage, 'subscriptionNameTextBox');
      testKit.includeHappyPaths(page, taglineInputPage, 'taglineTextBox');

      it('should allow symbols in introductions', function(){
        page.basicsTabLink.click();
        page.introductionTextBox.clear();
        page.introductionTextBox.sendKeys(testKit.punctuation33);
      });

      it('should allow symbols in descriptions', function(){
        page.fullDescriptionTabLink.click();
        page.descriptionTextBox.clear();
        page.descriptionTextBox.sendKeys(testKit.punctuation33);
      });

      it('should allow empty descriptions', function(){
        page.fullDescriptionTabLink.click();
        page.descriptionTextBox.clear();

      });

      it('should allow YouTube video urls', function(){
        page.fullDescriptionTabLink.click();
        page.videoTextBox.clear();
        page.videoTextBox.sendKeys('https://www.youtube.com/watch?v=OnqnCoPLdyw');
      });

      it('should allow short YouTube video urls', function(){
        page.fullDescriptionTabLink.click();
        page.videoTextBox.clear();
        page.videoTextBox.sendKeys('http://youtu.be/K3p0EFtJIn8');
      });

      it('should allow Vimeo video urls', function(){
        page.fullDescriptionTabLink.click();
        page.videoTextBox.clear();
        page.videoTextBox.sendKeys('https://vimeo.com/37328349');
      });

      it('should allow empty video urls', function(){
        page.fullDescriptionTabLink.click();
        page.videoTextBox.clear();
      });
    });
  });

  describe('when validating against bad input', function() {

    var verifyInvalidMessage = function(){
      page.headerImageTabLink.click();
      expect(page.headerImageInvalidMessage.isDisplayed()).toBe(true);
      expect(page.headerImageSubmitButton.isEnabled()).toBe(true);

      page.basicsTabLink.click();
      expect(page.basicsInvalidMessage.isDisplayed()).toBe(true);
      expect(page.basicsSubmitButton.isEnabled()).toBe(true);

      page.fullDescriptionTabLink.click();
      expect(page.fullDescriptionInvalidMessage.isDisplayed()).toBe(true);
      expect(page.fullDescriptionSubmitButton.isEnabled()).toBe(true);
    };

    beforeEach(function(){

    });

    afterEach(function(){
      browser.refresh();
    });

    subscriptionNameInputPage.includeSadPaths(page.subscriptionNameTextBox, page.basicsSubmitButton, page.helpMessages, function() {});

    taglineInputPage.includeSadPaths(page.taglineTextBox, page.basicsSubmitButton, page.helpMessages, function() {});

    it('should not allow an empty introduction', function(){
      page.basicsTabLink.click();
      page.introductionTextBox.clear();

      page.basicsSubmitButton.click();

      testKit.assertSingleValidationMessage(page.helpMessages,
        'An introduction is required.');

      verifyInvalidMessage();
    });

    it('should not allow an introduction less than 15 characters', function(){
      page.basicsTabLink.click();
      page.introductionTextBox.clear();
      var underSizedValue = new Array(15).join( 'a' );
      page.introductionTextBox.sendKeys(underSizedValue);

      page.basicsSubmitButton.click();

      testKit.assertSingleValidationMessage(page.helpMessages,
        'Must be at least 15 characters.');

      verifyInvalidMessage();
    });

    it('should not allow an introduction more than 250 characters', function(){
      page.basicsTabLink.click();
      page.introductionTextBox.clear();
      var overSizedValue = new Array(252).join( 'a' );
      page.introductionTextBox.sendKeys(overSizedValue);

      testKit.assertMaxLength(page.helpMessages, page.introductionTextBox, overSizedValue, 250);
    });

    it('should not allow invalid urls', function(){
      page.fullDescriptionTabLink.click();
      page.videoTextBox.clear();
      page.videoTextBox.sendKeys('abc');

      page.fullDescriptionSubmitButton.click();

      expect(page.videoTextBox.getAttribute('class')).toContain('ng-invalid');

      verifyInvalidMessage();
    });

    it('should not allow urls over 100 characters', function(){
      page.fullDescriptionTabLink.click();
      page.descriptionTextBox.clear();

      var overSizedValue = 'http://youtu.be/K3p0EFtJIn8' + new Array(102).join( 'a' );
      page.videoTextBox.sendKeys(overSizedValue);

      testKit.assertMaxLength(page.helpMessages, page.videoTextBox, overSizedValue, 100);
    });

    it('should not allow random urls', function(){
      page.fullDescriptionTabLink.click();
      page.videoTextBox.clear();
      page.videoTextBox.sendKeys('http://en.wikipedia.org/wiki/Lorem_ipsum');

      page.fullDescriptionSubmitButton.click();

      expect(page.fullDescriptionErrorMessage.isDisplayed()).toBe(true);
      expect(page.fullDescriptionErrorMessage.getText()).toBe('Must be from Vimeo or YouTube');
    });

    it('should not allow descriptions over 2000 characters', function(){
      page.fullDescriptionTabLink.click();
      page.descriptionTextBox.clear();

      var overSizedValue = new Array(2002).join( 'a' );
      page.descriptionTextBox.sendKeys(overSizedValue);

      testKit.assertMaxLength(page.helpMessages, page.descriptionTextBox, overSizedValue, 2000);
    });

  });
});
