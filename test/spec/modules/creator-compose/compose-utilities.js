describe('compose utilities', function(){
  'use strict';

  var queueId = 'queueId';

  var $q;
  var $rootScope;
  var queueStub;
  var errorFacade;
  var target;

  beforeEach(function() {
    module('webApp');

    queueStub = jasmine.createSpyObj('queueStub', ['getLiveDateOfNewQueuedPost']);
    errorFacade = jasmine.createSpyObj('errorFacade', ['handleError']);

    module(function($provide) {
      $provide.value('queueStub', queueStub);
      $provide.value('errorFacade', errorFacade);
    });

    inject(function($injector) {
      $q = $injector.get('$q');
      $rootScope = $injector.get('$rootScope');
      target = $injector.get('composeUtilities');
    });

    errorFacade.handleError.and.callFake(function(error, setMessage) {
      setMessage('friendlyError');
      return $q.when();
    });
  });

  describe('when calling updateEstimatedLiveDate', function(){

    var model;

    beforeEach(function(){
      model = {
        queuedLiveDate: 'something',
        input: {}
      };
    });

    describe('when selectedQueue is undefined', function(){
      beforeEach(function(){
        target.updateEstimatedLiveDate(model);
        $rootScope.$apply();
      });

      it('should not call getLiveDateOfNewQueuedPost', function(){
        expect(queueStub.getLiveDateOfNewQueuedPost).not.toHaveBeenCalled();
      });

      it('should set queuedLiveDate to undefined', function(){
        expect(model.queuedLiveDate).toBeUndefined();
      });
    });

    describe('when the selected queue is specified', function(){
      beforeEach(function(){
        queueStub.getLiveDateOfNewQueuedPost.and.returnValue($q.when({ data:'2015-06-01T12:00:00Z' }));
        model.input.selectedQueue  = { queueId: queueId };
        target.updateEstimatedLiveDate(model);
        $rootScope.$apply();
      });

      it('should call getLiveDateOfNewQueuedPost', function(){
        expect(queueStub.getLiveDateOfNewQueuedPost).toHaveBeenCalledWith(queueId);
      });

      it('should update queuedLiveDate', function(){
        expect(model.queuedLiveDate).toEqual(new Date('2015-06-01T12:00:00Z'));
      });
    });

    describe('when getLiveDateOfNewQueuedPost fails', function(){
      beforeEach(function(){
        model.input.selectedQueue  = { queueId: queueId };
        queueStub.getLiveDateOfNewQueuedPost.and.returnValue($q.reject('error'));
        target.updateEstimatedLiveDate(model);
        $rootScope.$apply();
      });

      it('should display a friendly error message', function(){
        expect(model.errorMessage).toBe('friendlyError');
      });

      it('should set queuedLiveDate to undefined', function(){
        expect(model.queuedLiveDate).toBeUndefined();
      });
    });
  });
});
