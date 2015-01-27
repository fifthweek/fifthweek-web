'use strict';

describe('creator - customize landing page controller', function () {

  describe('basics', function () {
    it ('should have default data', function(){
      expect(scope.landingPageData.url).toEqual('https://www.fifthweek.com/marc-holmes');
      expect(scope.landingPageData.subscriptionName).toEqual('');
      expect(scope.landingPageData.tagline).toEqual('');
      expect(scope.landingPageData.introduction).toEqual('');
    });
  });

  // load the controller's module
  beforeEach(module('webApp'));

  var customizeLandingPageCtrl,
      scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    customizeLandingPageCtrl = $controller('customizeLandingPageCtrl', {
      $scope: scope
    });
  }));

});