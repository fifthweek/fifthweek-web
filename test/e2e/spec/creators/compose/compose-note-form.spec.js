var TestKit = require('../../../test-kit.js');
var CommonWorkflows = require('../../../common-workflows.js');
var SidebarPage = require('../../../pages/sidebar.page.js');
var ModalPage = require('../../../pages/modal.page.js');
var TargetPage = require('../../../pages/creators/compose/compose-note.page.js');
var ComposeOptionsPage = require('../../../pages/creators/compose/compose-options.page.js');
var DateTimePickerPage = require('../../../pages/date-time-picker.page.js');

describe('compose note form', function() {
  'use strict';

  var registration;
  var blog;

  var commonWorkflows = new CommonWorkflows();
  var sidebar = new SidebarPage();
  var page = new TargetPage();
  var modal = new ModalPage();
  var testKit = new TestKit();
  var dateTimePickerPage = new DateTimePickerPage();
  var composeOptions = new ComposeOptionsPage();

  var channelNames;

  var navigateToPage = function() {
    sidebar.postsLink.click();
    composeOptions.noteLink.click();
    browser.waitForAngular();
  };

  var createChannel = function(){
    var result = commonWorkflows.createChannel();
    channelNames.push(result.name);
  };

  var verifySuccess = function(){
    expectSuccessfulFinalState();

    navigateToPage();
    expect(page.postNowButton.isDisplayed()).toBe(true);

    leavePage();
  };

  var leavePage = function() {
    modal.crossButton.click();
  };

  var expectSuccessfulFinalState = function() {
    expect(modal.modalCount).toBe(0);
  };

  var postNow = function(channelIndex){
    it('should post a note to channel ' + channelIndex, function(){
      var channelName = channelNames[channelIndex];
      page.postNow(channelName);
      verifySuccess();
    });
  };

  var postOnDate = function(channelIndex){
    it('should schedule a note to channel' + channelIndex, function(){
      var channelName = channelNames[channelIndex];
      page.postOnDate(channelName);
      verifySuccess();
    });
  };

  beforeEach(function(){
    channelNames = [undefined];  // Set initial default channel name to undefined.
  });

  describe('workflows', function(){
    beforeEach(function(){
      var context = commonWorkflows.createBlog();
      registration = context.registration;
      blog = context.blog;
    });

    describe('when posting now', function(){

      describe('when creator has one channel', function(){
        beforeEach(navigateToPage);
        postNow(0);
      });

      describe('when creator has two channels', function(){
        beforeEach(function(){
          createChannel();
          navigateToPage();
        });

        postNow(1);
      });
    });

    describe('when posting later', function(){

      describe('when creator has one channel', function(){
        beforeEach(navigateToPage);
        postOnDate(0);
      });

      describe('when creator has two channels', function(){

        beforeEach(function(){
          createChannel();
          navigateToPage();
        });

        postOnDate(1);
      });
    });
  });

  describe('when validating inputs', function() {

    it('should run once before all', function() {
      navigateToPage();
    });

    describe('happy path', function(){

      describe('when posting now', function(){
        afterEach(function(){
          page.postNowButton.click();
          expectSuccessfulFinalState();
          navigateToPage();
        });

        it('should allow symbols in the content', function(){
          testKit.setValue(page.contentTextBoxId, testKit.punctuation33);
        });

        it('should allow numbers in the content', function(){
          testKit.setValue(page.contentTextBoxId, '0123456789');
        });
      });

      describe('when posting to backlog', function(){
        beforeEach(function(){
          testKit.setValue(page.contentTextBoxId, '0123456789');
          page.postLaterButton.click();
        });

        afterEach(function(){
          page.postToBacklogButton.click();
          expectSuccessfulFinalState();
          navigateToPage();
        });

        dateTimePickerPage.includeHappyPaths(function() {});
      });
    });

    describe('sad path', function() {

      describe('when testing date time picker', function(){

        it('should run once before all', function() {
          testKit.setValue(page.contentTextBoxId, '0123456789');
          page.postLaterButton.click();
        });

        dateTimePickerPage.includeSadPaths(page.postToBacklogButton, page.helpMessages, function() {});

        it('should run once after all', function(){
          leavePage();
        });
      });

      describe('when testing note', function(){
        beforeEach(function() {
          navigateToPage();
        });
        afterEach(function(){
          leavePage();
        });

        it('should not allow a note with more than 280 characters', function(){
          var maxLength = 280;
          var overSizedValue = new Array(maxLength + 2).join( 'a' );
          testKit.setValue(page.contentTextBoxId, overSizedValue, true);

          testKit.assertMaxLength(page.helpMessages, page.contentTextBoxId, overSizedValue, maxLength);
        });

        it('should not allow an empty note', function(){
          testKit.clear(page.contentTextBoxId);
          page.postNowButton.click();

          testKit.assertSingleValidationMessage(page.helpMessages,
            'Please write your note before continuing.');
        });

        it('should not allow an empty note when posting later', function(){
          testKit.clear(page.contentTextBoxId);
          page.postLaterButton.click();

          testKit.assertSingleValidationMessage(page.helpMessages,
            'Please write your note before continuing.');
        });
      });
    });
  });
});
