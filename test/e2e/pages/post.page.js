(function(){
  'use strict';

  var _ = require('lodash');
  var TestKit = require('../test-kit.js');
  var ModalPage = require('./modal.page.js');
  var CreatorLandingPagePage = require('./creators/creator-landing-page.page.js');
  var PostListInformation = require('./post-list-information.page.js');

  var testKit = new TestKit();
  var modalPage = new ModalPage();
  var landingPage = new CreatorLandingPagePage();
  var postListInformation = new PostListInformation();

  var PostPage = function(isBacklog, postIndex) {
    if(postIndex){
      this.postIndex = postIndex;
    }

    if(isBacklog){
      this.isBacklog = isBacklog;
    }
  };

  var createPostSelector = function(postIndex){
    if(postIndex === 'full'){
      return '#full-post';
    }

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

    ownerTag: { value: undefined, writable: false },
    previewTag: { value: 'Preview', writable: false },
    guestListTag: { value: 'Guest List', writable: false },
    subscribedTag: { value: 'Subscribed', writable: false },

    postsArea: { get: function() { return element(by.css('.posts')); }},
    taggedPostsArea: { get: function() { return element(by.css('.tagged-posts')); }},
    allPosts: { get: function () { return element.all(by.css('.posts .post')); }},

    image: { get: function() { return element(this.byCss('.full-width-image')); }},
    images: { get: function() { return element.all(this.byCss('.full-width-image')); }},
    scheduleTag: { get: function() { return element(this.byCss('.tag')); }},
    scheduleTags: { get: function() { return element.all(this.byCss('.tag')); }},
    comment: { get: function() { return element(this.byCss('#post-comment')); }},
    fileDownloadLink: { get: function() { return element(this.byCss('.text .content .file-content')); }},
    fileDownloadLinks: { get: function() { return element.all(this.byCss('.text .content .file-content')); }},
    fileSizeText: { get: function() { return element(this.byCss('.text .content .file-size')); }},
    profileImage: { get: function() { return element(this.byCss('.author-image')); }},
    usernameLink: { get: function() { return element(this.byCss('.poster-name')); }},
    containerNameLink: { get: function() { return element(this.byCss('.container-name')); }},
    liveInLink: { get: function() { return element(this.byCss('.live-in-info')); }},
    liveInInfos: { get: function() { return element.all(this.byCss('.live-in-info')); }},
    liveInLinks: { get: function() { return element.all(this.byCss('.live-in-link')); }},
    moreActionsButton: { get: function() { return element(this.byCss('.actions-more button')); }},
    editPostLink: { get: function() { return element(this.byCssContainingText('.dropdown-menu a', 'Edit')); }},
    editPostLinks: { get: function() { return element.all(this.byCssContainingText('.dropdown-menu a', 'Edit')); }},
    deletePostLink: { get: function() { return element(this.byCssContainingText('.dropdown-menu a', 'Delete')); }},

    openPostLink: { get: function() { return element(this.byCss('#open-post-link')); }},
    tag: { get: function() { return element(this.byCss('.tag')); }},

    likesLink: { get: function() { return element(this.byCss('.likes-count')); }},
    commentsLink: { get: function() { return element(this.byCss('.comments-count')); }},

    hasLikedCount: { get: function() { return element.all(this.byCss('.has-liked')).count(); }},

    noPostsMessage: { get: function() { return element(by.css('.no-posts-message')); }},

    // Full Post
    likePostLink: { get: function() { return element(by.cssContainingText('.like-comment-buttons a', 'Like')); }},
    unlikePostLink: { get: function() { return element(by.cssContainingText('.like-comment-buttons a', 'Unlike')); }},
    commentOnPostLink: { get: function() { return element(by.cssContainingText('.like-comment-buttons a', 'Comment')); }},

    sharePostLink: { get: function() { return element(by.css('.share-post-link a')); }},
    morePostsLink: { get: function() { return element(by.id('more-posts-button')); }},

    crossButton: { get: function () { return modalPage.getCrossButton('post'); }},
    closePost: { value: function(){
      this.crossButton.click();
      testKit.waitForElementToBeRemoved(this.crossButton);
    }},
    // ---------

    expectTag: { value: function(expectedTag, index){
      var originalIndex = this.postIndex;
      if(!_.isUndefined(index)){
        this.postIndex = index;
      }

      expect(this.tag.getText()).toContain(expectedTag);

      if(index){
        this.postIndex = originalIndex;
      }
    }},

    expectHeader: { value: function(postData, expectedTag){
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
        if(expectedTag){
          expect(this.tag.getText()).toContain(expectedTag);
        }
        else{
          expect(this.scheduleTags.count()).toBe(0);
        }
      }
    }},

    expectFooter: { value: function(blogData, postData, registration, navigateToPage, isCustomer){

      //testKit.scrollIntoView(this.usernameLink);

      this.usernameLink.click();
      expect(browser.getCurrentUrl()).toContain('/' + registration.username);
      navigateToPage();

      if(postData.channelName && postData.channelName !== blogData.name) {
        this.containerNameLink.click();
        expect(browser.getCurrentUrl()).toContain('/' + registration.username + '/channel/');
        //expect(postListInformation.postsHeader.getText()).toBe(postData.channelName || blogData.name);
        navigateToPage();
      }

      if(isCustomer){
        expect(this.liveInInfos.count()).toBe(1);
        expect(this.liveInLinks.count()).toBe(0);
        expect(this.editPostLinks.count()).toBe(0);
      }
      else{
        expect(this.liveInInfos.count()).toBe(1);
        expect(this.liveInLinks.count()).toBe(1);
        expect(this.editPostLinks.count()).toBe(1);
      }
    }},

    expectPost: { value: function(blogData, postData, registration, navigateToPage, isCustomer, expectedTag){
      this.expectHeader(postData, expectedTag);

      if(postData.imagePath){
        expect(this.image.isPresent()).toBe(true);
      }
      else{
        expect(this.images.count()).toBe(0);
      }

      //if(postData.filePath){
      //  expect(this.fileDownloadLink.getText()).toBe(getFileName(postData.filePath));
      //  expect(this.fileSizeText.getText()).toContain('KB');
      //}
      //else{
      //  expect(this.fileDownloadLinks.count()).toBe(0);
      //}

      if(postData.commentText){
        expect(this.comment.getText()).toBe(postData.commentText);
      }

      expect(this.usernameLink.getText()).toBe(blogData.name);
      if(postData.channelName && postData.channelName !== blogData.name){
        expect(this.containerNameLink.getText()).toBe(postData.channelName);
      }

      this.expectFooter(blogData, postData, registration, navigateToPage, isCustomer);
    }}
  });

  module.exports = PostPage;

})();
