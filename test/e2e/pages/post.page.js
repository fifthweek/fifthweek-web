(function(){
  'use strict';


  var PostPage = function(isBacklog, postIndex) {
    if(postIndex){
      this.postIndex = postIndex;
    }

    if(isBacklog){
      this.isBacklog = isBacklog;
    }
  };

  var createPostSelector = function(postIndex){
    return '#post-' + postIndex;
  };

  var getFileName = function(filePath){
    return filePath.replace(/^.*[\\\/]/, '');
  };

  PostPage.prototype = Object.create({}, {
    postIndex: { value: 0, writable: true },
    isBacklog: { value: false, writable: true },
    postId: { get: function() { return element(by.id(createPostSelector(this.postIndex))); }},
    byCss: { value: function(css){
      return by.css(createPostSelector(this.postIndex) + ' ' + css);
    }},
    byCssContainingText: { value: function(css, text){
      return by.cssContainingText(createPostSelector(this.postIndex) + ' ' + css, text);
    }},

    postsArea: { get: function() { return element(by.css('.posts')); }},
    taggedPostsArea: { get: function() { return element(by.css('.tagged-posts')); }},
    allPosts: { get: function () { return element.all(by.css('.posts .post')); }},

    image: { get: function() { return element(this.byCss('.full-width-image')); }},
    scheduleTag: { get: function() { return element(this.byCss('.tag')); }},
    scheduleTags: { get: function() { return element.all(this.byCss('.tag')); }},
    comment: { get: function() { return element(this.byCss('.text .content .post-comment')); }},
    fileDownloadLink: { get: function() { return element(this.byCss('.text .content .file-content')); }},
    fileSizeText: { get: function() { return element(this.byCss('.text .content .file-size')); }},
    profileImage: { get: function() { return element(this.byCss('.author-image')); }},
    usernameLink: { get: function() { return element(this.byCss('.poster-name')); }},
    containerNameLink: { get: function() { return element(this.byCss('.container-name')); }},
    liveInLink: { get: function() { return element(this.byCss('.live-in-info')); }},
    moreActionsButton: { get: function() { return element(this.byCss('.actions-more button')); }},
    editPostLink: { get: function() { return element(this.byCssContainingText('.actions-drop-down a', 'Edit')); }},
    deletePostLink: { get: function() { return element(this.byCssContainingText('.actions-drop-down a', 'Delete')); }},

    expectScheduledTag: { value: function(postData, registration){
      if(this.isBacklog){
        expect(this.scheduleTag.isDisplayed()).toBe(true);

        if(postData.isQueued){
          expect(this.scheduleTag.getText()).toContain('Queued');
        }
        else{
          expect(this.scheduleTag.getText()).toContain('Scheduled');
          expect(this.scheduleTag.getText()).toContain(' ' + postData.dayOfMonth);
        }
      }
      else{
        expect(this.scheduleTags.count()).toBe(0);
      }
    }},

    expectNotePost: { value: function(postData, registration){
      this.expectScheduledTag(postData,  registration);

      expect(this.comment.getText()).toBe(postData.noteText);

      expect(this.usernameLink.getText()).toBe(registration.username);

      if(postData.channelName){
        expect(this.containerNameLink.getText()).toBe(postData.channelName);
      }
      else{
        expect(this.containerNameLink.getText()).toBe('Basic Subscription');
      }
    }},

    expectImagePost: { value: function(postData, registration){
      this.expectScheduledTag(postData,  registration);

      expect(this.comment.getText()).toBe(postData.commentText);

      expect(this.usernameLink.getText()).toBe(registration.username);
      expect(this.containerNameLink.getText()).toBe(postData.collectionName);
    }},

    expectNonViewableImagePost: { value: function(postData, registration){
      this.expectScheduledTag(postData,  registration);

      expect(this.comment.getText()).toBe(postData.commentText);
      expect(this.fileDownloadLink.getText()).toBe(getFileName(postData.filePath));
      expect(this.fileSizeText.getText()).toContain('KB');

      expect(this.usernameLink.getText()).toBe(registration.username);
      expect(this.containerNameLink.getText()).toBe(postData.collectionName);
    }},

    expectFilePost: { value: function(postData, registration){
      this.expectScheduledTag(postData,  registration);

      expect(this.comment.getText()).toBe(postData.commentText);
      expect(this.fileDownloadLink.getText()).toBe(getFileName(postData.filePath));
      expect(this.fileSizeText.getText()).toContain('KB');

      expect(this.usernameLink.getText()).toBe(registration.username);
      expect(this.containerNameLink.getText()).toBe(postData.collectionName);
    }}
  });

  module.exports = PostPage;

})();
