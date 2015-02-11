angular.module('webApp').directive('fwFormInputGlyphs', function ($compile) {
  'use strict';

  return {
    restrict: 'A',
    link: function(scope, element) {

      element.addClass('has-feedback');

      var validGlyphHtml = '<span fw-form-input-valid class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>';
      var validGlyph = angular.element(validGlyphHtml);
      element.append(validGlyph);
      $compile(validGlyph)(scope);

      var invalidGlyphHtml = '<span fw-form-input-invalid class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>';
      var invalidGlyph = angular.element(invalidGlyphHtml);
      element.append(invalidGlyph);
      $compile(invalidGlyph)(scope);
    }
  };
});
