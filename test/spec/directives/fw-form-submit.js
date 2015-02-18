describe('submit form directive', function(){
  'use strict';

  var getFormHtml = function(attributes) {
    return '<form name="form"><button form-name="form" fw-form-submit="submit()" ' + attributes + '>default</button></form>';
  };

  var formHtml = getFormHtml();
  var $rootScope;
  var $compile;
  var $q;

  var errorFacade;
  var analytics;

  beforeEach(function() {
    analytics = jasmine.createSpyObj('analytics', ['eventTrack']);
    errorFacade = {};

    module('webApp');
    module(function($provide){
      $provide.value('errorFacade', errorFacade);
      $provide.value('analytics', analytics);
    });

    inject(function($injector) {
      $rootScope = $injector.get('$rootScope');
      $compile = $injector.get('$compile');
      $q = $injector.get('$q');
    });

    errorFacade.handleError = function(error, setMessage) {
      setMessage('friendly error message');
      return $q.when();
    };
    spyOn(errorFacade, 'handleError').and.callThrough();
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
      expect(scope.form.hasSubmitted).toBe(false);
      expect(scope.form.submissionSucceeded).toBe(false);
    });

    it('bind message to setMessage on parent if present', function(){
      var scope = $rootScope.$new();
      scope.submit = function(){};
      spyOn(scope, 'submit');

      var element = angular.element(formHtml);
      $compile(element)(scope);
      scope.$digest();

      expect(scope.form.message).toBe('');
    });
  });

  describe('when click event is triggered', function(){

    var scope;
    var element;
    var deferred;

    beforeEach(function(){
      scope = $rootScope.$new();
      deferred = $q.defer();
      scope.submit = function() { return deferred.promise; };

      element = angular.element(formHtml);
      $compile(element)(scope);
      element = element.find('button');
      scope.$digest();
      scope.form.$pristine = false;
    });

    it('should call the specified delegate', function(){
      scope.submit = function() {};
      spyOn(scope, 'submit').and.callThrough();
      element.click();
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

      deferred.reject('error');
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

      deferred.reject('error');
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

      deferred.reject('error');
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

    it('should set the message to the friendly error message after an unsuccessful submission', function(){
      expect(scope.form.message).toBe('');

      element.click();
      $rootScope.$apply();

      expect(scope.form.message).toBe('');

      deferred.reject('error');
      $rootScope.$apply();

      expect(scope.form.message).toBe('friendly error message');
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

      deferred.reject('error');
      $rootScope.$apply();

      expect(element.hasClass('disabled')).toBe(false);
      expect(element.attr('disabled')).toBeUndefined();
    });

    it('should not report error if submission succeeds', function(){
      deferred.resolve();
      element.click();
      $rootScope.$apply();

      expect(errorFacade.handleError).not.toHaveBeenCalled();
    });

    it('should report the error if submission fails', function(){
      deferred.reject('error');
      element.click();
      $rootScope.$apply();

      expect(errorFacade.handleError).toHaveBeenCalledWith('error', jasmine.any(Function));
    });

    it('should not call the analytics service during successful submission', function(){
      deferred.resolve();
      element.click();
      $rootScope.$apply();

      expect(analytics.eventTrack).not.toHaveBeenCalled();
    });

    it('should call the analytics service during unsuccessful submission', function(){
      deferred.reject('error');
      element.click();
      $rootScope.$apply();

      expect(analytics.eventTrack).not.toHaveBeenCalled();
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
        element.click();
        $rootScope.$apply();
        scope.form.$pristine = false;
      });

      it('should keep the hasSubmitted as true', function(){
        var deferred = $q.defer();
        scope.submit = function() { return deferred.promise; };

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
        scope.submit = function() { return deferred.promise; };

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
        scope.submit = function() { return deferred.promise; };

        expect(scope.form.submissionSucceeded).toBe(true);

        element.click();
        $rootScope.$apply();

        expect(scope.form.submissionSucceeded).toBe(false);

        deferred.reject('error');
        $rootScope.$apply();

        expect(scope.form.submissionSucceeded).toBe(false);
      });

      it('should set the message to the friendly error message on next unsuccessful submission', function(){
        var deferred = $q.defer();
        scope.submit = function() { return deferred.promise; };

        expect(scope.form.message).toBe('');

        element.click();
        $rootScope.$apply();

        expect(scope.form.message).toBe('');

        deferred.reject('error');
        $rootScope.$apply();

        expect(scope.form.message).toBe('friendly error message');
      });
    });

    describe('when first submission fails', function(){
      beforeEach(function(){
        var deferred = $q.defer();
        scope.submit = function() { return deferred.promise; };
        deferred.reject('error');

        element.click();
        $rootScope.$apply();
        scope.form.$pristine = false;
      });

      it('should keep the hasSubmitted as true on subsequent unsuccessful submissions', function(){
        var deferred = $q.defer();
        scope.submit = function() { return deferred.promise; };

        expect(scope.form.hasSubmitted).toBe(true);

        element.click();
        $rootScope.$apply();

        expect(scope.form.hasSubmitted).toBe(true);

        deferred.reject('error');
        $rootScope.$apply();

        expect(scope.form.hasSubmitted).toBe(true);
      });

      it('should set the submissionSucceeded state to true on next successful submission', function(){
        var deferred = $q.defer();
        scope.submit = function() { return deferred.promise; };

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
        scope.submit = function() { return deferred.promise; };

        expect(scope.form.message).toBe('friendly error message');

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
      scope.submit = function() { return deferred.promise; };

      element = angular.element(getFormHtml('ng-disabled="something"'));
      $compile(element)(scope);
      element = element.find('button');
      scope.$digest();
      scope.form.$pristine = false;
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
      scope.submit = function() { return deferred.promise; };

      element = angular.element(getFormHtml('data-loading-text="loading"'));
      $compile(element)(scope);
      element = element.find('button');
      scope.$digest();
      scope.form.$pristine = false;
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

  describe('when click event is triggered with data-event-title attribute', function() {

    var scope;
    var element;
    var deferred;

    beforeEach(function () {
      scope = $rootScope.$new();
      deferred = $q.defer();
      scope.submit = function() { return deferred.promise; };

      element = angular.element(getFormHtml('data-event-title="title"'));
      $compile(element)(scope);
      element = element.find('button');
      scope.$digest();
      scope.form.$pristine = false;
    });

    it('should not call the analytics service during successful submission', function(){
      deferred.resolve();
      element.click();
      $rootScope.$apply();

      expect(analytics.eventTrack).not.toHaveBeenCalled();
    });

    it('should not call the analytics service during unsuccessful submission', function(){
      deferred.reject('error');
      element.click();
      $rootScope.$apply();

      expect(analytics.eventTrack).not.toHaveBeenCalled();
    });
  });

  describe('when click event is triggered with data-event-category attribute', function() {

    var scope;
    var element;
    var deferred;

    beforeEach(function () {
      scope = $rootScope.$new();
      deferred = $q.defer();
      scope.submit = function() { return deferred.promise; };

      element = angular.element(getFormHtml('data-event-category="category"'));
      $compile(element)(scope);
      element = element.find('button');
      scope.$digest();
      scope.form.$pristine = false;
    });

    it('should not call the analytics service during successful submission', function(){
      deferred.resolve();
      element.click();
      $rootScope.$apply();

      expect(analytics.eventTrack).not.toHaveBeenCalled();
    });

    it('should not call the analytics service during unsuccessful submission', function(){
      deferred.reject('error');
      element.click();
      $rootScope.$apply();

      expect(analytics.eventTrack).not.toHaveBeenCalled();
    });
  });

  describe('when click event is triggered with data-event-title and data-event-category attribute', function() {

    var scope;
    var element;
    var deferred;

    beforeEach(function () {
      scope = $rootScope.$new();
      deferred = $q.defer();
      scope.submit = function() { return deferred.promise; };

      element = angular.element(getFormHtml('data-event-title="title" data-event-category="category"'));
      $compile(element)(scope);
      element = element.find('button');
      scope.$digest();
      scope.form.$pristine = false;
    });

    it('should call the analytics service during successful submission', function(){
      deferred.resolve();
      element.click();
      $rootScope.$apply();

      expect(analytics.eventTrack).toHaveBeenCalledWith('title', 'category');
    });

    it('should not call the analytics service during unsuccessful submission', function(){
      deferred.reject('error');
      element.click();
      $rootScope.$apply();

      expect(analytics.eventTrack).not.toHaveBeenCalled();
    });
  });

  describe('when click event is triggered with fw-can-submit-form attribute', function() {

    var scope;
    var element;
    var deferred;

    beforeEach(function () {
      scope = $rootScope.$new();
      deferred = $q.defer();
      scope.submit = function() { return deferred.promise; };

      element = angular.element(formHtml);
      $compile(element)(scope);
      element = element.find('button');
      scope.$digest();
    });

    it('should not perform the submission if invalid', function(){
      scope.form.$invalid = true;
      deferred.resolve();
      element.click();
      $rootScope.$apply();

      expect(scope.form.hasSubmitted).toBe(false);
    });

    it('should not perform the submission if pristine', function(){
      scope.form.$pristine = true;
      deferred.resolve();
      element.click();
      $rootScope.$apply();

      expect(scope.form.hasSubmitted).toBe(false);
    });

    it('should perform the submission if valid and dirty ;)', function(){
      scope.form.$invalid = false;
      scope.form.$pristine = false;
      deferred.resolve();
      element.click();
      $rootScope.$apply();

      expect(scope.form.hasSubmitted).toBe(true);
    });
  });
});
