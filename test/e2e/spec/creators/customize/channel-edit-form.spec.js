var TestKit = require('../../../test-kit.js');
var CommonWorkflows = require('../../../common-workflows.js');
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

  var itShouldBehaveLikeAGoodForm = function() {
    it('should discard changes when user cancels', function() {
      page.nameTextBox.clear();
      page.nameTextBox.sendKeys('New Value');
      page.descriptionTextBox.clear();
      page.descriptionTextBox.sendKeys('New Value');
      page.priceTextBox.clear();
      page.priceTextBox.sendKeys(subscription.basePrice + 2.55);

      page.cancelButton.click();
      channelListPage.getEditChannelButton(0).click();

      expectDefaultChannelValues();
    });

    it('should allow user to cancel when form is invalid', function() {
      page.nameTextBox.clear();
      page.descriptionTextBox.clear();
      page.priceTextBox.clear();

      page.cancelButton.click();
      channelListPage.getEditChannelButton(0).click();

      expectDefaultChannelValues();
    });

    testKit.itShouldHaveWellBehavedSubmitButton(page.saveButton, [
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
    ]);
  };

  describe('when editing the default channel', function() {
    it('should run once before all', function() {
      channelListPage.getEditChannelButton(0).click();
    });

    itShouldBehaveLikeAGoodForm();

    it('should initialise with the correct properties', function() {
      expectDefaultChannelValues();
    });

    it('should not give you the option to delete the channel', function() {
      expect(page.deleteButtonCount).toBe(0);
    });

    it('should not give you the option to hide the channel', function() {
      expect(page.hiddenCheckboxCount).toBe(0);
    });

    describe('when submitting with valid input', function() {
      it('should persist the changes', function() {

      });
    });

    describe('when submitting with invalid input', function() {

    });
  });

  //describe('when editing a non-default channel', function() {
  //  it('should run once before all', function() {
  //    channelListPage.getEditChannelButton(1).click();
  //  });
  //
  //  itShouldBehaveLikeAGoodForm();
  //  it('should initialise with the correct properties', function() {
  //    expect(page.nameTextBox.getAttribute('value')).toBe(...);
  //    expect(page.descriptionTextBox.getAttribute('value')).toBe(...);
  //    expect(page.priceTextBox.getAttribute('value')).toBe(...);
  //    expect(page.hiddenCheckbox.getAttribute('value')).toBe(...);
  //  });
  //
  //  describe('when deleting the channel', function() {
  //
  //  });
  //});

  var expectDefaultChannelValues = function() {
    expect(page.nameTextBox.getAttribute('value')).toBe(channelListPage.defaultChannelName);
    expect(page.descriptionTextBox.getAttribute('value')).toBe(channelListPage.defaultChannelDescription);
    expect(page.priceTextBox.getAttribute('value')).toBe(subscription.basePrice);
  };
});
