var _ = require('lodash');
var TestKit = require('../../../test-kit.js');
var CommonWorkflows = require('../../../common-workflows.js');
var ChannelNameInputPage = require('../../../pages/channel-name-input.page.js');
var ChannelDescriptionInputPage = require('../../../pages/channel-description-input.page.js');
var ChannelPriceInputPage = require('../../../pages/channel-price-input.page.js');
var SidebarPage = require('../../../pages/sidebar.page.js');
var HeaderCustomizePage = require('../../../pages/header-customize.page.js');
var ChannelListPage = require('../../../pages/creators/customize/channel-list.page.js');
var ChannelEditPage = require('../../../pages/creators/customize/channel-edit.page.js');

describe('edit channel form', function() {
  'use strict';

  var registration;
  var subscription;

  var testKit = new TestKit();
  var commonWorkflows = new CommonWorkflows();
  var channelNameInputPage = new ChannelNameInputPage();
  var channelDescriptionInputPage = new ChannelDescriptionInputPage();
  var channelPriceInputPage = new ChannelPriceInputPage();
  var sidebar = new SidebarPage();
  var header = new HeaderCustomizePage();
  var channelListPage = new ChannelListPage();
  var page = new ChannelEditPage();

  it('should run once before all', function() {
    var context = commonWorkflows.createSubscription();
    registration = context.registration;
    subscription = context.subscription;
    sidebar.customizeLink.click();
    header.channelsLink.click();
  });

  var describeForm = function(isDefault) {
    var initialValues;
    var inputs = isDefault ? _.reject(page.inputs, {name: 'hiddenCheckbox'}) : page.inputs;
    var determineCorrectInitialValues = function() {
      initialValues = {
        nameTextBox: isDefault ? channelListPage.defaultChannelName : 'Not Implemented',
        descriptionTextBox: isDefault ? channelListPage.defaultChannelDescription : 'Not Implemented',
        priceTextBox: isDefault ? subscription.basePrice : 'Not Implemented'
      };

      if (!isDefault) {
        initialValues.hiddenCheckbox = 'Not Implemented';
        throw 'Not Implemented';
      }
    };
    var navigateToPage = function() {
      var editChannelButton = channelListPage.getEditChannelButton(isDefault ? 0 : 1);
      editChannelButton.click();
    };

    it('should run once before all', function() {
      determineCorrectInitialValues();
      navigateToPage();
    });

    it('should ' + (isDefault ? 'not' : '') + ' give you the option to delete the channel', function() {
      expect(page.deleteButtonCount).toBe(isDefault ? 0 : 1);
    });

    it('should ' + (isDefault ? 'not' : '') + ' give you the option to hide the channel', function() {
      expect(page.hiddenCheckboxCount).toBe(isDefault ? 0 : 1);
    });

    it('should initialise with the correct properties', function() {
      testKit.expectFormValues(page, initialValues);
    });

    it('should discard changes when user cancels', function() {
      testKit.setFormValues(page, inputs);

      page.cancelButton.click();
      navigateToPage();

      testKit.expectFormValues(page, initialValues);
    });

    it('should allow user to cancel when form is invalid', function() {
      testKit.clearForm(page, inputs);

      page.cancelButton.click();
      navigateToPage();

      testKit.expectFormValues(page, initialValues);
    });

    describe('on successful submission', function() {
      var newFormValues;

      it('should run once before all', function() {
        newFormValues = testKit.setFormValues(page, inputs);
        page.saveButton.click();
        browser.waitForAngular(); // Seems to be required.
        navigateToPage();
      });

      it('should persist the changes', function() {
        testKit.expectFormValues(page, newFormValues);
      });

      it('should persist the changes, between sessions', function() {
        commonWorkflows.reSignIn(registration);
        sidebar.customizeLink.click();
        header.channelsLink.click();
        navigateToPage();
        testKit.expectFormValues(page, newFormValues);
      });
    });

    describe('when validating good input', function() {
      var newFormValues;

      afterEach(function() {
        page.saveButton.click();
        browser.waitForAngular(); // Seems to be required.
        navigateToPage();
        testKit.expectFormValues(page, newFormValues);
      });

      testKit.includeHappyPaths(page, channelNameInputPage, 'nameTextBox', null, function(generatedFormValues) {
        newFormValues = generatedFormValues;
      });

      testKit.includeHappyPaths(page, channelDescriptionInputPage, 'descriptionTextBox', null, function(generatedFormValues) {
        newFormValues = generatedFormValues;
      });

      testKit.includeHappyPaths(page, channelPriceInputPage, 'priceTextBox', null, function(generatedFormValues) {
        newFormValues = generatedFormValues;
      });
    });

    describe('when validating bad input', function() {
      afterEach(function() {
        header.channelsLink.click(); // Reset form state.
        navigateToPage();
      });

      channelNameInputPage.includeSadPaths(page.nameTextBox, page.saveButton, page.helpMessages, function() {});
      channelDescriptionInputPage.includeSadPaths(page.descriptionTextBox, page.saveButton, page.helpMessages, function() {});
      channelPriceInputPage.includeSadPaths(page.priceTextBox, page.saveButton, page.helpMessages, function() {});
    });

    describe('submit button', function() {
      afterEach(function () {
        header.channelsLink.click(); // Reset form state.
        navigateToPage();
      });

      testKit.itShouldHaveWellBehavedSubmitButton(page, inputs, page.saveButton);
    });
  };

  describe('when editing the default channel', function() {
    describeForm(true);
  });

  //describe('when editing a non-default channel', function() {
  //  describeForm(false);
  //});
});
