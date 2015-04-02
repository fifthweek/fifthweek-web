(function(){
  'use strict';

  var path = require('path');
  var TestKit = require('../../../test-kit.js');
  var SidebarPage = require('../../../pages/sidebar.page.js');
  var ModalPage = require('../../../pages/modal.page.js');
  var CollectionNameInputPage = require('../../../pages/collection-name-input.page.js');
  var DateTimePickerPage = require('../../../pages/date-time-picker.page.js');
  var ComposeOptionsPage = require('./compose-options.page.js');

  var testKit = new TestKit();
  var modal = new ModalPage();
  var collectionNameInputPage = new CollectionNameInputPage();
  var dateTimePickerPage = new DateTimePickerPage();

  var composeUploadPage = function() {};

  var getCollectionOptionName = function(collectionName, channelName){
    var itemName = collectionName;
    if(channelName){
      itemName = itemName + ' (' + channelName + ')';
    }
    return itemName;
  };

  composeUploadPage.prototype = Object.create({}, {

    // Values to override:
    uploadType: { value: undefined },
    headerLink: { value: undefined },
    uploadIndicator: { get: function(){ return undefined; }},
    pageUrl: { get: function () { return 'undefined'; }},

    // The remainder probably doesn't need to be overridden:
    postNowButton: { get: function() { return element(by.css('button[fw-form-submit="postNow()"]')); }},
    postLaterButton: { get: function() { return element(by.css('button[fw-form-submit="postLater()"]')); }},

    postToBacklogButton: { get: function() { return element(by.css('button[fw-form-submit="postToBacklog()"]')); }},
    cancelButton: { get: function() { return element(by.css('button[ng-click="cancelPostLater()"]')); }},

    uploadInput: { get: function() { return element(by.id('file-upload-button-input')); }},
    uploadButton: { get: function() { return element(by.css('#file-upload-button-area .btn')); }},

    commentTextBoxId: { value: 'model-input-comment' },
    collectionSelect: { get: function() { return element(by.id('model-input-selected-collection')); }},
    createCollectionLink: { get: function() { return element(by.css('.create-collection-link')); }},

    dialogCreateCollectionCloseButton: { get: function() { return modal.getCrossButton('create-collection'); }},
    dialogCreateCollectionNameTextBoxId: { value: 'new-collection-modal-input' },
    dialogContinueButton: { get: function() { return element(by.css('#create-collection-form button[fw-form-submit="submit()"]')); }},

    createCollectionAreaCount: { get: function() { return element.all(by.id('new-collection-area')).count(); }},
    createCollectionNameTextBoxId: { value: 'new-collection-area-input' },

    postToQueueRadio: { get: function() { return element(by.css('input[ng-value="true"]')); }},
    postOnDateRadio: { get: function() { return element(by.css('input[ng-value="false"]')); }},

    postToQueueDate: { get: function() { return element(by.css('span[ng-if="model.queuedLiveDate"]')); }},

    successMessage: { get: function(){ return element(by.css('.alert-success')); }},
    postAnotherButton: { get: function(){ return element(by.css('button[ng-click="postAnother()"]')); }},

    helpMessages: { get: function () { return element.all(by.css('.help-block')); }},

    inputs: { value: [
      {
        name: 'createCollectionNameTextBox',
        newValue: function() { return collectionNameInputPage.newName(); }
      }
    ]},

    dialogInputs: { value: [
      {
        name: 'dialogCreateCollectionNameTextBox',
        newValue: function() { return collectionNameInputPage.newName(); }
      }
    ]},

    populateUpload: { value: function(filePath, waitFormUploadedIndicator){
      this.setFileInput(filePath);

      if(waitFormUploadedIndicator){
        testKit.waitForElementToDisplay(this.uploadIndicator);
      }
      else{
        testKit.waitForElementToDisplay(this.postNowButton);
      }
    }},

    getCollectionOptionCount: { value: function(collectionName, channelName){
      var itemName = getCollectionOptionName(collectionName, channelName);
      return element.all(by.cssContainingText('#model-input-selected-collection option', itemName)).count();
    }},

    populateContent: { value: function(filePath, collectionName, channelName, createCollection, isFirstCollection){
      this.populateUpload(filePath, true);

      var date = new Date();
      var commentText = 'Comment on ' + date.toISOString();
      testKit.setValue(this.commentTextBoxId, commentText);

      if(collectionName){
        if(!createCollection){
          var itemName = getCollectionOptionName(collectionName, channelName);
          element(by.cssContainingText('#model-input-selected-collection option', itemName)).click();
        }
        else{
          if(isFirstCollection){
            testKit.setValue(this.createCollectionNameTextBoxId, collectionName);
            if(channelName){
              element(by.cssContainingText('#new-collection-area option', channelName)).click();
            }
          }
          else{
            this.createCollectionLink.click();
            browser.waitForAngular();

            testKit.setValue(this.dialogCreateCollectionNameTextBoxId, collectionName);
            if(channelName){
              element(by.cssContainingText('#create-collection-form option', channelName)).click();
            }

            this.dialogContinueButton.click();
          }
        }
      }

      browser.waitForAngular();

      return {
        commentText: commentText,
        channelName: channelName,
        collectionName: collectionName,
        filePath: filePath,
        uploadType: this.uploadType
      }
    }},

    createCollection: { value: function(filePath, collectionName, channelName, isFirstCollection) {

      if(!collectionName){
        collectionName = collectionNameInputPage.newName();
      }

      this.populateContent(filePath, collectionName,  channelName, true, isFirstCollection);

      this.postNowButton.click();

      return {
        filePath: filePath,
        collectionName: collectionName,
        channelName: channelName
      };
    }},

    postNow: { value: function(filePath, collectionName, channelName, createCollection, isFirstCollection) {
      var result = this.populateContent(filePath, collectionName,  channelName, createCollection, isFirstCollection);

      this.postNowButton.click();

      return result;
    }},

    postOnDate: { value: function(filePath, collectionName, channelName, createCollection, isFirstCollection) {
      var result = this.populateContent(filePath, collectionName,  channelName, createCollection, isFirstCollection);
      this.postLaterButton.click();
      this.postOnDateRadio.click();

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

      return result;
    }},

    postToQueue: { value: function(filePath, collectionName, channelName, createCollection, isFirstCollection) {
      var result = this.populateContent(filePath, collectionName,  channelName, createCollection, isFirstCollection);
      result.isQueued = true;

      this.postLaterButton.click();

      this.postToBacklogButton.click();

      return result;
    }},

    setFileInput: { value: function(filePath) {
      // console.log(filePath);
      this.uploadInput.sendKeys(path.resolve(__dirname + '/' + filePath));
    }},

    includeTests: { value: function(page){

      var uploadType = this.uploadType;
      var headerLink = this.headerLink;

      describe('compose ' + uploadType + ' form', function() {
        'use strict';

        var registration;
        var subscription;

        var CommonWorkflows = require('../../../common-workflows.js');

        var commonWorkflows = new CommonWorkflows();
        var sidebar = new SidebarPage();
        var composeOptions = new ComposeOptionsPage();
        var collectionNameInputPage = new CollectionNameInputPage();

        var filePath = '../../../sample-image.jpg';
        var tinyFilePath = '../../../sample-image-tiny.jpg';

        var channelNames;

        var firstCollectionName = 'Collection 0';
        var secondCollectionName = 'Collection 1';

        var createChannel = function(){
          var result = commonWorkflows.createChannel();
          channelNames.push(result.name);
        };

        var createCollection = function(collectionName, channelName){
          commonWorkflows.createNamedCollection(channelName, collectionName);
        };

        var verifySuccess = function(successMessage, collectionName, channelName){
          expectSuccessfulFinalState();

          navigateToPage();
          page.populateUpload(tinyFilePath);

          expect(page.getCollectionOptionCount(collectionName, channelName)).not.toBe(0);
          leavePage();
        };

        var postNow = function(collectionName, channelIndex, createCollection, isFirstCollection){
          it('should post an ' + uploadType + ' to ' + collectionName + ' (Channel ' + channelIndex + ')', function(){
            var channelName = channelNames[channelIndex];
            page.postNow(filePath, collectionName, channelName, createCollection, isFirstCollection);
            verifySuccess('Posted successfully', collectionName, channelName);
          });
        };

        var postOnDate = function(collectionName, channelIndex, createCollection, isFirstCollection){
          it('should schedule an ' + uploadType + ' to ' + collectionName + ' (Channel ' + channelIndex + ')', function(){
            var channelName = channelNames[channelIndex];
            page.postOnDate(filePath, collectionName, channelName, createCollection, isFirstCollection);
            verifySuccess('Scheduled successfully', collectionName, channelName);
          });
        };

        var postToQueue = function(collectionName, channelIndex, createCollection, isFirstCollection){
          it('should queue an ' + uploadType + ' to ' + collectionName + ' (Channel ' + channelIndex + ')', function(){
            var channelName = channelNames[channelIndex];
            page.postToQueue(filePath, collectionName, channelName, createCollection, isFirstCollection);
            verifySuccess('Queued successfully', collectionName, channelName);
          });
        };

        var navigateToPage = function() {
          sidebar.postsLink.click();
          composeOptions[headerLink].click();
          browser.waitForAngular();
        };

        var leavePage = function() {
          modal.crossButton.click();
        };

        var expectSuccessfulFinalState = function() {
          expect(modal.modalCount).toBe(0);
        };

        beforeEach(function(){
          channelNames = [undefined];  // Set initial default channel name to undefined.
        });

        describe('workflows', function(){
          beforeEach(function(){
            var context = commonWorkflows.createSubscription();
            registration = context.registration;
            subscription = context.subscription;
          });

          describe('when posting now', function(){

            describe('when creator has one channel', function(){

              describe('when the creator has no collections', function(){
                beforeEach(navigateToPage);
                postNow(firstCollectionName, 0, true, true);
              });

              describe('when the creator has one collection', function(){

                beforeEach(function(){
                  createCollection(firstCollectionName, channelNames[0]);
                  navigateToPage();
                });

                it('should select the existing collection if a duplicate collection is added', function(){
                  page.populateUpload(tinyFilePath);
                  page.createCollectionLink.click();

                  testKit.setValue(page.dialogCreateCollectionNameTextBoxId, firstCollectionName);

                  page.dialogContinueButton.click();

                  expect(page.getCollectionOptionCount(firstCollectionName, channelNames[0])).toBe(1);
                  leavePage();
                });

                postNow(firstCollectionName, 0, false, false);
                postNow(secondCollectionName, 0, true, false);
              });
            });

            describe('when creator has two channels', function(){

              describe('when the creator has no collections', function(){
                beforeEach(function(){
                  createChannel();
                  navigateToPage();
                });

                postNow(firstCollectionName, 0, true, true);
                postNow(firstCollectionName, 1, true, true);
              });

              describe('when the creator has one collection', function(){

                beforeEach(function(){
                  createChannel();
                  createCollection(firstCollectionName, channelNames[0]);
                  navigateToPage();
                });

                postNow(firstCollectionName, 0, false, false);
                postNow(secondCollectionName, 0, true, false);
                postNow(firstCollectionName, 1, true, false);
                postNow(secondCollectionName, 1, true, false);
              });

              describe('when the creator has two collections', function(){

                beforeEach(function(){
                  createChannel();
                  createCollection(firstCollectionName, channelNames[0]);
                  createCollection(firstCollectionName, channelNames[1]);
                  navigateToPage();
                });

                postNow(firstCollectionName, 0, false, false);
                postNow(secondCollectionName, 0, true, false);
                postNow(firstCollectionName, 1, false, false);
                postNow(secondCollectionName, 1, true, false);
              });
            });
          });

          describe('when posting on schedule', function(){

            describe('when creator has one channel', function(){
              beforeEach(navigateToPage);
              postOnDate(firstCollectionName, 0, true, true);
            });

            describe('when creator has two channels and two collections', function(){

              beforeEach(function(){
                createChannel();
                createCollection(firstCollectionName, channelNames[0]);
                createCollection(firstCollectionName, channelNames[1]);
                navigateToPage();
              });

              postOnDate(firstCollectionName, 0, false, false);
              postOnDate(secondCollectionName, 0, true, false);
              postOnDate(firstCollectionName, 1, false, false);
              postOnDate(secondCollectionName, 1, true,  false);
            });
          });

          describe('when posting to queue', function(){

            describe('when creator has one channel', function(){
              beforeEach(navigateToPage);
              postToQueue(firstCollectionName, 0, true, true);
            });

            describe('when creator has one channel and one collection', function() {

              beforeEach(function () {
                createCollection(firstCollectionName, channelNames[0]);
                navigateToPage();
              });

              it('should receive an estimated live date from the server', function(){
                page.populateUpload(tinyFilePath);
                page.postLaterButton.click();
                testKit.waitForElementToDisplay(page.postToQueueDate);
                leavePage();
              });
            });

            describe('when creator has two channels and two collections', function(){

              beforeEach(function(){
                createChannel();
                createCollection(firstCollectionName, channelNames[0]);
                createCollection(firstCollectionName, channelNames[1]);
                navigateToPage();
              });

              postToQueue(firstCollectionName, 0, false, false);
              postToQueue(secondCollectionName, 0, true, false);
              postToQueue(firstCollectionName, 1, false, false);
              postToQueue(secondCollectionName, 1, true,  false);
            });
          });
        });

        describe('when validating inputs', function() {
          describe('happy path', function(){
            describe('when posting now', function(){

              describe('when no collections exist', function(){
                beforeEach(function() {
                  var context = commonWorkflows.createSubscription();
                  registration = context.registration;
                  subscription = context.subscription;
                  navigateToPage();
                  page.populateUpload(tinyFilePath);
                  testKit.waitForElementToDisplay(element(by.id(page.createCollectionNameTextBoxId)));
                });

                afterEach(function(){
                  page.postNowButton.click();
                  expectSuccessfulFinalState();
                });

                testKit.includeHappyPaths(page, collectionNameInputPage, 'createCollectionNameTextBox');
              });

              describe('when a collection exists (pre)', function(){
                it('should run once before all', function() {
                  var context = commonWorkflows.createSubscription();
                  registration = context.registration;
                  subscription = context.subscription;
                  createCollection(firstCollectionName, channelNames[0]);
                });

                describe('when a collection exists', function() {
                  beforeEach(function() {
                    navigateToPage();
                    page.populateUpload(tinyFilePath);
                  });

                  afterEach(function(){
                    page.postNowButton.click();
                    expectSuccessfulFinalState();
                  });

                  it('should allow symbols in the comment', function(){
                    testKit.setValue(page.commentTextBoxId, testKit.punctuation33);
                  });

                  it('should allow empty comments', function(){
                    // No action.
                  });

                  describe('when creating a collection', function() {
                    beforeEach(function() {
                      page.createCollectionLink.click();
                    });

                    afterEach(function(){
                      page.dialogContinueButton.click();
                      browser.waitForAngular();
                    });

                    testKit.includeHappyPaths(page, collectionNameInputPage, 'dialogCreateCollectionNameTextBox');
                  });
                });
              });

            });

            describe('when testing date time picker', function(){
              beforeEach(function(){
                navigateToPage();
                page.populateUpload(tinyFilePath);
                page.postLaterButton.click();
                page.postOnDateRadio.click();
              });

              afterEach(function(){
                page.postToBacklogButton.click();
                expectSuccessfulFinalState();
              });

              dateTimePickerPage.includeHappyPaths(function() {});
            });
          });

          describe('sad path', function() {

            it('should run once before all', function() {
              navigateToPage();
            });

            describe('when testing date time picker', function(){

              it('should run once before all', function() {
                page.populateUpload(tinyFilePath);
                page.postLaterButton.click();
                page.postOnDateRadio.click();
              });

              dateTimePickerPage.includeSadPaths(page.postToBacklogButton, page.helpMessages, function() {});

              it('should run once after all', function(){
                leavePage();
              });
            });

            describe('when a collection exists', function(){
              it('should run once before all', function() {
                navigateToPage();
                page.populateUpload(tinyFilePath);
                page.createCollectionLink.click();
              });

              testKit.includeSadPaths(page, page.dialogContinueButton, page.helpMessages, collectionNameInputPage, 'dialogCreateCollectionNameTextBox');

              it('should run once after all', function(){
                page.dialogCreateCollectionCloseButton.click();
                leavePage();
              });
            });

            describe('when a collection does not exist', function(){
              it('should run once before all', function() {
                var context = commonWorkflows.createSubscription();
                registration = context.registration;
                subscription = context.subscription;
              });

              describe('then', function() {
                beforeEach(function(){
                  navigateToPage();
                  page.populateUpload(tinyFilePath);
                  testKit.waitForElementToDisplay(element(by.id(page.createCollectionNameTextBoxId)));
                });

                afterEach(function(){
                  leavePage();
                });

                it('should not allow a comment more than 2000 characters', function(){
                  testKit.setFormValues(page, page.inputs);
                  var overSizedValue = new Array(2002).join( 'a' );
                  testKit.setValue(page.commentTextBoxId, overSizedValue, true);

                  testKit.assertMaxLength(page.helpMessages, page.commentTextBoxId, overSizedValue, 2000);
                });

                testKit.includeSadPaths(page, page.postNowButton, page.helpMessages, collectionNameInputPage, 'createCollectionNameTextBox');
                testKit.includeSadPaths(page, page.postLaterButton, page.helpMessages, collectionNameInputPage, 'createCollectionNameTextBox');
              });
            });
          });
        });
      });
    }}
  });

  module.exports = composeUploadPage;
})();
