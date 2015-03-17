describe('blob image controller', function(){
  'use strict';

  var $q;
  var $scope;
  var $timeout;

  var blobImageCtrlConstants;
  var azureUriService;
  var errorFacade;
  var target;

  beforeEach(function() {
    azureUriService = jasmine.createSpyObj('azureUriService', ['getAvailableImageUri']);

    module('webApp', 'errorFacadeMock');
    module(function($provide) {
      $provide.value('azureUriService', azureUriService);
    });

    inject(function ($injector) {
      $q = $injector.get('$q');
      $scope = $injector.get('$rootScope').$new();
      $timeout = $injector.get('$timeout');
      errorFacade = $injector.get('errorFacade');
      blobImageCtrlConstants = $injector.get('blobImageCtrlConstants');
    });
  });

  var createController = function(){
    inject(function ($controller) {
      target = $controller('blobImageCtrl', { $scope: $scope });
    });
  };

  describe('when being created', function(){
    it('should initialize the scope', function(){
      createController();

      expect($scope.model).toBeDefined();
      expect($scope.model.imageUri).toBeUndefined();
      expect($scope.model.errorMessage).toBeUndefined();
      expect($scope.model.updating).toBe(false);
    });

    it('should attach to the update event', function(){
      spyOn($scope, '$on');

      createController();

      expect($scope.$on).toHaveBeenCalledWith(blobImageCtrlConstants.updateEvent, jasmine.any(Function));
    });

  });

  describe('when created', function(){

    beforeEach(function(){
      createController();
      azureUriService.getAvailableImageUri.and.returnValue($q.when('uri?sig'));
    });

    it('should update the image uri', function(){
      $scope.$broadcast(blobImageCtrlConstants.updateEvent, 'uri', 'containerName');
      $scope.$apply();
      $timeout.flush();
      expect($scope.model.imageUri).toBe('uri?sig');
      expect($scope.model.errorMessage).toBeUndefined();
      expect(azureUriService.getAvailableImageUri).toHaveBeenCalledWith('containerName', 'uri', null, jasmine.any(Object));
    });

    it('should pause before the initial check, when image is not immediately available', function(){
      $scope.$broadcast(blobImageCtrlConstants.updateEvent, 'uri', 'containerName');
      $scope.$apply();
      expect($scope.model.imageUri).toBeUndefined();
      $timeout.flush();
      expect($scope.model.imageUri).toBe('uri?sig');
    });

    it('should not pause before the initial check, when image is immediately available', function(){
      $scope.$broadcast(blobImageCtrlConstants.updateEvent, 'uri', 'containerName', true);
      $scope.$apply();
      expect($scope.model.imageUri).toBe('uri?sig');
    });

    it('should set the image uri to undefined while checking availability', function(){
      $scope.model.imageUri = 'something';
      $scope.$broadcast(blobImageCtrlConstants.updateEvent, 'uri', 'containerName');

      expect($scope.model.imageUri).toBeUndefined();
      $scope.$apply();
      $timeout.flush();
      expect($scope.model.imageUri).toBe('uri?sig');
    });

    it('should set the error message to undefined while checking availability', function(){
      $scope.model.errorMessage = 'something';
      $scope.$broadcast(blobImageCtrlConstants.updateEvent, 'uri', 'containerName');

      expect($scope.model.errorMessage).toBeUndefined();
    });

    it('should stop checking availability if interrupted with another update event', function(){
      var actualCancellationToken;
      azureUriService.getAvailableImageUri.and.callFake(function(containerName, uri, thumbnail, cancellationToken) {
        actualCancellationToken = cancellationToken;
        return $q.defer().promise;
      });
      $scope.$broadcast(blobImageCtrlConstants.updateEvent, 'uri', 'containerName');
      $scope.$apply();
      $timeout.flush();
      expect(actualCancellationToken.isCancelled).toBeUndefined();

      $scope.$broadcast(blobImageCtrlConstants.updateEvent);
      $scope.$apply();
      $timeout.flush();
      expect(actualCancellationToken.isCancelled).toBe(true);
    });

    it('should check availability with new file if interrupted with another update event', function(){
      var actualCancellationTokens = [];
      azureUriService.getAvailableImageUri.and.callFake(function(containerName, uri, thumbnail, cancellationToken) {
        actualCancellationTokens.push(cancellationToken);
        return $q.defer().promise;
      });
      $scope.$broadcast(blobImageCtrlConstants.updateEvent, 'uri', 'containerName');
      $scope.$apply();
      $timeout.flush();
      expect(azureUriService.getAvailableImageUri).toHaveBeenCalledWith('containerName', 'uri', null, jasmine.any(Object));
      expect(actualCancellationTokens[0].isCancelled).toBeUndefined();

      azureUriService.getAvailableImageUri.calls.reset();

      $scope.$broadcast(blobImageCtrlConstants.updateEvent, 'uri2', 'containerName2');
      $scope.$apply();
      $timeout.flush();
      expect(azureUriService.getAvailableImageUri).toHaveBeenCalledWith('containerName2', 'uri2', null, jasmine.any(Object));
      expect(actualCancellationTokens[0].isCancelled).toBe(true);
      expect(actualCancellationTokens[1].isCancelled).toBeUndefined();
    });

    it('should not start checking availability if the update event has no arguments', function(){
      $scope.$broadcast(blobImageCtrlConstants.updateEvent);
      $scope.$apply();
      $timeout.flush();
      expect($scope.model.updating).toBe(false);
      expect($scope.model.imageUri).toBeUndefined();
      expect($scope.model.errorMessage).toBeUndefined();
      expect(azureUriService.getAvailableImageUri).not.toHaveBeenCalled();
    });

    it('should reset the model to defaults and not check availability, when subsequent update event has no arguments, and current event is in progress', function(){
      azureUriService.getAvailableImageUri.and.returnValue($q.defer().promise);

      $scope.$broadcast(blobImageCtrlConstants.updateEvent, 'uri', 'containerName');
      $scope.$apply();
      $timeout.flush();
      expect($scope.model.updating).toBe(true);
      expect($scope.model.imageUri).toBeUndefined();
      expect($scope.model.errorMessage).toBeUndefined();
      expect(azureUriService.getAvailableImageUri).toHaveBeenCalled();

      azureUriService.getAvailableImageUri.calls.reset();

      $scope.$broadcast(blobImageCtrlConstants.updateEvent);
      $scope.$apply();
      $timeout.flush();
      expect($scope.model.updating).toBe(false);
      expect($scope.model.imageUri).toBeUndefined();
      expect($scope.model.errorMessage).toBeUndefined();

      expect(azureUriService.getAvailableImageUri).not.toHaveBeenCalled();
    });

    it('should reset the model to defaults and not check availability, when subsequent update event has no arguments, and current event has completed', function(){
      $scope.$broadcast(blobImageCtrlConstants.updateEvent, 'uri', 'containerName');
      $scope.$apply();
      $timeout.flush();
      expect($scope.model.updating).toBe(false);
      expect($scope.model.imageUri).toBe('uri?sig');
      expect($scope.model.errorMessage).toBeUndefined();
      expect(azureUriService.getAvailableImageUri).toHaveBeenCalled();

      azureUriService.getAvailableImageUri.calls.reset();

      $scope.$broadcast(blobImageCtrlConstants.updateEvent);
      $scope.$apply();
      $timeout.flush();
      expect($scope.model.updating).toBe(false);
      expect($scope.model.imageUri).toBeUndefined();
      expect($scope.model.errorMessage).toBeUndefined();

      expect(azureUriService.getAvailableImageUri).not.toHaveBeenCalled();
    });

  });
});
