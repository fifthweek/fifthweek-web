describe('form input invalid directive', function(){
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

  it('should allow no rule to be specified', function () {
    runDirective('<p fw-form-input-invalid />');

    expect(element.attr('ng-if')).toBe('formX.test.$invalid && ((formX.test.$touched && formX.test.$dirty) || formX.$submitted)');
  });

  it('should allow a rule to be specified', function () {
    runDirective('<p fw-form-input-invalid="theRule" />');

    expect(element.attr('ng-if')).toBe('formX.test.$error.theRule && ((formX.test.$touched && formX.test.$dirty) || formX.$submitted)');
  });
});
