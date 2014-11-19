exports.config = {
  /*seleniumAddress: 'http://localhost:4444/wd/hub',*/
  specs: ['e2e/*fifthweek_test.js'],
  baseUrl: 'http://localhost:9000' //default test port with Yeoman
  /*multiCapabilities: [{
    browserName: 'firefox'
  }, {
    browserName: 'chrome'
  }]*/
}