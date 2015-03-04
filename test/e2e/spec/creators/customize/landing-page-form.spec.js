var CommonWorkflows = require('../../../common-workflows.js');
var SidebarPage = require('../../../pages/sidebar.page.js');
var HeaderCustomizePage = require('../../../pages/header-customize.page.js');
var LandingPagePage = require('../../../pages/creators/customize/landing-page.page.js');

describe('customize landing page form', function() {
  'use strict';

  var registration;
  var subscription;

  var commonWorkflows = new CommonWorkflows();
  var sidebar = new SidebarPage();
  var header = new HeaderCustomizePage();
  var page = new LandingPagePage();

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
  });

  describe('when validating against bad input', function() {
  });
});
