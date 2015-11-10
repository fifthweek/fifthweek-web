angular.module('webApp')
  .directive('fwSirTrevorEditor', function () {
    'use strict';

    return {
      restrict: 'E',
      require: ['fwSirTrevorEditor', 'ngModel'],
      controller:'fwSirTrevorEditorCtrl',
      scope:
      {
        maxlength: '@?',
        placeholder: '@?',
        editorId: '@?',
        ngRequired: '=?',
        ngDisabled: '=?',
        noFocus: '@?',
        channelId: '@',
        textOnly: '@'
      },
      templateUrl: 'modules/sir-trevor/fw-sir-trevor-editor.html',
      link: function (scope, element, attrs, ctrls) {
        var sirTrevorEditorCtrl = ctrls[0];
        var ngModelCtrl = ctrls[1];

        sirTrevorEditorCtrl.initialize(ngModelCtrl);
      }
    };
  });
