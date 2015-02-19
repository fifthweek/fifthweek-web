describe('form input valid directive', function(){
  'use strict';

  var inputName = 'test';
  var formName = 'formX';
  var element;

  beforeEach(function() {
    module('webApp');
  });

  var runDirective = function(elementHtml) {
    inject(function ($compile, $rootScope) {
      var $scope = $rootScope.$new();
      $rootScope.getFormName = function() { return formName; };
      $rootScope.getInputName = function() { return inputName; };

      element = $compile(elementHtml)($scope);
      $scope.$digest();
    });
  };

  it('should add the ng-if directive', function () {
    runDirective('<p fw-form-input-valid />');

    expect(element.attr('ng-if')).toBe('formX.test.$valid && ((formX.test.$touched && formX.test.$dirty) || formX.$submitted)');
  });
});
