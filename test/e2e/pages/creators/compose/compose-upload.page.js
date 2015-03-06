(function(){
  'use strict';

  var CommonWorkflows = require('../../../common-workflows.js');
  var TestKit = require('../../../test-kit.js');
  var SidebarPage = require('../../../pages/sidebar.page.js');
  var HeaderComposePage = require('../../../pages/header-compose.page.js');
  var CollectionNameInputPage = require('../../../pages/collection-name-input.page.js');

  var collectionNameInputPage = new CollectionNameInputPage();

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

    datepicker: { get: function() { return element(by.id('model-input-date')); }},

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
          }
        }
      }
    }},

    postNow: { value: function(filePath, collectionName, channelName, createCollection, isFirstCollection) {
      this.populateContent(filePath, collectionName,  channelName, createCollection, isFirstCollection);

      this.postNowButton.click();
    }},

    postOnDate: { value: function(filePath, collectionName, channelName, createCollection, isFirstCollection) {
      this.populateContent(filePath, collectionName,  channelName, createCollection, isFirstCollection);
      this.postLaterButton.click();
      this.postOnDateRadio.click();

      var tomorrow = new Date(new Date().getTime() + 24*60*60*1000);
      this.datepicker.clear();
      this.datepicker.sendKeys(tomorrow.toISOString());

      this.postToBacklogButton.click();
    }},

    postToQueue: { value: function(filePath, collectionName, channelName, createCollection, isFirstCollection) {
      this.populateContent(filePath, collectionName,  channelName, createCollection, isFirstCollection);
      this.postLaterButton.click();
      this.postToQueueRadio.click();
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

          expect(page.uploadButton.isDisplayed()).toBe(true);

          page.populateUpload(tinyFilePath);

          expect(page.getCollectionOptionCount(collectionName, channelName)).toBe(1);
        };

        var postNow = function(collectionName, channelName, createCollection, isFirstCollection){
          it('should post an ' + uploadType + ' to ' + collectionName + (channelName ? '(' + channelName + ')' : ''), function(){
            page.postNow(filePath, collectionName, channelName, createCollection, isFirstCollection);
            verifySuccess('Posted successfully', collectionName, channelName);
          });
        };

        var postOnDate = function(collectionName, channelName, createCollection, isFirstCollection){
          it('should schedule an ' + uploadType + ' to ' + collectionName + (channelName ? '(' + channelName + ')' : ''), function(){
            page.postOnDate(filePath, collectionName, channelName, createCollection, isFirstCollection);
            verifySuccess('Scheduled successfully', collectionName, channelName);
          });
        };

        var postToQueue = function(collectionName, channelName, createCollection, isFirstCollection){
          it('should queue an ' + uploadType + ' to ' + collectionName + (channelName ? '(' + channelName + ')' : ''), function(){
            page.postToQueue(filePath, collectionName, channelName, createCollection, isFirstCollection);
            verifySuccess('Queued successfully', collectionName, channelName);
          });
        };

        var navigateToPage = function() {
          sidebar.newPostLink.click();
          header[headerLink].click();
        };

        describe('workflows', function(){
          beforeEach(function(){
            var context = commonWorkflows.createSubscription();
            registration = context.registration;
            subscription = context.subscription;
            navigateToPage();
          });

          postNow(firstCollectionName, undefined, true, true);
          postToQueue(firstCollectionName, undefined, true, true);
          postOnDate(firstCollectionName, undefined, true, true);

          /*
           describe('when posting now', function(){

           describe('when creator has one channel', function(){

           createChannel(secondChannelName); // Test reflected in UI.
           createCollection(firstCollectionName); // Test reflected in UI.

           describe('when the creator has no collections', function(){
           postNow(firstCollectionName, undefined, true, true);
           });

           describe('when the creator has one collection', function(){

           beforeEach(function(){
           createCollection(firstCollectionName);
           });

           postNow(firstCollectionName, undefined, false, false);
           postNow(secondCollectionName, undefined, true, false);
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
           postNow(firstCollectionName, undefined, true, true);
           postNow(firstCollectionName, secondChannelName, true, true);
           });

           describe('when the creator has one collection', function(){

           beforeEach(function(){
           createCollection(firstCollectionName);
           });

           postNow(firstCollectionName, undefined, false, false);
           postNow(secondCollectionName, undefined, true, false);
           postNow(firstCollectionName, secondChannelName, true, false);
           postNow(secondCollectionName, secondChannelName, true, false);
           });

           describe('when the creator has two collections', function(){

           beforeEach(function(){
           createCollection(firstCollectionName);
           createCollection(firstCollectionName, secondChannelName);
           });

           postNow(firstCollectionName, undefined, false, false);
           postNow(secondCollectionName, undefined, true, false);
           postNow(firstCollectionName, secondChannelName, false, false);
           postNow(secondCollectionName, secondChannelName, true, false);
           });
           });
           });

           describe('when posting on schedule', function(){

           describe('when creator has one channel', function(){
           postOnDate(firstCollectionName, undefined, true, true);
           });

           describe('when creator has two channels and two collections', function(){

           beforeEach(function(){
           createChannel(secondChannelName);
           createCollection(firstCollectionName);
           createCollection(firstCollectionName, secondChannelName);
           });

           postOnDate(firstCollectionName, undefined, false, false);
           postOnDate(secondCollectionName, undefined, true, false);
           postOnDate(firstCollectionName, secondChannelName, false, false);
           postOnDate(secondCollectionName, secondChannelName, true,  false);
           });
           });

           describe('when posting to queue', function(){

           describe('when creator has one channel', function(){
           postToQueue(firstCollectionName, undefined, true, true);
           });

           describe('when creator has two channels and two collections', function(){

           beforeEach(function(){
           createChannel(secondChannelName);
           createCollection(firstCollectionName);
           createCollection(firstCollectionName, secondChannelName);
           });

           postToQueue(firstCollectionName, undefined, false, false);
           postToQueue(secondCollectionName, undefined, true, false);
           postToQueue(firstCollectionName, secondChannelName, false, false);
           postToQueue(secondCollectionName, secondChannelName, true,  false);
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
              page.populateUpload(tinyFilePath);
            });

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
            /*
             describe('when a collection exists', function(){

             beforeEach(function(){
             createCollection(firstCollectionName);
             navigateToPage();
             page.populateUpload(tinyFilePath);
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
             page.populateUpload(tinyFilePath);
             page.createCollectionLink.click();
             });

             collectionNameInputPage.includeSadPaths(page.dialogCreateCollectionNameTextBox, page.dialogContinueButton, page.helpMessages, function() {});
             });
             */
          });
        });
      });
    }}
  });

  module.exports = composeUploadPage;
})();
