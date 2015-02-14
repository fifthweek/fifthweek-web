angular.module('webApp').directive('fwFormInputPassword', function ($compile) {
  'use strict';

  return {
    restrict: 'E',
    link: function(scope, element, attrs)
    {
      var isRequired = attrs.hasOwnProperty('required');
      var required = isRequired ? 'required' : '';
      var focus = attrs.hasOwnProperty('focus') ? 'focus=true' : '';

      var htmlText =
        '<div class="form-group" fw-form-group-validation>' +
          '<div class="row">' +
            '<div class="col-md-6">' +
              '<div fw-form-input-glyphs>' +
                '<input type="password" class="form-control" name="password" placeholder="' + attrs.placeholder + '" ' +
                'ng-model="' + attrs.model + '" ' +
                'ng-minlength="6" ' +
                focus + ' ' +
                required + '>' +
              '</div>' +
            '</div>' +
            '<div class="col-md-6">' +
              '<p fw-form-input-invalid-p="minlength">Must be at least 6 characters.</p>' +
              (isRequired ? '<p fw-form-input-invalid-p="required">A password is required.</p>' : '') +
            '</div>' +
          '</div>' +
        '</div>';

      $compile(htmlText)(scope, function(newElement) {
        element.replaceWith(newElement);
      });
    }
  };
});
