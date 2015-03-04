
exports.config = {
  baseUrl: 'http://localhost:9001',

  // Developers can override and check-in. This is only used by other developers
  // to debug specific tests and will be frequently overwritten.
  specs: ['e2e/spec/**/channel-edit-page.spec.js'],

  capabilities: {
    browserName: 'firefox'
  },
  onPrepare: function () {
    // The require statement must be down here, since jasmine-reporters
    // needs jasmine to be in the global and protractor does not guarantee
    // this until inside the onPrepare function.
    var window = browser.manage().window();

    require('jasmine-reporters');
    var HtmlReporter = require('protractor-html-screenshot-reporter');
    var path = require('path');

    jasmine.getEnv().addReporter(new jasmine.ConsoleReporter());

    // create a html reporter with screenshots
    jasmine.getEnv().addReporter(new HtmlReporter({
      baseDirectory: 'reports/screenshots',
      takeScreenShotsOnlyForFailedSpecs: true
    }));

    window.setSize(1280, 850);
  }
};
