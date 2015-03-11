(function(){
  'use strict';

  var CommonWorkflows = require('../../../common-workflows.js');
  var TestKit = require('../../../test-kit.js');
  var SidebarPage = require('../../../pages/sidebar.page.js');
  var HeaderComposePage = require('../../../pages/header-compose.page.js');
  var CollectionNameInputPage = require('../../../pages/collection-name-input.page.js');
  var DateTimePickerPage = require('../../../pages/date-time-picker.page.js');

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

    uploadInput: { get: function() { return element(by.css('#file-upload-button-area input')); }},
    uploadButton: { get: function() { return element(by.css('#file-upload-button-area .btn')); }},

    commentTextBox: { get: function() { return element(by.id('model-input-comment')); }},
    collectionSelect: { get: function() { return element(by.id('model-input-selected-collection')); }},
    createCollectionLink: { get: function() { return element(by.css('.create-collection-link')); }},

    dialogCreateCollectionNameTextBox: { get: function() { return element(by.css('#create-collection-form input[type=text]')); }},
    dialogContinueButton: { get: function() { return element(by.css('#create-collection-form button[fw-form-submit="submit()"]')); }},

    createCollectionAreaCount: { get: function() { return element.all(by.id('new-collection-area')).count(); }},
    createCollectionNameTextBox: { get: function() { return element(by.css('#new-collection-area input[type=text]')); }},

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
        var indicator = this.uploadIndicator;
        browser.wait(function(){
          return indicator.isPresent();
        });
      }
      else{
        var postButton = this.postNowButton;
        browser.wait(function(){
          return postButton.isPresent();
        });
      }
    }},

    getCollectionOptionCount: { value: function(collectionName, channelName){
      var itemName = getCollectionOptionName(collectionName, channelName);
      return element.all(by.cssContainingText('#model-input-selected-collection option', itemName)).count();
    }},

    populateContent: { value: function(filePath, collectionName, channelName, createCollection, isFirstCollection){
      this.populateUpload(filePath, true);

      var date = new Date();
      this.commentTextBox.clear();
      this.commentTextBox.sendKeys('Comment on ' + date.toISOString());

      if(collectionName){
        if(!createCollection){
          var itemName = getCollectionOptionName(collectionName, channelName);
          element(by.cssContainingText('#model-input-selected-collection option', itemName)).click();
        }
        else{
          if(isFirstCollection){
            this.createCollectionNameTextBox.sendKeys(collectionName);
            if(channelName){
              element(by.cssContainingText('#new-collection-area option', channelName)).click();
            }
          }
          else{
            this.createCollectionLink.click();

            this.dialogCreateCollectionNameTextBox.sendKeys(collectionName);
            if(channelName){
              element(by.cssContainingText('#create-collection-form option', channelName)).click();
            }

            this.dialogContinueButton.click();
          }
        }
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
      this.populateContent(filePath, collectionName,  channelName, createCollection, isFirstCollection);

      this.postNowButton.click();
    }},

    postOnDate: { value: function(filePath, collectionName, channelName, createCollection, isFirstCollection) {
      this.populateContent(filePath, collectionName,  channelName, createCollection, isFirstCollection);
      this.postLaterButton.click();
      this.postOnDateRadio.click();

      dateTimePickerPage.datepickerButton.click();
      dateTimePickerPage.datepickerNextMonthButton.click();
      dateTimePickerPage.datepicker15Button.click();

      dateTimePickerPage.timeHoursTextBox.clear();
      dateTimePickerPage.timeHoursTextBox.sendKeys('13');
      dateTimePickerPage.timeMinutesTextBox.clear();
      dateTimePickerPage.timeMinutesTextBox.sendKeys('37');

      this.postToBacklogButton.click();
    }},

    postToQueue: { value: function(filePath, collectionName, channelName, createCollection, isFirstCollection) {
      this.populateContent(filePath, collectionName,  channelName, createCollection, isFirstCollection);
      this.postLaterButton.click();

      this.postToBacklogButton.click();
    }},

    setFileInput: { value: function(filePath) {
      var absolutePath = __dirname + '/' + filePath;
      //console.log(absolutePath);
      this.uploadInput.sendKeys(absolutePath);
    }},

    includeTests: { value: function(page){

      var uploadType = this.uploadType;
      var headerLink = this.headerLink;

      describe('compose ' + uploadType + ' form', function() {
        'use strict';

        var registration;
        var subscription;

        var commonWorkflows = new CommonWorkflows();
        var sidebar = new SidebarPage();
        var header = new HeaderComposePage();
        var testKit = new TestKit();
        var collectionNameInputPage = new CollectionNameInputPage();

        var filePath = '../../../sample-image.jpg';
        var tinyFilePath = '../../../sample-image-tiny.jpg';

        var channelNames;

        var firstCollectionName = 'Collection 0';
        var secondCollectionName = 'Collection 1';

        var createChannel = function(channelName){
          var result = commonWorkflows.createChannel();
          channelNames.push(result.name);
          navigateToPage();
        };

        var createCollection = function(collectionName, channelName, isFirstCollection){
          page.createCollection(tinyFilePath, collectionName, channelName, isFirstCollection);
          expect(page.successMessage.isDisplayed()).toBe(true);
          page.postAnotherButton.click();
        };

        var verifySuccess = function(successMessage, collectionName, channelName){
          expect(page.successMessage.isDisplayed()).toBe(true);
          expect(page.successMessage.getText()).toBe(successMessage);
          expect(page.postAnotherButton.isDisplayed()).toBe(true);

          page.postAnotherButton.click();

          expect(page.uploadButton.isDisplayed()).toBe(true);

          page.populateUpload(tinyFilePath);

          expect(page.getCollectionOptionCount(collectionName, channelName)).not.toBe(0);
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
          sidebar.newPostLink.click();
          header[headerLink].click();
        };

        beforeEach(function(){
          channelNames = [undefined];  // Set initial default channel name to undefined.
        });

        describe('workflows', function(){
          beforeEach(function(){
            var context = commonWorkflows.createSubscription();
            registration = context.registration;
            subscription = context.subscription;
            navigateToPage();
          });

          describe('when posting now', function(){

            describe('when creator has one channel', function(){

              describe('when the creator has no collections', function(){
                postNow(firstCollectionName, 0, true, true);
              });

              describe('when the creator has one collection', function(){

                beforeEach(function(){
                  createCollection(firstCollectionName, channelNames[0], true);
                });

                it('should select the existing collection if a duplicate collection is added', function(){
                  page.populateUpload(tinyFilePath);
                  page.createCollectionLink.click();

                  page.dialogCreateCollectionNameTextBox.sendKeys(firstCollectionName);

                  page.dialogContinueButton.click();

                  expect(page.getCollectionOptionCount(firstCollectionName, channelNames[0])).toBe(1);
                });

                postNow(firstCollectionName, 0, false, false);
                postNow(secondCollectionName, 0, true, false);
              });
            });

            describe('when creator has two channels', function(){

              beforeEach(function(){
                createChannel();
              });

              describe('when the creator has no collections', function(){
                postNow(firstCollectionName, 0, true, true);
                postNow(firstCollectionName, 1, true, true);
              });

              describe('when the creator has one collection', function(){

                beforeEach(function(){
                  createCollection(firstCollectionName, channelNames[0], true);
                });

                postNow(firstCollectionName, 0, false, false);
                postNow(secondCollectionName, 0, true, false);
                postNow(firstCollectionName, 1, true, false);
                postNow(secondCollectionName, 1, true, false);
              });

              describe('when the creator has two collections', function(){

                beforeEach(function(){
                  createCollection(firstCollectionName, channelNames[0], true);
                  createCollection(firstCollectionName, channelNames[1], false);
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
              postOnDate(firstCollectionName, 0, true, true);
            });

            describe('when creator has two channels and two collections', function(){

              beforeEach(function(){
                createChannel();
                createCollection(firstCollectionName, channelNames[0], true);
                createCollection(firstCollectionName, channelNames[1], false);
              });

              postOnDate(firstCollectionName, 0, false, false);
              postOnDate(secondCollectionName, 0, true, false);
              postOnDate(firstCollectionName, 1, false, false);
              postOnDate(secondCollectionName, 1, true,  false);
            });
          });

          describe('when posting to queue', function(){

            describe('when creator has one channel', function(){
              postToQueue(firstCollectionName, 0, true, true);
            });

            describe('when creator has one channel and one collection', function() {

              beforeEach(function () {
                createCollection(firstCollectionName, channelNames[0], true);
              });

              it('should receive an estimated live date from the server', function(){
                page.populateUpload(tinyFilePath);
                page.postLaterButton.click();

                browser.wait(function(){
                  return page.postToQueueDate.isPresent();
                });

                expect(page.postToQueueDate.isDisplayed()).toBe(true);
              });
            });

            describe('when creator has two channels and two collections', function(){

              beforeEach(function(){
                createChannel();
                createCollection(firstCollectionName, channelNames[0], true);
                createCollection(firstCollectionName, channelNames[1], false);
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
            beforeEach(function(){
              var context = commonWorkflows.createSubscription();
              registration = context.registration;
              subscription = context.subscription;
              navigateToPage();
              page.populateUpload(tinyFilePath);
            });

            describe('when posting now', function(){
              afterEach(function(){
                page.postNowButton.click();
                expect(page.successMessage.isDisplayed()).toBe(true);

                page.postAnotherButton.click();
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

              describe('when a collection exists', function(){

                beforeEach(function(){
                  createCollection(firstCollectionName, channelNames[0], true);
                  navigateToPage();
                  page.populateUpload(tinyFilePath);
                  page.createCollectionLink.click();
                });

                collectionNameInputPage.includeHappyPaths(function(value) {
                  page.createCollectionNameTextBox.clear();
                  page.createCollectionNameTextBox.sendKeys(value);
                });
              });

            });

            describe('when posting to backlog', function(){
              beforeEach(function(){
                testKit.setFormValues(page, page.inputs);
                page.postLaterButton.click();
              });

              afterEach(function(){
                page.postToBacklogButton.click();
                expect(page.successMessage.isDisplayed()).toBe(true);

                page.postAnotherButton.click();
              });

              describe('when testing date time picker', function(){
                beforeEach(function(){
                  page.postOnDateRadio.click();
                });

                dateTimePickerPage.includeHappyPaths(function() {});
              });
            });
          });

          describe('sad path', function() {

            it('should run once before all', function() {
              var context = commonWorkflows.createSubscription();
              registration = context.registration;
              subscription = context.subscription;
              navigateToPage();
            });

            describe('when testing date time picker', function(){

              it('should run once before all', function() {
                page.populateUpload(tinyFilePath);
                testKit.setFormValues(page, page.inputs);
                page.postLaterButton.click();
                page.postOnDateRadio.click();
              });

              dateTimePickerPage.includeSadPaths(page.postToBacklogButton, page.helpMessages, function() {});

              it('should run once after all', function(){
                browser.refresh();
              });
            });

            describe('when a collection does not exist', function(){
              beforeEach(function(){
                page.populateUpload(tinyFilePath);
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
            });

            describe('when a collection exists', function(){

              it('should run once before all', function() {
                createCollection(firstCollectionName, channelNames[0], true);
                navigateToPage();
              });

              describe('then', function(){

                beforeEach(function(){
                  page.populateUpload(tinyFilePath);
                  page.createCollectionLink.click();
                });

                afterEach(function(){
                  browser.refresh();
                });

                collectionNameInputPage.includeSadPaths(page.dialogCreateCollectionNameTextBox, page.dialogContinueButton, page.helpMessages, function() {});
              });
            });
          });
        });
      });
    }}
  });

  module.exports = composeUploadPage;
})();
