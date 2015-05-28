(function(){
  'use strict';

  var TestKit = require('../test-kit.js');
  var CreatorLandingPagePage = require('./creators/creator-landing-page.page.js');
  var Defaults = require('../defaults.js');

  var testKit = new TestKit();
  var landingPage = new CreatorLandingPagePage();
  var defaults = new Defaults();

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
    postsHeader: { get: function() { return element(by.css('.posts-header')); }},
    taggedPostsArea: { get: function() { return element(by.css('.tagged-posts')); }},
    allPosts: { get: function () { return element.all(by.css('.posts .post')); }},

    image: { get: function() { return element(this.byCss('.full-width-image')); }},
    images: { get: function() { return element.all(this.byCss('.full-width-image')); }},
    dayGrouping: { get: function() { return element(this.byCss('.day-grouping')); }},
    dayGroupings: { get: function() { return element.all(this.byCss('.day-grouping')); }},
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

    expectHeader: { value: function(postData, registration, postHasNoDayGrouping){
      if(this.isBacklog){
        expect(this.scheduleTag.isDisplayed()).toBe(true);
        expect(this.dayGroupings.count()).toBe(0);

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

        if(!postHasNoDayGrouping){
          expect(this.dayGrouping.isDisplayed()).toBe(true);
        }
      }
    }},

    expectFooter: { value: function(isNote, postData, registration, navigateToPage, isCustomer){

      //testKit.scrollIntoView(this.usernameLink);

      this.usernameLink.click();
      expect(browser.getCurrentUrl()).toContain('/' + registration.username + '/all');
      landingPage.fifthweekLink.click();
      navigateToPage();

      var channelName = postData.channelName || defaults.channelName;
      if(isNote){
        this.containerNameLink.click();
        expect(browser.getCurrentUrl()).toContain('/' + registration.username + '/channel/');
        expect(this.postsHeader.getText()).toBe(channelName);
        landingPage.fifthweekLink.click();
        navigateToPage();
      }
      else{
        this.containerNameLink.click();
        expect(browser.getCurrentUrl()).toContain('/' + registration.username + '/collection/');
        expect(this.postsHeader.getText()).toBe(channelName + ' / ' + postData.collectionName);
        landingPage.fifthweekLink.click();
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

    expectNotePost: { value: function(postData, registration, navigateToPage, postHasNoDayGrouping, isCustomer){
      this.expectHeader(postData, registration, postHasNoDayGrouping);

      expect(this.images.count()).toBe(0);
      expect(this.fileDownloadLinks.count()).toBe(0);
      expect(this.comment.getText()).toBe(postData.noteText);
      expect(this.usernameLink.getText()).toBe(registration.username);
      expect(this.containerNameLink.getText()).toBe(postData.channelName || 'Everyone');

      this.expectFooter(true, postData, registration, navigateToPage, isCustomer);
    }},

    expectImagePost: { value: function(postData, registration, navigateToPage, postHasNoDayGrouping, isCustomer){
      this.expectHeader(postData, registration, postHasNoDayGrouping);

      expect(this.image.isPresent()).toBe(true);
      expect(this.comment.getText()).toBe(postData.commentText);

      expect(this.usernameLink.getText()).toBe(registration.username);
      expect(this.containerNameLink.getText()).toBe(postData.collectionName);

      this.expectFooter(false, postData, registration, navigateToPage, isCustomer);
    }},

    expectFilePost: { value: function(postData, registration, navigateToPage, postHasNoDayGrouping, isCustomer){
      this.expectHeader(postData, registration, postHasNoDayGrouping);

      expect(this.images.count()).toBe(0);
      expect(this.comment.getText()).toBe(postData.commentText);
      expect(this.fileDownloadLink.getText()).toBe(getFileName(postData.filePath));
      expect(this.fileSizeText.getText()).toContain('KB');

      expect(this.usernameLink.getText()).toBe(registration.username);
      expect(this.containerNameLink.getText()).toBe(postData.collectionName);

      this.expectFooter(false, postData, registration, navigateToPage, isCustomer);
    }},

    expectNonViewableImagePost: { value: function(postData, registration, navigateToPage, postHasNoDayGrouping, isCustomer){
      expect(this.fileDownloadLink.getText()).toBe(getFileName(postData.filePath));
      expect(this.fileSizeText.getText()).toContain('KB');

      this.expectImagePost(postData, registration, navigateToPage, postHasNoDayGrouping, isCustomer);
    }}

  });

  module.exports = PostPage;

})();
