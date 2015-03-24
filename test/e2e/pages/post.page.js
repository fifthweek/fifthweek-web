(function(){
  'use strict';

  var AccountPage = require('./account-settings.page.js');
  var EditChannelPage = require('./creators/subscription/channel-edit.page.js');
  var EditCollectionPage = require('./creators/subscription/collection-edit.page.js');

  var accountPage = new AccountPage();
  var editChannelPage = new EditChannelPage();
  var editCollectionPage = new EditCollectionPage();

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
    comment: { get: function() { return element(this.byCss('.text .content p:first-child')); }},
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

    expectFooter: { value: function(isNote, postData, registration, navigateToPage){

      this.usernameLink.click();
      expect(browser.getCurrentUrl()).toContain(accountPage.pageUrl);
      navigateToPage();

      if(isNote){
        this.containerNameLink.click();
        expect(browser.getCurrentUrl()).toContain(editChannelPage.pageUrl);
        expect(editChannelPage.nameTextBox.getAttribute('value')).toBe(postData.channelName || 'Basic Subscription');
        navigateToPage();
      }
      else{
        this.containerNameLink.click();
        expect(browser.getCurrentUrl()).toContain(editCollectionPage.pageUrl);
        expect(editCollectionPage.nameTextBox.getAttribute('value')).toBe(postData.collectionName);
        navigateToPage();
      }
    }},

    expectNotePost: { value: function(postData, registration, navigateToPage){
      this.expectScheduledTag(postData,  registration);

      expect(this.comment.getText()).toBe(postData.noteText);
      expect(this.usernameLink.getText()).toBe(registration.username);
      expect(this.containerNameLink.getText()).toBe(postData.channelName || 'Everyone');

      this.expectFooter(true, postData, registration, navigateToPage);
    }},

    expectImagePost: { value: function(postData, registration, navigateToPage){
      this.expectScheduledTag(postData,  registration);

      expect(this.comment.getText()).toBe(postData.commentText);

      expect(this.usernameLink.getText()).toBe(registration.username);
      expect(this.containerNameLink.getText()).toBe(postData.collectionName);

      this.expectFooter(false, postData, registration, navigateToPage);
    }},

    expectFilePost: { value: function(postData, registration, navigateToPage){
      this.expectScheduledTag(postData,  registration);

      expect(this.comment.getText()).toBe(postData.commentText);
      expect(this.fileDownloadLink.getText()).toBe(getFileName(postData.filePath));
      expect(this.fileSizeText.getText()).toContain('KB');

      expect(this.usernameLink.getText()).toBe(registration.username);
      expect(this.containerNameLink.getText()).toBe(postData.collectionName);

      this.expectFooter(false, postData, registration, navigateToPage);
    }},

    expectNonViewableImagePost: { value: function(postData, registration, navigateToPage){
      expect(this.fileDownloadLink.getText()).toBe(getFileName(postData.filePath));
      expect(this.fileSizeText.getText()).toContain('KB');

      this.expectImagePost(postData, registration, navigateToPage);
    }}

  });

  module.exports = PostPage;

})();
