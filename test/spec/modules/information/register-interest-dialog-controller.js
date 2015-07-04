describe('register-interest-dialog-controller', function () {
  'use strict';

  var $controller;
  var $q;
  var $scope;
  var target;

  var identifiedUserNotifierConstants;
  var analyticsEventConstants;
  var membershipStub;
  var attributes;

  beforeEach(function() {
    membershipStub = jasmine.createSpyObj('membershipStub', ['postRegisteredInterest']);
    attributes = {
      mode: 'register',
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
      analyticsEventConstants = $injector.get('analyticsEventConstants');
    });

    $scope.$close = function(){};
  });

  var initializeTarget = function() {
    target = $controller('registerInterestDialogCtrl', { $scope: $scope });
    $scope.$apply();
  };

  describe('when validating modes', function() {
    it('should not allow no mode to be specified', function() {
      delete attributes.mode;
      expect(function() {
        initializeTarget();
      }).toThrowError(FifthweekError);
    });

    it('should not allow invalid modes to be specified', function() {
      attributes.mode = 'invalid';
      expect(function() {
        initializeTarget();
      }).toThrowError(FifthweekError);
    });

    it('should allow valid modes to be specified', function() {
      attributes.mode = 'register';
      initializeTarget();
    });

    it('should allow valid modes to be specified', function() {
      attributes.mode = 'pricing';
      initializeTarget();
    });
  });

  describe('when setting tracking events', function() {

    it('should set registration events', function () {
      attributes.mode = 'register';
      initializeTarget();
      expect($scope.model.trackingEventTitle).toBe('Faux Registered');
      expect($scope.model.trackingEventCategory).toBe('Interest Registration');
    });

    it('should set registration events', function () {
      attributes.mode = 'pricing';
      initializeTarget();
      expect($scope.model.trackingEventTitle).toBe('Pricing Requested');
      expect($scope.model.trackingEventCategory).toBe('Interest Registration');
    });
  });

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

