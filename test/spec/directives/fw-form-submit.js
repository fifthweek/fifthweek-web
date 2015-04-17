describe('submit form directive', function(){
  'use strict';

  var getFormHtml = function(attributes) {
    return '<form name="form"><button fw-form-submit="submit()" ' + attributes + '>default</button></form>';
  };

  var formHtml = getFormHtml();
  var $rootScope;
  var $compile;
  var $q;

  var wrapUserAction;

  beforeEach(function() {
    wrapUserAction = jasmine.createSpy('wrapUserAction');

    module('webApp');
    module(function($provide){
      $provide.value('wrapUserAction', wrapUserAction);
    });

    inject(function($injector) {
      $rootScope = $injector.get('$rootScope');
      $compile = $injector.get('$compile');
      $q = $injector.get('$q');
    });
  });

  describe('when created', function(){

    it('should setup the initial scope variables', function(){
      var scope = $rootScope.$new();
      scope.submit = function(){};
      spyOn(scope, 'submit');

      var element = angular.element(formHtml);
      $compile(element)(scope);
      scope.$digest();

      expect(scope.submit).not.toHaveBeenCalled();
      expect(scope.form.message).toBe('');
      expect(scope.form.isSubmitting).toBe(false);
      expect(scope.form.hasAttemptedSubmit).toBe(false);
      expect(scope.form.hasSubmitted).toBe(false);
      expect(scope.form.submissionSucceeded).toBe(false);
    });
  });

  describe('when click event is triggered', function(){

    var scope;
    var element;
    var deferred;

    beforeEach(function(){
      scope = $rootScope.$new();
      deferred = $q.defer();
      wrapUserAction.and.returnValue(deferred.promise);

      element = angular.element(formHtml);
      $compile(element)(scope);
      element = element.find('button');
      scope.$digest();
      scope.form.$valid = true;
      scope.form.$dirty = true;
    });

    it('should call the specified delegate', function(){
      scope.submit = jasmine.createSpy('submit');
      wrapUserAction.and.callFake(function(action) {
        action();
        return deferred.promise;
      });

      element.click();

      expect(wrapUserAction).toHaveBeenCalled();
      expect(scope.submit).toHaveBeenCalled();
    });

    it('should set the isSubmitting state to true during the submission', function(){
      expect(scope.form.isSubmitting).toBe(false);

      element.click();
      $rootScope.$apply();

      expect(scope.form.isSubmitting).toBe(true);

      deferred.resolve();
      $rootScope.$apply();

      expect(scope.form.isSubmitting).toBe(false);
    });

    it('should set the isSubmitting state to true during the submission and reset when an error occurs', function(){
      expect(scope.form.isSubmitting).toBe(false);

      element.click();
      $rootScope.$apply();

      expect(scope.form.isSubmitting).toBe(true);

      deferred.resolve('error message');
      $rootScope.$apply();

      expect(scope.form.isSubmitting).toBe(false);
    });

    it('should set the hasSubmitted state to true after the first successful submission', function(){
      expect(scope.form.hasSubmitted).toBe(false);

      element.click();
      $rootScope.$apply();

      expect(scope.form.hasSubmitted).toBe(false);

      deferred.resolve();
      $rootScope.$apply();

      expect(scope.form.hasSubmitted).toBe(true);
    });

    it('should set the hasSubmitted state to true after the first unsuccessful submission', function(){
      expect(scope.form.hasSubmitted).toBe(false);

      element.click();
      $rootScope.$apply();

      expect(scope.form.hasSubmitted).toBe(false);

      deferred.resolve('error message');
      $rootScope.$apply();

      expect(scope.form.hasSubmitted).toBe(true);
    });

    it('should set the submissionSucceeded state to true on first successful submission', function(){
      expect(scope.form.submissionSucceeded).toBe(false);

      element.click();
      $rootScope.$apply();

      expect(scope.form.submissionSucceeded).toBe(false);

      deferred.resolve();
      $rootScope.$apply();

      expect(scope.form.submissionSucceeded).toBe(true);
    });

    it('should set the submissionSucceeded state to false after the first unsuccessful submission', function(){
      expect(scope.form.submissionSucceeded).toBe(false);

      element.click();
      $rootScope.$apply();

      expect(scope.form.submissionSucceeded).toBe(false);

      deferred.resolve('error message');
      $rootScope.$apply();

      expect(scope.form.submissionSucceeded).toBe(false);
    });

    it('should set the message to empty after a successful submission', function(){
      expect(scope.form.message).toBe('');

      element.click();
      $rootScope.$apply();

      expect(scope.form.message).toBe('');

      deferred.resolve();
      $rootScope.$apply();

      expect(scope.form.message).toBe('');
    });

    it('should set the message to the error message after an unsuccessful submission', function(){
      expect(scope.form.message).toBe('');

      element.click();
      $rootScope.$apply();

      expect(scope.form.message).toBe('');

      deferred.resolve('error message');
      $rootScope.$apply();

      expect(scope.form.message).toBe('error message');
    });

    it('should set the disabled state during submission', function(){
      expect(element.hasClass('disabled')).toBe(false);
      expect(element.attr('disabled')).toBeUndefined();

      element.click();
      $rootScope.$apply();

      expect(element.hasClass('disabled')).toBe(true);
      expect(element.attr('disabled')).toBe('disabled');

      deferred.resolve();
      $rootScope.$apply();

      expect(element.hasClass('disabled')).toBe(false);
      expect(element.attr('disabled')).toBeUndefined();
    });

    it('should set the disabled state during submission and reset if submission fails', function(){
      expect(element.hasClass('disabled')).toBe(false);
      expect(element.attr('disabled')).toBeUndefined();

      element.click();
      $rootScope.$apply();

      expect(element.hasClass('disabled')).toBe(true);
      expect(element.attr('disabled')).toBe('disabled');

      deferred.resolve('error message');
      $rootScope.$apply();

      expect(element.hasClass('disabled')).toBe(false);
      expect(element.attr('disabled')).toBeUndefined();
    });

    it('should not set the loading text on the button during submission', function(){
      expect(element.html()).toBe('default');

      element.click();
      $rootScope.$apply();

      expect(element.html()).toBe('default');

      deferred.resolve();
      $rootScope.$apply();

      expect(element.html()).toBe('default');
    });

    describe('when first submission succeeds', function(){
      beforeEach(function(){
        scope.submit = function() {};
        wrapUserAction.and.returnValue($q.when());
        element.click();
        $rootScope.$apply();
        scope.form.$valid = true;
        scope.form.$dirty = true;
      });

      it('should keep the hasSubmitted as true', function(){
        var deferred = $q.defer();
        wrapUserAction.and.returnValue(deferred.promise);

        expect(scope.form.hasSubmitted).toBe(true);

        element.click();
        $rootScope.$apply();

        expect(scope.form.hasSubmitted).toBe(true);

        deferred.resolve();
        $rootScope.$apply();

        expect(scope.form.hasSubmitted).toBe(true);
      });

      it('should reset the submissionSucceeded state to false during the next submission', function(){
        var deferred = $q.defer();
        wrapUserAction.and.returnValue(deferred.promise);

        expect(scope.form.submissionSucceeded).toBe(true);

        element.click();
        $rootScope.$apply();

        expect(scope.form.submissionSucceeded).toBe(false);

        deferred.resolve();
        $rootScope.$apply();

        expect(scope.form.submissionSucceeded).toBe(true);
      });

      it('should set the submissionSucceeded state to false if the next submission fails', function(){
        var deferred = $q.defer();
        wrapUserAction.and.returnValue(deferred.promise);

        expect(scope.form.submissionSucceeded).toBe(true);

        element.click();
        $rootScope.$apply();

        expect(scope.form.submissionSucceeded).toBe(false);

        deferred.resolve('error message');
        $rootScope.$apply();

        expect(scope.form.submissionSucceeded).toBe(false);
      });

      it('should set the message to the error message on next unsuccessful submission', function(){
        var deferred = $q.defer();
        wrapUserAction.and.returnValue(deferred.promise);

        expect(scope.form.message).toBe('');

        element.click();
        $rootScope.$apply();

        expect(scope.form.message).toBe('');

        deferred.resolve('error message');
        $rootScope.$apply();

        expect(scope.form.message).toBe('error message');
      });
    });

    describe('when first submission fails', function(){
      beforeEach(function(){
        var deferred = $q.defer();
        wrapUserAction.and.returnValue(deferred.promise);
        deferred.resolve('error message');

        element.click();
        $rootScope.$apply();
        scope.form.$valid = true;
        scope.form.$dirty = true;
      });

      it('should keep the hasSubmitted as true on subsequent unsuccessful submissions', function(){
        var deferred = $q.defer();
        wrapUserAction.and.returnValue(deferred.promise);

        expect(scope.form.hasSubmitted).toBe(true);

        element.click();
        $rootScope.$apply();

        expect(scope.form.hasSubmitted).toBe(true);

        deferred.resolve('error message');
        $rootScope.$apply();

        expect(scope.form.hasSubmitted).toBe(true);
      });

      it('should set the submissionSucceeded state to true on next successful submission', function(){
        var deferred = $q.defer();
        wrapUserAction.and.returnValue(deferred.promise);

        expect(scope.form.submissionSucceeded).toBe(false);

        element.click();
        $rootScope.$apply();

        expect(scope.form.submissionSucceeded).toBe(false);

        deferred.resolve();
        $rootScope.$apply();

        expect(scope.form.submissionSucceeded).toBe(true);
      });

      it('should reset the message on a subsequent submission after an unsuccessful submission', function(){
        var deferred = $q.defer();
        wrapUserAction.and.returnValue(deferred.promise);

        expect(scope.form.message).toBe('error message');

        element.click();
        $rootScope.$apply();

        expect(scope.form.message).toBe('');

        deferred.resolve();
        $rootScope.$apply();

        expect(scope.form.message).toBe('');
      });
    });
  });

  describe('when click event is triggered with ngDisabled attribute', function() {

    var scope;
    var element;
    var deferred;

    beforeEach(function () {
      scope = $rootScope.$new();
      deferred = $q.defer();
      wrapUserAction.and.returnValue(deferred.promise);

      element = angular.element(getFormHtml('ng-disabled="something"'));
      $compile(element)(scope);
      element = element.find('button');
      scope.$digest();
      scope.form.$valid = true;
      scope.form.$dirty = true;
    });

    it('should not disable the button during submission', function(){
      expect(element.hasClass('disabled')).toBe(false);
      expect(element.attr('disabled')).toBeUndefined();

      element.click();
      $rootScope.$apply();

      expect(element.hasClass('disabled')).toBe(false);
      expect(element.attr('disabled')).toBeUndefined();

      deferred.resolve();
      $rootScope.$apply();

      expect(element.hasClass('disabled')).toBe(false);
      expect(element.attr('disabled')).toBeUndefined();
    });
  });

  describe('when click event is triggered with data-loading-text attribute', function() {

    var scope;
    var element;
    var deferred;

    beforeEach(function () {
      scope = $rootScope.$new();
      deferred = $q.defer();
      wrapUserAction.and.returnValue(deferred.promise);

      element = angular.element(getFormHtml('data-loading-text="loading"'));
      $compile(element)(scope);
      element = element.find('button');
      scope.$digest();
      scope.form.$valid = true;
      scope.form.$dirty = true;
    });

    it('should set the loading text on the button during submission', function(){
      expect(element.html()).toBe('default');

      element.click();
      $rootScope.$apply();

      expect(element.html()).toBe('loading');

      deferred.resolve();
      $rootScope.$apply();

      expect(element.html()).toBe('default');
    });
  });

  describe('when click event is triggered with tracking information', function() {

    var scope;
    var element;
    var deferred;

    beforeEach(function () {
      scope = $rootScope.$new();
      scope.submit = function() { };
      deferred = $q.defer();
      wrapUserAction.and.returnValue(deferred.promise);

      element = angular.element(getFormHtml('data-event-title="title" data-event-category="category"'));
      $compile(element)(scope);
      element = element.find('button');
      scope.$digest();
      scope.form.$valid = true;
      scope.form.$dirty = true;
    });

    it('should forward this information to the user action wrapper', function(){
      deferred.resolve();
      element.click();
      $rootScope.$apply();

      expect(wrapUserAction).toHaveBeenCalledWith(jasmine.any(Function), {
        eventTitle: 'title',
        eventCategory: 'category'
      });
    });
  });

  describe('when click event is triggered with error-message attribute', function() {

    var scope;
    var element;
    var deferred;

    beforeEach(function () {
      scope = $rootScope.$new();
      scope.submit = function() { };
      scope.model = {};
      deferred = $q.defer();
      wrapUserAction.and.returnValue(deferred.promise);

      element = angular.element(getFormHtml('error-message="model.clickErrorMessage"'));
      $compile(element)(scope);
      element = element.find('button');
      scope.$digest();
      scope.form.$valid = true;
      scope.form.$dirty = true;
    });

    it('should set the message to the error message after an unsuccessful submission', function(){
      expect(scope.form.message).toBe('');
      expect(scope.model.clickErrorMessage).toBeUndefined();

      element.click();
      $rootScope.$apply();

      expect(scope.form.message).toBe('');
      expect(scope.model.clickErrorMessage).toBe('');

      deferred.resolve('error message');
      $rootScope.$apply();

      expect(scope.form.message).toBe('error message');
      expect(scope.model.clickErrorMessage).toBe('error message');
    });
  });

  describe('when click event is triggered without can-submit attribute', function() {

    var scope;
    var element;
    var deferred;

    beforeEach(function () {
      scope = $rootScope.$new();
      deferred = $q.defer();
      wrapUserAction.and.returnValue(deferred.promise);

      element = angular.element(formHtml);
      $compile(element)(scope);
      element = element.find('button');
      scope.$digest();
    });

    it('should not perform the submission if invalid', function(){
      scope.form.$valid = false;
      scope.form.$dirty = true;
      deferred.resolve();
      element.click();
      $rootScope.$apply();

      expect(scope.form.hasSubmitted).toBe(false);
    });

    it('should not perform the submission if pristine', function(){
      scope.form.$valid = true;
      scope.form.$dirty = false;
      deferred.resolve();
      element.click();
      $rootScope.$apply();

      expect(scope.form.hasSubmitted).toBe(false);
    });

    it('should perform the submission if valid and dirty ;)', function(){
      scope.form.$valid = true;
      scope.form.$dirty = true;
      deferred.resolve();
      element.click();
      $rootScope.$apply();

      expect(scope.form.hasSubmitted).toBe(true);
    });
  });

  describe('when click event is triggered with can-submit attribute', function() {

    var scope;
    var element;
    var deferred;

    beforeEach(function () {
      scope = $rootScope.$new();
      deferred = $q.defer();
      wrapUserAction.and.returnValue(deferred.promise);

      element = angular.element(getFormHtml('can-submit="canSubmit()"'));
      $compile(element)(scope);
      element = element.find('button');
      scope.$digest();
    });

    it('should not perform the submission if canSubmit returns false', function(){
      scope.canSubmit = function(){ return false; };
      deferred.resolve();
      element.click();
      $rootScope.$apply();

      expect(scope.form.hasSubmitted).toBe(false);
    });

    it('should set hasAttemptedSubmit to true when canSubmit returns false', function(){
      scope.canSubmit = function(){ return false; };
      deferred.resolve();
      element.click();
      $rootScope.$apply();

      expect(scope.form.hasAttemptedSubmit).toBe(true);
    });

    it('should perform the submission if canSubmit returns true', function(){
      scope.canSubmit = function(){ return true; };
      deferred.resolve();
      element.click();
      $rootScope.$apply();

      expect(scope.form.hasSubmitted).toBe(true);
    });

    it('should set hasAttemptedSubmit to true when canSubmit returns false', function(){
      scope.canSubmit = function(){ return true; };
      deferred.resolve();
      element.click();
      $rootScope.$apply();

      expect(scope.form.hasAttemptedSubmit).toBe(true);
    });
  });
});
