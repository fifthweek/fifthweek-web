(function(){
  'use strict';

  var path = require('path');
  var _ = require('lodash');
  var TestKit = require('../../test-kit.js');
  var testKit = new TestKit();
  var PostPage = require('../../pages/post.page.js');
  var DateTimePickerPage = require('../../pages/date-time-picker.page.js');
  var dateTimePickerPage = new DateTimePickerPage();
  var DiscardChangesPage = require('../../pages/discard-changes.page.js');
  var discardChanges = new DiscardChangesPage();

  var editedText = 'Edited';

  var EditPostDialogPage = function() {};

  var runDialogTests = function (self,displayModal,refresh,editPost,verifyItemNotEdited,verifyItemEdited){
    var displayModalAndWait = function() {
      displayModal();
      testKit.waitForElementToDisplay(self.expandButton);
    };

    it('should run once before all', function () {
      displayModalAndWait();
    });

    it('should have the title "Edit Post"', function() {
      expect(self.title.getText()).toBe('Edit Post');
    });


    _.forEach([
    {
      name: 'cancel button',
      action: function() {
        self.cancelButton.click();
      }
    },
    {
      name: 'X button',
      action: function() {
        self.crossButton.click();
      }
    }],
    function(cancelOperation) {
      describe('clicking the ' + cancelOperation.name, function() {
        it('should cancel the operation', function () {
          editPost();
          cancelOperation.action();
          testKit.waitForElementToDisplay(discardChanges.discardButton);
          discardChanges.discardButton.click();
          testKit.waitForElementToBeRemoved(self.crossButton);
          displayModalAndWait();
        });
      });
    });

    describe('the save button', function() {
      it('should be enabled', function() {
        expect(self.saveButton.isEnabled()).toBe(true);
        self.crossButton.click();
        testKit.waitForElementToBeRemoved(self.crossButton);
      });
    });

    it('should not have edited the item up to this point', function() {
      refresh();
      verifyItemNotEdited();
      displayModalAndWait();
    });

    it('should edit the post', function() {
      editPost();
      self.saveButton.click();
      testKit.waitForElementToBeRemoved(self.saveButton);
      verifyItemEdited();
      refresh();
      verifyItemEdited();
      refresh();
    });
  };

  EditPostDialogPage.prototype = Object.create({}, {
    saveButton: { get: function() { return element(by.id('save-post-button')); }},
    modals: { get: function () { return element.all(by.css('.modal')); }},
    title: { get: function () { return element(by.id('modal-title')); }},
    crossButton: { get: function () { return element(by.id('modal-cross-button')); }},
    cancelButton: { get: function () { return element(by.id('modal-cancel-button')); }},
    fileUploadInput: { get: function() { return element(by.id('file-upload-button-input')); }},
    fileUploadButton: { get: function() { return element(by.css('#file-upload-button-area .btn')); }},
    imageUploadInput: { get: function() { return element(by.id('image-upload-button-input')); }},
    imageUploadButton: { get: function() { return element(by.css('#image-upload-button-area .btn')); }},
    expandButton: { get: function() { return element(by.cssContainingText('button', 'expand')); }},
    collapseButton: { get: function() { return element(by.cssContainingText('button', 'close')); }},
    postToLiveRadio: { get: function() { return element(by.css('input[type="radio"][value="0"]')); }},
    postToQueueRadio: { get: function() { return element(by.css('input[type="radio"][value="2"]')); }},
    postToDateRadio: { get: function() { return element(by.css('input[type="radio"][value="1"]')); }},
    imageUploadIndicator: { get: function(){ return element(by.css('.available-image')); }},

    commentTextBoxId: { value: 'model-input-comment' },
    commentTextBox: { get: function () { return element(by.id(this.commentTextBoxId)); }},

    editPostComment: { value: function(comment) {
      testKit.setContentEditableValue(this.commentTextBoxId, comment);
      browser.waitForAngular();
      this.saveButton.click();
      testKit.waitForElementToBeRemoved(this.saveButton);
    }},

    editPostDate: { value: function(monthCount) {
      this.expandButton.click();
      this.postToDateRadio.click();
      testKit.screenshot('before-edit.png');
      dateTimePickerPage.datepickerButton.click();

      var i;
      if(monthCount > 0){
        for(i=0;i<monthCount;++i){
          dateTimePickerPage.datepickerNextMonthButton.click();
        }
      }
      else if(monthCount < 0){
        monthCount = -1 * monthCount;
        for(i=0;i<monthCount;++i){
          dateTimePickerPage.datepickerPreviousMonthButton.click();
        }
      }

      dateTimePickerPage.datepicker15Button.click();
      this.saveButton.click();
      testKit.waitForElementToBeRemoved(this.saveButton);
    }},

    describeEditingPostToLive: { value: function(isBacklog, inputData, navigateToPage, displayModal, refresh) {
      var self = this;
      var post = new PostPage(isBacklog);

      var editPost = function(){
        self.expandButton.click();
        self.postToLiveRadio.click();
      };

      var verifyItemNotEdited = function(){
        expect(post.allPosts.count()).toBe(1);
      };

      var verifyItemEdited = function(){
        expect(post.allPosts.count()).toBe(0);
      };

      describe('editing post to live', function() {
        runDialogTests(self, displayModal, refresh, editPost, verifyItemNotEdited, verifyItemEdited);
      });
    }},

    describeEditingPostToQueue: { value: function(isBacklog, inputData, navigateToPage, displayModal, refresh) {
      var self = this;
      var post = new PostPage(isBacklog);

      var editPost = function(){
        self.expandButton.click();
        self.postToQueueRadio.click();
      };

      var verifyItemNotEdited = function(){
        expect(post.allPosts.count()).toBe(1);
      };

      var verifyItemEdited = function(){
        expect(post.allPosts.count()).toBe(0);
      };

      describe('editing post to queue', function() {
        runDialogTests(self, displayModal, refresh, editPost, verifyItemNotEdited, verifyItemEdited);
      });
    }},

    describeEditingPostToFutureDate: { value: function(isBacklog, inputData, navigateToPage, displayModal, refresh, monthCount) {
      var self = this;
      monthCount = monthCount || 1;
      var post = new PostPage(isBacklog);

      var editPost = function(){
        self.expandButton.click();
        self.postToDateRadio.click();
        dateTimePickerPage.datepickerButton.click();
        for(var i=0;i<monthCount;++i){
          dateTimePickerPage.datepickerNextMonthButton.click();
        }
        dateTimePickerPage.datepicker15Button.click();

        dateTimePickerPage.timeHoursTextBox.clear();
        dateTimePickerPage.timeHoursTextBox.sendKeys('3');
        dateTimePickerPage.timeMinutesTextBox.clear();
        dateTimePickerPage.timeMinutesTextBox.sendKeys('13');
      };

      var verifyItemNotEdited = function(){
        expect(post.allPosts.count()).toBe(1);
      };

      var verifyItemEdited = function(){
        expect(post.allPosts.count()).toBe(0);
      };

      describe('editing post to future date', function() {
        runDialogTests(self, displayModal, refresh, editPost, verifyItemNotEdited, verifyItemEdited);
      });
    }},

    describeEditingPostToPastDate: { value: function(isBacklog, inputData, navigateToPage, displayModal, refresh, monthCount) {
      var self = this;
      monthCount = monthCount || 1;
      var post = new PostPage(isBacklog);

      var editPost = function(){
        self.expandButton.click();
        self.postToDateRadio.click();
        dateTimePickerPage.datepickerButton.click();
        for(var i=0;i<monthCount;++i){
          dateTimePickerPage.datepickerPreviousMonthButton.click();
        }
        dateTimePickerPage.datepicker15Button.click();

        dateTimePickerPage.timeHoursTextBox.clear();
        dateTimePickerPage.timeHoursTextBox.sendKeys('3');
        dateTimePickerPage.timeMinutesTextBox.clear();
        dateTimePickerPage.timeMinutesTextBox.sendKeys('13');
      };

      var verifyItemNotEdited = function(){
        expect(post.allPosts.count()).toBe(1);
      };

      var verifyItemEdited = function(){
        expect(post.allPosts.count()).toBe(0);
      };

      describe('editing post to past date', function() {
        runDialogTests(self, displayModal, refresh, editPost, verifyItemNotEdited, verifyItemEdited);
      });
    }},

    describeEditingPostContent: { value: function(isBacklog, inputData, navigateToPage, displayModal, refresh) {
      var self = this;
      var post = new PostPage(isBacklog);

      var setFileInput = function(filePath, uploadInput) {
        filePath = path.resolve(__dirname + '/' + filePath);
        console.log(filePath);
        uploadInput.sendKeys(filePath);
      };

      var editPost = function(){
        testKit.setContentEditableValue(self.commentTextBoxId, editedText);
        browser.waitForAngular();

        setFileInput('../../sample-image-tiny-edited.tif', self.fileUploadInput);
        browser.waitForAngular();
        testKit.waitForElementToDisplay(self.fileUploadButton);

        setFileInput('../../sample-image-tiny-edited.jpg', self.imageUploadInput);
        browser.waitForAngular();
        testKit.waitForElementToDisplay(self.imageUploadIndicator);

        browser.waitForAngular();
      };

      var verifyItemNotEdited = function(){
        var blog = inputData.blog;
        var postData = inputData.postData;
        var registration = inputData.registration;
        post.expectPost(blog, postData, registration, navigateToPage);
      };

      var verifyItemEdited = function(){
        var blog = inputData.blog;
        var postData = inputData.postData;
        var registration = inputData.registration;
        postData = _.cloneDeep(postData);

        postData.commentText = editedText;
        postData.filePath = 'sample-image-tiny-edited.tif';
        postData.imagePath = 'sample-image-tiny-edited.jpg';

        expect(post.fileSizeText.getText()).toBe('67.81 KB');

        post.expectPost(blog, postData, registration, navigateToPage);
      };

      describe('the modal for editing post content', function() {
        runDialogTests(self, displayModal, refresh, editPost, verifyItemNotEdited, verifyItemEdited);
      });
    }}
  });

  module.exports = EditPostDialogPage;
})();
