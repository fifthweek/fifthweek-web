describe('authentication interceptor', function() {
  'use strict';

  describe('when intercepting a request', function() {

    it('should add developer name data to the request headers', function() {

      fifthweekConstants.developerName = 'XYZ';

      var config = {headers: {}};
      var newConfig = developerRequestInterceptor.request(config);

      expect(newConfig).toBe(config);
      expect(newConfig.headers[fifthweekConstants.developerNameHeader]).toBe(fifthweekConstants.developerName);
    });


    it('should not add developer name data to the request headers if the developer name is undefined', function() {

      fifthweekConstants.developerName = undefined;

      var config = {headers: {}};
      var newConfig = developerRequestInterceptor.request(config);

      expect(newConfig).toBe(config);
      expect(newConfig.headers[fifthweekConstants.developerNameHeader]).toBeUndefined();
    });


    it('should not add developer name data to the request headers if the developer name is empty string', function() {

      fifthweekConstants.developerName = '';

      var config = {headers: {}};
      var newConfig = developerRequestInterceptor.request(config);

      expect(newConfig).toBe(config);
      expect(newConfig.headers[fifthweekConstants.developerNameHeader]).toBeUndefined();
    });

  });

  // load the service's module
  beforeEach(module('webApp'));

  var developerRequestInterceptor;
  var fifthweekConstants;

  beforeEach(inject(function($injector) {
    developerRequestInterceptor = $injector.get('developerRequestInterceptor');
    fifthweekConstants = $injector.get('fifthweekConstants');
  }));
});
