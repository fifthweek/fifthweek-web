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
    azureUriService = jasmine.createSpyObj('azureUriService', ['getAvailableImageInformation']);
    errorFacade = jasmine.createSpyObj('errorFacade', ['handleError']);

    module('webApp', 'errorFacadeMock');
    module(function($provide) {
      $provide.value('azureUriService', azureUriService);
      $provide.value('errorFacade', errorFacade);
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
      target = $controller('blobImageCtrl', { $scope: $scope });
    });
  };

  describe('when being created', function(){
    it('should initialize the scope', function(){
      createController();

      expect($scope.model).toBeDefined();
      expect($scope.model.imageUri).toBeUndefined();
      expect($scope.model.renderSize).toBeUndefined();
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

    var expectedRenderSize;
    beforeEach(function(){
      createController();
      expectedRenderSize = { width: '200px', height: '100px' };
      azureUriService.getAvailableImageInformation.and.returnValue($q.when({ uri: 'uri?sig', width: '400', height: '200' }));
    });

    it('should update the image uri', function(){
      $scope.$broadcast(blobImageCtrlConstants.updateEvent, 'containerName', 'fileId', 'thumbnail');
      $scope.$apply();
      $timeout.flush();
      expect($scope.model.imageUri).toBe('uri?sig');
      expect($scope.model.renderSize).toEqual(expectedRenderSize);
      expect($scope.model.errorMessage).toBeUndefined();
      expect(azureUriService.getAvailableImageInformation).toHaveBeenCalledWith('containerName', 'fileId', 'thumbnail', jasmine.any(Object));
    });

    it('should pause before the initial check, when image is not immediately available', function(){
      $scope.$broadcast(blobImageCtrlConstants.updateEvent, 'containerName', 'fileId', 'thumbnail');
      $scope.$apply();
      expect($scope.model.imageUri).toBeUndefined();
      $timeout.flush();
      expect($scope.model.imageUri).toBe('uri?sig');
    });

    it('should not pause before the initial check, when image is immediately available', function(){
      $scope.$broadcast(blobImageCtrlConstants.updateEvent, 'containerName', 'fileId', 'thumbnail', true);
      $scope.$apply();
      expect($scope.model.imageUri).toBe('uri?sig');
    });

    it('should set the image uri to undefined while checking availability', function(){
      $scope.model.imageUri = 'something';
      $scope.$broadcast(blobImageCtrlConstants.updateEvent, 'containerName', 'fileId', 'thumbnail');

      expect($scope.model.imageUri).toBeUndefined();
      $scope.$apply();
      $timeout.flush();
      expect($scope.model.imageUri).toBe('uri?sig');
    });

    it('should not set the renderSize to undefined while checking availability', function(){
      $scope.model.renderSize = expectedRenderSize;
      $scope.$broadcast(blobImageCtrlConstants.updateEvent, 'containerName', 'fileId', 'thumbnail');

      expect($scope.model.renderSize).toEqual(expectedRenderSize);
      $scope.$apply();
      $timeout.flush();
      expect($scope.model.renderSize).toEqual(expectedRenderSize);
    });

    it('should update the renderSize if new information is present', function(){
      $scope.model.renderSize = 'somethingElse';
      $scope.$broadcast(blobImageCtrlConstants.updateEvent, 'containerName', 'fileId', 'thumbnail');

      expect($scope.model.renderSize).toBe('somethingElse');
      $scope.$apply();
      $timeout.flush();
      expect($scope.model.renderSize).toEqual(expectedRenderSize);
    });

    it('should remove the renderSize if no information is present', function(){
      azureUriService.getAvailableImageInformation.and.returnValue($q.when({ uri: 'uri?sig' }));
      $scope.model.renderSize = expectedRenderSize;
      $scope.$broadcast(blobImageCtrlConstants.updateEvent, 'containerName', 'fileId', 'thumbnail');

      expect($scope.model.renderSize).toEqual(expectedRenderSize);
      $scope.$apply();
      $timeout.flush();
      expect($scope.model.renderSize).toBeUndefined();
    });

    it('should set the error message to undefined while checking availability', function(){
      $scope.model.errorMessage = 'something';
      $scope.$broadcast(blobImageCtrlConstants.updateEvent, 'containerName', 'fileId', 'thumbnail');

      expect($scope.model.errorMessage).toBeUndefined();
    });

    it('should stop checking availability if interrupted with another update event', function(){
      var actualCancellationToken;
      azureUriService.getAvailableImageInformation.and.callFake(function(containerName, uri, thumbnail, cancellationToken) {
        actualCancellationToken = cancellationToken;
        return $q.defer().promise;
      });
      $scope.$broadcast(blobImageCtrlConstants.updateEvent, 'containerName', 'fileId', 'thumbnail');
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
      azureUriService.getAvailableImageInformation.and.callFake(function(containerName, uri, thumbnail, cancellationToken) {
        actualCancellationTokens.push(cancellationToken);
        return $q.defer().promise;
      });
      $scope.$broadcast(blobImageCtrlConstants.updateEvent, 'containerName', 'fileId', 'thumbnail');
      $scope.$apply();
      $timeout.flush();
      expect(azureUriService.getAvailableImageInformation).toHaveBeenCalledWith('containerName', 'fileId', 'thumbnail', jasmine.any(Object));
      expect(actualCancellationTokens[0].isCancelled).toBeUndefined();

      azureUriService.getAvailableImageInformation.calls.reset();

      $scope.$broadcast(blobImageCtrlConstants.updateEvent, 'containerName2', 'fileId2', 'thumbnail2');
      $scope.$apply();
      $timeout.flush();
      expect(azureUriService.getAvailableImageInformation).toHaveBeenCalledWith('containerName2', 'fileId2', 'thumbnail2', jasmine.any(Object));
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
      expect(azureUriService.getAvailableImageInformation).not.toHaveBeenCalled();
    });

    it('should reset the model to defaults, except renderSize, and not check availability, when subsequent update event has no arguments, and current event is in progress', function(){
      azureUriService.getAvailableImageInformation.and.returnValue($q.defer().promise);
      $scope.model.renderSize = 'renderSize';
      $scope.$broadcast(blobImageCtrlConstants.updateEvent, 'containerName', 'fileId', 'thumbnail');
      $scope.$apply();
      $timeout.flush();
      expect($scope.model.updating).toBe(true);
      expect($scope.model.imageUri).toBeUndefined();
      expect($scope.model.renderSize).toBe('renderSize');
      expect($scope.model.errorMessage).toBeUndefined();
      expect(azureUriService.getAvailableImageInformation).toHaveBeenCalled();

      azureUriService.getAvailableImageInformation.calls.reset();

      $scope.$broadcast(blobImageCtrlConstants.updateEvent);
      $scope.$apply();
      $timeout.flush();
      expect($scope.model.updating).toBe(false);
      expect($scope.model.imageUri).toBeUndefined();
      expect($scope.model.renderSize).toBe('renderSize');
      expect($scope.model.errorMessage).toBeUndefined();

      expect(azureUriService.getAvailableImageInformation).not.toHaveBeenCalled();
    });

    it('should reset the model to defaults, except renderSize, and not check availability, when subsequent update event has no arguments, and current event has completed', function(){
      $scope.$broadcast(blobImageCtrlConstants.updateEvent, 'containerName', 'fileId', 'thumbnail');
      $scope.$apply();
      $timeout.flush();
      expect($scope.model.updating).toBe(false);
      expect($scope.model.imageUri).toBe('uri?sig');
      expect($scope.model.renderSize).toEqual(expectedRenderSize);
      expect($scope.model.errorMessage).toBeUndefined();
      expect(azureUriService.getAvailableImageInformation).toHaveBeenCalled();

      azureUriService.getAvailableImageInformation.calls.reset();

      $scope.$broadcast(blobImageCtrlConstants.updateEvent);
      $scope.$apply();
      $timeout.flush();
      expect($scope.model.updating).toBe(false);
      expect($scope.model.imageUri).toBeUndefined();
      expect($scope.model.renderSize).toEqual(expectedRenderSize);
      expect($scope.model.errorMessage).toBeUndefined();

      expect(azureUriService.getAvailableImageInformation).not.toHaveBeenCalled();
    });

    describe('when getImageInformation fails', function(){
      beforeEach(function(){
        azureUriService.getAvailableImageInformation.and.returnValue($q.reject('error'));
        errorFacade.handleError.and.callFake(function(error, delegate){
          delegate('friendlyError');
        });

        $scope.model.renderSize = 'renderSize';
        $scope.$broadcast(blobImageCtrlConstants.updateEvent, 'containerName', 'fileId', 'thumbnail');
        $scope.$apply();
        $timeout.flush();
      });

      it('should call the errorFacade', function(){
        expect(errorFacade.handleError).toHaveBeenCalledWith('error', jasmine.any(Function));
      });

      it('should set the errorMessage to a friendly error message', function(){
        expect($scope.model.errorMessage).toBe('friendlyError');
      });

      it('should not reset the renderSize', function(){
        expect($scope.model.renderSize).toBe('renderSize');
      });

      it('should set updating to false', function(){
        expect($scope.model.updating).toBe(false);
      });
    });
  });
});
