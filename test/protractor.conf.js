
exports.config = {
  baseUrl: 'http://localhost:9001',
  specs: ['e2e/spec/**/registration-form.spec.js'],
  allScriptsTimeout: 60000,
  jasmineNodeOpts: {
    defaultTimeoutInterval: 5 * 60 * 1000, // 5 Minutes
    browserNoActivityTimeout: 50000,
    captureTimeout: 60000
  },
  capabilities: {
    browserName: 'firefox',
    shardTestFiles: true,
    maxInstances: 3
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
      pathBuilder: function pathBuilder(spec, descriptions, results, capabilities) {

        // When sharding, we discriminate by session ID since browser names will be non-unique, and will cause sessions
        // to overwrite each other's index.html.
        var sessionId = capabilities.caps_['webdriver.remote.sessionid'];

        var hasFailures = results.failedCount > 0;
        return path.join(
          hasFailures ? 'failure' : 'success',
          sessionId,
          descriptions.join(', '));
      }
    }));

    var window = browser.manage().window();
    window.setSize(1280, 850);
    browser.get('/');
  }
};
