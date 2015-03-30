(function(){
  'use strict';

  var path = require('path');
  var _ = require('lodash');
  var TestKit = require('../../test-kit.js');
  var testKit = new TestKit();
  var PostPage = require('../../pages/post.page.js');

  var editedText = 'Edited';

  var EditPostDialogPage = function() {};

  EditPostDialogPage.prototype = Object.create({}, {
    saveButton: { get: function() { return element(by.id('save-post-button')); }},
    modals: { get: function () { return element.all(by.css('.modal')); }},
    title: { get: function () { return element(by.id('modal-title')); }},
    crossButton: { get: function () { return element(by.id('modal-cross-button')); }},
    cancelButton: { get: function () { return element(by.id('modal-cancel-button')); }},
    uploadInput: { get: function() { return element(by.id('file-upload-button-input')); }},
    uploadButton: { get: function() { return element(by.css('#file-upload-button-area .btn')); }},

    commentTextBoxId: { value: 'model-input-comment' },
    commentTextBox: { get: function () { return element(by.id(this.commentTextBoxId)); }},

    describeEditingPostContent: { value: function(isBacklog, inputData, navigateToPage, displayModal, refresh) {
      var self = this;
      var post = new PostPage(isBacklog);
      var displayModalAndWait = function() {
        displayModal();
        browser.waitForAngular();
      };

      var setFileInput = function(filePath) {
        filePath = path.resolve(__dirname + '/' + filePath);
        console.log(filePath);
        self.uploadInput.sendKeys(filePath);
      };

      var editPost = function(){
        testKit.setValue(self.commentTextBoxId, editedText);

        if(inputData.postData.filePath){
          setFileInput('../../sample-image-tiny-edited.tif')
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

      describe('the modal for editing a post', function() {
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
          }
        ], function(cancelOperation) {
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
          browser.waitForAngular();
          refresh();
          verifyItemEdited();
          refresh();
        });
      });
    }}
  });

  module.exports = EditPostDialogPage;
})();
