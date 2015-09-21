var CommonWorkflows = require('../../common-workflows.js');
var TestKit = require('../../test-kit.js');
var SidebarPage = require('../../pages/sidebar.page.js');
var CreatorLandingPagePage = require('../../pages/creators/creator-landing-page.page.js');
var LandingPagePage = require('../../pages/creators/customize-landing-page.page.js');
var BlogNameInputPage = require('../../pages/blog-name-input.page.js');
var VideoUrlInputPage = require('../../pages/video-url-input.page.js');
var DiscardChangesPage = require('../../pages/discard-changes.page.js');

describe('customize landing page form', function() {
  'use strict';

  var registration;
  var blog;

  var commonWorkflows = new CommonWorkflows();
  var sidebar = new SidebarPage();
  var page = new LandingPagePage();
  var testKit = new TestKit();
  var creatorLandingPagePage = new CreatorLandingPagePage();
  var nameInputPage = new BlogNameInputPage();
  var videoUrlInputPage = new VideoUrlInputPage();
  var discardChanges = new DiscardChangesPage();

  var validVideo = 'https://www.youtube.com/watch?v=vEQrP3bGX8k';
  var validDescription = 'In publishing and graphic design, lorem ipsum is a filler text commonly used to demonstrate the graphic elements of a document or visual presentation. Replacing meaningful content that could be distracting with placeholder text may allow viewers to focus on graphic aspects such as font, typography, and page layout. It also reduces the need for the designer to come up with meaningful text, as they can instead use hastily generated lorem ipsum text.';

  var navigateToPage = function() {
    sidebar.landingPageLink.click();
    creatorLandingPagePage.editPageLink.click();
  };

  it('should run once before all', function() {
    var context = commonWorkflows.createBlog();
    registration = context.registration;
    blog = context.blog;
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
      });

      it('should contain the blog name', function(){
        expect(element(by.id(page.nameTextBoxId)).getAttribute('value')).toBe(blog.name);
      });

      it('should contain the default introduction', function(){
        expect(element(by.id(page.introductionTextBoxId)).getAttribute('value')).toBe('');
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
        expect(element(by.id(page.videoTextBoxId)).getAttribute('value')).toBe('');
      });

      it('should contain the description', function(){
        expect(element(by.id(page.descriptionTextBoxId)).getAttribute('value')).toBe('');
      });

      it('should contain the submit button', function(){
        expect(page.fullDescriptionSubmitButton.isDisplayed()).toBe(true);
        expect(page.fullDescriptionSubmitButton.isEnabled()).toBe(false);
      });

    });
  };

  var populateForm = function(){
    var newValues = {
      introduction: 'Introduction ' + Math.round(Math.random() * 100000),
      name: 'Blog ' + Math.round(Math.random() * 100000)
    };

    it('should populate the form with new data', function(){
      page.basicsTabLink.click();
      expect(page.basicsSubmitButton.isEnabled()).toBe(false);

      testKit.setValue(page.nameTextBoxId, newValues.name);
      expect(page.basicsSubmitButton.isEnabled()).toBe(true);

      testKit.setValue(page.introductionTextBoxId, newValues.introduction);

      page.headerImageTabLink.click();
      expect(page.headerImageSubmitButton.isEnabled()).toBe(true);

      page.setFileInput('../../sample-image.jpg');
      testKit.waitForElementToDisplay(page.headerImage);

      page.fullDescriptionTabLink.click();
      expect(page.fullDescriptionSubmitButton.isEnabled()).toBe(true);

      testKit.setValue(page.videoTextBoxId, validVideo);
      testKit.setValue(page.descriptionTextBoxId, validDescription);
    });

    return newValues;
  };

  describe('when first loaded after creating a blog', function(){

    testInitialContent();

    describe('when not saving changes', function(){

      populateForm();

      it('should not save the changes', function(){
        commonWorkflows.fastRefresh();
      });

      testInitialContent();
    });

    describe('when cancelling changes', function(){

      populateForm();

      it('should cancel the changes', function(){
        page.fullDescriptionCancelButton.click();
      });

      testInitialContent();
    });

    discardChanges.describeDiscardingChanges(
      navigateToPage,
      function(){ sidebar.channelsLink.click(); },
      function(){ testKit.setValue(page.nameTextBoxId, 'New Name');},
      function(){ expect(element(by.id(page.nameTextBoxId)).getAttribute('value')).toBe('New Name'); },
      function(){ expect(element(by.id(page.nameTextBoxId)).getAttribute('value')).toBe(blog.name); }
    );

    describe('when saving changes', function(){

      var formValues = populateForm();

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
        testKit.setValue(page.nameTextBoxId, '1');
        expect(page.basicsSuccessMessage.isDisplayed()).toBe(false);
        expect(page.basicsSubmitButton.isEnabled()).toBe(true);
        commonWorkflows.fastRefresh();
      });

      it('should persist new settings between sessions', function(){
        commonWorkflows.reSignIn(registration);
        navigateToPage();

        expect(element(by.id(page.nameTextBoxId)).getAttribute('value')).toBe(formValues.name);
        expect(element(by.id(page.introductionTextBoxId)).getAttribute('value')).toBe(formValues.introduction);

        page.headerImageTabLink.click();
        testKit.waitForElementToDisplay(page.headerImage);

        page.fullDescriptionTabLink.click();

        expect(element(by.id(page.videoTextBoxId)).getAttribute('value')).toBe(validVideo);
        expect(element(by.id(page.descriptionTextBoxId)).getAttribute('value')).toBe(validDescription);
      });
    });
  });

  describe('when validating inputs', function() {

    it('should run once before all', function() {
      var context = commonWorkflows.createBlog();
      registration = context.registration;
      blog = context.blog;
      navigateToPage();
    });

    describe('happy path', function(){
      afterEach(function(){
        page.basicsTabLink.click();
        page.basicsSubmitButton.click();
        expect(page.basicsSuccessMessage.isDisplayed()).toBe(true);
        expect(page.basicsSubmitButton.isEnabled()).toBe(false);

        commonWorkflows.fastRefresh();
      });

      describe('for "basics" section', function() {
        beforeEach(function() {
          page.basicsTabLink.click();
        });

        testKit.includeHappyPaths(page, nameInputPage, 'nameTextBox');

        it('should allow symbols in introductions', function(){
          testKit.setValue(page.introductionTextBoxId, testKit.punctuation33);
        });

        it('should allow an empty introduction', function(){
          testKit.clear(page.introductionTextBoxId);
        });
      });

      describe('for "full description" section', function() {
        beforeEach(function() {
          page.fullDescriptionTabLink.click();
        });

        testKit.includeHappyPaths(page, videoUrlInputPage, 'videoTextBox');

        it('should allow symbols in descriptions', function(){
          testKit.setValue(page.descriptionTextBoxId, testKit.punctuation33);
        });

        it('should allow empty descriptions', function(){
          testKit.clear(page.descriptionTextBoxId);
        });

        it('should allow empty video urls', function(){
          testKit.clear(page.videoTextBoxId);
        });
      });
    });

    describe('sad path', function() {

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

      afterEach(function(){
        commonWorkflows.fastRefresh();
      });

      describe('for "basics" section', function() {
        beforeEach(function () {
          page.basicsTabLink.click();
        });

        testKit.includeSadPaths(page, page.basicsSubmitButton, page.helpMessages, nameInputPage, 'nameTextBox');

        it('should not allow an introduction more than 250 characters', function(){
          var overSizedValue = new Array(252).join( 'a' );
          testKit.setValue(page.introductionTextBoxId, overSizedValue, true);

          testKit.assertMaxLength(page.helpMessages, page.introductionTextBoxId, overSizedValue, 250);
        });
      });

      describe('for "full description" section', function() {
        beforeEach(function() {
          page.fullDescriptionTabLink.click();
        });

        testKit.includeSadPaths(page, page.fullDescriptionSubmitButton, page.helpMessages, videoUrlInputPage, 'videoTextBox', null, true);

        it('should not allow descriptions over 2000 characters', function(){
          page.fullDescriptionTabLink.click();

          var overSizedValue = new Array(2002).join( 'a' );
          testKit.setValue(page.descriptionTextBoxId, overSizedValue, true);

          testKit.assertMaxLength(page.helpMessages, page.descriptionTextBoxId, overSizedValue, 2000);
        });
      });
    });
  });
});
