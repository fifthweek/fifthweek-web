var CommonWorkflows = require('../../../common-workflows.js');
var TestKit = require('../../../test-kit.js');
var SidebarPage = require('../../../pages/sidebar.page.js');
var HeaderComposePage = require('../../../pages/header-compose.page.js');
var TargetPage = require('../../../pages/creators/compose/compose-note.page.js');

describe('compose note form', function() {
  'use strict';

  var registration;
  var subscription;

  var commonWorkflows = new CommonWorkflows();
  var sidebar = new SidebarPage();
  var header = new HeaderComposePage();
  var page = new TargetPage();
  var testKit = new TestKit();

  var navigateToPage = function() {
    sidebar.newPostLink.click();
    header.noteLink.click();
  };

  var createChannel = function(channelName){

  };

  var verifySuccess = function(successMessage){
    expect(page.successMessage.isDisplayed()).toBe(true);
    expect(page.successMessage.getText()).toBe(successMessage);
    expect(page.postAnotherButton.isDisplayed()).toBe(true);

    page.postAnotherButton.click();

    expect(page.postNowButton.isDisplayed()).toBe(true);
  };

  var postNow = function(channelName){
    it('should post a note to ' + (channelName ? channelName : 'default channel'), function(){
      page.postNow(channelName);
      verifySuccess('Posted successfully');
    });
  };

  var postOnDate = function(channelName){
    it('should schedule a note to ' + (channelName ? channelName : 'default channel'), function(){
      page.postOnDate(channelName);
      verifySuccess('Scheduled successfully');
    });
  };

  describe('workflows', function(){
    beforeEach(function(){
      var context = commonWorkflows.createSubscription();
      registration = context.registration;
      subscription = context.subscription;
      navigateToPage();
    });

    postNow();

    postOnDate();

    /*
    describe('when posting now', function(){

      describe('when creator has one channel', function(){
        createChannel(secondChannelName); // Test reflected in UI.

        postNow();
      });

      describe('when creator has two channels', function(){

        beforeEach(function(){
          createChannel(secondChannelName);
        });

        createChannel(thirdChannelName); // Test reflected in UI.
        postNow(secondChannelName);
      });
    });

    describe('when posting later', function(){

      describe('when creator has one channel', function(){
        createChannel(secondChannelName); // Test reflected in UI.

        postOnDate();
      });

      describe('when creator has two channels', function(){

        beforeEach(function(){
          createChannel(secondChannelName);
        });

        createChannel(thirdChannelName); // Test reflected in UI.
        postOnDate(secondChannelName);
      });
    });
    */
  });

  describe('when validating inputs', function() {

    it('should run once before all', function() {
      var context = commonWorkflows.createSubscription();
      registration = context.registration;
      subscription = context.subscription;
      navigateToPage();
    });

    describe('happy path', function(){

      afterEach(function(){
        page.postNowButton.click();
        expect(page.successMessage.isDisplayed()).toBe(true);

        page.postAnotherButton.click();
      });

      it('should allow symbols in the content', function(){
        page.contentTextBox.clear();
        page.contentTextBox.sendKeys(testKit.punctuation33);
      });

      it('should allow numbers in the content', function(){
        page.contentTextBox.clear();
        page.contentTextBox.sendKeys('0123456789');
      });
    });

    describe('sad path', function() {

      it('should run once before all', function() {
        var context = commonWorkflows.createSubscription();
        registration = context.registration;
        subscription = context.subscription;
        navigateToPage();
      });

      afterEach(function(){
        browser.refresh();
      });

      it('should not allow a note with more than 280 characters', function(){
        page.contentTextBox.clear();
        var maxLength = 280;
        var overSizedValue = new Array(maxLength + 2).join( 'a' );
        page.contentTextBox.sendKeys(overSizedValue);

        testKit.assertMaxLength(page.helpMessages, page.contentTextBox, overSizedValue, maxLength);
      });

      it('should not allow an empty note', function(){
        page.contentTextBox.clear();
        page.postNowButton.click();

        testKit.assertSingleValidationMessage(page.helpMessages,
          'Please write your note before continuing.');
      });

      it('should not allow an empty note when posting later', function(){
        page.contentTextBox.clear();
        page.postLaterButton.click();

        testKit.assertSingleValidationMessage(page.helpMessages,
          'Please write your note before continuing.');
      });

      it('should not allow an empty date', function(){
        page.contentTextBox.sendKeys('abc');
        page.postLaterButton.click();

        page.postToBacklogButton.click();

        testKit.assertSingleValidationMessage(page.helpMessages,
          'Please select a date.');
      });
    });
  });
});
