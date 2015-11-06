describe('full-post-loader', function(){
  'use strict';

  var $rootScope;
  var $q;
  var target;

  var postStub;
  var postUtilities;

  beforeEach(function() {
    postStub = jasmine.createSpyObj('postStub', ['getPost']);
    postUtilities = jasmine.createSpyObj('postUtilities', ['processPostForRendering']);

    module('webApp');

    module(function($provide) {
      $provide.value('postStub', postStub);
      $provide.value('postUtilities', postUtilities);
    });

    inject(function($injector) {
      $rootScope = $injector.get('$rootScope');
      $q = $injector.get('$q');
      target = $injector.get('fullPostLoader');
    });
  });

  describe('loadPost', function(){
    var result;
    var error;
    var deferredGetPost;
    var deferredProcessPostForRendering;
    var initialPost;
    var expectedPost;
    beforeEach(function(){
      result = undefined;
      error = undefined;

      deferredGetPost = $q.defer();
      postStub.getPost.and.returnValue(deferredGetPost.promise);

      deferredProcessPostForRendering = $q.defer();
      postUtilities.processPostForRendering.and.returnValue(deferredProcessPostForRendering.promise);

      initialPost = { postId: 'postId' };
      expectedPost = { postId: 'postId', files: 'files' };
      target.loadPost('postId', 'accountSettingsRepository', 'blogRepository', 'subscriptionRepository').then(function(r){ result = r; }, function(e) { error = e; });
      $rootScope.$apply();
    });

    it('should call getPost', function(){
      expect(postStub.getPost).toHaveBeenCalledWith('postId');
    });

    describe('when getPost succeeds', function(){
      beforeEach(function(){
        deferredGetPost.resolve({ data: { post: initialPost, files: 'files' } });
        $rootScope.$apply();
      });

      it('should call processPostForRendering', function(){
        expect(postUtilities.processPostForRendering).toHaveBeenCalledWith(expectedPost, 'accountSettingsRepository', 'blogRepository', 'subscriptionRepository');
      });

      describe('when processPostForRendering succeeds', function(){
        beforeEach(function(){
          deferredProcessPostForRendering.resolve();
          $rootScope.$apply();
        });

        it('should complete successfully with the post', function(){
          expect(result).toEqual(expectedPost);
        });
      });

      describe('when processPostForRendering fails', function(){
        beforeEach(function(){
          deferredProcessPostForRendering.reject('error');
          $rootScope.$apply();
        });

        it('should propagate the error', function(){
          expect(error).toBe('error');
        });
      });
    });

    describe('when getPost fails', function(){
      beforeEach(function(){
        deferredGetPost.reject('error');
        $rootScope.$apply();
      });

      it('should propagate the error', function(){
        expect(error).toBe('error');
      });
    });
  });

});
