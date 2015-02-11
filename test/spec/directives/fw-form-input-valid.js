describe('form input valid directive', function(){
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

  it('should add the ng-if directive', function () {
    runDirective('<p fw-form-input-valid />');

    expect(element.attr('ng-if')).toBe('form.test.$valid && form.test.$touched');
  });
});
