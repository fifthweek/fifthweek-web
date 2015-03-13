describe('compose image controller', function () {
  'use strict';

  var $q;
  var $scope;
  var target;

  var composeUploadDelegate;
  var blobImageControlFactory;
  var postsStub;

  var control;

  beforeEach(function() {

    composeUploadDelegate = jasmine.createSpyObj('composeUploadDelegate', ['initialize']);
    blobImageControlFactory = jasmine.createSpyObj('blobImageControlFactory', ['createControl']);
    postsStub = jasmine.createSpyObj('postsStub', ['postFile']);

    control = {
      update: jasmine.createSpy('update')
    };

    blobImageControlFactory.createControl.and.returnValue(control);

    module('webApp');
    module(function($provide) {
      $provide.value('composeUploadDelegate', composeUploadDelegate);
      $provide.value('blobImageControlFactory', blobImageControlFactory);
      $provide.value('postsStub', postsStub);
    });

    inject(function ($injector) {
      $q = $injector.get('$q');
      $scope = $injector.get('$rootScope').$new();
    });
  });

  var createController = function(){
    inject(function ($controller) {
      target = $controller('composeImageCtrl', { $scope: $scope });
    });
  };

  describe('when created', function(){

    beforeEach(function(){
      createController();
    });

    it('should set uploadFormFile to image', function(){
      expect($scope.uploadFormFile).toBe('image');
    });

    it('should create the blob image control', function(){
      expect(blobImageControlFactory.createControl).toHaveBeenCalled();
      expect($scope.blobImage).toBe(control);
    });

    it('should initialize the composeUploadDelegate', function(){
      expect(composeUploadDelegate.initialize).toHaveBeenCalled();
      expect(composeUploadDelegate.initialize.calls.first().args[0]).toBe($scope);
      expect(composeUploadDelegate.initialize.calls.first().args[1]).toBeDefined();
      expect(composeUploadDelegate.initialize.calls.first().args[2]).toBe(postsStub.postImage);
    });
  });

  describe('when calling onUploadComplete delegate', function(){

    var delegate;
    beforeEach(function(){
      createController();
      delegate = composeUploadDelegate.initialize.calls.first().args[1];
      delegate({
        uri: 'uri',
        containerName: 'containerName'
      });
    });

    it('should update the blob image', function(){
      expect(control.update).toHaveBeenCalledWith('uri', 'containerName');
    });
  });
});
