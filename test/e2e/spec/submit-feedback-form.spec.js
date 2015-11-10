(function() {
  'use strict';

  var _ = require('lodash');
  var TestKit = require('../test-kit.js');
  var CommonWorkflows = require('../common-workflows.js');
  var SidebarPage = require('../pages/sidebar.page.js');
  var CommentInputPage = require('../pages/comment-input.page');
  var DiscardChangesPage = require('../pages/discard-changes.page.js');
  var CurrentPage = require('../pages/submit-feedback-workflow.page.js');

  describe("submit feedback form", function () {

    var testKit = new TestKit();
    var commonWorkflows = new CommonWorkflows();
    var sidebar = new SidebarPage();
    var commentInputPage = new CommentInputPage();
    var discardChanges = new DiscardChangesPage();
    var page = new CurrentPage();

    var navigateToPage = function() {
      sidebar.sendFeedbackLink.click();
    };

    it('should run once before all', function(){
      commonWorkflows.registerAsConsumer();
    });

    describe('when validating against good input', function() {

      beforeEach(navigateToPage);

      afterEach(function() {
        page.registerButton.click();
        page.expectThankYouMessageDisplayed();
        page.dismissButton.click();
      });

      it('should allow feedback to be sent', function(){
        testKit.setContentEditableValue(page.messageTextBoxSelector, 'message');
      });

      commentInputPage.includeHappyPaths(page.messageTextBoxSelector, function() {});
    });

    describe('when validating against bad input', function() {

      it('should run once before all', function() {
        navigateToPage();
      });

      describe('bad input', function(){
        afterEach(function() {
          // Reset form state.
          testKit.setContentEditableValue(page.messageTextBoxSelector, 'message'); // Ensure we're dirty.
          browser.sleep(1000); // This is to ensure the dirtyness takes effect, as we don't force the Sir Trevor instance to update when cancelling.
          page.cancelButton.click();
          testKit.waitForElementToDisplay(discardChanges.discardButton);
          discardChanges.discardButton.click();
          navigateToPage();
        });

        commentInputPage.includeSadPaths(page.messageTextBoxSelector, page.registerButton, page.helpMessages, function() {});
      });
    });
  });
})();
