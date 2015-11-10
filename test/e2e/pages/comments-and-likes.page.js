(function(){
  'use strict';

  var TestKit = require('../test-kit.js');

  var testKit = new TestKit();

  var CommentsAndLikesPage = function(isBacklog, commentIndex) {
    if(commentIndex){
      this.commentIndex = commentIndex;
    }

    if(isBacklog){
      this.isBacklog = isBacklog;
    }
  };

  var createCommentSelector = function(commentIndex){
    return '#comment-' + commentIndex;
  };

  CommentsAndLikesPage.prototype = Object.create({}, {
    commentIndex: { value: 0, writable: true },
    commentId: { get: function() { return element(by.id(createCommentSelector(this.commentIndex))); }},
    byCss: { value: function(css){
      return by.css(createCommentSelector(this.commentIndex) + ' ' + css);
    }},
    byCssContainingText: { value: function(css, text){
      return by.cssContainingText(createCommentSelector(this.commentIndex) + ' ' + css, text);
    }},

    commentTextBoxSelector: { value: '#model-input-comment .st-text-block' },
    commentTextBox: { get: function() { return element(by.css(this.commentTextBoxSelector)); }},
    addCommentButton: { get: function() { return element(by.id('save-comment-button')); }},
    crossButton: { get: function () { return element(by.id('modal-cross-button')); }},
    helpMessages: { get: function () { return element.all(by.css('.comments-dialog .help-block')); }},

    allComments: { get: function () { return element.all(by.css('.comments-dialog .comment')); }},

    commentNumber: { get: function() { return element(this.byCss('.comment-number')); }},
    commentUsername: { get: function() { return element(this.byCss('.comment-username')); }},
    commentLiveSince: { get: function() { return element(this.byCss('.comment-live-since')); }},
    commentContent: { get: function() { return element(this.byCss('.comment-content')); }},

    postComment: { value: function(){
      var date = new Date();
      var commentText = 'Comment on ' + date.toISOString();
      testKit.setContentEditableValue(this.commentTextBoxSelector, commentText);

      this.addCommentButton.click();

      return {
        content: commentText
      }
    }}
  });

  module.exports = CommentsAndLikesPage;

})();
