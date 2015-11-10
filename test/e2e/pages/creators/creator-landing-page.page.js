'use strict';

var CreatorLandingPagePage = function() {};

CreatorLandingPagePage.prototype = Object.create({}, {
  fifthweekLink: { get: function() { return element(by.css('.fifthweek-logo-sm')); }},
  editHeaderImageLink: { get: function() { return element(by.id('edit-header-link')); }},
  editTitleLink: { get: function() { return element(by.id('edit-title-link')); }},
  editAvatarLink: { get: function() { return element(by.id('edit-profile-image-link')); }},
  editIntroductionLink: { get: function() { return element(by.id('edit-introduction-link')); }},
  editChannelsLink: { get: function() { return element(by.id('edit-channels-link')); }},
  editVideoLink: { get: function() { return element(by.id('edit-video-link')); }},
  editDescriptionLink: { get: function() { return element(by.id('edit-description-link')); }},
  video: { get: function () { return element(by.css('#video iframe')); }},
  fullDescription: { get: function () { return element(by.id('description-area')); }},

  showChannelPostsButton: { get: function() { return element(by.id('show-channel-posts-button')); }},
  showPostButton: { get: function() { return element(by.id('show-post-button')); }},
  showAllPostsButton: { get: function() { return element(by.id('show-all-posts-button')); }},
  showSubscribedPostsButton: { get: function() { return element(by.id('show-subscribed-posts-button')); }},
  cancelChangesButton: { get: function() { return element(by.id('cancel-changes-button')); }},

  getSubscribeButton: { value: function (index) { return element(by.id('subscribe-button-' + index)); }},
  getUnsubscribeButton: { value: function (index) { return element(by.id('unsubscribe-button-' + index)); }},
  getAcceptButton: { value: function (index) { return element(by.id('accept-button-' + index)); }},
  getAcceptButtonCount: { value: function (index) { return element.all(by.id('accept-button-' + index)).count(); }},

  getPostSubscribeButtonCount: { value: function (index) { return element.all(by.id('post-subscribe-button-' + index)).count(); }},
  getPostSubscribeButton: { value: function (index) { return element(by.id('post-subscribe-button-' + index)); }},
  getPostAcceptButton: { value: function (index) { return element(by.id('post-accept-button-' + index)); }},
  getPostAcceptButtonCount: { value: function (index) { return element.all(by.id('post-accept-button-' + index)).count(); }},

  getChannel: { value: function (index) { return element(by.id('channel-' + index)); }},
  getChannelPrice: { value: function (index) { return element(by.id('channel-price-' + index)); }},
  getChannelPreviousPrice: { value: function (index) { return element(by.id('channel-previous-price-' + index)); }},
  getChannelPreviousPriceCount: { value: function (index) { return element.all(by.id('channel-previous-price-' + index)).count(); }},

  channelCount: { get: function () { return element.all(by.css('.channels .channel')).count(); }},
  channelCountInformation: { get: function() { return element(by.css('.channel-count-information')); }},

  expectSubscribedSuccessfully: { value: function(){
    expect(this.channelCountInformation.isDisplayed()).toBe(true);
  }},

  expectPriceIncrease: { value: function(index, from, to) {
    expect(this.getChannelPreviousPrice(index).getText()).toBe('$' + Number(from).toFixed(2) + '/week');
    if(to === 0){
      expect(this.getChannelPrice(index).getText()).toBe('FREE');
    }
    else{
      expect(this.getChannelPrice(index).getText()).toBe('$' + Number(to).toFixed(2) + '/week');
    }
  }},
  expectPriceDecrease: { value: function(index, from, to) {
    expect(this.getChannelPreviousPrice(index).getText()).toBe('$' + Number(from).toFixed(2) + '/week');
    if(to === 0){
      expect(this.getChannelPrice(index).getText()).toBe('FREE');
    }
    else {
      expect(this.getChannelPrice(index).getText()).toBe('$' + Number(to).toFixed(2) + '/week');
    }
  }}

});

module.exports = CreatorLandingPagePage;
