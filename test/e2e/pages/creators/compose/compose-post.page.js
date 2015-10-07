(function(){
  'use strict';

  var path = require('path');
  var TestKit = require('../../../test-kit.js');
  var SidebarPage = require('../../../pages/sidebar.page.js');
  var ModalPage = require('../../../pages/modal.page.js');
  var DateTimePickerPage = require('../../../pages/date-time-picker.page.js');
  var ComposeOptionsPage = require('./compose-options.page.js');
  var DiscardChangesPage = require('../../../pages/discard-changes.page.js');

  var testKit = new TestKit();
  var modal = new ModalPage();
  var dateTimePickerPage = new DateTimePickerPage();
  var discardChanges = new DiscardChangesPage();

  var composeUploadPage = function() {};

  composeUploadPage.prototype = Object.create({}, {

    imageUploadIndicator: { get: function(){ return element(by.css('.available-image')); }},

    fileUploadIndicator: { get: function(){ return element(by.css('.file-name')); }},

    postNowButton: { get: function() { return element(by.css('button[fw-form-submit="postNow()"]')); }},
    postLaterButton: { get: function() { return element(by.css('button[fw-form-submit="postLater()"]')); }},

    postToBacklogButton: { get: function() { return element(by.css('button[fw-form-submit="postToBacklog()"]')); }},
    cancelButton: { get: function() { return element(by.css('button[ng-click="cancelPostLater()"]')); }},

    postToText: { get: function() { return element(by.id('posting-to-text')); }},

    fileUploadInput: { get: function() { return element(by.id('file-upload-button-input')); }},
    fileUploadButton: { get: function() { return element(by.css('#file-upload-button-area .btn')); }},
    imageUploadInput: { get: function() { return element(by.id('image-upload-button-input')); }},
    imageUploadButton: { get: function() { return element(by.css('#image-upload-button-area .btn')); }},

    commentTextBoxId: { value: 'model-input-comment' },

    postToQueueRadio: { get: function() { return element(by.css('input[ng-value="true"]')); }},
    postOnDateRadio: { get: function() { return element(by.css('input[ng-value="false"]')); }},

    postToQueueDate: { get: function() { return element(by.css('span[ng-if="model.queuedLiveDate"]')); }},
    postToQueueSelect: { get: function() { return element(by.id('queue-select')); }},

    successMessage: { get: function(){ return element(by.css('.alert-success')); }},
    failureMessage: { get: function(){ return element(by.css('.alert-danger')); }},
    postAnotherButton: { get: function(){ return element(by.css('button[ng-click="postAnother()"]')); }},

    helpMessages: { get: function () { return element.all(by.css('.help-block')); }},

    populateFileUpload: { value: function(filePath, waitFormUploadedIndicator){
      this.setFileInput(filePath);

      if(waitFormUploadedIndicator){
        testKit.waitForElementToDisplay(this.fileUploadIndicator);
      }
      else{
        testKit.waitForElementToDisplay(this.postNowButton);
      }
    }},

    populateImageUpload: { value: function(filePath, waitFormUploadedIndicator){
      this.setImageInput(filePath);

      if(waitFormUploadedIndicator){
        testKit.waitForElementToDisplay(this.imageUploadIndicator);
      }
      else{
        testKit.waitForElementToDisplay(this.postNowButton);
      }
    }},

    populateContent: { value: function(hasComment, filePath, imagePath, channelIndex){

      if(typeof channelIndex != 'undefined'){
        element(by.id('select-channel-' + channelIndex)).click();
      }

      browser.waitForAngular();

      if(filePath){
        this.populateFileUpload(filePath, true);
      }

      if(imagePath){
        this.populateImageUpload(imagePath, true);
      }

      var commentText = undefined;
      if(hasComment){
        var date = new Date();
        commentText = 'Comment on ' + date.toISOString();
        testKit.setContentEditableValue(this.commentTextBoxId, commentText);
      }

      browser.waitForAngular();

      return {
        commentText: commentText,
        channelIndex: channelIndex,
        filePath: filePath,
        imagePath: imagePath
      }
    }},

    postNow: { value: function(hasComment, filePath, imagePath, channelIndex) {
      var result = this.populateContent(hasComment, filePath, imagePath, channelIndex);

      this.postNowButton.click();
      browser.waitForAngular();

      return result;
    }},

    postOnDate: { value: function(hasComment, filePath, imagePath, channelIndex) {
      var result = this.populateContent(hasComment, filePath, imagePath, channelIndex);
      this.postLaterButton.click();

      dateTimePickerPage.datepickerButton.click();
      dateTimePickerPage.datepickerNextMonthButton.click();
      dateTimePickerPage.datepicker15Button.click();

      dateTimePickerPage.timeHoursTextBox.clear();
      dateTimePickerPage.timeHoursTextBox.sendKeys('13');
      dateTimePickerPage.timeMinutesTextBox.clear();
      dateTimePickerPage.timeMinutesTextBox.sendKeys('37');

      result.dayOfMonth = '15';
      result.timeOfDay = '13:17';

      this.postToBacklogButton.click();
      browser.waitForAngular();

      return result;
    }},


    postOnPastDate: { value: function(hasComment, filePath, imagePath, channelIndex) {
      var result = this.populateContent(hasComment, filePath, imagePath, channelIndex);

      this.postLaterButton.click();

      dateTimePickerPage.datepickerButton.click();
      dateTimePickerPage.datepickerPreviousMonthButton.click();
      dateTimePickerPage.datepicker15Button.click();

      dateTimePickerPage.timeHoursTextBox.clear();
      dateTimePickerPage.timeHoursTextBox.sendKeys('3');
      dateTimePickerPage.timeMinutesTextBox.clear();
      dateTimePickerPage.timeMinutesTextBox.sendKeys('13');

      result.dayOfMonth = '15';
      result.timeOfDay = '13:17';

      this.postToBacklogButton.click();
      browser.waitForAngular();

      return result;
    }},

    postToQueue: { value: function(hasComment, filePath, imagePath, channelIndex, queueIndex) {
      var result = this.populateContent(hasComment, filePath, imagePath, channelIndex, queueIndex);
      result.isQueued = true;

      this.postLaterButton.click();

      if(typeof queueIndex != 'undefined') {
        this.postToQueueSelect.all(by.tagName('option'))
          .then(function(options){ options[queueIndex].click(); });
      }

      this.postToBacklogButton.click();
      browser.waitForAngular();

      return result;
    }},

    setFileInput: { value: function(filePath) {
      // console.log(filePath);
      this.fileUploadInput.sendKeys(path.resolve(__dirname + '/' + filePath));
    }},

    setImageInput: { value: function(filePath) {
      // console.log(filePath);
      this.imageUploadInput.sendKeys(path.resolve(__dirname + '/' + filePath));
    }},

    includeTests: { value: function(page){

      describe('compose post form', function() {
        'use strict';

        var registration;
        var blog;

        var CommonWorkflows = require('../../../common-workflows.js');

        var commonWorkflows = new CommonWorkflows();
        var sidebar = new SidebarPage();
        var composeOptions = new ComposeOptionsPage();

        var tinyFilePath = '../../../sample-image-tiny.jpg';

        var channelNames;

        var firstQueueName = 'Queue 0';
        var secondQueueName = 'Queue 1';

        var createChannel = function(){
          var result = commonWorkflows.createChannel();
          channelNames.push(result.name);
        };

        var createQueue = function(queueName){
          commonWorkflows.createNamedQueue(queueName);
        };

        var verifySuccess = function(){
          expectSuccessfulFinalState();
        };

        var postNow = function(hasComment, filePath, imagePath, channelIndex){
          it('should post to channel ' + channelIndex, function(){
            page.postNow(hasComment, filePath, imagePath, channelIndex);
            verifySuccess();
          });
        };

        var postOnDate = function(hasComment, filePath, imagePath, channelIndex){
          it('should schedule to channel ' + channelIndex , function(){
            page.postOnDate(hasComment, filePath, imagePath, channelIndex);
            verifySuccess();
          });
        };

        var postToQueue = function(hasComment, filePath, imagePath, channelIndex, queueIndex){
          it('should enqueue to channel ' + channelIndex, function(){
            page.postToQueue(hasComment, filePath, imagePath, channelIndex, queueIndex);
            verifySuccess();
          });
        };

        var navigateToPage = function() {
          sidebar.livePostsLink.click();
          sidebar.newPostLink.click();
          browser.waitForAngular();
        };

        var leavePage = function(discardChanges) {
          modal.crossButton.click();
          testKit.waitForElementToBeRemoved(modal.crossButton);
        };

        var expectSuccessfulFinalState = function() {
          expect(modal.modalCount).toBe(0);
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
              postNow(true, undefined, undefined);
            });

            describe('when creator has two channels', function(){
              beforeEach(function(){
                createChannel();
                navigateToPage();
              });

              postNow(true, undefined, undefined, 0);
              postNow(true, undefined, undefined, 1);
            });
          });

          describe('when posting on schedule', function(){

            describe('when creator has one channel', function(){
              beforeEach(navigateToPage);
              postOnDate(true, undefined, undefined);
            });

            describe('when creator has two channels and two queues', function(){

              beforeEach(function(){
                createChannel();
                createQueue(firstQueueName);
                createQueue(secondQueueName);
                navigateToPage();
              });

              postOnDate(true, undefined, undefined, 0);
              postOnDate(true, undefined, undefined, 1);
            });
          });

          describe('when posting to queue', function(){

            describe('when creator has one channel and one queue', function() {

              beforeEach(function () {
                createQueue(firstQueueName, channelNames[0]);
                navigateToPage();
              });

              it('should receive an estimated live date from the server', function(){
                page.postLaterButton.click();
                testKit.waitForElementToDisplay(page.postToQueueDate);
                leavePage();
              });
            });

            describe('when creator has two channels and two queues', function(){

              beforeEach(function(){
                createChannel();
                createQueue(firstQueueName, channelNames[0]);
                createQueue(secondQueueName, channelNames[1]);
                navigateToPage();
              });

              postToQueue(true, undefined, undefined, 0, 0);
              postToQueue(true, undefined, undefined, 0, 1);
              postToQueue(true, undefined, undefined, 1, 0);
              postToQueue(true, undefined, undefined, 1, 1);
            });
          });
        });

        describe('when validating inputs', function() {
          it('should run once before all', function(){
            var context = commonWorkflows.createBlog();
            registration = context.registration;
            blog = context.blog;
          });

          describe('happy path', function(){
            describe('when posting now', function(){


              describe('when testing post types', function() {
                beforeEach(function() {
                  navigateToPage();
                });

                postNow(true, undefined, undefined);
                postNow(false, tinyFilePath, undefined);
                postNow(true, tinyFilePath, undefined);
                postNow(false, undefined, tinyFilePath);
                postNow(true, undefined, tinyFilePath);
                postNow(false, tinyFilePath, tinyFilePath);
                postNow(true, tinyFilePath, tinyFilePath);
              });
            });


            describe('when testing date time picker', function(){
              beforeEach(function(){
                navigateToPage();
                testKit.setContentEditableValue(page.commentTextBoxId, 'Comment');
                page.postLaterButton.click();
                //page.postOnDateRadio.click();
              });

              afterEach(function(){
                page.postToBacklogButton.click();
                expectSuccessfulFinalState();
              });

              dateTimePickerPage.includeHappyPaths(function() {});
            });
          });

          describe('sad path', function() {

            describe('when testing date time picker', function(){
              it('should run once before all', function() {
                navigateToPage();
              });

              it('should run once before all', function() {
                page.postLaterButton.click();
                //page.postOnDateRadio.click();
              });

              dateTimePickerPage.includeSadPaths(page.postToBacklogButton, page.helpMessages, function() {});

              it('should run once after all', function(){
                leavePage();
                testKit.waitForElementToDisplay(discardChanges.discardButton);
                discardChanges.discardButton.click();
              });
            });

            describe('when testing empty posts', function(){
              it('should run once before all', function() {
                navigateToPage();
              });

              it('should not allow empty posts', function() {
                page.postNowButton.click();
                browser.waitForAngular();
                expect(page.failureMessage.isDisplayed()).toBe(true);
              });

              it('should run once after all', function(){
                leavePage();
              });

              it('should run once before all', function() {
                navigateToPage();
              });

              it('should not allow empty posts to be scheduled', function() {
                page.postLaterButton.click();
                page.postToBacklogButton.click();
                testKit.waitForElementToDisplay(page.failureMessage);
                expect(page.failureMessage.isDisplayed()).toBe(true);
              });

              it('should run once after all', function(){
                leavePage();
              });
            });

            describe('when testing comments', function(){
              it('should run once before all', function() {
                navigateToPage();
              });

              it('should not allow a comment more than 50000 characters', function(){
                var overSizedValue = new Array(50002).join( 'a' );
                testKit.setContentEditableValue(page.commentTextBoxId, overSizedValue, true);

                testKit.assertContentEditableMaxLength(page.helpMessages, page.commentTextBoxId, overSizedValue, 50000);
              });

              it('should run once after all', function(){
                leavePage();
                testKit.waitForElementToDisplay(discardChanges.discardButton);
                discardChanges.discardButton.click();
              });
            });
          });
        });
      });
    }}
  });

  module.exports = composeUploadPage;
})();
