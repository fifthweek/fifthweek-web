describe('fw-full-post-controller', function(){
  'use strict';

  var $q;
  var $scope;
  var target;

  var postInteractions;
  var blogRepositoryFactory;
  var blogRepository;
  var subscriptionRepositoryFactory;
  var subscriptionRepository;
  var accountSettingsRepositoryFactory;
  var accountSettingsRepository;
  var postStub;
  var errorFacade;
  var postUtilities;
  var initializer;

  beforeEach(function() {

    postInteractions = jasmine.createSpyObj('postInteractions', ['viewImage', 'openFile', 'showComments', 'toggleLikePost']);
    blogRepositoryFactory = jasmine.createSpyObj('blogRepositoryFactory', ['forCurrentUser']);
    blogRepository = 'blogRepository';
    blogRepositoryFactory.forCurrentUser.and.returnValue(blogRepository);
    subscriptionRepositoryFactory = jasmine.createSpyObj('subscriptionRepositoryFactory', ['forCurrentUser']);
    subscriptionRepository = 'subscriptionRepository';
    subscriptionRepositoryFactory.forCurrentUser.and.returnValue(subscriptionRepository);
    accountSettingsRepositoryFactory = jasmine.createSpyObj('accountSettingsRepositoryFactory', ['forCurrentUser']);
    accountSettingsRepository = 'accountSettingsRepository';
    accountSettingsRepositoryFactory.forCurrentUser.and.returnValue(accountSettingsRepository);
    postStub = jasmine.createSpyObj('postStub', ['getPost']);
    errorFacade = jasmine.createSpyObj('errorFacade', ['handleError']);
    postUtilities = jasmine.createSpyObj('postUtilities', ['processPostForRendering']);
    initializer = jasmine.createSpyObj('initializer', ['initialize']);

    module('webApp');
    module(function($provide) {
      $provide.value('postInteractions', postInteractions);
      $provide.value('blogRepositoryFactory', blogRepositoryFactory);
      $provide.value('subscriptionRepositoryFactory', subscriptionRepositoryFactory);
      $provide.value('accountSettingsRepositoryFactory', accountSettingsRepositoryFactory);
      $provide.value('postStub', postStub);
      $provide.value('errorFacade', errorFacade);
      $provide.value('postUtilities', postUtilities);
      $provide.value('initializer', initializer);
    });

    inject(function ($injector) {
      $q = $injector.get('$q');
      $scope = $injector.get('$rootScope').$new();
    });

    errorFacade.handleError.and.callFake(function(error, setMessage) {
      setMessage('friendlyError');
      return $q.when();
    });
  });

  var createController = function(){
    inject(function ($controller) {
      target = $controller('fwFullPostCtrl', { $scope: $scope });
    });
  };

  describe('when creating', function(){
    beforeEach(function(){
      createController();
    });

    it('should create the model', function(){
      expect($scope.model).toBeDefined();
    });

    it('should not have an error message', function(){
      expect($scope.model.errorMessage).toBeUndefined();
    });

    it('should get an account settings repository', function(){
      expect(accountSettingsRepositoryFactory.forCurrentUser).toHaveBeenCalledWith();
    });

    it('should get a blog repository', function(){
      expect(blogRepositoryFactory.forCurrentUser).toHaveBeenCalledWith();
    });

    it('should get a subscription repository', function(){
      expect(subscriptionRepositoryFactory.forCurrentUser).toHaveBeenCalledWith();
    });

    it('should call the initializer', function(){
      expect(initializer.initialize).toHaveBeenCalledWith(target.initialize);
    });
  });

  describe('when created', function(){
    beforeEach(function(){
      createController();
    });

    describe('when calling initialize', function(){
      var success;
      var error;
      var deferredGetFullPost;
      beforeEach(function(){
        deferredGetFullPost = $q.defer();
        spyOn(target.internal, 'getFullPost').and.returnValue(deferredGetFullPost.promise);

        spyOn(target.internal, 'replaceHiddenCharacters');
      });

      var testGetFullPostPath = function(){

        it('should set isLoading to true', function(){
          expect($scope.model.isLoading).toBe(true);
        });

        it('should not set showContent to false', function(){
          expect($scope.model.showContent).toBe(false);
        });

        it('should call getFullPost', function(){
          expect(target.internal.getFullPost).toHaveBeenCalledWith('postId');
        });

        describe('when getFullPost succeeds', function(){
          beforeEach(function(){
            deferredGetFullPost.resolve('post');
            $scope.$apply();
          });

          it('should call replaceHiddenCharacters', function(){
            expect(target.internal.replaceHiddenCharacters).toHaveBeenCalledWith('post');
          });

          it('should set the post to the scope', function(){
            expect($scope.post).toBe('post');
          });

          it('should set showContent to true', function(){
            expect($scope.model.showContent).toBe(true);
          });

          it('should complete successfully', function(){
            expect(success).toBe(true);
          });
        });

        describe('when getFullPost fails', function(){
          beforeEach(function(){
            deferredGetFullPost.reject('error');
            $scope.$apply();
          });

          it('should set the error message', function(){
            expect($scope.model.errorMessage).toBe('friendlyError');
          });

          it('should set isLoading to false', function(){
            expect($scope.model.isLoading).toBe(false);
          });

          it('should not set showContent to true', function(){
            expect($scope.model.showContent).toBe(false);
          });

          it('should complete successfully', function(){
            expect(success).toBe(true);
          });
        });
      };

      describe('when post does not exist', function(){
        beforeEach(function(){
          $scope.post = undefined;
          $scope.postId = 'postId';

          target.initialize().then(function(){ success = true; }, function(e) { error = e; });
          $scope.$apply();
        });

        testGetFullPostPath();
      });

      describe('when post exists without content', function(){
        beforeEach(function(){
          $scope.post = { postId: 'postId' };
          $scope.postId = undefined;

          target.initialize().then(function(){ success = true; }, function(e) { error = e; });
          $scope.$apply();
        });

        testGetFullPostPath();
      });

      describe('when post exists with content', function(){
        var post;
        beforeEach(function(){
          $scope.post = post = { postId: 'postId', content: 'content' };
          $scope.postId = undefined;

          target.initialize().then(function(){ success = true; }, function(e) { error = e; });
        });

        it('should set isLoading to true', function(){
          expect($scope.model.isLoading).toBe(true);
        });

        it('should not set showContent to false', function(){
          expect($scope.model.showContent).toBe(false);
        });

        it('should not call getFullPost', function(){
          expect(target.internal.getFullPost).not.toHaveBeenCalled();
        });

        describe('when post is returned', function(){
          beforeEach(function(){
            $scope.$apply();
          });

          it('should call replaceHiddenCharacters', function(){
            expect(target.internal.replaceHiddenCharacters).toHaveBeenCalledWith(post);
          });

          it('should set the post to the scope', function(){
            expect($scope.post).toBe(post);
          });

          it('should set showContent to true', function(){
            expect($scope.model.showContent).toBe(true);
          });

          it('should complete successfully', function(){
            expect(success).toBe(true);
          });
        });
      });
    });

    describe('when calling viewImage', function(){
      it('should forward the viewImage function to postInteractions', function(){
        $scope.viewImage('a', 'b');
        expect(postInteractions.viewImage).toHaveBeenCalledWith('a', 'b');
      });
    });

    describe('when calling openFile', function(){
      it('should forward the openFile function to postInteractions', function(){
        $scope.openFile('a');
        expect(postInteractions.openFile).toHaveBeenCalledWith('a');
      });
    });

    describe('when calling internal.showComments', function(){
      var success;
      var error;
      var updateCommentsCountDelegate;
      var post;
      var deferredShowComments;
      beforeEach(function(){
        success = undefined;
        error = undefined;
        updateCommentsCountDelegate = undefined;
        post = { postId: 'postId' };

        deferredShowComments = $q.defer();
        postInteractions.showComments.and.callFake(function(postId, isCommenting, updateCommentsCount){
          updateCommentsCountDelegate = updateCommentsCount;
          return deferredShowComments.promise;
        });

        target.internal.showComments(post, 'isCommenting')
          .then(function(){ success = true; }, function(e){ error = e; });
        $scope.$apply();
      });

      it('should call showComments', function(){
        expect(postInteractions.showComments).toHaveBeenCalledWith('postId', 'isCommenting', jasmine.any(Function));
      });

      it('should pass delegate to update comments count', function(){
        expect(post.commentsCount).toBeUndefined();
        updateCommentsCountDelegate('newCommentsCount');
        expect(post.commentsCount).toBe('newCommentsCount');
      });

      describe('when showComments succeeds', function(){
        beforeEach(function(){
          deferredShowComments.resolve();
          $scope.$apply();
        });

        it('should complete successfully', function(){
          expect(success).toBe(true);
        });
      });

      describe('when showComments fails', function(){
        beforeEach(function(){
          deferredShowComments.reject('error');
          $scope.$apply();
        });

        it('should propagate the error', function(){
          expect(error).toBe('error');
        });
      });
    });

    describe('when calling commentOnPost', function(){
      var success;
      var error;
      var deferredShowComments;
      beforeEach(function(){
        success = undefined;
        error = undefined;

        deferredShowComments = $q.defer();
        spyOn(target.internal, 'showComments').and.returnValue(deferredShowComments.promise);

        $scope.commentOnPost('post').then(function(){ success = true; }, function(e){ error = e; });
        $scope.$apply();
      });

      it('should call showComments', function(){
        expect(target.internal.showComments).toHaveBeenCalledWith('post', true);
      });

      describe('when showComments succeeds', function(){
        beforeEach(function(){
          deferredShowComments.resolve();
          $scope.$apply();
        });

        it('should complete successfully', function(){
          expect(success).toBe(true);
        });
      });

      describe('when showComments fails', function(){
        beforeEach(function(){
          deferredShowComments.reject('error');
          $scope.$apply();
        });

        it('should propagate the error', function(){
          expect(error).toBe('error');
        });
      });
    });

    describe('when calling viewComments', function(){
      var success;
      var error;
      var deferredShowComments;
      beforeEach(function(){
        success = undefined;
        error = undefined;

        deferredShowComments = $q.defer();
        spyOn(target.internal, 'showComments').and.returnValue(deferredShowComments.promise);

        $scope.viewComments('post')
          .then(function(){
            success = true;
          }, function(e){
            error = e;
          });
        $scope.$apply();
      });

      it('should call showComments', function(){
        expect(target.internal.showComments).toHaveBeenCalledWith('post', false);
      });

      describe('when showComments succeeds', function(){
        beforeEach(function(){
          deferredShowComments.resolve();
          $scope.$apply();
        });

        it('should complete successfully', function(){
          expect(success).toBe(true);
        });
      });

      describe('when showComments fails', function(){
        beforeEach(function(){
          deferredShowComments.reject('error');
          $scope.$apply();
        });

        it('should propagate the error', function(){
          expect(error).toBe('error');
        });
      });
    });

    describe('when calling toggleLikePost', function(){
      var success;
      var error;
      var deferredToggleLikePost;
      var post;
      beforeEach(function(){
        success = undefined;
        error = undefined;

        deferredToggleLikePost = $q.defer();
        postInteractions.toggleLikePost.and.returnValue(deferredToggleLikePost.promise);

        post = { postId: 'postId', likesCount: 'likesCount', hasLiked: 'hasLiked' };
        $scope.toggleLikePost(post).then(function(){ success = true; }, function(e) { error = e; });
        $scope.$apply();
      });

      it('should call toggleLikePost', function(){
        expect(postInteractions.toggleLikePost).toHaveBeenCalledWith(post);
      });

      describe('when toggleLikePost succeeds', function(){
        describe('when updateLikeStatus does not exist', function(){
          beforeEach(function(){
            deferredToggleLikePost.resolve();
            $scope.$apply();
          });

          it('should complete successfully', function(){
            expect(success).toBe(true);
          });
        });

        describe('when updateLikeStatus exists', function(){
          beforeEach(function(){
            $scope.updateLikeStatus = jasmine.createSpy('updateLikeStatus');
            deferredToggleLikePost.resolve();
            $scope.$apply();
          });

          it('should call updateLikeStatus', function(){
            expect($scope.updateLikeStatus).toHaveBeenCalledWith({ likesCount: 'likesCount', hasLiked: 'hasLiked' });
          });

          it('should complete successfully', function(){
            expect(success).toBe(true);
          });
        });
      });

      describe('when toggleLikePost fails', function(){
        beforeEach(function(){
          deferredToggleLikePost.reject('error');
          $scope.$apply();
        });

        it('should set the error message', function(){
          expect($scope.model.errorMessage).toBe('friendlyError');
        });

        it('should complete successfully', function(){
          expect(success).toBe(true);
        });
      });
    });

    describe('when calling getFullPost', function(){
      var result;
      var error;
      var deferredGetPost;
      var deferredProcessPostForRendering;
      var post;
      beforeEach(function(){
        result = undefined;
        error = undefined;

        deferredGetPost = $q.defer();
        postStub.getPost.and.returnValue(deferredGetPost.promise);

        deferredProcessPostForRendering = $q.defer();
        postUtilities.processPostForRendering.and.returnValue(deferredProcessPostForRendering.promise);

        post = { postId: 'postId' };

        target.internal.getFullPost(post.postId).then(function(r){ result = r; }, function(e) { error = e; });
        $scope.$apply();
      });

      it('should call getPost', function(){
        expect(postStub.getPost).toHaveBeenCalledWith('postId');
      });

      describe('when getPost succeeds', function(){
        beforeEach(function(){
          deferredGetPost.resolve({ data: { post: post, files: 'files' } });
          $scope.$apply();
        });

        it('should set files into the post', function(){
          expect(post.files).toBe('files');
        });

        it('should call processPostForRendering', function(){
          expect(postUtilities.processPostForRendering).toHaveBeenCalledWith(post, accountSettingsRepository, blogRepository, subscriptionRepository);
        });

        describe('when processPostForRendering succeeds', function(){
          beforeEach(function(){
            deferredProcessPostForRendering.resolve();
            $scope.$apply();
          });

          it('should complete successfully with the post', function(){
            expect(result).toBe(post);
          });
        });

        describe('when processPostForRendering fails', function(){
          beforeEach(function(){
            deferredProcessPostForRendering.reject('error');
            $scope.$apply();
          });

          it('should propagate the error', function(){
            expect(error).toBe('error');
          });
        });
      });

      describe('when getPost fails', function(){
        beforeEach(function(){
          deferredGetPost.reject('error');
          $scope.$apply();
        });

        it('should propagate the error', function(){
          expect(error).toBe('error');
        });
      });
    });

    describe('when calling replaceHiddenCharacters', function(){
      var post;
      beforeEach(function(){
        post = {
          blocks: [
            {
              type: 'image',
              data: {
                text: 'bl⁂⁂'
              }
            },
            {
              type: 'text',
              data: {
                text: 'bl⁂⁂'
              }
            },
            {
              type: 'file',
              data: {
                text: 'bl⁂⁂'
              }
            },
            {
              type: 'text',
              data: {
                text: 'bl⁂⁂'
              }
            }
          ]
        };
      });

      describe('when user does not have read access to post', function(){
        beforeEach(function(){
          post.readAccess = false;
          target.internal.replaceHiddenCharacters(post);
        });

        it('should replace hidden characters in text blocks', function(){
          expect(post).toEqual({
            readAccess: false,
            blocks: [
              {
                type: 'image',
                data: {
                  text: 'bl⁂⁂'
                }
              },
              {
                type: 'text',
                data: {
                  text: 'bl●●'
                }
              },
              {
                type: 'file',
                data: {
                  text: 'bl⁂⁂'
                }
              },
              {
                type: 'text',
                data: {
                  text: 'bl●●'
                }
              }
            ]
          });
        });
      });

      describe('when user has read access to post', function(){
        beforeEach(function(){
          post.readAccess = true;
          target.internal.replaceHiddenCharacters(post);
        });

        it('should not replace hidden characters in text blocks', function(){
          expect(post).toEqual({
            readAccess: true,
            blocks: [
              {
                type: 'image',
                data: {
                  text: 'bl⁂⁂'
                }
              },
              {
                type: 'text',
                data: {
                  text: 'bl⁂⁂'
                }
              },
              {
                type: 'file',
                data: {
                  text: 'bl⁂⁂'
                }
              },
              {
                type: 'text',
                data: {
                  text: 'bl⁂⁂'
                }
              }
            ]
          });
        });
      });
    });
  });
});
