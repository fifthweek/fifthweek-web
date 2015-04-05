describe('ng-focus directive', function(){
  'use strict';

  var element;

  beforeEach(module('ng-focus'));

  beforeEach(inject(function ($compile, $rootScope) {
        var $scope = $rootScope;

    element = $compile('<input focus=true />')($scope);
    $scope.$digest();
  }));

  it('should expect input focus to be true', function () {
    inject(function () {
        //check for true string rather than boolean
        //this is the only expected value of the focus attribute
        expect(element.attr('focus')).toBe('true');
    });
  });

});