var bsConfig = {
  'build': 'E2E Tests - ' + new Date().toISOString(),
  'project': 'Fifthweek',
  'debug': false
};

exports.config = {
  seleniumAddress: 'http://hub.browserstack.com/wd/hub',
  baseUrl: 'http://localhost:9001',
  specs: ['e2e/spec/**/account-settings-form.spec.js'],
  allScriptsTimeout: 60000,
  jasmineNodeOpts: {
    defaultTimeoutInterval: 5 * 60 * 1000, // 5 Minutes
    browserNoActivityTimeout: 50000,
    captureTimeout: 60000,
    includeStackTrace: true
  },
  maxSessions: 2,
  // Capabilities to be passed to the webdriver instance.

  multiCapabilities: [{
    'browserName': 'firefox',
    'version': '34',
    'os': 'OS X',
    'build': bsConfig.build,
    'project': bsConfig.project,
    'resolution': '1280x1024',
    'browserstack.debug': bsConfig.debug,
    'browserstack.tunnel': 'true',
    'browserstack.user': process.env.BROWSER_STACK_USERNAME,
    'browserstack.key': process.env.BROWSER_STACK_ACCESS_KEY
  }],

  onPrepare: function () {
    var path = require('path');
    var HtmlReporter = require('protractor-html-screenshot-reporter');
    require('jasmine-reporters');

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
    browser.get('/');
  }
};
