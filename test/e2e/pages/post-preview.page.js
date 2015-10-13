(function(){
  'use strict';

  var TestKit = require('../test-kit.js');
  var CreatorLandingPagePage = require('./creators/creator-landing-page.page.js');
  var PostListInformation = require('./post-list-information.page.js');

  var testKit = new TestKit();
  var landingPage = new CreatorLandingPagePage();
  var postListInformation = new PostListInformation();

  var PostPreviewPage = function(isBacklog, postIndex) {
    if(postIndex){
      this.postIndex = postIndex;
    }

    if(isBacklog){
      this.isBacklog = isBacklog;
    }
  };

  var createPostSelector = function(postIndex){
    return '#preview-post-' + postIndex;
  };

  var getFileName = function(filePath){
    return filePath.replace(/^.*[\\\/]/, '');
  };

  PostPreviewPage.prototype = Object.create({}, {
    postIndex: { value: 0, writable: true },
    postId: { get: function() { return element(by.id(createPostSelector(this.postIndex))); }},
    byCss: { value: function(css){
      return by.css(createPostSelector(this.postIndex) + ' ' + css);
    }},
    byCssContainingText: { value: function(css, text){
      return by.cssContainingText(createPostSelector(this.postIndex) + ' ' + css, text);
    }},

    postsArea: { get: function() { return element(by.css('.posts')); }},
    allPosts: { get: function () { return element.all(by.css('.posts .preview-post')); }},

    profileImage: { get: function() { return element(this.byCss('.author-image')); }},
    usernameLink: { get: function() { return element(this.byCss('.poster-name')); }},

    image: { get: function() { return element(this.byCss('.background-image')); }},
    liveInLink: { get: function() { return element(this.byCss('.live-in-info')); }},

    fileSizeText: { get: function() { return element(this.byCss('.post-link-size')); }},
    fileSizeTexts: { get: function() { return element.all(this.byCss('.post-link-size')); }},

    noPostsMessage: { get: function() { return element(by.css('.no-posts-message')); }},

    comment: { get: function() { return element(this.byCss('#post-comment')); }},

    expectPost: { value: function(blogData, postData, registration, navigateToPage, isCustomer){
      this.usernameLink.click();

      expect(browser.getCurrentUrl()).toContain('/' + registration.username + '/manage');
      landingPage.fifthweekLink.click();
      navigateToPage();

      expect(this.profileImage.isDisplayed()).toBe(true);

      if(postData.imagePath){
        expect(this.image.isPresent()).toBe(true);
      }

      if(postData.filePath){
        expect(this.fileSizeText.getText()).toContain('KB');
      }
      else{
        expect(this.fileSizeTexts.count()).toBe(0);
      }

      if(postData.commentText){
        expect(this.comment.getText()).toBe(postData.commentText);
      }

      if(!postData.channelName || postData.channelName === blogData.name){
        expect(this.usernameLink.getText()).toBe(blogData.name);
      }
      else{
        expect(this.usernameLink.getText()).toBe(blogData.name + ' - ' + postData.channelName);
      }

      expect(this.liveInLink.isDisplayed()).toBe(true);
    }}
  });

  module.exports = PostPreviewPage;

})();
