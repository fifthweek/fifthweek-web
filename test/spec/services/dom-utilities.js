describe('DOM utilities', function(){
  'use strict';

  var scope;
  var $compile;
  var target;

  beforeEach(function() {
    module('webApp');
    inject(function (domUtilities, $injector) {
      scope = $injector.get('$rootScope').$new();
      $compile = $injector.get('$compile');
      target = domUtilities;
    });
  });

  describe('when finding ancestor element', function() {
    it('should no allow search depth greater than 10', function() {
      var root = angular.element('<div />');
      var parent = angular.element('<p />');
      var element = angular.element('<span />');

      parent.append(element);
      root.append(parent);

      var result = target.ancestor('NONE', element);

      expect(result).toBe(null);
    });

    it('should find parents', function() {
      var root = angular.element('<div />');
      var parent = angular.element('<p />');
      var element = angular.element('<span />');

      parent.append(element);
      root.append(parent);

      var result = target.ancestor('P', element);

      expect(result[0].outerHTML).toBe('<p><span></span></p>');
    });

    it('should find grand parents', function() {
      var root = angular.element('<div />');
      var parent = angular.element('<p />');
      var element = angular.element('<span />');

      parent.append(element);
      root.append(parent);

      var result = target.ancestor('DIV', element);

      expect(result[0].outerHTML).toBe('<div><p><span></span></p></div>');
    });
  });
});
