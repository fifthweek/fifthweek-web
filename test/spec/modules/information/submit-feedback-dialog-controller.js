describe('submit-feedback-dialog-controller', function () {
  'use strict';

  var $controller;
  var $q;
  var $scope;
  var target;

  var identifiedUserNotifierConstants;
  var membershipStub;
  var attributes;

  beforeEach(function() {
    membershipStub = jasmine.createSpyObj('membershipStub', ['postFeedback']);
    attributes = {
      title: 'title1',
      buttonText: 'buttonText1'
    };

    module('webApp');
    module(function($provide) {
      $provide.value('membershipStub', membershipStub);
      $provide.value('attributes', attributes);
    });

    inject(function ($injector) {
      $q = $injector.get('$q');
      $scope = $injector.get('$rootScope').$new();
      $controller = $injector.get('$controller');
      identifiedUserNotifierConstants = $injector.get('identifiedUserNotifierConstants');
    });

    $scope.$close = function(){};
  });

  var initializeTarget = function() {
    target = $controller('submitFeedbackDialogCtrl', { $scope: $scope });
    $scope.$apply();
  };

  describe('when creating', function(){
    beforeEach(function(){
      initializeTarget();
    });

    it('should set the page to register', function() {
      expect($scope.model.page).toBe($scope.pages.form);
    });

    it('should set the title', function() {
      expect($scope.model.title).toBe(attributes.title);
    });

    it('should set the button text', function() {
      expect($scope.model.buttonText).toBe(attributes.buttonText);
    });

    it('should set the inputs to blank', function() {
      expect($scope.model.input.message).toBe('');
      expect($scope.model.input.email).toBe('');
    });
  });

  describe('when created', function(){
    beforeEach(function(){
      initializeTarget();
    });

    describe('when calling submitFeedback', function(){
      var deferredPostFeedback;
      var error;
      var complete;

      beforeEach(function(){
        error = undefined;
        complete = undefined;
        deferredPostFeedback = $q.defer();

        membershipStub.postFeedback.and.returnValue(deferredPostFeedback.promise);
        $scope.model.input = 'input';

        $scope.submitFeedback().then(function(){ complete = true; }, function(e){ error = e; });
        $scope.$apply();
      });

      it('should call postFeedback', function(){
        expect(membershipStub.postFeedback).toHaveBeenCalledWith('input');
      });

      describe('when postFeedback succeeds', function(){
        beforeEach(function(){
          spyOn($scope, '$emit');
        });

        describe('when email is specified', function(){
          beforeEach(function(){
            $scope.model.input = { email: 'email', message: 'message' };
            deferredPostFeedback.resolve();
            $scope.$apply();
          });

          it('should emit the identified user event', function(){
            expect($scope.$emit).toHaveBeenCalledWith(identifiedUserNotifierConstants.eventName, { email: 'email' });
          });

          it('should set the page to done', function(){
            expect($scope.model.page).toBe($scope.pages.done);
          });

          it('should complete the call', function(){
            expect(complete).toBe(true);
          });
        });

        describe('when email is not specified', function(){
          beforeEach(function(){
            deferredPostFeedback.resolve();
            $scope.$apply();
          });

          it('should not emit the identified user event', function(){
            expect($scope.$emit).not.toHaveBeenCalled();
          });

          it('should set the page to done', function(){
            expect($scope.model.page).toBe($scope.pages.done);
          });

          it('should complete the call', function(){
            expect(complete).toBe(true);
          });
        });
      });

      describe('when postFeedback fails', function(){
        beforeEach(function(){
          deferredPostFeedback.reject('error');
          $scope.$apply();
        });

        it('should propagate the error', function(){
          expect(error).toBe('error');
        });
      });
    });
  });
});

