describe('form input group validation directive', function(){
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

  it('should add the ng-class directive', function () {
    runDirective('<p fw-form-group-validation><input name="test" /></p>');

    expect(element.attr('ng-class')).toBe('{' +
      '\'has-error\' : form.test.$invalid && ((form.test.$touched && form.test.$dirty) || form.$submitted),' +
      '\'has-success\' : form.test.$valid && form.test.$touched}');
  });
});
