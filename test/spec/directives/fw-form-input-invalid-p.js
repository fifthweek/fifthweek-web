describe('form input invalid paragraph directive', function(){
  'use strict';

  var element;
  var $compile;
  var $compileDummy = function() { return function() {}; };

  beforeEach(function() {
    module('webApp');
    module(function($provide) {
      $provide.decorator('$compile', function($delegate) {
        $compile = $delegate;
        return $compileDummy;
      });
    });
  });

  var runDirective = function(elementHtml) {
    inject(function (_$compile_, $rootScope) {
      var $scope = $rootScope;
      element = $compile(elementHtml)($scope);
      $scope.$digest();
    });
  };

  it('should add the fw-form-input-invalid directive', function () {
    runDirective('<p fw-form-input-invalid-p="theRule" />');

    expect(element.attr('fw-form-input-invalid')).toBe('theRule');
  });
});
