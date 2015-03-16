var _ = require('lodash');
var TestKit = require('../../../test-kit.js');
var CommonWorkflows = require('../../../common-workflows.js');
var ChannelNameInputPage = require('../../../pages/channel-name-input.page.js');
var ChannelDescriptionInputPage = require('../../../pages/channel-description-input.page.js');
var ChannelPriceInputPage = require('../../../pages/channel-price-input.page.js');
var SidebarPage = require('../../../pages/sidebar.page.js');
var HeaderCustomizePage = require('../../../pages/header-customize.page.js');
var DeleteConfirmationPage = require('../../../pages/delete-confirmation.page.js');
var ChannelListPage = require('../../../pages/creators/customize/channel-list.page.js');
var ChannelEditPage = require('../../../pages/creators/customize/channel-edit.page.js');
var CollectionListPage = require('../../../pages/creators/customize/collection-list.page.js');

describe('edit channel form', function() {
  'use strict';

  var registration;
  var subscription;
  var defaultChannelCollectionCount = 1;

  var testKit = new TestKit();
  var commonWorkflows = new CommonWorkflows();
  var channelNameInputPage = new ChannelNameInputPage();
  var channelDescriptionInputPage = new ChannelDescriptionInputPage();
  var channelPriceInputPage = new ChannelPriceInputPage();
  var sidebar = new SidebarPage();
  var header = new HeaderCustomizePage();
  var deleteConfirmationPage = new DeleteConfirmationPage();
  var channelListPage = new ChannelListPage();
  var collectionListPage = new CollectionListPage();
  var page = new ChannelEditPage();

  it('should run once before all', function() {
    var context = commonWorkflows.createSubscription();
    registration = context.registration;
    subscription = context.subscription;
    sidebar.customizeLink.click();
    header.channelsLink.click();
  });

  var describeForm = function(isDefault) {
    describe('when editing a ' + (isDefault ? '' : 'non-') + 'default channel', function() {
      var channel;
      var savedValues;
      var inputs = isDefault ? _.reject(page.inputs, {name: 'hiddenCheckbox'}) : page.inputs;
      var determineCorrectInitialValues = function () {
        savedValues = {
          nameTextBox: isDefault ? channelListPage.defaultChannelName : channel.name,
          descriptionTextBox: isDefault ? channelListPage.defaultChannelDescription : channel.description,
          priceTextBox: isDefault ? subscription.basePrice : channel.price
        };

        if (!isDefault) {
          savedValues.hiddenCheckbox = channel.hidden;
        }
      };

      var navigateToPage = function () {
        channelListPage.waitForPage();
        var editButton = channelListPage.getEditChannelButton(savedValues.nameTextBox);
        editButton.click();
      };

      it('should run once before all', function () {
        if (!isDefault) {
          channel = commonWorkflows.createChannel();
          commonWorkflows.createCollection();
          commonWorkflows.createCollection([channel.name]);
          header.channelsLink.click();
        }

        determineCorrectInitialValues();
        navigateToPage();
      });

      it('should initialise with the correct properties', function () {
        testKit.expectFormValues(page, savedValues);
      });

      it('should ' + (isDefault ? 'not' : '') + ' give you the option to hide the channel', function () {
        expect(page.hiddenCheckboxCount).toBe(isDefault ? 0 : 1);
      });

      it('should ' + (isDefault ? 'not' : '') + ' give you the option to delete the channel', function () {
        expect(page.deleteButtonCount).toBe(isDefault ? 0 : 1);
      });

      it('should discard changes when user cancels', function () {
        testKit.setFormValues(page, inputs);

        page.cancelButton.click();
        navigateToPage();

        testKit.expectFormValues(page, savedValues);
      });

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
          sidebar.customizeLink.click();
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

        testKit.includeHappyPaths(page, channelDescriptionInputPage, 'descriptionTextBox', null, function (generatedFormValues) {
          _.merge(savedValues, generatedFormValues);
        });

        testKit.includeHappyPaths(page, channelPriceInputPage, 'priceTextBox', null, function (generatedFormValues) {
          _.merge(savedValues, generatedFormValues);
        });
      });

      describe('when validating bad input', function () {
        afterEach(function () {
          header.channelsLink.click(); // Reset form state.
          navigateToPage();
        });

        testKit.includeSadPaths(page, page.saveButton, page.helpMessages, channelNameInputPage, 'nameTextBox');
        testKit.includeSadPaths(page, page.saveButton, page.helpMessages, channelDescriptionInputPage, 'descriptionTextBox');
        testKit.includeSadPaths(page, page.saveButton, page.helpMessages, channelPriceInputPage, 'priceTextBox');
      });

      describe('submit button', function () {
        afterEach(function () {
          header.channelsLink.click(); // Reset form state.
          navigateToPage();
        });

        testKit.itShouldHaveSubmitButtonDisabledUntilDirty(page, inputs, page.saveButton);
      });

      if (!isDefault) {
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
            header.channelsLink.click();
            navigateToPage();
            testKit.expectFormValues(page, savedValues);

            // Check not deleted from API.
            commonWorkflows.reSignIn(registration);
            sidebar.customizeLink.click();
            header.channelsLink.click();
            navigateToPage();
            testKit.expectFormValues(page, savedValues);
          },
          function () {
            // Check deleted from client-side.
            header.collectionsLink.click();
            collectionListPage.waitForPage();
            expect(collectionListPage.collections.count()).toBe(defaultChannelCollectionCount);

            header.channelsLink.click();
            channelListPage.waitForPage();
            expect(channelListPage.channels.count()).toBe(1);
            expect(channelListPage.channels.getText()).not.toContain(savedValues.nameTextBox);

            // Check deleted from API.
            commonWorkflows.reSignIn(registration);
            sidebar.customizeLink.click();
            header.collectionsLink.click();
            collectionListPage.waitForPage();
            expect(collectionListPage.collections.count()).toBe(defaultChannelCollectionCount);

            header.channelsLink.click();
            channelListPage.waitForPage();
            expect(channelListPage.channels.count()).toBe(1);
            expect(channelListPage.channels.getText()).not.toContain(savedValues.nameTextBox);
          }
        );
      }
    });
  };

  describeForm(true);
  describeForm(false);
});
