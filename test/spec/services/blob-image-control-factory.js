describe('error facade', function() {
  'use strict';

  var $rootScope;
  var $q;
  var target;

  beforeEach(function() {
    module('webApp');

    inject(function($injector) {
      $rootScope = $injector.get('$rootScope');
      $q = $injector.get('$q');
      target = $injector.get('blobImageControlFactory');
    });
  });

  describe('when created', function(){

    var control;

    beforeEach(function(){
      control = target.createControl();
    });

    it('should return an unresolved promise from update if initialize has not been called', function(){
      var completed = false;
      control.update().then(function(){completed = true;});

      $rootScope.$apply();

      expect(completed).toBe(false);
    });

    it('should resolve the promise once initialize has been called', function(){
      var completed = false;
      control.update().then(function(){completed = true;});
      $rootScope.$apply();

      control.initialize(function(){});
      $rootScope.$apply();

      expect(completed).toBe(true);
    });

    it('should resolve the promise immediately if initialize has already been called', function(){

      control.initialize(function(){});

      var completed = false;
      control.update().then(function(){completed = true;});
      $rootScope.$apply();

      expect(completed).toBe(true);
    });

    it('should not call the update handler if update has not been called', function(){

      var updateHandler = jasmine.createSpy('updateHandler');

      control.initialize(updateHandler);
      $rootScope.$apply();

      expect(updateHandler).not.toHaveBeenCalled();
    });

    it('should call the update handler once update has been called', function(){

      var updateHandler = jasmine.createSpy('updateHandler');

      control.initialize(updateHandler);
      $rootScope.$apply();

      control.update('a', 'b', 'c', 'd');
      $rootScope.$apply();

      expect(updateHandler).toHaveBeenCalledWith('a', 'b', 'c', 'd');
    });

    it('should call the update handler immediately if update has already been called before initializing', function(){

      control.update('a', 'b', 'c', 'd');
      $rootScope.$apply();

      var updateHandler = jasmine.createSpy('updateHandler');

      control.initialize(updateHandler);
      $rootScope.$apply();

      expect(updateHandler).toHaveBeenCalledWith('a', 'b', 'c', 'd');
    });

    it('should call the update handler every time update is called', function(){

      control.update('a', 'b', 'c', 'd');
      $rootScope.$apply();

      var updateHandler = jasmine.createSpy('updateHandler');

      control.initialize(updateHandler);
      $rootScope.$apply();

      expect(updateHandler).toHaveBeenCalledWith('a', 'b', 'c', 'd');

      control.update('d', 'e', 'f', 'g');
      $rootScope.$apply();

      expect(updateHandler).toHaveBeenCalledWith('d', 'e', 'f', 'g');

      control.update('g', 'h', 'i', 'j');
      $rootScope.$apply();

      expect(updateHandler).toHaveBeenCalledWith('g', 'h', 'i', 'j');
    });
  });
});
