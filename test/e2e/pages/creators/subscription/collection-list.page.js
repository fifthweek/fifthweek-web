'use strict';

var TestKit = require('../../../test-kit.js');
var Defaults = require('../../../defaults.js');

var testKit = new TestKit();
var defaults = new Defaults();

var CollectionListPage = function() {};

CollectionListPage.prototype = Object.create({}, {
  addCollectionButton: { get: function () { return element(by.id('add-button')); }},
  collections: { get: function () { return element.all(by.css('#collections .item-content')); }},
  getCollection: { value: function(name, includeButton) {
    return element
      .all(by.css('#collections ' + (includeButton ? '.item' : '.item-content')))
      .filter(function(elem) {
        return elem.element(by.css('h5 a')).getText().then(function(text) {
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

    expect(element.getText()).toContain(expectedChannelName);
  }},
  waitForPage: { value: function() {
    var self = this;
    testKit.waitForElementToDisplay(self.addCollectionButton);
  }}
});

module.exports = CollectionListPage;
