describe('post-interactions', function(){
  'use strict';

  var $rootScope;
  var $q;
  var target;

  var $modal;
  var postsStub;
  var accessSignatures;

  beforeEach(function() {
    postsStub = jasmine.createSpyObj('postsStub', ['deletePost']);
    accessSignatures = jasmine.createSpyObj('accessSignatures', ['getContainerAccessInformation']);
    $modal = jasmine.createSpyObj('$modal', ['open']);

    module('webApp');

    module(function($provide) {
      $provide.value('postsStub', postsStub);
      $provide.value('accessSignatures', accessSignatures);
      $provide.value('$modal', $modal);
    });

    inject(function($injector) {
      $rootScope = $injector.get('$rootScope');
      $q = $injector.get('$q');
      target = $injector.get('postInteractions');
    });
  });

  describe('when viewImage is called', function(){
    var modalParameter;
    beforeEach(function(){
      $modal.open.and.callFake(function(data){
        modalParameter = data;
      });

      target.viewImage('image', 'imageSource');
    });

    it('should open a modal dialog', function(){
      expect($modal.open).toHaveBeenCalled();
    });

    it('should configure injection of image and image source', function(){
      expect(modalParameter.resolve.image()).toBe('image');
      expect(modalParameter.resolve.imageSource()).toBe('imageSource');
    });
  });

  describe('when openFile is called', function(){

    beforeEach(function(){
      spyOn(window, 'open');
      accessSignatures.getContainerAccessInformation.and.returnValue($q.when({ uri: 'uri', signature: '?signature' }));
      target.openFile({ containerName: 'containerName', fileId: 'fileId' });
      $rootScope.$apply();
    });

    it('should get the access information', function(){
      expect(accessSignatures.getContainerAccessInformation).toHaveBeenCalledWith('containerName');
    });

    it('should open a new browser window with the correct uri', function(){
      expect(window.open).toHaveBeenCalledWith('uri/fileId?signature', '_blank');
    });
  });

  describe('when editPost is called', function(){
    var modalParameter;
    beforeEach(function(){
      $modal.open.and.callFake(function(data){
        modalParameter = data;
      });

      target.editPost('post');
    });

    it('should open a modal dialog', function(){
      expect($modal.open).toHaveBeenCalled();
    });

    it('should configure injection of post', function(){
      expect(modalParameter.resolve.post()).toBe('post');
    });
  });

  describe('when deletePost is called', function(){
    describe('when deletePost succeeds', function(){
      var success;
      beforeEach(function(){
        postsStub.deletePost.and.returnValue($q.when());
        target.deletePost('postId').then(function() { success = true; });
        $rootScope.$apply();
      });

      it('should delete the post on the API', function(){
        expect(postsStub.deletePost).toHaveBeenCalledWith('postId');
      });

      it('should return a successful promise', function(){
        expect(success).toBe(true);
      });
    });

    describe('when deletePost fails', function(){
      var error;
      beforeEach(function(){
        postsStub.deletePost.and.returnValue($q.reject('error'));
        target.deletePost('postId').catch(function(e) { error = e; });
        $rootScope.$apply();
      });

      it('should propagate the error', function(){
        expect(error).toBe('error');
      });
    });
  });
});
