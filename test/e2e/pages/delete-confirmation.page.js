'use strict';

var _ = require('lodash');
var TestKit = require('../test-kit.js');

var testKit = new TestKit();

var DeleteConfirmationPage = function() {};

DeleteConfirmationPage.prototype = Object.create({}, {
  modals: { get: function () { return element.all(by.css('.modal')); }},
  title: { get: function () { return element(by.id('modal-title')); }},
  deleteHintText: { get: function () { return element(by.id('delete-hint')); }},
  confirmationTextBoxId: { value: 'deletion-confirmation-text' },
  deleteVerifiedButton: { get: function () { return element(by.id('delete-item-verified-button')); }},
  deleteUnverifiedButton: { get: function () { return element(by.id('delete-item-unverified-button')); }},
  crossButton: { get: function () { return element(by.id('modal-cross-button')); }},
  cancelButton: { get: function () { return element(by.id('modal-cancel-button')); }},
  describeDeletingWithoutVerification: { value: function(itemType, displayModal, verifyItemNotDeleted, verifyItemDeleted) {
    var self = this;
    var itemTypeLower = itemType.toLowerCase();
    var displayModalAndWait = function() {
      displayModal();
      browser.waitForAngular();
    };

    describe('the modal for deleting a ' + itemTypeLower, function() {
      it('should run once before all', function () {
        displayModalAndWait();
      });

      it('should have the title "Delete ' + itemType + '"', function() {
        expect(self.title.getText()).toBe('Delete ' + itemType);
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
            browser.waitForAngular();
            expect(self.modals.count()).toBe(0);
            displayModalAndWait();
          });
        });
      });

      describe('the delete button', function() {
        it('should be enabled', function() {
          expect(self.deleteUnverifiedButton.isEnabled()).toBe(true);
          self.crossButton.click();
        });
      });

      it('should not have deleted the item up to this point', function() {
        verifyItemNotDeleted();
        displayModalAndWait();
      });

      it('should delete the ' + itemTypeLower, function() {
        self.deleteUnverifiedButton.click();
        browser.waitForAngular();
        verifyItemDeleted();
      });
    });
  }},
  describeDeletingWithVerification: { value: function(itemType, getItemName, displayModal, verifyItemNotDeleted, verifyItemDeleted) {
    var self = this;
    var itemTypeLower = itemType.toLowerCase();
    var nonMatchingInput = 'Suitably Random #' + Math.random();
    var displayModalAndWait = function() {
      displayModal();
      browser.waitForAngular();
    };
    var expectEmptyTextBox = function() {
      expect(element(by.id(self.confirmationTextBoxId)).getAttribute('value')).toBe('');
    };

    describe('the modal for deleting a ' + itemTypeLower, function() {
      var itemName;

      it('should run once before all', function () {
        itemName = getItemName();
        displayModalAndWait();
      });

      it('should have the title "Delete ' + itemType + '"', function() {
        expect(self.title.getText()).toBe('Delete ' + itemType);
      });

      it('should contain the ' + itemTypeLower + '\'s name in the confirmation message', function() {
        expect(self.deleteHintText.getText()).toBe(itemName);
      });

      it('should contain an empty confirmation text box', function() {
        expectEmptyTextBox();
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
          afterEach(function() {
            cancelOperation.action();
            browser.waitForAngular();
            expect(self.modals.count()).toBe(0);
            displayModalAndWait();
            expectEmptyTextBox();
          });

          it('should cancel the operation when no input has been entered', function () {
            // No operation.
          });

          it('should cancel the operation after invalid input has been entered', function () {
            testKit.setValue(self.confirmationTextBoxId, nonMatchingInput);
          });

          it('should cancel the operation after valid input has been entered', function () {
            testKit.setValue(self.confirmationTextBoxId, itemName);
          });
        });
      });

      describe('the delete button', function() {
        describe('should be disabled', function() {
          afterEach(function() {
            expect(self.deleteVerifiedButton.isEnabled()).toBe(false);
            testKit.clear(self.confirmationTextBoxId);
          });

          it('should be disabled by default', function() {
            // No operation.
          });

          it('should be disabled after entering non-matching input', function() {
            testKit.setValue(self.confirmationTextBoxId, nonMatchingInput);
          });

          it('should be disabled after entering a subset of the ' + itemTypeLower + '\'s name', function() {
            testKit.setValue(self.confirmationTextBoxId, itemName.substring(0, itemName.length - 1));
          });

          it('should be disabled after entering a superset of the ' + itemTypeLower + '\'s name', function() {
            testKit.setValue(self.confirmationTextBoxId, itemName + '!');
          });
        });

        it('should become enabled after entering the ' + itemTypeLower + '\'s name', function() {
          testKit.setValue(self.confirmationTextBoxId, itemName);
          expect(self.deleteVerifiedButton.isEnabled()).toBe(true);
          self.cancelButton.click();
        });
      });

      it('should not have deleted the item up to this point', function() {
        verifyItemNotDeleted();
        displayModalAndWait();
      });

      it('should delete the ' + itemTypeLower, function() {
        testKit.setValue(self.confirmationTextBoxId, itemName);
        self.deleteVerifiedButton.click();
        browser.waitForAngular();
        verifyItemDeleted();
      });
    });
  }}
});

module.exports = DeleteConfirmationPage;
