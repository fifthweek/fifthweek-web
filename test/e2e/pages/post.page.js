(function(){
  'use strict';

  var TestKit = require('../test-kit.js');
  var CreatorLandingPagePage = require('./creators/creator-landing-page.page.js');
  var PostListInformation = require('./post-list-information.page.js');

  var testKit = new TestKit();
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

    likePostLink: { get: function() { return element(this.byCssContainingText('.like-comment-buttons a', 'Like')); }},
    unlikePostLink: { get: function() { return element(this.byCssContainingText('.like-comment-buttons a', 'Unlike')); }},
    commentOnPostLink: { get: function() { return element(this.byCssContainingText('.like-comment-buttons a', 'Comment')); }},
    likesLink: { get: function() { return element(this.byCss('.likes-count a')); }},
    commentsLink: { get: function() { return element(this.byCss('.comments-count a')); }},

    hasLikedCount: { get: function() { return element.all(this.byCss('.has-liked')).count(); }},

    noPostsMessage: { get: function() { return element(by.css('.no-posts-message')); }},

    expectHeader: { value: function(postData){
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

    expectFooter: { value: function(blogData, postData, registration, navigateToPage, isCustomer){

      //testKit.scrollIntoView(this.usernameLink);

      this.usernameLink.click();
      expect(browser.getCurrentUrl()).toContain('/' + registration.username + '/all');
      landingPage.fifthweekLink.click();
      navigateToPage();

      this.containerNameLink.click();
      expect(browser.getCurrentUrl()).toContain('/' + registration.username + '/channel/');
      expect(postListInformation.postsHeader.getText()).toBe(postData.channelName || blogData.name);
      landingPage.fifthweekLink.click();
      navigateToPage();

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

    expectPost: { value: function(blogData, postData, registration, navigateToPage, isCustomer){
      this.expectHeader(postData);

      if(postData.imagePath){
        expect(this.image.isPresent()).toBe(true);
      }
      else{
        expect(this.images.count()).toBe(0);
      }

      if(postData.filePath){
        expect(this.fileDownloadLink.getText()).toBe(getFileName(postData.filePath));
        expect(this.fileSizeText.getText()).toContain('KB');
      }
      else{
        expect(this.fileDownloadLinks.count()).toBe(0);
      }

      if(postData.commentText){
        expect(this.comment.getText()).toBe(postData.commentText);
      }

      expect(this.usernameLink.getText()).toBe(blogData.name);
      expect(this.containerNameLink.getText()).toBe(postData.channelName || blogData.name);

      this.expectFooter(blogData, postData, registration, navigateToPage, isCustomer);
    }}
  });

  module.exports = PostPage;

})();
