describe('submit-feedback-service', function(){
  'use strict';

  var $rootScope;
  var $q;
  var target;

  var $modal;

  beforeEach(function() {
    module('webApp');

    $modal = jasmine.createSpyObj('$modal', ['open']);

    module(function($provide) {
      $provide.value('$modal', $modal);
    });

    inject(function($injector) {
      $rootScope = $injector.get('$rootScope');
      $q = $injector.get('$q');
      target = $injector.get('submitFeedbackService');
    });
  });

  describe('when submitFeedback is called', function(){
    beforeEach(function(){
      $modal.open.and.returnValue({ result: 'result' });
      target.showDialog();
      $rootScope.$apply();
    });

    it('should open the dialog', function(){
      expect($modal.open).toHaveBeenCalled();
    });

    it('should specify the controller', function(){
      expect($modal.open.calls.first().args[0].controller).toBe('submitFeedbackDialogCtrl');
    });

    it('should specify the template', function(){
      expect($modal.open.calls.first().args[0].templateUrl).toBe('modules/feedback/submit-feedback-dialog.html');
    });

    it('should specify the size', function(){
      expect($modal.open.calls.first().args[0].size).toBe('md');
    });
  });
});
