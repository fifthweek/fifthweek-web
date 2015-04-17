(function(){
  'use strict';

  var path = require('path');
  var _ = require('lodash');
  var TestKit = require('../../test-kit.js');
  var testKit = new TestKit();
  var PostPage = require('../../pages/post.page.js');
  var DateTimePickerPage = require('../../pages/date-time-picker.page.js');
  var dateTimePickerPage = new DateTimePickerPage();

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
          browser.waitForAngular();
          expect(self.modals.count()).toBe(0);
          displayModalAndWait();
        });
      });
    });

    describe('the save button', function() {
      it('should be enabled', function() {
        expect(self.saveButton.isEnabled()).toBe(true);
        self.crossButton.click();
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
      verifyItemEdited();
      browser.sleep(5000);
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
    uploadInput: { get: function() { return element(by.id('file-upload-button-input')); }},
    uploadButton: { get: function() { return element(by.css('#file-upload-button-area .btn')); }},
    expandButton: { get: function() { return element(by.cssContainingText('button', 'expand')); }},
    collapseButton: { get: function() { return element(by.cssContainingText('button', 'close')); }},
    postToLiveRadio: { get: function() { return element(by.css('input[type="radio"][value="0"]')); }},
    postToQueueRadio: { get: function() { return element(by.css('input[type="radio"][value="2"]')); }},
    postToDateRadio: { get: function() { return element(by.css('input[type="radio"][value="1"]')); }},
    imageUploadIndicator: { get: function(){ return element(by.css('.available-image')); }},

    commentTextBoxId: { value: 'model-input-comment' },
    commentTextBox: { get: function () { return element(by.id(this.commentTextBoxId)); }},

    editPostComment: { value: function(comment) {
      testKit.setValue(this.commentTextBoxId, comment);
      browser.waitForAngular();
      this.saveButton.click();
      browser.waitForAngular();
    }},

    editPostDate: { value: function(monthCount) {
      this.expandButton.click();
      this.postToDateRadio.click();
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
      browser.waitForAngular();
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

      var setFileInput = function(filePath) {
        filePath = path.resolve(__dirname + '/' + filePath);
        console.log(filePath);
        self.uploadInput.sendKeys(filePath);
      };

      var editPost = function(){
        testKit.setValue(self.commentTextBoxId, editedText);
        browser.waitForAngular();

        if(inputData.postData.filePath){
          setFileInput('../../sample-image-tiny-edited.tif');
          if(inputData.postData.uploadType === 'image') {
            testKit.waitForElementToDisplay(self.imageUploadIndicator);
          }
        }
      };

      var verifyItemNotEdited = function(){
        var postData = inputData.postData;
        var registration = inputData.registration;
        if(postData.uploadType === 'image'){
          post.expectImagePost(postData, registration, navigateToPage);
        }
        else if(postData.uploadType === 'file'){
          post.expectFilePost(postData, registration, navigateToPage);
        }
        else{
          post.expectNotePost(postData, registration, navigateToPage);
        }
      };

      var verifyItemEdited = function(){
        var postData = inputData.postData;
        var registration = inputData.registration;
        var postData = _.cloneDeep(postData);

        if(postData.uploadType === undefined) {
          postData.noteText = editedText;
          post.expectNotePost(postData, registration, navigateToPage);
        }
        else{
          postData.commentText = editedText;
          postData.filePath = 'sample-image-tiny-edited.tif';
          expect(post.fileSizeText.getText()).toBe('67.81 KB');

          if(postData.uploadType === 'image'){
            post.expectNonViewableImagePost(postData, registration, navigateToPage);
          }
          else if(postData.uploadType === 'file'){
            post.expectFilePost(postData, registration, navigateToPage);
          }
        }
      };

      describe('the modal for editing post content', function() {
        runDialogTests(self, displayModal, refresh, editPost, verifyItemNotEdited, verifyItemEdited);
      });
    }}
  });

  module.exports = EditPostDialogPage;
})();
