describe('json-service', function(){
  'use strict';

  var $rootScope;
  var $q;
  var target;


  beforeEach(function() {
    module('webApp');

    inject(function($injector) {
      $rootScope = $injector.get('$rootScope');
      $q = $injector.get('$q');
      target = $injector.get('jsonService');
    });
  });

  describe('when toJson is called', function(){
    it('should convert falsy value to empty string', function(){
      var result = target.toJson(undefined);
      expect(result).toEqual('');
    });

    it('should serialize object', function(){
      var result = target.toJson({a:1, b: 'two', c: [{hello: 'world'}]});
      expect(result).toBe('{"a":1,"b":"two","c":[{"hello":"world"}]}');
    });

    it('should serialize array', function(){
      var result = target.toJson([{a:1},{b:2}]);
      expect(result).toBe('[{"a":1},{"b":2}]');
    });
  });

  describe('when fromJson is called', function(){
    it('should deserialize empty string as undefined', function(){
      var result = target.fromJson('');
      expect(result).toBeUndefined();
    });

    it('should deserialize object', function(){
      var result = target.fromJson('{"a":1,"b":"two","c":[{"hello":"world"}]}');
      expect(result).toEqual({a:1, b: 'two', c: [{hello: 'world'}]});
    });

    it('should deserialize array', function(){
      var result = target.fromJson('[{"a":1},{"b":2}]');
      expect(result).toEqual([{a:1},{b:2}]);
    });
  });

  describe('when toSirTrevor is called', function(){
    it('should return sirTrevor content', function(){
      var result = target.toSirTrevor({a: 1}, 'files');
      expect(result).toEqual({
        serializedBlocks: '{"a":1}',
        files: 'files'
      });
    });
  });
});
