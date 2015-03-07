
exports.config = {
  baseUrl: 'http://localhost:9001',

  // Small subset of tests. Entire suite will be run as part of CI.
  specs: ['e2e/spec/sign-in-reset-form.spec.js'],

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
