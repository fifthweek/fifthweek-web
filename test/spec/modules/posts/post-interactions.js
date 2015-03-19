describe('post-interactions', function(){
  'use strict';

  var $rootScope;
  var $q;
  var target;

  var $modal;
  var deleteVerification;
  var accessSignatures;

  beforeEach(function() {
    deleteVerification = jasmine.createSpyObj('deleteVerification', ['verifyDelete']);
    accessSignatures = jasmine.createSpyObj('accessSignatures', ['getContainerAccessInformation']);
    $modal = jasmine.createSpyObj('$modal', ['open']);

    module('webApp');

    module(function($provide) {
      $provide.value('deleteVerification', deleteVerification);
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

      target.editPost('postId');
    });

    it('should open a modal dialog', function(){
      expect($modal.open).toHaveBeenCalled();
    });

    it('should configure injection of postId', function(){
      expect(modalParameter.resolve.postId()).toBe('postId');
    });
  });

  describe('when deletePost is called', function(){
    var deleteDelegate;
    beforeEach(function(){
      deleteDelegate = undefined;
      deleteVerification.verifyDelete.and.callFake(function(performDelete){
        deleteDelegate = performDelete;
      });
    });

    describe('when isBacklog is false', function(){
      beforeEach(function(){
        target.deletePost('postId', false);
      });

      it('should call verifyDelete', function(){
        expect(deleteVerification.verifyDelete).toHaveBeenCalledWith(jasmine.any(Function), 'Post deleted', 'News Feed', 'Post');
      });

      describe('when the delete delegate is called', function(){
        beforeEach(function(){
          deleteDelegate();
        });

        it('should delete the post', function(){
          // TODO
        });
      });
    });

    describe('when isBacklog is true', function(){
      beforeEach(function(){
        target.deletePost('postId', true);
      });

      it('should call verifyDelete', function(){
        expect(deleteVerification.verifyDelete).toHaveBeenCalledWith(jasmine.any(Function), 'Post deleted', 'Backlog', 'Post');
      });

      describe('when the delete delegate is called', function(){
        beforeEach(function(){
          deleteDelegate();
        });

        it('should delete the post', function(){
          // TODO
        });
      });
    });
  });
});
