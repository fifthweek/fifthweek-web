angular.module('webApp').directive('fwFormInputChannelPrice', function ($compile) {
  'use strict';

  return {
    restrict: 'E',
    link: function(scope, element, attrs)
    {
      var isRequired = attrs.hasOwnProperty('required');
      var required = isRequired ? 'required' : '';
      var focus = attrs.hasOwnProperty('focus') ? 'focus=true' : '';
      var breakpoint = attrs.breakpoint || 'sm';

      var inputName = 'channelPrice';
      var htmlText =
        '<fw-form-group input-name="' + inputName + '">' +
          '<div class="row">' +
            '<div class="col-' + breakpoint + '-6">' +
              '<div class="input-group">' +
                '<div class="input-group-addon">&#36;</div>' +
                '<input type="text" ' +
                  'class="form-control" ' +
                  'name="' + inputName + '" ' +
                  'ng-model="' + attrs.ngModel + '" ' +
                  'money ' +
                  'min="0.01" ' +
                  focus + ' ' +
                  required + '>' +
                '<div class="input-group-addon">per week</div>' +
              '</div>' +
              '<small>i.e. the amount people will pay you</small>' +
              '<!-- https://github.com/twbs/bootstrap/issues/12551 -->' +
              '<span style="right: 98px;" fw-form-input-valid class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>' +
              '<span style="right: 98px;" fw-form-input-invalid class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>' +
            '</div>' +
            '<div class="col-' + breakpoint + '-6">' +
              '<p fw-form-input-invalid-p="min">Must be at least one cent.</p>' +
              '<p fw-form-input-invalid-p="required">A price is required.</p>' +
            '</div>' +
          '</div>' +
        '</fw-form-group>';

      $compile(htmlText)(scope, function(newElement) {
        element.replaceWith(newElement);
      });
    }
  };
});
