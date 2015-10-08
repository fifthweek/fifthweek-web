angular.module('webApp')
  .directive('fwMarkdownEditor', function () {
    'use strict';

    return {
      restrict: 'E',
      require: ['fwMarkdownEditor', 'ngModel'],
      controller:'fwMarkdownEditorCtrl',
      scope:
      {
        maxlength: '@?',
        placeholder: '@?',
        editorId: '@?',
        ngRequired: '=?',
        ngDisabled: '=?',
        ngFocus: '@?'
      },
      templateUrl: 'modules/common/fw-markdown-editor.html',
      link: {
        pre: function (scope) {
          scope.bindOptions = {
            placeholder:
            {
              text: scope.placeholder
            },
            buttonLabels: 'fontawesome',
            autoLink: true,
            toolbar: {
              buttons: [
                'bold',
                'italic',
                'underline',
                'anchor',
                'h1',
                'h2',
                'quote',
                'orderedlist',
                'unorderedlist',
                'pre'
              ]
            },
            paste: {
              forcePlainText: false,
              cleanPastedHTML: true,
              cleanAttrs: ['class', 'style', 'dir'],
              cleanTags: ['meta', 'table']
            }
          };
        },
        post: function (scope, element, attrs, ctrls) {

          var markdownEditorCtrl = ctrls[0];
          var ngModelCtrl = ctrls[1];

          markdownEditorCtrl.initialize(ngModelCtrl);
        }
      }
    };
  });
