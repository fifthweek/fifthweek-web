angular.module('webApp')
  .directive('fwImageBlock', function () {
    'use strict';

    return {
      restrict: 'E',
      require: ['fwImageBlock'],
      controller:'fwImageBlockCtrl',
      scope:
      {
        channelId: '@?',
        fileId: '@?',
        containerName: '@?',
        renderSize: '=?',
        onUploadStartedDelegate: '&?',
        onProcessingCompleteDelegate: '&?'
      },
      templateUrl: 'modules/sir-trevor/fw-image-block.html',
      link: function (scope, element, attrs, ctrls) {
        var ctrl = ctrls[0];
        ctrl.initialize();
      }
    };
  });
