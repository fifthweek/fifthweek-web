'use strict';

var ChannelListPage = require('./channel-list.page.js');

var channelListPage = new ChannelListPage();

var CollectionListPage = function() {};

CollectionListPage.prototype = Object.create({}, {
  addCollectionButton: { get: function () { return element(by.id('add-button')); }},
  collections: { get: function () { return element.all(by.css('#collections .item')); }},
  getCollection: { value: function(name) {
    return element
      .all(by.css('#collections .item'))
      .filter(function(elem) {
        return elem.element(by.css('h5 a')).getText().then(function(text) {
          return text === name;
        });
      })
      .first();
  }},
  getEditCollectionButton: { value: function(name) {
    return this.getCollection(name).element(by.tagName('button'));
  }},
  expectCollection: { value: function(collectionData) {
    var expectedChannelName = collectionData.channelName === channelListPage.defaultChannelName ? 'Everyone' : collectionData.channelName;

    var element = this.getCollection(collectionData.name);

    expect(element.getText()).toContain(expectedChannelName);
  }},
  waitForPage: { value: function() {
    var self = this;
    browser.wait(function(){
      return self.addCollectionButton.isPresent();
    });
  }}
});

module.exports = CollectionListPage;
