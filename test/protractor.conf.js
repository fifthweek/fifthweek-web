
exports.config = {
  baseUrl: 'http://localhost:9001',
  specs: ['e2e/spec/**/*.spec.js'],
  allScriptsTimeout: 60000,
  jasmineNodeOpts: {
    defaultTimeoutInterval: 5 * 60 * 1000, // 5 Minutes
    browserNoActivityTimeout: 50000,
    captureTimeout: 60000,
    includeStackTrace: true
  },
  capabilities: {
    browserName: 'chrome',
    chromeOptions: {
      'args': ['no-sandbox'] // Requirement for Travis.
    },
    shardTestFiles: true,
    maxInstances: 2
  },
  onPrepare: function () {
    require('jasmine-reporters');
    var HtmlReporter = require('protractor-html-screenshot-reporter');
    var path = require('path');

    jasmine.getEnv().addReporter(new jasmine.ConsoleReporter());
    jasmine.getEnv().addReporter(new HtmlReporter({
      baseDirectory: 'reports',
      preserveDirectory: true,
      takeScreenShotsOnlyForFailedSpecs: true,
      pathBuilder: function pathBuilder(spec, descriptions, results) {
        var hasFailures = results.failedCount > 0;
        return path.join(
          hasFailures ? 'failure' : 'success',
          descriptions.join(', '));
      }
    }));

    var window = browser.manage().window();
    window.setSize(1280, 850);
    browser.get('/');
  }
};
