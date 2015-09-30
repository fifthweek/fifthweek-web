angular.module('webApp')
  .controller('fwMarkdownEditorCtrl', function ($scope, markdownService) {
    'use strict';

    var internal = this.internal = {};

    internal.render = function(){
      if(!internal.ngModelCtrl.$viewValue){
        $scope.htmlValue = internal.ngModelCtrl.$viewValue;
      }
      else{
        $scope.htmlValue = markdownService.renderMarkdown(internal.ngModelCtrl.$viewValue);
      }
    };

    internal.setValidity = function(markdownValue){
      if($scope.maxlength){
        $scope.remaining = $scope.maxlength - markdownValue.length;
        internal.ngModelCtrl.$setValidity('maxlength', $scope.remaining >= 0);
      }

      if($scope.ngRequired){
        internal.ngModelCtrl.$setValidity('required', !!markdownValue);
      }
    };

    internal.setViewValue = function(){
      if(!$scope.htmlValue){
        internal.ngModelCtrl.$setViewValue($scope.htmlValue);
        internal.setValidity('');
      }
      else{
        var markdownValue = markdownService.createMarkdown($scope.htmlValue);
        internal.ngModelCtrl.$setViewValue(markdownValue);
        internal.setValidity(markdownValue);
      }
    };

    this.initialize = function(ngModelCtrl_){
      internal.ngModelCtrl = ngModelCtrl_;
      internal.ngModelCtrl.$render = internal.render;

      $scope.$watch('htmlValue', internal.setViewValue);
    };
  });
