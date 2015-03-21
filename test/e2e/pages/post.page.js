(function(){
  'use strict';

  var PostPage = function(postIndex) {
    if(postIndex){
      this.postIndex = postIndex;
    }
  };

  var createPostSelector = function(postIndex){
    return '#post-' + postIndex;
  };

  PostPage.prototype = Object.create({}, {
    postIndex: { value: 0, writable: true },
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
    comment: { get: function() { return element(this.byCss('.text .content')); }},
    fileDownloadLink: { get: function() { return element(this.byCss('.text .content .file-download')); }},
    profileImage: { get: function() { return element(this.byCss('.author-image')); }},
    usernameLink: { get: function() { return element(this.byCss('.poster-name')); }},
    containerNameLink: { get: function() { return element(this.byCss('.container-name')); }},
    liveInLink: { get: function() { return element(this.byCss('.live-in-info')); }},
    moreActionsButton: { get: function() { return element(this.byCss('.actions-more button')); }},
    editPostLink: { get: function() { return element(this.byCssContainingText('.actions-drop-down a', 'Edit')); }},
    deletePostLink: { get: function() { return element(this.byCssContainingText('.actions-drop-down a', 'Delete')); }},

    expectNotePost: { value: function(css, text){
    }},
    expectImagePost: { value: function(css, text){
    }},
    expectNonViewableImagePost: { value: function(css, text){
    }},
    expectFilePost: { value: function(css, text){
    }},


  });

  module.exports = PostPage;

})();
