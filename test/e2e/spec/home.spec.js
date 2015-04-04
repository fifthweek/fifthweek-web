var HomePage = require('../pages/home.page.js');
var SignOutPage = require('../pages/sign-out.page.js');

describe("homepage", function() {
  'use strict';

  var homePage = new HomePage();
  var signOutPage = new SignOutPage();

  beforeEach(function() {
    signOutPage.signOutAndGoHome();
  });

  it('should have a sign-in link', function() {
    expect(homePage.signInLink.getText()).toContain('Sign In');
    homePage.signInLink.click();
    expect(browser.getCurrentUrl()).toContain('/sign-in');
  });

  it('should have correct intro heading', function() {
    expect(homePage.introHeading.getInnerHtml()).toBe('Comics, photos, <br>videos, blogs.');
  });

  it('should have correct sub intro heading', function() {
    expect(homePage.introSubHeading.getText()).toContain('Bring more of your best creations to life. Launch your own subscription');
  });

  it('should link to the "creator journey" video', function() {
    homePage.playVideoLink.click();
    expect(homePage.videoIFrame.getAttribute('src')).toContain('player.vimeo.com/video/114229222');
    homePage.videoIFrameCloseButton.click();
    expect(homePage.videoIFrame.isPresent()).toBe(false);
  });
});
