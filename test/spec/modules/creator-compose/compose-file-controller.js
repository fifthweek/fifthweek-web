describe('compose file controller', function () {
  'use strict';

  var $q;
  var $scope;
  var target;

  var composeUploadDelegate;
  var postsStub;

  beforeEach(function() {

    composeUploadDelegate = jasmine.createSpyObj('composeUploadDelegate', ['initialize']);
    postsStub = jasmine.createSpyObj('postsStub', ['postFile']);

    module('webApp');
    module(function($provide) {
      $provide.value('composeUploadDelegate', composeUploadDelegate);
      $provide.value('postsStub', postsStub);
    });

    inject(function ($injector) {
      $q = $injector.get('$q');
      $scope = $injector.get('$rootScope').$new();
    });
  });

  var createController = function(){
    inject(function ($controller) {
      target = $controller('composeFileCtrl', { $scope: $scope });
    });
  };

  describe('when created', function(){
    beforeEach(function(){
      createController();
    });

    it('should set uploadFormFile to file', function(){
      expect($scope.uploadFormFile).toBe('file');
    });

    it('should initialize the composeUploadDelegate', function(){
      expect(composeUploadDelegate.initialize).toHaveBeenCalled();
      expect(composeUploadDelegate.initialize.calls.first().args[0]).toBe($scope);
      expect(composeUploadDelegate.initialize.calls.first().args[1]).toBeDefined();
      expect(composeUploadDelegate.initialize.calls.first().args[2]).toBe(postsStub.postFile);
    });
  });

  describe('when calling onUploadComplete delegate', function(){

    var delegate;
    beforeEach(function(){
      createController();
      delegate = composeUploadDelegate.initialize.calls.first().args[1];
      delegate({
        file: { name: 'fileName' },
        uri: 'uri',
        containerName: 'containerName'
      });
    });

    it('should update the scope with the file name', function(){
      expect($scope.fileName).toBe('fileName');
    });
  });
});
