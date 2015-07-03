describe('register-interest-dialog-controller', function () {
  'use strict';

  var $controller;
  var $q;
  var $scope;
  var target;

  var identifiedUserNotifierConstants;
  var membershipStub;
  var title;
  var message;
  var buttonText;

  beforeEach(function() {
    membershipStub = jasmine.createSpyObj('membershipStub', ['postRegisteredInterest']);
    title = 'title1';
    message = 'message1';
    buttonText = 'buttonText1';

    module('webApp');
    module(function($provide) {
      $provide.value('membershipStub', membershipStub);
      $provide.value('title', title);
      $provide.value('message', message);
      $provide.value('buttonText', buttonText);
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
    target = $controller('registerInterestDialogCtrl', { $scope: $scope });
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
      expect($scope.model.title).toBe(title);
    });

    it('should set the message', function() {
      expect($scope.model.message).toBe(message);
    });

    it('should set the button text', function() {
      expect($scope.model.buttonText).toBe(buttonText);
    });

    it('should set the inputs to blank', function() {
      expect($scope.model.input.name).toBe('');
      expect($scope.model.input.email).toBe('');
    });
  });

  describe('when created', function(){
    beforeEach(function(){
      initializeTarget();
    });

    describe('when calling registerInterest', function(){
      var deferredPostRegisteredInterest;
      var error;
      var complete;

      beforeEach(function(){
        error = undefined;
        complete = undefined;
        deferredPostRegisteredInterest = $q.defer();

        membershipStub.postRegisteredInterest.and.returnValue(deferredPostRegisteredInterest.promise);
        $scope.model.input = 'input';

        $scope.registerInterest().then(function(){ complete = true; }, function(e){ error = e; });
        $scope.$apply();
      });

      it('should call postRegisteredInterest', function(){
        expect(membershipStub.postRegisteredInterest).toHaveBeenCalledWith('input');
      });

      describe('when postRegisteredInterest succeeds', function(){
        beforeEach(function(){
          spyOn($scope, '$emit');
          deferredPostRegisteredInterest.resolve();
          $scope.$apply();
        });

        it('should emit the identified user event', function(){
          expect($scope.$emit).toHaveBeenCalledWith(identifiedUserNotifierConstants.eventName, 'input');
        });

        it('should set the page to done', function(){
          expect($scope.model.page).toBe($scope.pages.done);
        });

        it('should complete the call', function(){
          expect(complete).toBe(true);
        });
      });

      describe('when postRegisteredInterest fails', function(){
        beforeEach(function(){
          deferredPostRegisteredInterest.reject('error');
          $scope.$apply();
        });

        it('should propagate the error', function(){
          expect(error).toBe('error');
        });
      });
    });
  });
});

