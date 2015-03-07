'use strict';

var CollectionListPage = function() {};

CollectionListPage.prototype = Object.create({}, {
  addCollectionButton: { get: function () { return element(by.id('add-button')); }},
  collections: { get: function () { return element.all(by.css('#collections .item')); }},
  getCollection: { value: function(index) {
    return element(by.css('#collections .item:nth-child(' + (index + 1) + ')'))
  }},
  getEditCollectionButton: { value: function(index) {
    return element(by.css('#collections .item:nth-child(' + (index + 1) + ') button'))
  }},
  expectCollection: { value: function(collectionIndex, collectionData) {
    var element = this.getCollection(collectionIndex);
    expect(element.getText()).toContain(collectionData.name);
    expect(element.getText()).toContain(collectionData.description);

    if (collectionData.nonDefaultChannelName) {
      expect(element.getText()).toContain(collectionData.nonDefaultChannelName);
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
