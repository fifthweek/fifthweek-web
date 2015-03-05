var TestKit = require('../../../test-kit.js');
var CommonWorkflows = require('../../../common-workflows.js');
var ChannelNameInputPage = require('../../../pages/channel-name-input.page.js');
var ChannelDescriptionInputPage = require('../../../pages/channel-description-input.page.js');
var ChannelPriceInputPage = require('../../../pages/channel-price-input.page.js');
var SidebarPage = require('../../../pages/sidebar.page.js');
var HeaderCustomizePage = require('../../../pages/header-customize.page.js');
var ChannelListPage = require('../../../pages/creators/customize/channel-list.page.js');
var ChannelEditPage = require('../../../pages/creators/customize/channel-edit.page.js');

ddescribe('edit channel form', function() {
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

    var navigateToPage = function() {
      if (isDefault) {
        channelListPage.getEditChannelButton(0).click();
      }
      else {
        channelListPage.getEditChannelButton(1).click();
      }
    };

    var expectFormValues = function(values) {
      expect(page.nameTextBox.getAttribute('value')).toBe(values.name);
      expect(page.descriptionTextBox.getAttribute('value')).toBe(values.description);
      expect(page.priceTextBox.getAttribute('value')).toBe(values.price);

      if (!isDefault) {
        throw 'Not Implemented';
      }
    };

    it('should run once before all', function() {
      initialValues = {
        name: isDefault ? channelListPage.defaultChannelName : 'Not Implemented',
        description: isDefault ? channelListPage.defaultChannelDescription : 'Not Implemented',
        price: isDefault ? subscription.basePrice : 'Not Implemented',
        hidden: 'Not Implemented'
      };

      navigateToPage();
    });

    it('should ' + (isDefault ? 'not' : '') + ' give you the option to delete the channel', function() {
      expect(page.deleteButtonCount).toBe(isDefault ? 0 : 1);
    });

    it('should ' + (isDefault ? 'not' : '') + ' give you the option to hide the channel', function() {
      expect(page.hiddenCheckboxCount).toBe(isDefault ? 0 : 1);
    });

    it('should initialise with the correct properties', function() {
      expectFormValues(initialValues);
    });

    it('should discard changes when user cancels', function() {
      page.nameTextBox.clear();
      page.nameTextBox.sendKeys(channelNameInputPage.newName());
      page.descriptionTextBox.clear();
      page.descriptionTextBox.sendKeys(channelDescriptionInputPage.newDescription());
      page.priceTextBox.clear();
      page.priceTextBox.sendKeys(channelPriceInputPage.newPrice());

      if (!isDefault) {
        page.hiddenCheckbox.click();
      }

      page.cancelButton.click();
      channelListPage.getEditChannelButton(0).click();

      expectFormValues(initialValues);
    });

    it('should allow user to cancel when form is invalid', function() {
      page.nameTextBox.clear();
      page.descriptionTextBox.clear();
      page.priceTextBox.clear();

      page.cancelButton.click();
      channelListPage.getEditChannelButton(0).click();

      expectFormValues(initialValues);
    });

    describe('when submitting with valid input', function() {
      var newValues;

      it('should run once before all', function() {
        newValues = {
          name: channelNameInputPage.newName(),
          description: channelDescriptionInputPage.newDescription(),
          price: channelPriceInputPage.newPrice(),
          hidden: !initialValues.hidden
        };

        page.nameTextBox.clear();
        page.nameTextBox.sendKeys(newValues.name);
        page.descriptionTextBox.clear();
        page.descriptionTextBox.sendKeys(newValues.description);
        page.priceTextBox.clear();
        page.priceTextBox.sendKeys(newValues.price);

        if (!isDefault) {
          page.hiddenCheckbox.click();
        }

        page.saveButton.click();
        browser.waitForAngular();
        channelListPage.getEditChannelButton(0).click();
      });

      it('should persist the changes', function() {
        expectFormValues(newValues);
      });

      it('should persist the changes, between sessions', function() {
        commonWorkflows.reSignIn(registration);
        sidebar.customizeLink.click();
        header.channelsLink.click();
        navigateToPage();
        expectFormValues(newValues);
      });
    });

    describe('when submitting with invalid input', function() {

    });

    var formActions = [
      {
        name: 'changing the name',
        textbox: page.nameTextBox
      },
      {
        name: 'changing the description',
        textbox: page.descriptionTextBox
      },
      {
        name: 'changing the price',
        textbox: page.priceTextBox
      }
    ];

    if (!isDefault) {
      formActions.push({
        name: 'changing the visibility',
        checkbox: page.hiddenCheckbox
      });
    }

    testKit.itShouldHaveWellBehavedSubmitButton(page.saveButton, formActions);
  };

  describe('when editing the default channel', function() {
    describeForm(true);
  });

  //describe('when editing a non-default channel', function() {
  //  describeForm(false);
  //});
});
