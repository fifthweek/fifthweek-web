describe('on change directive', function(){
  'use strict';

  var $rootScope;
  var $compile;
  var $q;

  var errorFacade;
  var analytics;

  beforeEach(function() {
    analytics = jasmine.createSpyObj('analytics', ['eventTrack']);
    errorFacade = {};

    module('webApp');
    module(function($provide){
      $provide.value('errorFacade', errorFacade);
      $provide.value('analytics', analytics);
    });

    inject(function($injector) {
      $rootScope = $injector.get('$rootScope');
      $compile = $injector.get('$compile');
      $q = $injector.get('$q');
    });
  });


  describe('when created', function(){

    it('should not call the bound event handler', function(){
      var scope = $rootScope.$new();
      scope.submit = function(){};
      spyOn(scope, 'submit');

      var element = angular.element('<input type="file" fw-on-change="submit()" value="default">');
      $compile(element)(scope);
      scope.$digest();

      expect(scope.submit).not.toHaveBeenCalled();
    });
  });

  describe('when value changed', function(){

    it('should call the bound event handler', function(){
      var scope = $rootScope.$new();
      scope.submit = function(){};
      spyOn(scope, 'submit');

      var element = angular.element('<input type="file" fw-on-change="submit()" value="default">');
      $compile(element)(scope);
      scope.$digest();

      expect(scope.submit).not.toHaveBeenCalled();

      element.change();

      expect(scope.submit).toHaveBeenCalled();
      expect(scope.submit.calls.count()).toBe(1);
    });
  });
});
