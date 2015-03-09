(function(){
  'use strict';

  var BasePage = require('../../../pages/creators/compose/compose-upload.page.js');

  var composeFilePage = function() {};
  composeFilePage.prototype = Object.create(BasePage.prototype, {
    uploadType: { value: 'file' },
    headerLink: { value: 'fileLink' },
    uploadIndicator: { get: function(){ return element(by.css('.btn-file-download')); }},
    pageUrl: { get: function () { return '/creators/compose/file'; }}
  });

  module.exports = composeFilePage;
})();
