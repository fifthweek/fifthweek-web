
exports.config = {
  baseUrl: 'http://localhost:9001',
  specs: ['e2e/spec/**/*.spec.js'],
  allScriptsTimeout: 30000,
  jasmineNodeOpts: {defaultTimeoutInterval: 5 * 60 * 1000}, // 5 Minutes
  capabilities: {
    browserName: 'firefox'
  },
  onPrepare: function () {
    require('jasmine-reporters');
    var HtmlReporter = require('protractor-html-screenshot-reporter');
    var path = require('path');

    jasmine.getEnv().addReporter(new jasmine.ConsoleReporter());

    // create a html reporter with screenshots
    jasmine.getEnv().addReporter(new HtmlReporter({
      baseDirectory: 'reports',
      preserveDirectory: true,
      takeScreenShotsOnlyForFailedSpecs: true,
      pathBuilder: function pathBuilder(spec, descriptions, results, capabilities) {
        var hasFailures = results.failedCount > 0;
        return path.join(
          hasFailures ? 'failure' : 'success',
          capabilities.caps_.platform + '-' + capabilities.caps_.browserName + '-' + capabilities.caps_.version,
          descriptions.join(', '));
      }
    }));

    var window = browser.manage().window();
    window.setSize(1280, 850);
    browser.get('/');
  }
};
