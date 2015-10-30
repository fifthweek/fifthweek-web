angular.module('webApp')
  .directive('fwFileBlock', function () {
    'use strict';

    return {
      restrict: 'E',
      require: ['fwFileBlock'],
      controller:'fwFileBlockCtrl',
      scope:
      {
        channelId: '@?',
        fileId: '@?',
        containerName: '@?',
        fileName: '@?',
        onUploadStartedDelegate: '&?',
        onUploadCompleteDelegate: '&?'
      },
      templateUrl: 'modules/sir-trevor/fw-file-block.html',
      link: function (scope, element, attrs, ctrls) {
        var ctrl = ctrls[0];
        ctrl.initialize();
      }
    };
  });
