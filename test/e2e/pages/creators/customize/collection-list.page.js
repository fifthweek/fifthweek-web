'use strict';

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
