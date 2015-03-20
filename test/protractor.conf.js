
exports.config = {
  baseUrl: 'http://localhost:9001',
  specs: ['e2e/spec/**/*.spec.js'],
  allScriptsTimeout: 30000,
  jasmineNodeOpts: {defaultTimeoutInterval: 5 * 60 * 1000}, // 5 Minutes
  capabilities: {
    browserName: 'firefox',
    shardTestFiles: true,
    maxInstances: 3
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
      preserveDirectory: true,
      takeScreenShotsOnlyForFailedSpecs: true
    }));

    window.setSize(1280, 850);
  }
};
