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
    sidebar.editProfileLink.click();
  };

  it('should run once before all', function() {
    var context = commonWorkflows.createBlog();
    registration = context.registration;
    blog = context.blog;
    navigateToPage();
  });

  var testInitialContent = function(){

    it('should contain a vanity url', function(){
      expect(page.vanityUrl.getText()).toBe('https://www.fifthweek.com/' + registration.username);
    });

    it('should contain the blog name', function(){
      expect(element(by.id(page.nameTextBoxId)).getAttribute('value')).toBe(blog.name);
    });

    it('should contain the default introduction', function(){
      expect(element(by.id(page.introductionTextBoxId)).getAttribute('value')).toBe('');
    });

    it('should contain a blank header image', function(){
      expect(page.noHeaderImage.isDisplayed()).toBe(true);
    });

    it('should contain a file upload button', function(){
      expect(page.fileUploadButton.isDisplayed()).toBe(true);
    });

    it('should contain the video link', function(){
      expect(element(by.id(page.videoTextBoxId)).getAttribute('value')).toBe('');
    });

    it('should contain the description', function(){
      expect(element(by.id(page.descriptionTextBoxId)).getText()).toBe('');
    });

    it('should contain the submit button', function(){
      expect(page.submitButton.isDisplayed()).toBe(true);
      expect(page.submitButton.isEnabled()).toBe(false);
    });
  };

  var populateForm = function(){
    var newValues = {
      introduction: 'Introduction ' + Math.round(Math.random() * 100000),
      name: 'Blog ' + Math.round(Math.random() * 100000)
    };

    it('should populate the form with new data', function(){
      expect(page.submitButton.isEnabled()).toBe(false);

      testKit.setValue(page.nameTextBoxId, newValues.name);
      expect(page.submitButton.isEnabled()).toBe(true);

      testKit.setValue(page.introductionTextBoxId, newValues.introduction);

      page.setFileInput('../../sample-image.jpg');
      testKit.waitForElementToDisplay(page.headerImage);

      testKit.setValue(page.videoTextBoxId, validVideo);
      testKit.setContentEditableValue(page.descriptionTextBoxId, validDescription);
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
        page.cancelButton.click();
      });

      testInitialContent();
    });

    discardChanges.describeDiscardingChanges(
      navigateToPage,
      function(){ sidebar.subscriptionsLink.click(); },
      function(){ testKit.setValue(page.nameTextBoxId, 'New Name');},
      function(){ expect(element(by.id(page.nameTextBoxId)).getAttribute('value')).toBe('New Name'); },
      function(){ expect(element(by.id(page.nameTextBoxId)).getAttribute('value')).toBe(blog.name); }
    );

    describe('when saving changes', function(){

      var formValues = populateForm();

      it('should save successfully and display the success message', function(){
        page.submitButton.click();
        expect(page.successMessage.isDisplayed()).toBe(true);
        expect(page.submitButton.isEnabled()).toBe(false);
      });

      it('should reset the submit button and success message status on next change', function(){
        testKit.setValue(page.nameTextBoxId, '1');
        expect(page.successMessage.isDisplayed()).toBe(false);
        expect(page.submitButton.isEnabled()).toBe(true);
        commonWorkflows.fastRefresh();
      });

      it('should persist new settings between sessions', function(){
        commonWorkflows.reSignIn(registration);
        navigateToPage();

        expect(element(by.id(page.nameTextBoxId)).getAttribute('value')).toBe(formValues.name);
        expect(element(by.id(page.introductionTextBoxId)).getAttribute('value')).toBe(formValues.introduction);

        testKit.waitForElementToDisplay(page.headerImage);

        expect(element(by.id(page.videoTextBoxId)).getAttribute('value')).toBe(validVideo);
        expect(element(by.id(page.descriptionTextBoxId)).getText()).toBe(validDescription);
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
        page.submitButton.click();
        expect(page.successMessage.isDisplayed()).toBe(true);
        expect(page.submitButton.isEnabled()).toBe(false);

        commonWorkflows.fastRefresh();
      });

      testKit.includeHappyPaths(page, nameInputPage, 'nameTextBox');

      it('should allow symbols in introductions', function(){
        testKit.setValue(page.introductionTextBoxId, testKit.punctuation33);
      });

      it('should allow an empty introduction', function(){
        testKit.clear(page.introductionTextBoxId);
      });

      testKit.includeHappyPaths(page, videoUrlInputPage, 'videoTextBox');

      it('should allow symbols in descriptions', function(){
        testKit.setContentEditableValue(page.descriptionTextBoxId, testKit.punctuation33);
      });

      it('should allow empty descriptions', function(){
        testKit.clearContentEditable(page.descriptionTextBoxId);
      });

      it('should allow empty video urls', function(){
        testKit.clear(page.videoTextBoxId);
      });
    });

    describe('sad path', function() {

      var verifyInvalidMessage = function(){
        expect(page.invalidMessage.isDisplayed()).toBe(true);
        expect(page.submitButton.isEnabled()).toBe(true);
      };

      afterEach(function(){
        commonWorkflows.fastRefresh();
      });

      testKit.includeSadPaths(page, page.submitButton, page.helpMessages, nameInputPage, 'nameTextBox');

      it('should not allow an introduction more than 250 characters', function(){
        var overSizedValue = new Array(252).join( 'a' );
        testKit.setValue(page.introductionTextBoxId, overSizedValue, true);

        testKit.assertMaxLength(page.helpMessages, page.introductionTextBoxId, overSizedValue, 250);
      });

      testKit.includeSadPaths(page, page.submitButton, page.helpMessages, videoUrlInputPage, 'videoTextBox', null, true);

      it('should not allow descriptions over 50000 characters', function(){
        var overSizedValue = new Array(50002).join( 'a' );
        testKit.setContentEditableValue(page.descriptionTextBoxId, overSizedValue, true);

        testKit.assertContentEditableMaxLength(page.helpMessages, page.descriptionTextBoxId, overSizedValue, 50000);
      });
    });
  });
});
