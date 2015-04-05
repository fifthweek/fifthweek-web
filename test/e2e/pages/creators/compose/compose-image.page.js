(function(){
  'use strict';

  var BasePage = require('../../../pages/creators/compose/compose-upload.page.js');
  var composeImagePage = function() {};
  composeImagePage.prototype = Object.create(BasePage.prototype, {
    uploadType: { value: 'image' },
    headerLink: { value: 'imageLink' },
    uploadIndicator: { get: function(){ return element(by.css('.available-image')); }},
    pageUrl: { get: function () { return '/creators/post/image'; }}
  });

  module.exports = composeImagePage;
})();
