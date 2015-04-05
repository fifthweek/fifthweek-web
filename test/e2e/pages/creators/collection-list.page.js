'use strict';

var TestKit = require('../../test-kit.js');
var Defaults = require('../../defaults.js');

var testKit = new TestKit();
var defaults = new Defaults();

var CollectionListPage = function() {};

CollectionListPage.prototype = Object.create({}, {
  addCollectionButton: { get: function () { return element(by.id('add-button')); }},
  collections: { get: function () { return element.all(by.css('#collections .collection-name')); }},
  getCollection: { value: function(name) {
    return element
      .all(by.css('#collections .item'))
      .filter(function(elem) {
        return elem.element(by.css('.collection-name')).getText().then(function(text) {
          return text === name;
        });
      })
      .first();
  }},
  getEditCollectionButton: { value: function(name) {
    return this.getCollection(name, true).element(by.tagName('button'));
  }},
  expectCollection: { value: function(collectionData) {
    var expectedChannelName = collectionData.channelName === defaults.channelName ? 'Everyone' : collectionData.channelName;

    var element = this.getCollection(collectionData.name);
    var collectionName = element.element(by.css('.collection-name'));
    var channelName = element.element(by.css('.channel-name'));

    expect(collectionName.getText()).toBe(collectionData.name);
    expect(channelName.getText()).toBe(expectedChannelName);
  }},
  waitForPage: { value: function() {
    var self = this;
    testKit.waitForElementToDisplay(self.addCollectionButton);
  }}
});

module.exports = CollectionListPage;
