angular.module('webApp').directive('fwFileUpload', function () {
  'use strict';

    return {
      link: function(scope, elem, attrs){
        scope.fileType = attrs.fileType;
      },
      templateUrl:'views/partials/file-upload.html'
    };

});
