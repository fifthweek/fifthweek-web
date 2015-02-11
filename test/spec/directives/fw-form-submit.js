describe('submit form directive', function(){
  'use strict';

  beforeEach(function() {
    module('webApp');
  });

  var $rootScope;
  var $compile;
  var $q;

  var logService;
  var analytics;
  var utilities;
  var friendlyErrorMessage;

  beforeEach(function() {
    logService = jasmine.createSpyObj('logService', ['error']);
    analytics = jasmine.createSpyObj('analytics', ['eventTrack']);

    friendlyErrorMessage = 'friendly error message';
    utilities = { getFriendlyErrorMessage: function(){ return friendlyErrorMessage; } };

    module(function($provide){
      $provide.value('logService', logService);
      $provide.value('analytics', analytics);
      $provide.value('utilities', utilities);
    });
  });

  beforeEach(inject(function($injector) {
    $rootScope = $injector.get('$rootScope');
    $compile = $injector.get('$compile');
    $q = $injector.get('$q');
  }));

  describe('when created', function(){

    it('should setup the initial scope variables', function(){
      var scope = $rootScope.$new();
      scope.submit = function(){};
      spyOn(scope, 'submit');

      var element = angular.element('<button fw-form-submit="submit()">default</button>');
      $compile(element)(scope);
      scope.$digest();

      expect(scope.submit).not.toHaveBeenCalled();
      expect(scope.message).toBe('');
      expect(scope.isSubmitting).toBe(false);
      expect(scope.hasSubmitted).toBe(false);
      expect(scope.submissionSucceeded).toBe(false);
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

      element = angular.element('<button fw-form-submit="submit()">default</button>');
      $compile(element)(scope);
      scope.$digest();
    });

    it('should call the specified delegate', function(){
      scope.submit = function() {};
      spyOn(scope, 'submit').and.callThrough();
      element.click();
      expect(scope.submit).toHaveBeenCalled();
    });

    it('should set the isSubmitting state to true during the submission', function(){
      expect(scope.isSubmitting).toBe(false);

      element.click();
      $rootScope.$apply();

      expect(scope.isSubmitting).toBe(true);

      deferred.resolve();
      $rootScope.$apply();

      expect(scope.isSubmitting).toBe(false);
    });

    it('should set the isSubmitting state to true during the submission and reset when an error occurs', function(){
      expect(scope.isSubmitting).toBe(false);

      element.click();
      $rootScope.$apply();

      expect(scope.isSubmitting).toBe(true);

      deferred.reject('error');
      $rootScope.$apply();

      expect(scope.isSubmitting).toBe(false);
    });

    it('should set the hasSubmitted state to true after the first successful submission', function(){
      expect(scope.hasSubmitted).toBe(false);

      element.click();
      $rootScope.$apply();

      expect(scope.hasSubmitted).toBe(false);

      deferred.resolve();
      $rootScope.$apply();

      expect(scope.hasSubmitted).toBe(true);
    });

    it('should set the hasSubmitted state to true after the first unsuccessful submission', function(){
      expect(scope.hasSubmitted).toBe(false);

      element.click();
      $rootScope.$apply();

      expect(scope.hasSubmitted).toBe(false);

      deferred.reject('error');
      $rootScope.$apply();

      expect(scope.hasSubmitted).toBe(true);
    });

    it('should set the submissionSucceeded state to true on first successful submission', function(){
      expect(scope.submissionSucceeded).toBe(false);

      element.click();
      $rootScope.$apply();

      expect(scope.submissionSucceeded).toBe(false);

      deferred.resolve();
      $rootScope.$apply();

      expect(scope.submissionSucceeded).toBe(true);
    });

    it('should set the submissionSucceeded state to false after the first unsuccessful submission', function(){
      expect(scope.submissionSucceeded).toBe(false);

      element.click();
      $rootScope.$apply();

      expect(scope.submissionSucceeded).toBe(false);

      deferred.reject('error');
      $rootScope.$apply();

      expect(scope.submissionSucceeded).toBe(false);
    });

    it('should set the message to empty after a successful submission', function(){
      expect(scope.message).toBe('');

      element.click();
      $rootScope.$apply();

      expect(scope.message).toBe('');

      deferred.resolve();
      $rootScope.$apply();

      expect(scope.message).toBe('');
    });

    it('should set the message to the friendly error message after an unsuccessful submission', function(){
      expect(scope.message).toBe('');

      element.click();
      $rootScope.$apply();

      expect(scope.message).toBe('');

      deferred.reject('error');
      $rootScope.$apply();

      expect(scope.message).toBe('friendly error message');
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

    it('should not log anything if submission succeeds', function(){
      deferred.resolve();
      element.click();
      $rootScope.$apply();

      expect(logService.error).not.toHaveBeenCalled();
    });

    it('should log the error if submission fails', function(){
      deferred.reject('error');
      element.click();
      $rootScope.$apply();

      expect(logService.error).toHaveBeenCalledWith('error');
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
      });

      it('should keep the hasSubmitted as true', function(){
        var deferred = $q.defer();
        scope.submit = function() { return deferred.promise; };

        expect(scope.hasSubmitted).toBe(true);

        element.click();
        $rootScope.$apply();

        expect(scope.hasSubmitted).toBe(true);

        deferred.resolve();
        $rootScope.$apply();

        expect(scope.hasSubmitted).toBe(true);
      });

      it('should reset the submissionSucceeded state to false during the next submission', function(){
        var deferred = $q.defer();
        scope.submit = function() { return deferred.promise; };

        expect(scope.submissionSucceeded).toBe(true);

        element.click();
        $rootScope.$apply();

        expect(scope.submissionSucceeded).toBe(false);

        deferred.resolve();
        $rootScope.$apply();

        expect(scope.submissionSucceeded).toBe(true);
      });

      it('should set the submissionSucceeded state to false if the next submission fails', function(){
        var deferred = $q.defer();
        scope.submit = function() { return deferred.promise; };

        expect(scope.submissionSucceeded).toBe(true);

        element.click();
        $rootScope.$apply();

        expect(scope.submissionSucceeded).toBe(false);

        deferred.reject('error');
        $rootScope.$apply();

        expect(scope.submissionSucceeded).toBe(false);
      });

      it('should set the message to the friendly error message on next unsuccessful submission', function(){
        var deferred = $q.defer();
        scope.submit = function() { return deferred.promise; };

        expect(scope.message).toBe('');

        element.click();
        $rootScope.$apply();

        expect(scope.message).toBe('');

        deferred.reject('error');
        $rootScope.$apply();

        expect(scope.message).toBe('friendly error message');
      });
    });

    describe('when first submission fails', function(){
      beforeEach(function(){
        var deferred = $q.defer();
        scope.submit = function() { return deferred.promise; };
        deferred.reject('error');

        element.click();
        $rootScope.$apply();
      });

      it('should keep the hasSubmitted as true on subsequent unsuccessful submissions', function(){
        var deferred = $q.defer();
        scope.submit = function() { return deferred.promise; };

        expect(scope.hasSubmitted).toBe(true);

        element.click();
        $rootScope.$apply();

        expect(scope.hasSubmitted).toBe(true);

        deferred.reject('error');
        $rootScope.$apply();

        expect(scope.hasSubmitted).toBe(true);
      });

      it('should set the submissionSucceeded state to true on next successful submission', function(){
        var deferred = $q.defer();
        scope.submit = function() { return deferred.promise; };

        expect(scope.submissionSucceeded).toBe(false);

        element.click();
        $rootScope.$apply();

        expect(scope.submissionSucceeded).toBe(false);

        deferred.resolve();
        $rootScope.$apply();

        expect(scope.submissionSucceeded).toBe(true);
      });

      it('should reset the message on a subsequent submission after an unsuccessful submission', function(){
        var deferred = $q.defer();
        scope.submit = function() { return deferred.promise; };

        expect(scope.message).toBe('friendly error message');

        element.click();
        $rootScope.$apply();

        expect(scope.message).toBe('');

        deferred.resolve();
        $rootScope.$apply();

        expect(scope.message).toBe('');
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

      element = angular.element('<button ng-disabled="something" fw-form-submit="submit()">default</button>');
      $compile(element)(scope);
      scope.$digest();
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

      element = angular.element('<button data-loading-text="loading" fw-form-submit="submit()">default</button>');
      $compile(element)(scope);
      scope.$digest();
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

      element = angular.element('<button data-event-title="title" fw-form-submit="submit()">default</button>');
      $compile(element)(scope);
      scope.$digest();
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

      element = angular.element('<button data-event-category="category" fw-form-submit="submit()">default</button>');
      $compile(element)(scope);
      scope.$digest();
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

      element = angular.element('<button data-event-title="title" data-event-category="category" fw-form-submit="submit()">default</button>');
      $compile(element)(scope);
      scope.$digest();
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
      scope.canSubmitForm1 = true;
      scope.canSubmitForm2 = true;

      element = angular.element('<button fw-can-submit-form="canSubmitForm1 && canSubmitForm2" fw-form-submit="submit()">default</button>');
      $compile(element)(scope);
      scope.$digest();
    });

    it('should perform the submission if fw-can-submit-form evaluates to true', function(){
      deferred.resolve();
      element.click();
      $rootScope.$apply();

      expect(scope.hasSubmitted).toBe(true);
    });

    it('should not perform the submission if fw-can-submit-form evaluates to false', function(){
      scope.canSubmitForm2 = false;
      deferred.resolve();
      element.click();
      $rootScope.$apply();

      expect(scope.hasSubmitted).toBe(false);
    });
  });
});
