(function() {
  'use strict';
  var TargetPage = require('../../../pages/creators/compose/compose-file.page.js');
  var targetPage = new TargetPage();
  targetPage.includeTests(targetPage);
})();
