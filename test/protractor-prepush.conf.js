
exports.config = {
  baseUrl: 'http://localhost:9001',

  // Small subset of tests. Entire suite will be run as part of CI.
  specs: ['e2e/spec/sign-in-reset-form.spec.js'],

  capabilities: {
    browserName: 'firefox'
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
        var hasFailures = results.failedCount > 0;
        return path.join(
          hasFailures ? 'failure' : 'success',
          capabilities.caps_.platform + '-' + capabilities.caps_.browserName + '-' + capabilities.caps_.version,
          descriptions.join(', '));
      }
    }));

    var window = browser.manage().window();
    window.setSize(1280, 850);
  }
};
