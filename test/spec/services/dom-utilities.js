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

  describe('when finding closest element', function() {
    it('should no allow search depth greater than 10', function() {
      var body = angular.element('<p><span /><input /></p>');
      var element = body.find('span');

      expect(function() {
        target.closest('input', element, 11);
      })
      .toThrowError(FifthweekError);
    });

    it('should find siblings', function() {
      var root = angular.element('<p />');
      var parent = angular.element('<p />');
      var element = angular.element('<span />');
      var sibling = angular.element('<input />');

      parent.append(element);
      parent.append(sibling);
      root.append(parent);

      var result = target.closest('input', element);

      expect(result[0].outerHTML).toBe('<input>');
    });

    it('should find uncles', function() {
      var root = angular.element('<p />');
      var parent = angular.element('<p />');
      var element = angular.element('<span />');
      var uncle = angular.element('<div />');

      parent.append(element);
      root.append(parent);
      root.append(uncle);

      var result = target.closest('div', element);

      expect(result[0].outerHTML).toBe('<div></div>');
    });

    it('should find cousins', function() {
      var root = angular.element('<p />');
      var parent = angular.element('<p />');
      var element = angular.element('<span />');
      var uncle = angular.element('<p />');
      var cousin = angular.element('<img />');

      parent.append(element);
      uncle.append(cousin);
      root.append(parent);
      root.append(uncle);

      var result = target.closest('img', element);

      expect(result[0].outerHTML).toBe('<img>');
    });

    it('should find nephews', function() {
      var root = angular.element('<p />');
      var parent = angular.element('<p />');
      var element = angular.element('<span />');
      var sibling = angular.element('<p />');
      var nephew = angular.element('<br />');

      parent.append(element);
      parent.append(sibling);
      sibling.append(nephew);
      root.append(parent);

      var result = target.closest('br', element);

      expect(result[0].outerHTML).toBe('<br>');
    });
  });
});
