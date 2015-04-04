var CommonWorkflows = require('./e2e/common-workflows.js');
var commonWorkflows = new CommonWorkflows();
var minute = 60 * 1000;

var bsConfig = {
  'build': 'E2E Tests - ' + new Date().toISOString(),
  'project': 'Fifthweek',
  'debug': false
};

exports.config = {
  seleniumAddress: 'http://hub.browserstack.com/wd/hub',
  baseUrl: 'http://localhost:9001',

  specs: ['e2e/spec/**/*.spec.js'],

  // We cannot run any file upload tests until BrowserStack upgrade to Selenium 2.45.0
  exclude: [
    'e2e/spec/**/compose-file-form.spec.js',
    'e2e/spec/**/compose-image-form.spec.js',
    'e2e/spec/**/creator-backlog-form.spec.js',
    'e2e/spec/**/creator-timeline-form.spec.js',
    'e2e/spec/**/account-settings-form.spec.js',
    'e2e/spec/**/customize-landing-page-form.spec.js'
  ],

  allScriptsTimeout: minute,
  jasmineNodeOpts: {
    defaultTimeoutInterval: 5 * minute, // Need to allow slightly longer for BrowserStack tests.
    includeStackTrace: true
  },

  maxSessions: 2,
  // Capabilities to be passed to the webdriver instance.

  // Browser version strategy. Statistics taken from: https://www.netmarketshare.com/
  //
  // Top 95% of OS products:
  //
  //  - Windows
  //  - Mac
  //
  // Top 95% of browser products:
  //
  //  - IE
  //  - Chrome
  //  - Firefox
  //  - Safari
  //
  // Top 80% of OS versions, including the most popular version from each OS product listed above:
  //
  //  - Windows 7
  //  - Windows XP (excluded - latest supported version of IE is too old)
  //  - Windows 8.1
  //  - Mac OSX 10.10
  //
  // For each of these OS versions, take the most popular version of each supported browser product:
  //
  //  - Windows 7 / IE 11
  //  - Windows 7 / Chrome 39
  //  - Windows 7 / Firefox 34
  //  - Windows 8.1 / IE 11
  //  - Windows 8.1 / Chrome 39
  //  - Windows 8.1 / Firefox 34
  //  - Mac OSX 10.10 / Chrome 39
  //  - Mac OSX 10.10 / Firefox 34
  //  - Mac OSX 10.10 / Safari 8

multiCapabilities: [
    {
      'os': 'Windows',
      'os_version': '7',
      'browser': 'IE',
      'browser_version': '11',
      'build': bsConfig.build,
      'project': bsConfig.project,
      'resolution': '1280x1024',
      'browserstack.debug': bsConfig.debug,
      'browserstack.tunnel': 'true',
      'browserstack.user': process.env.BROWSER_STACK_USERNAME,
      'browserstack.key': process.env.BROWSER_STACK_ACCESS_KEY
    },
    {
      'os': 'Windows',
      'os_version': '7',
      'browser': 'Chrome',
      'browser_version': '39',
      'build': bsConfig.build,
      'project': bsConfig.project,
      'resolution': '1280x1024',
      'browserstack.debug': bsConfig.debug,
      'browserstack.tunnel': 'true',
      'browserstack.user': process.env.BROWSER_STACK_USERNAME,
      'browserstack.key': process.env.BROWSER_STACK_ACCESS_KEY
    },
    {
      'os': 'Windows',
      'os_version': '7',
      'browser': 'Firefox',
      'browser_version': '34',
      'build': bsConfig.build,
      'project': bsConfig.project,
      'resolution': '1280x1024',
      'browserstack.debug': bsConfig.debug,
      'browserstack.tunnel': 'true',
      'browserstack.user': process.env.BROWSER_STACK_USERNAME,
      'browserstack.key': process.env.BROWSER_STACK_ACCESS_KEY
    },
    {
      'os': 'Windows',
      'os_version': '8.1',
      'browser': 'IE',
      'browser_version': '11',
      'build': bsConfig.build,
      'project': bsConfig.project,
      'resolution': '1280x1024',
      'browserstack.debug': bsConfig.debug,
      'browserstack.tunnel': 'true',
      'browserstack.user': process.env.BROWSER_STACK_USERNAME,
      'browserstack.key': process.env.BROWSER_STACK_ACCESS_KEY
    },
    {
      'os': 'Windows',
      'os_version': '8.1',
      'browser': 'Chrome',
      'browser_version': '39',
      'build': bsConfig.build,
      'project': bsConfig.project,
      'resolution': '1280x1024',
      'browserstack.debug': bsConfig.debug,
      'browserstack.tunnel': 'true',
      'browserstack.user': process.env.BROWSER_STACK_USERNAME,
      'browserstack.key': process.env.BROWSER_STACK_ACCESS_KEY
    },
    {
      'os': 'Windows',
      'os_version': '8.1',
      'browser': 'Firefox',
      'browser_version': '34',
      'build': bsConfig.build,
      'project': bsConfig.project,
      'resolution': '1280x1024',
      'browserstack.debug': bsConfig.debug,
      'browserstack.tunnel': 'true',
      'browserstack.user': process.env.BROWSER_STACK_USERNAME,
      'browserstack.key': process.env.BROWSER_STACK_ACCESS_KEY
    },
    {
      'os': 'OS X',
      'os_version': 'Yosemite',
      'browser': 'Safari',
      'browser_version': '8',
      'build': bsConfig.build,
      'project': bsConfig.project,
      'resolution': '1280x1024',
      'browserstack.debug': bsConfig.debug,
      'browserstack.tunnel': 'true',
      'browserstack.user': process.env.BROWSER_STACK_USERNAME,
      'browserstack.key': process.env.BROWSER_STACK_ACCESS_KEY
    },
    {
      'os': 'OS X',
      'os_version': 'Yosemite',
      'browser': 'Chrome',
      'browser_version': '39',
      'build': bsConfig.build,
      'project': bsConfig.project,
      'resolution': '1280x1024',
      'browserstack.debug': bsConfig.debug,
      'browserstack.tunnel': 'true',
      'browserstack.user': process.env.BROWSER_STACK_USERNAME,
      'browserstack.key': process.env.BROWSER_STACK_ACCESS_KEY
    },
    {
      'os': 'OS X',
      'os_version': 'Yosemite',
      'browser': 'Firefox',
      'browser_version': '34',
      'build': bsConfig.build,
      'project': bsConfig.project,
      'resolution': '1280x1024',
      'browserstack.debug': bsConfig.debug,
      'browserstack.tunnel': 'true',
      'browserstack.user': process.env.BROWSER_STACK_USERNAME,
      'browserstack.key': process.env.BROWSER_STACK_ACCESS_KEY
    }
  ],

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
          descriptions.join(', ').substring(0, 250));
      }
    }));

    var window = browser.manage().window();
    window.setSize(1280, 850);
    commonWorkflows.getRoot();
  }
};
