
exports.config = {
  baseUrl: 'http://localhost:9001',
  specs: ['e2e/spec/**/compose-file-form.spec.js'],
  capabilities: {
    browserName: 'firefox',
    //shardTestFiles: true,
    //maxInstances: 2
  },
  onPrepare: function () {
    // The require statement must be down here, since jasmine-reporters
    // needs jasmine to be in the global and protractor does not guarantee
    // this until inside the onPrepare function.
    var browserName,
      platform,
      window = browser.manage().window();

    require('jasmine-reporters');
    var HtmlReporter = require('protractor-html-screenshot-reporter');
    var path = require('path');

    jasmine.getEnv().addReporter(new jasmine.ConsoleReporter());

    // create a html reporter with screenshots
    jasmine.getEnv().addReporter(new HtmlReporter({
      baseDirectory: 'reports/screenshots',
      takeScreenShotsOnlyForFailedSpecs: true/*,
       pathBuilder: function pathBuilder(spec, descriptions, results, capabilities) {
       // Return '<browser>/<specname>' as path for screenshots:
       // Example: 'firefox/list-should work'.
       return path.join(capabilities.caps_.browser, descriptions.join('-'));
       }*/
    }));

    window.setSize(1280, 850);
/*
    // set the window size
    browser.getCapabilities().then(function (capabilities) {
        browserName = capabilities.caps_.browserName;
        platform = capabilities.caps_.platform;
      }
    ).then(function getCurrentWindowSize() {
        return window.getSize();
      }
    ).then(function setWindowSize(dimensions) {
        var windowWidth = 1280,
          windowHeight = 850;

        return window.setSize(windowWidth, windowHeight);
      }
    ).then(function getUpdatedWindowSize() {
        return window.getSize();
      }
    ).then(function showWindowSize(dimensions) {
        console.log('Browser:', browserName, 'on', platform, 'at', dimensions.width + 'x' + dimensions.height);
        console.log('Running e2e tests...');
      }
    );*/
  }
};
