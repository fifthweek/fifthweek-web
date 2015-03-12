'use strict';

var CollectionListPage = function() {};

CollectionListPage.prototype = Object.create({}, {
  addCollectionButton: { get: function () { return element(by.id('add-button')); }},
  collections: { get: function () { return element.all(by.css('#collections .item')); }},
  getCollection: { value: function(name) {
    return element(by.cssContainingText('#collections .item', name));
  }},
  getEditCollectionButton: { value: function(name) {
    return this.getCollection(name).element(by.tagName('button'));
  }},
  expectCollection: { value: function(collectionData) {
    var element = this.getCollection(collectionData.name);

    if (collectionData.channelName) {
      expect(element.getText()).toContain(collectionData.channelName);
    }
  }},
  waitForPage: { value: function() {
    var self = this;
    browser.wait(function(){
      return self.addCollectionButton.isPresent();
    });
  }}
});

module.exports = CollectionListPage;
