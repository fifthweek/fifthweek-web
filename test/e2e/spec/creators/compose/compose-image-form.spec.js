var CommonWorkflows = require('../../../common-workflows.js');
var TestKit = require('../../../test-kit.js');
var SidebarPage = require('../../../pages/sidebar.page.js');
var HeaderComposePage = require('../../../pages/header-compose.page.js');
var TargetPage = require('../../../pages/creators/compose/compose-image.page.js');
var CollectionNameInputPage = require('../../../pages/collection-name-input.page.js');

describe('compose image form', function() {
  'use strict';

  var registration;
  var subscription;

  var commonWorkflows = new CommonWorkflows();
  var sidebar = new SidebarPage();
  var header = new HeaderComposePage();
  var page = new TargetPage();
  var testKit = new TestKit();
  var collectionNameInputPage = new CollectionNameInputPage();

  var filePath = '../../../sample-image.jpg';
  var tinyFilePath = '../../../sample-image-tiny.jpg';
  var secondChannelName = 'Channel 2';
  var thirdChannelName = 'Channel 3;';
  var firstCollectionName = 'Collection 1';
  var secondCollectionName = 'Collection 2';

  var createChannel = function(channelName){

  };

  var createCollection = function(collectionName){

  };

  var verifySuccess = function(successMessage, collectionName, channelName){
    expect(page.successMessage.isDisplayed()).toBe(true);
    expect(page.successMessage.getText()).toBe(successMessage);
    expect(page.postAnotherButton.isDisplayed()).toBe(true);

    page.postAnotherButton.click();

    expect(page.fileUploadButton.isDisplayed()).toBe(true);

    page.populateImage(tinyFilePath);

    expect(page.getCollectionOptionCount(collectionName, channelName)).toBe(1);
  };

  var postImageNow = function(collectionName, channelName, createCollection, isFirstCollection){
    it('should post an image to ' + collectionName + (channelName ? '(' + channelName + ')' : ''), function(){
      page.postImageNow(filePath, collectionName, channelName, createCollection, isFirstCollection);
      verifySuccess('Posted successfully', collectionName, channelName);
    });
  };

  var postImageOnDate = function(collectionName, channelName, createCollection, isFirstCollection){
    it('should post an image to ' + collectionName + (channelName ? '(' + channelName + ')' : ''), function(){
      page.postImageOnDate(filePath, collectionName, channelName, createCollection, isFirstCollection);
      verifySuccess('Scheduled successfully', collectionName, channelName);
    });
  };

  var postImageToQueue = function(collectionName, channelName, createCollection, isFirstCollection){
    it('should post an image to ' + collectionName + (channelName ? '(' + channelName + ')' : ''), function(){
      page.postImageToQueue(filePath, collectionName, channelName, createCollection, isFirstCollection);
      verifySuccess('Queued successfully', collectionName, channelName);
    });
  };

  var navigateToPage = function() {
    sidebar.newPostLink.click();
    header.imageLink.click();
  };

  describe('workflows', function(){
    beforeEach(function(){
      var context = commonWorkflows.createSubscription();
      registration = context.registration;
      subscription = context.subscription;
      navigateToPage();
    });

    postImageNow(firstCollectionName, undefined, true, true);
    postImageToQueue(firstCollectionName, undefined, true, true);
    postImageOnDate(firstCollectionName, undefined, true, true);

    /*
    describe('when posting now', function(){

      describe('when creator has one channel', function(){

        createChannel(secondChannelName); // Test reflected in UI.
        createCollection(firstCollectionName); // Test reflected in UI.

        describe('when the creator has no collections', function(){
          postImageNow(firstCollectionName, undefined, true, true);
        });

        describe('when the creator has one collection', function(){

          beforeEach(function(){
            createCollection(firstCollectionName);
          });

          postImageNow(firstCollectionName, undefined, false, false);
          postImageNow(secondCollectionName, undefined, true, false);
        });
      });

      describe('when creator has two channels', function(){

        beforeEach(function(){
          createChannel(secondChannelName);
        });

        createChannel(thirdChannelName); // Test reflected in UI.
        createCollection(firstCollectionName); // Test reflected in UI.
        createCollection(firstCollectionName, secondChannelName); // Test reflected in UI.

        describe('when the creator has no collections', function(){
          postImageNow(firstCollectionName, undefined, true, true);
          postImageNow(firstCollectionName, secondChannelName, true, true);
        });

        describe('when the creator has one collection', function(){

          beforeEach(function(){
            createCollection(firstCollectionName);
          });

          postImageNow(firstCollectionName, undefined, false, false);
          postImageNow(secondCollectionName, undefined, true, false);
          postImageNow(firstCollectionName, secondChannelName, true, false);
          postImageNow(secondCollectionName, secondChannelName, true, false);
        });

        describe('when the creator has two collections', function(){

          beforeEach(function(){
            createCollection(firstCollectionName);
            createCollection(firstCollectionName, secondChannelName);
          });

          postImageNow(firstCollectionName, undefined, false, false);
          postImageNow(secondCollectionName, undefined, true, false);
          postImageNow(firstCollectionName, secondChannelName, false, false);
          postImageNow(secondCollectionName, secondChannelName, true, false);
        });
      });
    });

    describe('when posting on schedule', function(){

      describe('when creator has one channel', function(){
        postImageOnDate(firstCollectionName, undefined, true, true);
      });

      describe('when creator has two channels and two collections', function(){

        beforeEach(function(){
          createChannel(secondChannelName);
          createCollection(firstCollectionName);
          createCollection(firstCollectionName, secondChannelName);
        });

        postImageOnDate(firstCollectionName, undefined, false, false);
        postImageOnDate(secondCollectionName, undefined, true, false);
        postImageOnDate(firstCollectionName, secondChannelName, false, false);
        postImageOnDate(secondCollectionName, secondChannelName, true,  false);
      });
    });

    describe('when posting to queue', function(){

      describe('when creator has one channel', function(){
        postImageToQueue(firstCollectionName, undefined, true, true);
      });

      describe('when creator has two channels and two collections', function(){

        beforeEach(function(){
          createChannel(secondChannelName);
          createCollection(firstCollectionName);
          createCollection(firstCollectionName, secondChannelName);
        });

        postImageToQueue(firstCollectionName, undefined, false, false);
        postImageToQueue(secondCollectionName, undefined, true, false);
        postImageToQueue(firstCollectionName, secondChannelName, false, false);
        postImageToQueue(secondCollectionName, secondChannelName, true,  false);
      });
    });

    */
  });

  describe('when validating inputs', function() {

    describe('happy path', function(){
      beforeEach(function(){
        var context = commonWorkflows.createSubscription();
        registration = context.registration;
        subscription = context.subscription;
        navigateToPage();
        page.populateImage(tinyFilePath);
      });

      afterEach(function(){
        page.postNowButton.click();
        expect(page.successMessage.isDisplayed()).toBe(true);

        browser.refresh();
      });

      it('should allow symbols in the comment', function(){
        testKit.setFormValues(page, page.inputs);
        page.commentTextBox.clear();
        page.commentTextBox.sendKeys(testKit.punctuation33);
      });

      it('should allow empty comments', function(){
        testKit.setFormValues(page, page.inputs);
        page.commentTextBox.clear();
      });

      testKit.includeHappyPaths(page, collectionNameInputPage, 'createCollectionNameTextBox');
      /*
      describe('when a collection exists', function(){

        beforeEach(function(){
          createCollection(firstCollectionName);
          navigateToPage();
          page.populateImage(tinyFilePath);
          page.createCollectionLink.click();
        });

        collectionNameInputPage.includeSadPaths(page.dialogCreateCollectionNameTextBox, page.dialogContinueButton, page.helpMessages, function() {});
      });
      */
    });

    describe('sad path', function() {

      it('should run once before all', function() {
        var context = commonWorkflows.createSubscription();
        registration = context.registration;
        subscription = context.subscription;
        navigateToPage();
      });

      beforeEach(function(){
        page.populateImage(tinyFilePath);
      });

      afterEach(function(){
        browser.refresh();
      });

      it('should not allow a comment more than 2000 characters', function(){
        testKit.setFormValues(page, page.inputs);
        page.commentTextBox.clear();
        var overSizedValue = new Array(2002).join( 'a' );
        page.commentTextBox.sendKeys(overSizedValue);

        testKit.assertMaxLength(page.helpMessages, page.commentTextBox, overSizedValue, 2000);
      });

      collectionNameInputPage.includeSadPaths(page.createCollectionNameTextBox, page.postNowButton, page.helpMessages, function() {});
      collectionNameInputPage.includeSadPaths(page.createCollectionNameTextBox, page.postLaterButton, page.helpMessages, function() {});

      it('should not allow an empty date', function(){
        page.createCollectionNameTextBox.sendKeys('collection');
        page.postLaterButton.click();

        page.postOnDateRadio.click();

        page.postToBacklogButton.click();

        testKit.assertSingleValidationMessage(page.helpMessages,
          'Please select a date.');
      });
      /*
      describe('when a collection exists', function(){

        beforeEach(function(){
          createCollection(firstCollectionName);
          navigateToPage();
          page.populateImage(tinyFilePath);
          page.createCollectionLink.click();
        });

        collectionNameInputPage.includeSadPaths(page.dialogCreateCollectionNameTextBox, page.dialogContinueButton, page.helpMessages, function() {});
      });
      */
    });
  });
});
