'use strict';

var CollectionNameInputPage = require('../../../pages/collection-name-input.page.js');

var collectionNameInputPage = new CollectionNameInputPage();

var composeImagePage = function() {};

var getCollectionOptionName = function(collectionName, channelName){
  var itemName = collectionName;
  if(channelName){
    itemName = itemName + ' (' + channelName + ')';
  }
  return itemName;
};

composeImagePage.prototype = Object.create({}, {

  postNowButton: { get: function() { return element(by.css('button[fw-form-submit="postNow()"]')); }},
  postLaterButton: { get: function() { return element(by.css('button[fw-form-submit="postLater()"]')); }},

  postToBacklogButton: { get: function() { return element(by.css('button[fw-form-submit="postToBacklog()"]')); }},
  cancelButton: { get: function() { return element(by.css('button[ng-click="cancelPostLater()"]')); }},

  image: { get: function(){ return element(by.css('.available-image')); }},
  noImage: { get: function(){ return element(by.css('.blank-area')); }},
  fileInput: { get: function() { return element(by.css('#file-upload-button-area input')); }},
  fileUploadButton: { get: function() { return element(by.css('#file-upload-button-area .btn')); }},

  commentTextBox: { get: function() { return element(by.id('model-input-comment')); }},
  collectionSelect: { get: function() { return element(by.id('model-input-selected-collection')); }},
  createCollectionLink: { get: function() { return element(by.css('.create-collection-link')); }},

  dialogCreateCollectionNameTextBox: { get: function() { return element(by.css('#create-collection-form input[type=text]')); }},
  dialogContinueButton: { get: function() { return element(by.css('#create-collection-form button[fw-form-submit="submit()"]')); }},

  createCollectionAreaCount: { get: function() { return element.all(by.id('new-collection-area')).count(); }},
  createCollectionNameTextBox: { get: function() { return element(by.css('#new-collection-area input[type=text]')); }},

  postToQueueRadio: { get: function() { return element(by.css('input[ng-value="true"]')); }},
  postOnDateRadio: { get: function() { return element(by.css('input[ng-value="false"]')); }},

  datepicker: { get: function() { return element(by.id('model-input-date')); }},

  successMessage: { get: function(){ return element(by.css('.alert-success')); }},
  postAnotherButton: { get: function(){ return element(by.css('button[ng-click="postAnother()"]')); }},

  pageUrl: { get: function () { return '/creators/compose/image'; }},

  helpMessages: { get: function () { return element.all(by.css('.help-block')); }},

  inputs: { value: [
    {
      name: 'createCollectionNameTextBox',
      newValue: function() { return collectionNameInputPage.newName(); }
    }
  ]},

  dialogInputs: { value: [
    {
      name: 'dialogCreateCollectionNameTextBox',
      newValue: function() { return collectionNameInputPage.newName(); }
    }
  ]},

  populateImage: { value: function(filePath, waitForThumbnail){
    this.setFileInput(filePath);

    if(waitForThumbnail){
      var img = this.image;
      browser.wait(function(){
        return img.isPresent();
      });
    }
    else{
      var postButton = this.postNowButton;
      browser.wait(function(){
        return postButton.isPresent();
      });
    }
  }},

  getCollectionOptionCount: { value: function(collectionName, channelName){
    var itemName = getCollectionOptionName(collectionName, channelName);
    return element.all(by.cssContainingText('#model-input-selected-collection option', itemName)).count();
  }},

  populateContent: { value: function(filePath, collectionName, channelName, createCollection, isFirstCollection){
    this.populateImage(filePath, true);

    var date = new Date();
    this.commentTextBox.clear();
    this.commentTextBox.sendKeys('Comment on ' + date.toISOString());

    if(collectionName){
      if(!createCollection){
        var itemName = getCollectionOptionName(collectionName, channelName);
        element(by.cssContainingText('#model-input-selected-collection option', itemName)).click();
      }
      else{
        if(isFirstCollection){
          this.createCollectionNameTextBox.sendKeys(collectionName);
          if(channelName){
            element(by.cssContainingText('#new-collection-area option', channelName)).click();
          }
        }
        else{
          this.createCollectionLink.click();

          this.dialogCreateCollectionNameTextBox.sendKeys(collectionName);
          if(channelName){
            element(by.cssContainingText('#create-collection-form option', channelName)).click();
          }
        }
      }
    }
  }},

  postImageNow: { value: function(filePath, collectionName, channelName, createCollection, isFirstCollection) {
    this.populateContent(filePath, collectionName,  channelName, createCollection, isFirstCollection);

    this.postNowButton.click();
  }},

  postImageOnDate: { value: function(filePath, collectionName, channelName, createCollection, isFirstCollection) {
    this.populateContent(filePath, collectionName,  channelName, createCollection, isFirstCollection);
    this.postLaterButton.click();
    this.postOnDateRadio.click();

    var tomorrow = new Date(new Date().getTime() + 24*60*60*1000);
    this.datepicker.clear();
    this.datepicker.sendKeys(tomorrow.toISOString());

    this.postToBacklogButton.click();
  }},

  postImageToQueue: { value: function(filePath, collectionName, channelName, createCollection, isFirstCollection) {
    this.populateContent(filePath, collectionName,  channelName, createCollection, isFirstCollection);
    this.postLaterButton.click();
    this.postToQueueRadio.click();
    this.postToBacklogButton.click();
  }},

  setFileInput: { value: function(filePath) {
    var absolutePath = __dirname + '/' + filePath;
    console.log(absolutePath);
    this.fileInput.sendKeys(absolutePath);
  }}
});

module.exports = composeImagePage;
