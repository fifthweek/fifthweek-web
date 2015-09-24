(function(){
  'use strict';

  var HeaderViewProfilePage = function() {};

  HeaderViewProfilePage.prototype = Object.create({}, {
    name: { get: function () { return element(by.id('blog-name')); }},
    introduction: { get: function () { return element(by.id('blog-introduction')); }},
    profileImage: { get: function () { return element(by.id('profile-image')); }},
    headerImage: { get: function () { return element(by.id('header-image')); }},
    includeTests: { value: function(blog, blogIntroduction) {
      var self = this;

      describe('creator header', function() {

        it('should display the blog name', function() {
          expect(self.name.getText()).toBe(blog().name);
        });

        it('should display the quick introduction', function() {
          if(blogIntroduction){
            expect(self.introduction.getText()).toBe(blogIntroduction());
          }
        });
      });
    }}
  });

  module.exports = HeaderViewProfilePage;
})();
