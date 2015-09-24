var _ = require('lodash');
var TestKit = require('../../test-kit.js');
var CommonWorkflows = require('../../common-workflows.js');
var ChannelNameInputPage = require('../../pages/channel-name-input.page.js');
var ChannelPriceInputPage = require('../../pages/channel-price-input.page.js');
var SidebarPage = require('../../pages/sidebar.page.js');
var HeaderPage = require('../../pages/header-edit-profile.page.js');
var ScheduledPostsHeaderPage = require('../../pages/header-scheduled-posts.page.js');
var DeleteConfirmationPage = require('../../pages/delete-confirmation.page.js');
var ChannelListPage = require('../../pages/creators/channel-list.page.js');
var ChannelEditPage = require('../../pages/creators/channel-edit.page.js');
var QueueListPage = require('../../pages/creators/queue-list.page.js');
var DiscardChangesPage = require('../../pages/discard-changes.page.js');

describe('edit channel form', function() {
  'use strict';

  var registration;
  var blog;

  var testKit = new TestKit();
  var commonWorkflows = new CommonWorkflows();
  var channelNameInputPage = new ChannelNameInputPage();
  var channelPriceInputPage = new ChannelPriceInputPage();
  var sidebar = new SidebarPage();
  var header = new HeaderPage();
  var scheduledPostsHeader = new ScheduledPostsHeaderPage();
  var deleteConfirmationPage = new DeleteConfirmationPage();
  var channelListPage = new ChannelListPage();
  var queueListPage = new QueueListPage();
  var page = new ChannelEditPage();
  var discardChanges = new DiscardChangesPage();

  it('should run once before all', function() {
    var context = commonWorkflows.createBlog();
    registration = context.registration;
    blog = context.blog;
    sidebar.editProfileLink.click();
    header.channelsLink.click();
  });

  describe('when editing a channel', function() {
    var channel;
    var savedValues;
    var inputs = page.inputs;
    var determineCorrectInitialValues = function () {
      savedValues = {
        nameTextBox: channel.name,
        priceTextBox: channel.price
      };

      savedValues.hiddenCheckbox = channel.hidden;
    };

    var navigateToPage = function () {
      channelListPage.waitForPage();
      var editButton = channelListPage.getEditChannelButton(savedValues.nameTextBox);
      editButton.click();
    };

    it('should run once before all', function () {
      channel = commonWorkflows.createChannel();
      sidebar.editProfileLink.click();
      header.channelsLink.click();

      determineCorrectInitialValues();
      navigateToPage();
    });

    it('should initialise with the correct properties', function () {
      testKit.expectFormValues(page, savedValues);
    });

    it('should give you the option to hide the channel', function () {
      expect(page.hiddenCheckboxCount).toBe(1);
    });

    it('should give you the option to delete the channel', function () {
      expect(page.deleteButtonCount).toBe(1);
    });

    it('should discard changes when user cancels', function () {
      testKit.setFormValues(page, inputs);

      page.cancelButton.click();
      navigateToPage();

      testKit.expectFormValues(page, savedValues);
    });

    discardChanges.describeDiscardingChanges(
      function(){
        sidebar.editProfileLink.click();
        header.channelsLink.click();
        navigateToPage();
      },
      function(){ sidebar.subscriptionsLink.click(); },
      function(){ return testKit.setFormValues(page, inputs); },
      function(newValues){ testKit.expectFormValues(page, newValues); },
      function(){ testKit.expectFormValues(page, savedValues); }
    );

    it('should allow user to cancel when form is invalid', function () {
      testKit.clearForm(page, inputs);

      page.cancelButton.click();
      navigateToPage();

      testKit.expectFormValues(page, savedValues);
    });

    describe('on successful submission', function () {

      it('should run once before all', function () {
        savedValues = testKit.setFormValues(page, inputs);
        page.saveButton.click();
        navigateToPage();
      });

      it('should persist the changes', function () {
        testKit.expectFormValues(page, savedValues);
      });

      it('should persist the changes, between sessions', function () {
        commonWorkflows.reSignIn(registration);
        sidebar.editProfileLink.click();
        header.channelsLink.click();
        navigateToPage();
        testKit.expectFormValues(page, savedValues);
      });
    });

    describe('when validating good input', function () {

      afterEach(function () {
        page.saveButton.click();
        navigateToPage();
        testKit.expectFormValues(page, savedValues);
      });

      testKit.includeHappyPaths(page, channelNameInputPage, 'nameTextBox', null, function (generatedFormValues) {
        _.merge(savedValues, generatedFormValues);
      });

      testKit.includeHappyPaths(page, channelPriceInputPage, 'priceTextBox', null, function (generatedFormValues) {
        _.merge(savedValues, generatedFormValues);
      });
    });

    describe('when validating bad input', function () {
      afterEach(function () {
        commonWorkflows.fastRefresh();
      });

      testKit.includeSadPaths(page, page.saveButton, page.helpMessages, channelNameInputPage, 'nameTextBox');
      testKit.includeSadPaths(page, page.saveButton, page.helpMessages, channelPriceInputPage, 'priceTextBox');
    });

    describe('submit button', function () {
      afterEach(function () {
        commonWorkflows.fastRefresh();
      });

      testKit.itShouldHaveSubmitButtonDisabledUntilDirty(page, inputs, page.saveButton);
    });

    deleteConfirmationPage.describeDeletingWithVerification(
      'Channel',
      function () {
        return savedValues.nameTextBox;
      },
      function () {
        page.deleteButton.click();
      },
      function () {
        // Check not deleted from client-side.
        sidebar.editProfileLink.click();
        header.channelsLink.click();
        navigateToPage();
        testKit.expectFormValues(page, savedValues);

        // Check not deleted from API.
        commonWorkflows.reSignIn(registration);
        sidebar.editProfileLink.click();
        header.channelsLink.click();
        navigateToPage();
        testKit.expectFormValues(page, savedValues);
      },
      function () {
        // Check deleted from client-side.
        sidebar.scheduledPostsLink.click();
        scheduledPostsHeader.queuesLink.click();
        queueListPage.waitForPage();

        sidebar.editProfileLink.click();
        header.channelsLink.click();
        channelListPage.waitForPage();
        expect(channelListPage.channels.count()).toBe(1);
        expect(channelListPage.channels.getText()).not.toContain(savedValues.nameTextBox);

        // Check deleted from API.
        commonWorkflows.reSignIn(registration);

        sidebar.editProfileLink.click();
        header.channelsLink.click();
        channelListPage.waitForPage();
        expect(channelListPage.channels.count()).toBe(1);
        expect(channelListPage.channels.getText()).not.toContain(savedValues.nameTextBox);
      }
    );
  });
});
