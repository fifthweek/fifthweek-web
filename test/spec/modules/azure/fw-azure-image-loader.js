describe('fw-azure-image-loader directive', function(){
  'use strict';

  var $q;
  var $rootScope;
  var $compile;
  var $sce;
  var azureUriService;
  var logService;

  beforeEach(function() {
    module('webApp');

    $sce = jasmine.createSpyObj('$sce', ['trustAsResourceUrl']);
    azureUriService = jasmine.createSpyObj('azureUriService', ['getImageUri']);
    logService = jasmine.createSpyObj('logService', ['error']);

    module(function($provide){
      $provide.value('$sce', $sce);
      $provide.value('azureUriService', azureUriService);
      $provide.value('logService', logService);
    });

    inject(function($injector) {
      $rootScope = $injector.get('$rootScope');
      $compile = $injector.get('$compile');
      $q = $injector.get('$q');
    });
  });

  describe('when creating', function(){

    var scope;

    beforeEach(function(){
      scope = $rootScope.$new();
    });

    it('should get the image URI', function(){
      azureUriService.getImageUri.and.returnValue($q.when('imageUrl'));
      $sce.trustAsResourceUrl.and.returnValue('imageUrlTrusted');
      scope.outputImageUrl = '';

      var element = angular.element('<fw-azure-image-loader thumbnail="a" file-id="b" container-name="c" output-url="outputImageUrl"></fw-azure-image-loader>');
      $compile(element)(scope);
      scope.$digest();

      expect(azureUriService.getImageUri).toHaveBeenCalledWith('c', 'b', 'a');
      expect($sce.trustAsResourceUrl).toHaveBeenCalledWith('imageUrl');
      expect(scope.outputImageUrl).toBe('imageUrlTrusted');
    });

    it('should log any errors', function(){
      azureUriService.getImageUri.and.returnValue($q.reject('bad'));
      scope.outputImageUrl = '';

      var element = angular.element('<fw-azure-image-loader thumbnail="a" file-id="b" container-name="c" output-url="outputImageUrl"></fw-azure-image-loader>');
      $compile(element)(scope);
      scope.$digest();

      expect(logService.error).toHaveBeenCalledWith('bad');
      expect(scope.outputImageUrl).toBe('');
    });

    it('should not do anything if any value is absent 1', function(){
      scope.outputImageUrl = 'dageasgaes';

      var element = angular.element('<fw-azure-image-loader thumbnail="" file-id="b" container-name="c" output-url="outputImageUrl"></fw-azure-image-loader>');
      $compile(element)(scope);
      element.isolateScope().$apply();

      expect(azureUriService.getImageUri).not.toHaveBeenCalled();
    });

    it('should not do anything if any value is absent 2', function(){
      scope.outputImageUrl = '';

      var element = angular.element('<fw-azure-image-loader thumbnail="a" file-id="" container-name="c" output-url="outputImageUrl" />');
      $compile(element)(scope);
      scope.$digest();

      expect(azureUriService.getImageUri).not.toHaveBeenCalled();
    });

    it('should not do anything if any value is absent 3', function(){
      scope.outputImageUrl = '';

      var element = angular.element('<fw-azure-image-loader thumbnail="a" file-id="b" container-name="" output-url="outputImageUrl" />');
      $compile(element)(scope);
      scope.$digest();

      expect(azureUriService.getImageUri).not.toHaveBeenCalled();
    });
  });
});
