describe('blob image controller', function(){
  'use strict';

  var $q;
  var $scope;
  var $timeout;

  var blobImageCtrlConstants;
  var azureBlobAvailability;
  var utilities;
  var logService;
  var target;

  beforeEach(function() {
    azureBlobAvailability = jasmine.createSpyObj('azureBlobAvailability', ['checkAvailability']);
    utilities = jasmine.createSpyObj('utilities', ['getFriendlyErrorMessage']);
    logService = jasmine.createSpyObj('logService', ['error']);

    module('webApp');
    module(function($provide) {
      $provide.value('azureBlobAvailability', azureBlobAvailability);
      $provide.value('utilities', utilities);
      $provide.value('logService', logService);
    });

    inject(function ($injector) {
      $q = $injector.get('$q');
      $scope = $injector.get('$rootScope').$new();
      $timeout = $injector.get('$timeout');
      blobImageCtrlConstants = $injector.get('blobImageCtrlConstants');
    });
  });

  var createController = function(){
    inject(function ($controller) {
      target = $controller('blobImageCtrl', {
        $scope: $scope,
        $q: $q,
        $timeout: $timeout,
        blobImageCtrlConstants: blobImageCtrlConstants,
        azureBlobAvailability: azureBlobAvailability,
        utilities: utilities,
        logService: logService
      });
    });
  };

  describe('when being created', function(){
    it('should initialize the scope', function(){
      createController();

      expect($scope.model).toBeDefined();
      expect($scope.model.imageUri).toBeUndefined();
      expect($scope.model.errorMessage).toBeUndefined();
    });

    it('should attach to the update event', function(){

      spyOn($scope, '$on');

      createController();

      expect($scope.$on).toHaveBeenCalled();
      expect($scope.$on.calls.first().args[0]).toBe(blobImageCtrlConstants.updateEvent);
    });

  });

  describe('when created', function(){

    var now;

    beforeEach(function(){
      createController();
      utilities.getFriendlyErrorMessage.and.callFake(function(error) { return error.message; });

      now = _.now();
      spyOn(_, 'now').and.returnValue(now);
    });

    it('should update the image uri', function(){
      azureBlobAvailability.checkAvailability.and.returnValue($q.when('uri?sig'));
      $scope.$broadcast(blobImageCtrlConstants.updateEvent, 'uri', 'containerName');
      $scope.$apply();
      expect($scope.model.imageUri).toBe('uri?sig');
      expect($scope.model.errorMessage).toBeUndefined();
    });

    it('should set the image uri to undefined while checking availability', function(){
      $scope.model.imageUri = 'something';
      azureBlobAvailability.checkAvailability.and.returnValue($q.when('uri?sig'));
      $scope.$broadcast(blobImageCtrlConstants.updateEvent, 'uri', 'containerName');

      expect($scope.model.imageUri).toBeUndefined();
      $scope.$apply();
      expect($scope.model.imageUri).toBe('uri?sig');
    });

    it('should set the error message to undefined while checking availability', function(){
      $scope.model.errorMessage = 'something';
      azureBlobAvailability.checkAvailability.and.returnValue($q.when('uri?sig'));
      $scope.$broadcast(blobImageCtrlConstants.updateEvent, 'uri', 'containerName');

      expect($scope.model.errorMessage).toBeUndefined();
    });

    it('should retry after a timeout if the image does not exist', function(){
      azureBlobAvailability.checkAvailability.and.returnValue($q.when(undefined));
      $scope.$broadcast(blobImageCtrlConstants.updateEvent, 'uri', 'containerName');
      $scope.$apply();

      expect($scope.model.imageUri).toBeUndefined();
      expect($scope.model.errorMessage).toBeUndefined();
      expect(azureBlobAvailability.checkAvailability.calls.count()).toBe(1);

      azureBlobAvailability.checkAvailability.and.returnValue($q.when('uri?sig'));
      $timeout.flush();

      expect($scope.model.imageUri).toBe('uri?sig');
      expect($scope.model.errorMessage).toBeUndefined();
      expect(azureBlobAvailability.checkAvailability.calls.count()).toBe(2);
    });

    it('should continue retry after a timeout if the image continues not to exist', function(){
      azureBlobAvailability.checkAvailability.and.returnValue($q.when(undefined));
      $scope.$broadcast(blobImageCtrlConstants.updateEvent, 'uri', 'containerName');
      $scope.$apply();

      expect($scope.model.imageUri).toBeUndefined();
      expect($scope.model.errorMessage).toBeUndefined();
      expect(azureBlobAvailability.checkAvailability.calls.count()).toBe(1);

      $timeout.flush();

      expect($scope.model.imageUri).toBeUndefined();
      expect($scope.model.errorMessage).toBeUndefined();
      expect(azureBlobAvailability.checkAvailability.calls.count()).toBe(2);

      azureBlobAvailability.checkAvailability.and.returnValue($q.when('uri?sig'));
      $timeout.flush();

      expect($scope.model.imageUri).toBe('uri?sig');
      expect($scope.model.errorMessage).toBeUndefined();
      expect(azureBlobAvailability.checkAvailability.calls.count()).toBe(3);
    });

    it('should continue to check while within the timeout period', function(){
      azureBlobAvailability.checkAvailability.and.returnValue($q.when(undefined));
      $scope.$broadcast(blobImageCtrlConstants.updateEvent, 'uri', 'containerName');
      $scope.$apply();

      expect($scope.model.imageUri).toBeUndefined();
      expect($scope.model.errorMessage).toBeUndefined();
      expect(azureBlobAvailability.checkAvailability.calls.count()).toBe(1);

      azureBlobAvailability.checkAvailability.and.returnValue($q.when('uri?sig'));
      _.now.and.returnValue(now + blobImageCtrlConstants.timeoutSeconds * 1000);

      $timeout.flush();

      expect($scope.model.imageUri).toBe('uri?sig');
      expect($scope.model.errorMessage).toBeUndefined();
      expect(azureBlobAvailability.checkAvailability.calls.count()).toBe(2);
    });

    it('should fail if the timeout expires', function(){
      azureBlobAvailability.checkAvailability.and.returnValue($q.when(undefined));
      $scope.$broadcast(blobImageCtrlConstants.updateEvent, 'uri', 'containerName');
      $scope.$apply();

      expect($scope.model.imageUri).toBeUndefined();
      expect($scope.model.errorMessage).toBeUndefined();
      expect(azureBlobAvailability.checkAvailability.calls.count()).toBe(1);

      azureBlobAvailability.checkAvailability.and.returnValue($q.when('uri?sig'));
      _.now.and.returnValue(now + blobImageCtrlConstants.timeoutSeconds * 1000 + 1);

      $timeout.flush();

      expect($scope.model.imageUri).toBeUndefined();
      expect($scope.model.errorMessage).toBe('Timeout');
      expect(logService.error).toHaveBeenCalled();
      expect(azureBlobAvailability.checkAvailability.calls.count()).toBe(1);
    });

    it('should fail if the checkAvailability call fails', function(){
      azureBlobAvailability.checkAvailability.and.returnValue($q.reject({ message: 'error' }));
      $scope.$broadcast(blobImageCtrlConstants.updateEvent, 'uri', 'containerName');
      $scope.$apply();

      expect($scope.model.imageUri).toBeUndefined();
      expect($scope.model.errorMessage).toBe('error');
      expect(logService.error).toHaveBeenCalled();
    });

    it('should continue checking availability with new file if interrupted with new file', function(){
      azureBlobAvailability.checkAvailability.and.returnValue($q.when(undefined));
      $scope.$broadcast(blobImageCtrlConstants.updateEvent, 'uri', 'containerName');
      $scope.$apply();

      $scope.$broadcast(blobImageCtrlConstants.updateEvent, 'uri2', 'containerName');
      $scope.$apply();
      $timeout.flush();

      expect(azureBlobAvailability.checkAvailability.calls.count()).toBe(2);
      expect(azureBlobAvailability.checkAvailability.calls.first().args[0]).toBe('uri');
      expect(azureBlobAvailability.checkAvailability.calls.mostRecent().args[0]).toBe('uri2');
    });

    it('should reset the timer and continue checking availability if interrupted with new file', function(){
      azureBlobAvailability.checkAvailability.and.returnValue($q.when(undefined));
      $scope.$broadcast(blobImageCtrlConstants.updateEvent, 'uri', 'containerName');
      $scope.$apply();
      expect($scope.model.errorMessage).toBeUndefined();

      _.now.and.returnValue(now + 10000);

      $scope.$broadcast(blobImageCtrlConstants.updateEvent, 'uri2', 'containerName');
      $scope.$apply();
      $timeout.flush();
      expect($scope.model.errorMessage).toBeUndefined();

      _.now.and.returnValue(now + 10000 + blobImageCtrlConstants.timeoutSeconds * 1000);

      $timeout.flush();
      expect($scope.model.errorMessage).toBeUndefined();

      _.now.and.returnValue(now + 10000 + blobImageCtrlConstants.timeoutSeconds * 1000 + 1);

      $timeout.flush();
      expect($scope.model.errorMessage).toBe('Timeout');
    });
  });
});
