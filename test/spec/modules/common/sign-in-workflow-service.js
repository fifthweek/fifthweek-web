describe('sign-in-workflow-service', function(){
  'use strict';

  var $rootScope;
  var $q;
  var target;

  var $modal;

  beforeEach(function() {
    $modal = jasmine.createSpyObj('$modal', ['open']);

    module('webApp');

    module(function($provide) {
      $provide.value('$modal', $modal);
    });

    inject(function($injector) {
      $rootScope = $injector.get('$rootScope');
      $q = $injector.get('$q');
      target = $injector.get('signInWorkflowService');
    });
  });

  describe('when handleDialogError is called', function(){

    it('should propagate Error derived objects', function(){
      var error;
      target.internal.handleDialogError(new FifthweekError('error')).catch(function(e){ error = e; });
      $rootScope.$apply();

      expect(error).toBeDefined();
      expect(error instanceof FifthweekError).toBe(true);
      expect(error.message).toBe('error');
    });

    it('should absorb non Error derived objects', function(){
      var error;
      target.internal.handleDialogError('error').catch(function(e){ error = e; });
      $rootScope.$apply();

      expect(error).toBeUndefined();
    });
  });

  describe('when beginSignInWorkflow is called', function(){
    var deferredResult;
    var error;
    var result;
    beforeEach(function(){
      deferredResult = $q.defer();
      $modal.open.and.returnValue({ result: deferredResult.promise });
      spyOn(target.internal, 'handleDialogError').and.returnValue($q.reject('handledError'));
      target.beginSignInWorkflow().then(function(r){ result = r; }, function(e){ error = e; });
      $rootScope.$apply();
    });

    it('should call $modal.open', function(){
      expect($modal.open).toHaveBeenCalledWith({
        controller: 'signInWorkflowDialogCtrl',
        templateUrl: 'modules/landing-page/sign-in-workflow-dialog.html',
        size: 'sm'
      });
    });

    describe('when modal succeeds', function(){
      beforeEach(function(){
        deferredResult.resolve($q.when('result'));
        $rootScope.$apply();
      });

      it('should propagate the result', function(){
        expect(result).toBe('result');
      });
    });

    describe('when modal fails', function(){
      beforeEach(function(){
        deferredResult.reject('error');
        $rootScope.$apply();
      });

      it('should call handleDialogError', function(){
        expect(target.internal.handleDialogError).toHaveBeenCalledWith('error');
      });

      it('should propagate the error', function(){
        expect(error).toBe('handledError');
      });
    });
  });
});
