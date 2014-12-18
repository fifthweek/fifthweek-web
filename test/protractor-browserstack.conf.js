var bsConfig = {
  'build': 'E2E Tests - ' + new Date().toISOString(),
  'project': 'Fifthweek',
  'debug': true
};

exports.config = {
  // The address of a running selenium server.
  seleniumAddress: 'http://hub.browserstack.com/wd/hub',
  baseUrl: 'http://localhost:9001',
  allScriptsTimeout: 55000,
  maxSessions: 2,
  // Capabilities to be passed to the webdriver instance.

  multiCapabilities: [{
    'browserName': 'firefox',
    'os': 'OS X',
    'build': bsConfig.build,
    'project': bsConfig.project,
    'resolution': '1280x1024',
    'browserstack.debug': bsConfig.debug,
    'browserstack.tunnel': 'true',
    'browserstack.user': process.env.BROWSER_STACK_USERNAME,
    'browserstack.key': process.env.BROWSER_STACK_ACCESS_KEY
  }/*,
  {
    'browserName': 'IE',
    'browser_version': '11.0',
    'os': 'Windows',
    'build': bsConfig.build,
    'project': bsConfig.project,
    'resolution': '1280x1024',
    'browserstack.debug': bsConfig.debug,
    'browserstack.tunnel': 'true',
    'browserstack.user': process.env.BROWSER_STACK_USERNAME,
    'browserstack.key': process.env.BROWSER_STACK_ACCESS_KEY
  },
  {
    'browserName': 'safari',
    'os': 'OS X',
    'build': bsConfig.build,
    'project': bsConfig.project,
    'browserstack.debug': bsConfig.debug,
    'browserstack.tunnel': 'true',
    'browserstack.user': process.env.BROWSER_STACK_USERNAME,
    'browserstack.key': process.env.BROWSER_STACK_ACCESS_KEY
  },
  {
    'browserName': 'chrome',
    'os': 'Windows',
    'build': bsConfig.build,
    'project': bsConfig.project,
    'resolution': '1280x1024',
    'browserstack.debug': bsConfig.debug,
    'browserstack.tunnel': 'true',
    'browserstack.user': process.env.BROWSER_STACK_USERNAME,
    'browserstack.key': process.env.BROWSER_STACK_ACCESS_KEY
  },
  {
    'browserName': 'chrome',
    'os': 'OS X',
    'os_version': 'Mountain Lion',
    'build': bsConfig.build,
    'project': bsConfig.project,
    'resolution': '1280x1024',
    'browserstack.debug': bsConfig.debug,
    'browserstack.tunnel': 'true',
    'browserstack.user': process.env.BROWSER_STACK_USERNAME,
    'browserstack.key': process.env.BROWSER_STACK_ACCESS_KEY
  }*/],

  // Spec patterns are relative to the current working directly when
  // protractor is called.
  specs: ['e2e/fifthweek.spec.js'],

  // Options to be passed to Jasmine-node.
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 90000,
    browserNoActivityTimeout: 50000,
    captureTimeout: 60000
  },

  onPrepare: function () {

    // set the window size
    browser.getCapabilities().then(function (capabilities) {
        browserName = capabilities.caps_.browserName;
        platform = capabilities.caps_.platform;
      }
    ).then(function setWindowSize() {
        return browser.driver.manage().window().maximize();
      }
    ).then(function getUpdatedWindowSize() {
        return browser.driver.manage().window().getSize();
      }
    ).then(function showWindowSize(dimensions) {
        console.log('Browser:', browserName, 'on', platform, 'at', dimensions.width + 'x' + dimensions.height);
        console.log('Running e2e tests...');
      }
    );
  }

};
