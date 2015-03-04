var CommonWorkflows = require('../../../common-workflows.js');
var SidebarPage = require('../../../pages/sidebar.page.js');
var HeaderCustomizePage = require('../../../pages/header-customize.page.js');
var LandingPagePage = require('../../../pages/creators/customize/landing-page.page.js');

describe('customize landing page form', function() {
  'use strict';

  var registration;
  var subscription;

  var commonWorkflows = new CommonWorkflows();
  var sidebar = new SidebarPage();
  var header = new HeaderCustomizePage();
  var page = new LandingPagePage();

  var navigateToPage = function() {
    sidebar.customizeLink.click();
  };

  it('should run once before all', function() {
    var context = commonWorkflows.createSubscription();
    registration = context.registration;
    subscription = context.subscription;
    navigateToPage();
  });

  describe('when first loaded after creating a subscription', function(){
    it('should contain a Basics tab', function(){
      expect(page.basicsTabLink.getText()).toBe('Basics');
    });

    it('should contain a Header Image tab', function(){
      expect(page.headerImageTabLink.getText()).toBe('Header Image');
    });

    it('should contain a Header Image tab', function(){
      expect(page.fullDescriptionTabLink.getText()).toBe('Full Description');
    });

    describe('when the Basics tab is selected', function(){

      it('should activate the Basics tab by default', function(){
        expect(page.basicsTab.getAttribute('class')).toContain('active');
        expect(page.headerImageTab.getAttribute('class')).not.toContain('active');
        expect(page.fullDescriptionTab.getAttribute('class')).not.toContain('active');
      });

      it('should contain a vanity url', function(){
        expect(page.vanityUrl.getText()).toBe('https://www.fifthweek.com/' + registration.username);
        expect(page.vanityUrl.getAttribute('ui-sref')).toBe('user.timeline');
      });

      it('should contain the subscription name', function(){
        expect(page.subscriptionNameTextBox.getAttribute('value')).toBe(subscription.name);
      });

      it('should contain the tagline', function(){
        expect(page.taglineTextBox.getAttribute('value')).toBe(subscription.tagline);
      });

      it('should contain the default introduction', function(){
        expect(page.introductionTextBox.getAttribute('value')).toContain('Hello!');
      });

      it('should contain the submit button', function(){
        expect(page.basicsSubmitButton.isDisplayed()).toBe(true);
        expect(page.basicsSubmitButton.isEnabled()).toBe(false);
      });
    });

    describe('when the Header Image tab is selected', function(){

      it('should activate the Header Image tab when clicked', function(){
        page.headerImageTabLink.click();
        expect(page.basicsTab.getAttribute('class')).not.toContain('active');
        expect(page.headerImageTab.getAttribute('class')).toContain('active');
        expect(page.fullDescriptionTab.getAttribute('class')).not.toContain('active');
      });

      it('should contain a blank header image', function(){
        expect(page.noHeaderImage.isDisplayed()).toBe(true);
      });

      it('should contain a file upload button', function(){
        expect(page.fileUploadButton.isDisplayed()).toBe(true);
      });

      it('should contain the submit button', function(){
        expect(page.headerImageSubmitButton.isDisplayed()).toBe(true);
        expect(page.headerImageSubmitButton.isEnabled()).toBe(false);
      });

    });

    describe('when the Full Description tab is selected', function(){

      it('should activate the Full Description tab when clicked', function(){
        page.fullDescriptionTabLink.click();
        expect(page.basicsTab.getAttribute('class')).not.toContain('active');
        expect(page.headerImageTab.getAttribute('class')).not.toContain('active');
        expect(page.fullDescriptionTab.getAttribute('class')).toContain('active');
      });

      it('should contain the video link', function(){
        expect(page.videoTextBox.getAttribute('value')).toBe('');
      });

      it('should contain the description', function(){
        expect(page.descriptionTextBox.getAttribute('value')).toBe('');
      });

      it('should contain the submit button', function(){
        expect(page.fullDescriptionSubmitButton.isDisplayed()).toBe(true);
        expect(page.fullDescriptionSubmitButton.isEnabled()).toBe(false);
      });

    });

  });

});
