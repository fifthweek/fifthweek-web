(function(){
  'use strict';

  var HeaderCreatorPage = function() {};

  HeaderCreatorPage.prototype = Object.create({}, {
    name: { get: function () { return element(by.id('subscription-name')); }},
    tagline: { get: function () { return element(by.id('subscription-tagline')); }},
    introduction: { get: function () { return element(by.id('subscription-introduction')); }},
    profileImage: { get: function () { return element(by.id('profile-image')); }},
    headerImage: { get: function () { return element(by.id('header-image')); }},
    includeTests: { value: function(subscription, subscriptionIntroduction) {
      var self = this;

      describe('creator header', function() {

        it('should display the subscription name', function() {
          expect(self.name.getText()).toBe(subscription().name);
        });

        it('should display the tagline', function() {
          expect(self.tagline.getText()).toBe(subscription().tagline);
        });

        it('should display the quick introduction', function() {
          expect(self.introduction.getText()).toBe(subscriptionIntroduction());
        });
      });
    }}
  });

  module.exports = HeaderCreatorPage;
})();
