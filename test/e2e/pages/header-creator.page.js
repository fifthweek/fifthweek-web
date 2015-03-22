(function(){
  'use strict';

  var HeaderCreatorPage = function() {};

  var commonWorkflows = new CommonWorkflows();

  HeaderCreatorPage.prototype = Object.create({}, {
    name: { get: function () { return element(by.id('subscription-name')); }},
    tagline: { get: function () { return element(by.id('subscription-tagline')); }},
    introduction: { get: function () { return element(by.id('subscription-introduction')); }},
    includeTests: { value: function(registration, subscription) {
      var self = this;

      describe('creator header', function() {

        it('should display the subscription name', function() {
          expect(self.name.getText()).toBe(subscription.name);
        });

        it('should display the tagline', function() {
          expect(self.tagline.getText()).toBe(subscription.tagline);
        });

        it('should display the quick introduction', function() {
          expect(self.introduction.getText()).toBe(subscription.tagline);
        });

        describe('header image', function() {
          it('should display a default image when absent', function() {

          });

          it('should display the image when provided', function() {

          });
        });

        describe('profile image', function() {
          it('should display a default image when absent', function() {

          });

          it('should display the image when provided', function() {

          });
        });
      });
    }}
  });

  module.exports = HeaderCreatorPage;
})();
