describe('full-size-image-modal-controller', function() {
  'use strict';

  var $q;
  var $scope;
  var target;

  var image;
  var imageSource;
  var accessSignatures;
  var postInteractions;

  beforeEach(function () {

    image = { containerName: 'containerName', fileId: 'fileId' };
    imageSource = 'imageSource';
    accessSignatures = jasmine.createSpyObj('accessSignatures', ['getContainerAccessInformation']);
    postInteractions = jasmine.createSpyObj('postInteractions', ['openFile']);

    module('webApp');
    module(function ($provide) {
      $provide.value('image', image);
      $provide.value('imageSource', imageSource);
      $provide.value('accessSignatures', accessSignatures);
      $provide.value('postInteractions', postInteractions);
    });

    inject(function ($injector) {
      $q = $injector.get('$q');
      $scope = $injector.get('$rootScope').$new();
    });
  });

  var createController = function () {
    inject(function ($controller) {
      target = $controller('fullSizeImageModalCtrl', {$scope: $scope});
    });
  };

  describe('when creating', function(){
    beforeEach(function(){
      accessSignatures.getContainerAccessInformation.and.returnValue($q.when({ uri: 'uri', signature: '?signature' }));
      createController();
      $scope.$apply();
    });

    it('should call getContainerAccessInformation', function(){
      expect(accessSignatures.getContainerAccessInformation).toHaveBeenCalledWith('containerName');
    });

    it('should set the image path to the scope', function(){
      expect($scope.imagePath).toBe('uri/fileId?signature');
    });

    it('should set the image to the scope', function(){
      expect($scope.image).toBe(image);
    });

    it('should set the imageSource to the scope', function(){
      expect($scope.imageSource).toBe(imageSource);
    });

    describe('when openFile is called', function(){

      var result;
      beforeEach(function(){
        postInteractions.openFile.and.returnValue('result');
        result = $scope.openFile('file');
      });

      it('should forward the call to postInteractions', function(){
        expect(postInteractions.openFile).toHaveBeenCalledWith('file');
      });

      it('should return the result of postInteractions', function(){
        expect(result).toBe('result');
      });
    });
  });
});
