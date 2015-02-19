angular.module('webApp').directive('fwFormInputPassword', function ($compile) {
  'use strict';

  return {
    restrict: 'E',
    link: function(scope, element, attrs)
    {
      var isRequired = attrs.hasOwnProperty('required');
      var required = isRequired ? 'required' : '';
      var focus = attrs.hasOwnProperty('focus') ? 'focus=true' : '';
      var breakpoint = attrs.breakpoint || 'sm';

      var inputName = 'password';
      var htmlText =
        '<fw-form-group input-name="' + inputName + '">' +
          '<div class="row">' +
            '<div class="col-' + breakpoint + '-6">' +
              '<div fw-form-input-glyphs>' +
                '<input type="password" class="form-control" name="' + inputName + '" placeholder="' + attrs.placeholder + '" ' +
                'ng-model="' + attrs.ngModel + '" ' +
                'ng-minlength="6" ' +
                focus + ' ' +
                required + '>' +
              '</div>' +
            '</div>' +
            '<div class="col-' + breakpoint + '-6">' +
              '<p fw-form-input-invalid-p="minlength">Must be at least 6 characters.</p>' +
              (isRequired ? '<p fw-form-input-invalid-p="required">A password is required.</p>' : '') +
            '</div>' +
          '</div>' +
        '</fw-form-group>';

      $compile(htmlText)(scope, function(newElement) {
        element.replaceWith(newElement);
      });
    }
  };
});
