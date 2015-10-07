var CommonWorkflows = require('./e2e/common-workflows.js');
var commonWorkflows = new CommonWorkflows();
var minute = 60 * 1000;

exports.config = {
  baseUrl: 'http://localhost:9001',
  specs: ['e2e/spec/**/compose-post-form.spec.js'],
  framework: 'jasmine2',

  allScriptsTimeout: minute,

  jasmineNodeOpts: {
    defaultTimeoutInterval: 2 * minute
  },

  capabilities: {
    browserName: 'chrome',
    chromeOptions: {
      'args': ['no-sandbox']
    }
  },


  onPrepare: function () {
/*
    var disableNgAnimate = function() {
      angular
        .module('disableNgAnimate', [])
        .run(['$animate', function($animate) {
          $animate.enabled(false);
        }]);
    };

    var disableCssAnimate = function() {
      angular
        .module('disableCssAnimate', [])
        .run(function() {
          var style = document.createElement('style');
          style.type = 'text/css';
          style.innerHTML = '* {' +
            '-webkit-transition: none !important;' +
            '-moz-transition: none !important' +
            '-o-transition: none !important' +
            '-ms-transition: none !important' +
            'transition: none !important' +
            '}';
          document.getElementsByTagName('head')[0].appendChild(style);
        });
    };

    browser.addMockModule('disableNgAnimate', disableNgAnimate);
    browser.addMockModule('disableCssAnimate', disableCssAnimate);

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
          descriptions.join(', ').substring(0, 250));
      }
    }));
 */

    var window = browser.manage().window();
    window.setSize(1280, 850);
    return commonWorkflows.getRoot();
  }
};
