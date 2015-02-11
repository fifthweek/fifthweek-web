describe('form input glyphs directive', function(){
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

  it('should add the has-feedback class', function () {
    runDirective('<p fw-form-input-glyphs />');

    expect(element.hasClass('has-feedback')).toBe(true);
  });

  it('should add the valid glyph', function () {
    runDirective('<p fw-form-input-glyphs />');

    expect(element.children().length).toBe(2);
    expect(element.children()[0].outerHTML).toBe('<span fw-form-input-valid="" class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>');
  });

  it('should add the invalid glyph', function () {
    runDirective('<p fw-form-input-glyphs />');

    expect(element.children().length).toBe(2);
    expect(element.children()[1].outerHTML).toBe('<span fw-form-input-invalid="" class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>');
  });
});
