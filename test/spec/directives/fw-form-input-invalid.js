describe('form input invalid directive', function(){
  'use strict';

  var inputName = 'test';
  var domUtilities;
  var element;

  beforeEach(function() {
    domUtilities = jasmine.createSpyObj('domUtilities', [ 'closest' ]);
    domUtilities.closest.and.returnValue({
      attr: function() {
        return inputName;
      }
    });

    module('webApp');
    module(function($provide) {
      $provide.value('domUtilities', domUtilities);
    });
  });

  var runDirective = function(elementHtml) {
    inject(function ($compile, $rootScope) {
      var $scope = $rootScope;
      element = $compile(elementHtml)($scope);
      $scope.$digest();
    });
  };

  it('should allow no rule to be specified', function () {
    runDirective('<p fw-form-input-invalid />');

    expect(element.attr('ng-if')).toBe('form.test.$invalid && ((form.test.$touched && form.test.$dirty) || form.$submitted)');
  });

  it('should allow a rule to be specified', function () {
    runDirective('<p fw-form-input-invalid="theRule" />');

    expect(element.attr('ng-if')).toBe('form.test.$error.theRule && ((form.test.$touched && form.test.$dirty) || form.$submitted)');
  });
});
