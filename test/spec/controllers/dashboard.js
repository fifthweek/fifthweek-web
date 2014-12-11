'use strict';

describe('dashboard controller', function () {

  it('should have the correct url', function()
  {
    expect(fifthweekConstants.dashboardPage).toEqual(dashboardPage.path);
  });

  // load the controller's module
  beforeEach(module('webApp'));

  var dashboardCtrl;
  var scope;
  var fifthweekConstants;
  var dashboardPage;

  beforeEach(inject(function ($controller, $rootScope, _fifthweekConstants_, _dashboardPage_) {
    scope = $rootScope.$new();
    fifthweekConstants = _fifthweekConstants_;
    dashboardPage = _dashboardPage_;

    dashboardCtrl = $controller('DashboardCtrl', {
      $scope: scope
    });
  }));

});
