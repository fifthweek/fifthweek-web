'use strict';

var _ = require('lodash');
var TestKit = require('../test-kit.js');
var ModalPage = require('./modal.page.js');

var testKit = new TestKit();
var modalPage = new ModalPage();

var DiscardChangesPage = function() {};

DiscardChangesPage.prototype = Object.create({}, {
  modals: { get: function () { return element.all(by.css('.modal')); }},
  title: { get: function () { return element(by.id('modal-title')); }},
  discardButton: { get: function () { return element(by.id('discard-button')); }},
  crossButton: { get: function () { return modalPage.getCrossButton('dirty-confirmation'); }},
  cancelButton: { get: function () { return modalPage.getCancelButton('dirty-confirmation'); }},
  describeDiscardingChanges: { value: function(navigateToPage, navigateAwayFromPage, makeFormDirty, verifyFormDirty, verifyFormClean) {
    var self = this;
    var navigateAwayAndWait = function() {
      navigateAwayFromPage();
      testKit.waitForElementToDisplay(self.discardButton);
    };

    describe('the modal for discarding changes', function() {
      var dirtyValues;
      it('should run once before all', function(){
        dirtyValues = undefined;
      });

      it('should not display if the form is not dirty', function(){
        navigateAwayFromPage();
        browser.waitForAngular();
        expect(self.modals.count()).toBe(0);
        navigateToPage();
      });

      it('should display if the form is dirty', function(){
        dirtyValues = makeFormDirty();
        navigateAwayAndWait();
        expect(self.modals.count()).toBe(1);
      });

      it('should have the title "Discard changes?"', function() {
        expect(self.title.getText()).toBe('Discard changes?');
      });

      _.forEach([
        {
          name: 'cancel button',
          action: function() {
            self.cancelButton.click();
          }
        },
        {
          name: 'X button',
          action: function() {
            self.crossButton.click();
          }
        }
      ], function(cancelOperation) {
        describe('clicking the ' + cancelOperation.name, function() {
          it('should cancel the operation', function () {
            cancelOperation.action();
            testKit.waitForElementToBeRemoved(self.crossButton);
            navigateAwayAndWait();
          });
        });
      });

      describe('the discard button', function() {
        it('should be enabled', function() {
          expect(self.discardButton.isEnabled()).toBe(true);
          self.crossButton.click();
          testKit.waitForElementToBeRemoved(self.crossButton);
        });
      });

      it('should not have discarded changes up to this point', function() {
        verifyFormDirty(dirtyValues);
      });

      it('should discard changes when discard button is clicked', function() {
        navigateAwayAndWait();
        self.discardButton.click();
        testKit.waitForElementToBeRemoved(self.discardButton);
        navigateToPage();
        verifyFormClean();
      });
    });
  }}
});

module.exports = DiscardChangesPage;
