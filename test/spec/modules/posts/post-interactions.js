describe('post-interactions', function(){
  'use strict';

  var $rootScope;
  var $q;
  var target;

  var $modal;
  var postStub;
  var accessSignatures;

  beforeEach(function() {
    postStub = jasmine.createSpyObj('postStub', ['deletePost', 'postLike', 'deleteLike']);
    accessSignatures = jasmine.createSpyObj('accessSignatures', ['getContainerAccessInformation']);
    $modal = jasmine.createSpyObj('$modal', ['open']);

    module('webApp');

    module(function($provide) {
      $provide.value('postStub', postStub);
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

      target.editPost({ postId: 'postId' });
    });

    it('should open a modal dialog', function(){
      expect($modal.open).toHaveBeenCalled();
    });

    it('should configure injection of post', function(){
      expect(modalParameter.resolve.initialPost()).toEqual({ postId: 'postId' });
    });
  });

  describe('when viewPost is called', function(){
    var modalParameter;
    var post;
    var result;
    beforeEach(function(){
      $modal.open.and.callFake(function(data){
        modalParameter = data;
        return { result: 'result' };
      });
      post = {
        postId: 'postId'
      };

      result = target.viewPost(post);
    });

    it('should open a modal dialog', function(){
      expect($modal.open).toHaveBeenCalled();
    });

    it('should configure injection of post', function(){
      expect(modalParameter.resolve.post()).toEqual(post);
    });

    describe('when updateLikeStatus is called', function(){
      it('should update the post', function(){
        modalParameter.resolve.updateLikeStatus()('totalLikes', 'hasLiked');
        expect(post).toEqual({
          postId: 'postId',
          likesCount: 'totalLikes',
          hasLiked: 'hasLiked'
        });
      });
    });

    describe('when updateCommentsCount is called', function(){
      it('should update the post', function(){
        modalParameter.resolve.updateCommentsCount()('totalComments');
        expect(post).toEqual({
          postId: 'postId',
          commentsCount: 'totalComments'
        });
      });
    });

    it('should return the modal result', function(){
      expect(result).toBe('result');
    });
  });

  describe('when deletePost is called', function(){
    describe('when deletePost succeeds', function(){
      var success;
      beforeEach(function(){
        postStub.deletePost.and.returnValue($q.when());
        target.deletePost('postId').then(function() { success = true; });
        $rootScope.$apply();
      });

      it('should delete the post on the API', function(){
        expect(postStub.deletePost).toHaveBeenCalledWith('postId');
      });

      it('should return a successful promise', function(){
        expect(success).toBe(true);
      });
    });

    describe('when deletePost fails', function(){
      var error;
      beforeEach(function(){
        postStub.deletePost.and.returnValue($q.reject('error'));
        target.deletePost('postId').catch(function(e) { error = e; });
        $rootScope.$apply();
      });

      it('should propagate the error', function(){
        expect(error).toBe('error');
      });
    });
  });

  describe('when calling toggleLikePost', function(){
    describe('when post is liked', function(){
      var success;
      var error;
      var deferredUnlikePost;
      var post;
      beforeEach(function(){
        success = undefined;
        error = undefined;

        deferredUnlikePost = $q.defer();
        spyOn(target.internal, 'unlikePost').and.returnValue(deferredUnlikePost.promise);

        post = { hasLiked: true };
        target.toggleLikePost(post).then(function(){ success = true; }, function(e){ error = e; });
        $rootScope.$apply();
      });

      it('should call unlikePost', function(){
        expect(target.internal.unlikePost).toHaveBeenCalledWith(post);
      });

      describe('when unlikePost succeeds', function(){
        beforeEach(function(){
          deferredUnlikePost.resolve();
          $rootScope.$apply();
        });

        it('should complete successfully', function(){
          expect(success).toBe(true);
        });
      });

      describe('when unlikePost fails', function(){
        beforeEach(function(){
          deferredUnlikePost.reject('error');
          $rootScope.$apply();
        });

        it('should propagate the error', function(){
          expect(error).toBe('error');
        });
      });
    });

    describe('when post is not liked', function(){
      var success;
      var error;
      var deferredLikePost;
      var post;
      beforeEach(function(){
        success = undefined;
        error = undefined;

        deferredLikePost = $q.defer();
        spyOn(target.internal, 'likePost').and.returnValue(deferredLikePost.promise);

        post = { hasLiked: false };
        target.toggleLikePost(post).then(function(){ success = true; }, function(e){ error = e; });
        $rootScope.$apply();
      });

      it('should call likePost', function(){
        expect(target.internal.likePost).toHaveBeenCalledWith(post);
      });

      describe('when likePost succeeds', function(){
        beforeEach(function(){
          deferredLikePost.resolve();
          $rootScope.$apply();
        });

        it('should complete successfully', function(){
          expect(success).toBe(true);
        });
      });

      describe('when likePost fails', function(){
        beforeEach(function(){
          deferredLikePost.reject('error');
          $rootScope.$apply();
        });

        it('should propagate the error', function(){
          expect(error).toBe('error');
        });
      });
    });
  });

  describe('when calling likePost', function(){
    var success;
    var error;
    var deferredLikePost;
    var post;
    beforeEach(function(){
      success = undefined;
      error = undefined;

      deferredLikePost = $q.defer();
      postStub.postLike.and.returnValue(deferredLikePost.promise);

      post = { postId: 'postId', hasLiked: false, likesCount: 10 };
      target.internal.likePost(post).then(function(){ success = true; }, function(e){ error = e; });
      $rootScope.$apply();
    });

    it('should set hasLiked to true', function(){
      expect(post.hasLiked).toBe(true);
    });

    it('should increment likesCount', function(){
      expect(post.likesCount).toBe(11);
    });

    it('should call postLike', function(){
      expect(postStub.postLike).toHaveBeenCalledWith('postId');
    });

    describe('when likePost succeeds', function(){
      beforeEach(function(){
        deferredLikePost.resolve();
        $rootScope.$apply();
      });

      it('should complete successfully', function(){
        expect(success).toBe(true);
      });

      it('should retain hasLiked state', function(){
        expect(post.hasLiked).toBe(true);
      });

      it('should retain likesCount', function(){
        expect(post.likesCount).toBe(11);
      });
    });

    describe('when likePost fails', function(){
      beforeEach(function(){
        deferredLikePost.reject('error');
        $rootScope.$apply();
      });

      it('should propagate the error', function(){
        expect(error).toBe('error');
      });

      it('should revert hasLiked state', function(){
        expect(post.hasLiked).toBe(false);
      });

      it('should revert likesCount', function(){
        expect(post.likesCount).toBe(10);
      });
    });
  });

  describe('when calling unlikePost', function(){
    var success;
    var error;
    var deferredUnlikePost;
    var post;
    beforeEach(function(){
      success = undefined;
      error = undefined;

      deferredUnlikePost = $q.defer();
      postStub.deleteLike.and.returnValue(deferredUnlikePost.promise);

      post = { postId: 'postId', hasLiked: true, likesCount: 10 };
      target.internal.unlikePost(post).then(function(){ success = true; }, function(e){ error = e; });
      $rootScope.$apply();
    });

    it('should set hasLiked to false', function(){
      expect(post.hasLiked).toBe(false);
    });

    it('should decrement likesCount', function(){
      expect(post.likesCount).toBe(9);
    });

    it('should call unlikePost', function(){
      expect(postStub.deleteLike).toHaveBeenCalledWith('postId');
    });

    describe('when unlikePost succeeds', function(){
      beforeEach(function(){
        deferredUnlikePost.resolve();
        $rootScope.$apply();
      });

      it('should complete successfully', function(){
        expect(success).toBe(true);
      });

      it('should retain hasLiked state', function(){
        expect(post.hasLiked).toBe(false);
      });

      it('should retain likesCount', function(){
        expect(post.likesCount).toBe(9);
      });
    });

    describe('when unlikePost fails', function(){
      beforeEach(function(){
        deferredUnlikePost.reject('error');
        $rootScope.$apply();
      });

      it('should propagate the error', function(){
        expect(error).toBe('error');
      });

      it('should revert hasLiked state', function(){
        expect(post.hasLiked).toBe(true);
      });

      it('should revert likesCount', function(){
        expect(post.likesCount).toBe(10);
      });
    });
  });

  describe('when showComments is called', function(){
    var modalParameter;
    var result;
    beforeEach(function(){
      $modal.open.and.callFake(function(data){
        modalParameter = data;
        return {
          result: 'result'
        };
      });

      result = target.showComments('postId', 'isCommenting', 'updateCommentsCount');
    });

    it('should open a modal dialog', function(){
      expect($modal.open).toHaveBeenCalled();
    });

    it('should configure injection of post', function(){
      expect(modalParameter.resolve.postId()).toBe('postId');
      expect(modalParameter.resolve.isCommenting()).toBe('isCommenting');
      expect(modalParameter.resolve.updateCommentsCount()).toBe('updateCommentsCount');
    });

    it('should return the result', function(){
      expect(result).toBe('result');
    });
  });
});
