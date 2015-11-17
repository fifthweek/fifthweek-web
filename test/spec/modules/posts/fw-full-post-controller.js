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
  var fullPostLoader;
  var errorFacade;
  var initializer;
  var signInWorkflowService;

  var aggregateUserStateConstants;
  var uiRouterConstants;

  beforeEach(function() {

    postInteractions = jasmine.createSpyObj('postInteractions', ['viewImage', 'openFile', 'showComments', 'toggleLikePost']);
    blogRepositoryFactory = jasmine.createSpyObj('blogRepositoryFactory', ['forCurrentUser']);
    blogRepository = jasmine.createSpyObj('blogRepository', ['getUserId']);
    blogRepositoryFactory.forCurrentUser.and.returnValue(blogRepository);
    subscriptionRepositoryFactory = jasmine.createSpyObj('subscriptionRepositoryFactory', ['forCurrentUser']);
    subscriptionRepository = 'subscriptionRepository';
    subscriptionRepositoryFactory.forCurrentUser.and.returnValue(subscriptionRepository);
    accountSettingsRepositoryFactory = jasmine.createSpyObj('accountSettingsRepositoryFactory', ['forCurrentUser']);
    accountSettingsRepository = jasmine.createSpyObj('accountSettingsRepository', ['decrementFreePostsRemaining']);
    accountSettingsRepositoryFactory.forCurrentUser.and.returnValue(accountSettingsRepository);
    postStub = jasmine.createSpyObj('postStub', ['getPost']);
    fullPostLoader = jasmine.createSpyObj('fullPostLoader', ['loadPost']);
    errorFacade = jasmine.createSpyObj('errorFacade', ['handleError']);
    initializer = jasmine.createSpyObj('initializer', ['initialize']);
    signInWorkflowService = jasmine.createSpyObj('signInWorkflowService', ['beginSignInWorkflow']);

    blogRepository.getUserId.and.returnValue('userId');

    module('webApp');
    module(function($provide) {
      $provide.value('postInteractions', postInteractions);
      $provide.value('blogRepositoryFactory', blogRepositoryFactory);
      $provide.value('subscriptionRepositoryFactory', subscriptionRepositoryFactory);
      $provide.value('accountSettingsRepositoryFactory', accountSettingsRepositoryFactory);
      $provide.value('postStub', postStub);
      $provide.value('fullPostLoader', fullPostLoader);
      $provide.value('errorFacade', errorFacade);
      $provide.value('initializer', initializer);
      $provide.value('signInWorkflowService', signInWorkflowService);
    });

    inject(function ($injector) {
      $q = $injector.get('$q');
      $scope = $injector.get('$rootScope').$new();
      aggregateUserStateConstants = $injector.get('aggregateUserStateConstants');
      uiRouterConstants = $injector.get('uiRouterConstants');
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

    it('should create the model with the current user id', function(){
      expect($scope.model).toEqual({ userId: 'userId' });
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
  });

  describe('when created', function(){
    beforeEach(function(){
      createController();
    });

    describe('when calling initialize', function(){
      var result;
      beforeEach(function(){
        result = undefined;
        spyOn(target.internal, 'attachToEvents');
        spyOn(target.internal, 'loadPost').and.returnValue('result');
      });

      var standardTests = function(){

        it('should call attachToEvents', function(){
          expect(target.internal.attachToEvents).toHaveBeenCalledWith();
        });

        it('should return the result', function(){
          expect(result).toBe('result');
        });
      };

      describe('when post does not exist', function(){
        beforeEach(function(){
          $scope.post = undefined;
          $scope.postId = 'postId';

          result = target.initialize();
        });

        standardTests();

        it('should call loadPost with loadFullPostFromApi', function(){
          expect(target.internal.loadPost).toHaveBeenCalledWith(target.internal.loadFullPostFromApi);
        });
      });

      describe('when post exists without content', function(){
        beforeEach(function(){
          $scope.post = { postId: 'postId' };
          $scope.postId = undefined;

          result = target.initialize();
        });

        standardTests();

        it('should call loadPost with loadFullPostFromApi', function(){
          expect(target.internal.loadPost).toHaveBeenCalledWith(target.internal.loadFullPostFromApi);
        });
      });

      describe('when post exists with content', function(){
        var post;
        beforeEach(function(){
          $scope.post = post = { postId: 'postId', content: 'content' };
          $scope.postId = undefined;

          result = target.initialize();
        });

        standardTests();

        it('should call loadPost with getFullPostFromScope', function(){
          expect(target.internal.loadPost).toHaveBeenCalledWith(target.internal.getFullPostFromScope);
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

    describe('requestFreePost', function(){
      var success;
      var error;
      var deferredReloadPost;
      var deferredDecrementFreePostsRemaining;
      beforeEach(function(){
        success = undefined;
        error = undefined;

        deferredReloadPost = $q.defer();
        spyOn(target.internal, 'reloadPost').and.returnValue(deferredReloadPost.promise);

        deferredDecrementFreePostsRemaining = $q.defer();
        accountSettingsRepository.decrementFreePostsRemaining.and.returnValue(deferredDecrementFreePostsRemaining.promise);

        $scope.requestFreePost().then(function(){ success = true; }, function(e){ error = e; });
        $scope.$apply();
      });

      it('should call reloadPost', function(){
        expect(target.internal.reloadPost).toHaveBeenCalledWith(true);
      });

      describe('when reloadPost succeeds', function(){
        beforeEach(function(){
          deferredReloadPost.resolve();
          $scope.$apply();
        });

        it('should call decrementFreePostsRemaining', function(){
          expect(accountSettingsRepository.decrementFreePostsRemaining).toHaveBeenCalledWith();
        });

        describe('when decrementFreePostsRemaining succeeds', function(){
          beforeEach(function(){
            deferredDecrementFreePostsRemaining.resolve();
            $scope.$apply();
          });

          it('should complete successfully', function(){
            expect(success).toBe(true);
          });
        });

        describe('when decrementFreePostsRemaining fails', function(){
          beforeEach(function(){
            deferredDecrementFreePostsRemaining.reject('error');
            $scope.$apply();
          });

          it('should propagate the error', function(){
            expect(error).toBe('error');
          });
        });
      });

      describe('when reloadPost succeeds with false result', function(){
        beforeEach(function(){
          deferredReloadPost.resolve(false);
          $scope.$apply();
        });

        it('should not call decrementFreePostsRemaining', function(){
          expect(accountSettingsRepository.decrementFreePostsRemaining).not.toHaveBeenCalled();
        });

        it('should complete successfully', function(){
          expect(success).toBe(true);
        });
      });

      describe('when reloadPost fails', function(){
        beforeEach(function(){
          deferredReloadPost.reject('error');
          $scope.$apply();
        });

        it('should propagate the error', function(){
          expect(error).toBe('error');
        });
      });
    });

    describe('when calling getFullPost', function(){
      it('should call loadPost', function(){
        fullPostLoader.loadPost.and.returnValue('result');
        var result = target.internal.getFullPost('postId', 'requestFreePost');
        expect(fullPostLoader.loadPost).toHaveBeenCalledWith('postId', accountSettingsRepository, blogRepository, subscriptionRepository, 'requestFreePost');
        expect(result).toBe('result');
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

    describe('ensureSignedIn', function(){
      describe('when signed in', function(){
        var result;
        beforeEach(function(){
          result = undefined;
          $scope.model.userId = 'userId';
          target.internal.ensureSignedIn().then(function(r){ result = r; });
          $scope.$apply();
        });

        it('should return true', function(){
          expect(result).toBe(true);
        });
      });

      describe('when not signed in', function(){
        var result;
        var error;
        var deferredBeginSignInWorkflow;
        beforeEach(function(){
          result = undefined;
          error = undefined;

          $scope.model.userId = undefined;

          deferredBeginSignInWorkflow = $q.defer();
          signInWorkflowService.beginSignInWorkflow.and.returnValue(deferredBeginSignInWorkflow.promise);

          target.internal.ensureSignedIn().then(function(r){ result = r; }, function(e){ error = e; });
          $scope.$apply();
        });

        it('should call beginSignInWorkflow', function(){
          expect(signInWorkflowService.beginSignInWorkflow).toHaveBeenCalledWith();
        });

        describe('when beginSignInWorkflow succeeds', function(){
          beforeEach(function(){
            deferredBeginSignInWorkflow.resolve('result');
            $scope.$apply();
          });

          it('should succeed with result', function(){
            expect(result).toBe('result');
          });
        });

        describe('when beginSignInWorkflow fails', function(){
          beforeEach(function(){
            deferredBeginSignInWorkflow.reject('error');
            $scope.$apply();
          });

          it('should propagate the error', function(){
            expect(error).toBe('error');
          });
        });
      });
    });

    describe('reloadPost', function(){
      describe('when requesting free post', function(){
        var result;
        var error;
        var deferredEnsureSignedIn;
        var deferredLoadPost;
        beforeEach(function(){
          result = undefined;
          error = undefined;

          accountSettingsRepositoryFactory.forCurrentUser.calls.reset();
          blogRepositoryFactory.forCurrentUser.calls.reset();
          subscriptionRepositoryFactory.forCurrentUser.calls.reset();
          $scope.model.userId = undefined;

          deferredEnsureSignedIn = $q.defer();
          spyOn(target.internal, 'ensureSignedIn').and.returnValue(deferredEnsureSignedIn.promise);

          deferredLoadPost = $q.defer();
          spyOn(target.internal, 'loadPost').and.returnValue(deferredLoadPost.promise);

          target.internal.reloadPost(true).then(function(r){ result = r; }, function(e){ error = e; });
          $scope.$apply();
        });

        it('should get a new accountSettingsRespository', function(){
          expect(accountSettingsRepositoryFactory.forCurrentUser).toHaveBeenCalledWith();
        });

        it('should get a new blogRespository', function(){
          expect(blogRepositoryFactory.forCurrentUser).toHaveBeenCalledWith();
        });

        it('should get a new subscriptionRespository', function(){
          expect(subscriptionRepositoryFactory.forCurrentUser).toHaveBeenCalledWith();
        });

        it('should set the user id', function(){
          expect($scope.model.userId).toBe('userId');
        });

        it('should call ensureSignedIn', function(){
          expect(target.internal.ensureSignedIn).toHaveBeenCalledWith();
        });

        describe('when ensureSignedIn succeeds with false', function(){
          beforeEach(function(){
            deferredEnsureSignedIn.resolve(false);
            $scope.$apply();
          });

          it('should not call loadPost', function(){
            expect(target.internal.loadPost).not.toHaveBeenCalled();
          });

          it('should return false', function(){
            expect(result).toBe(false);
          });
        });

        describe('when ensureSignedIn succeeds with true', function(){
          beforeEach(function(){
            deferredEnsureSignedIn.resolve(true);
            $scope.$apply();
          });

          it('should call loadPost', function(){
            expect(target.internal.loadPost).toHaveBeenCalledWith(target.internal.requestFreePostFromApi);
          });

          describe('when loadPost succeeds', function(){
            beforeEach(function(){
              deferredLoadPost.resolve('result');
              $scope.$apply();
            });

            it('should return the result', function(){
              expect(result).toBe('result');
            });
          });

          describe('when loadPost fails', function(){
            beforeEach(function(){
              deferredLoadPost.reject('error');
              $scope.$apply();
            });

            it('should propagate the error', function(){
              expect(error).toBe('error');
            });
          });
        });

        describe('when ensureSignedIn fails', function(){
          beforeEach(function(){
            deferredEnsureSignedIn.reject('error');
            $scope.$apply();
          });

          it('should propagate the error', function(){
            expect(error).toBe('error');
          });
        });
      });

      describe('when not requesting free post', function(){
        var result;
        beforeEach(function(){
          accountSettingsRepositoryFactory.forCurrentUser.calls.reset();
          blogRepositoryFactory.forCurrentUser.calls.reset();
          subscriptionRepositoryFactory.forCurrentUser.calls.reset();
          $scope.model.userId = undefined;

          spyOn(target.internal, 'loadPost').and.returnValue('result');

          result = target.internal.reloadPost();
        });

        it('should get a new accountSettingsRespository', function(){
          expect(accountSettingsRepositoryFactory.forCurrentUser).toHaveBeenCalledWith();
        });

        it('should get a new blogRespository', function(){
          expect(blogRepositoryFactory.forCurrentUser).toHaveBeenCalledWith();
        });

        it('should get a new subscriptionRespository', function(){
          expect(subscriptionRepositoryFactory.forCurrentUser).toHaveBeenCalledWith();
        });

        it('should set the user id', function(){
          expect($scope.model.userId).toBe('userId');
        });

        it('should call loadPost with loadFullPostFromApi', function(){
          expect(target.internal.loadPost).toHaveBeenCalledWith(target.internal.loadFullPostFromApi);
        });

        it('should return the result', function(){
          expect(result).toBe('result');
        });
      });
    });

    describe('loadFullPostFromApi', function(){
      var result;
      beforeEach(function(){
        spyOn(target.internal, 'getFullPost').and.returnValue('result');
      });

      describe('when scope contains postId', function(){
        beforeEach(function(){
          $scope.postId = 'postId';
          $scope.post = { postId: 'postId2' };

          result = target.internal.loadFullPostFromApi();
        });

        it('should call loadPost with postId', function(){
          expect(target.internal.getFullPost).toHaveBeenCalledWith('postId', false);
        });

        it('should return the result', function(){
          expect(result).toBe('result');
        });
      });

      describe('when scope contains post but no postId', function(){
        beforeEach(function(){
          $scope.postId = undefined;
          $scope.post = { postId: 'postId2' };

          result = target.internal.loadFullPostFromApi();
        });

        it('should call loadPost with postId', function(){
          expect(target.internal.getFullPost).toHaveBeenCalledWith('postId2', false);
        });

        it('should return the result', function(){
          expect(result).toBe('result');
        });
      });
    });

    describe('requestFreePostFromApi', function(){
      var result;
      beforeEach(function(){
        spyOn(target.internal, 'getFullPost').and.returnValue('result');
      });

      describe('when scope contains postId', function(){
        beforeEach(function(){
          $scope.postId = 'postId';
          $scope.post = { postId: 'postId2' };

          result = target.internal.requestFreePostFromApi();
        });

        it('should call loadPost with postId', function(){
          expect(target.internal.getFullPost).toHaveBeenCalledWith('postId', true);
        });

        it('should return the result', function(){
          expect(result).toBe('result');
        });
      });

      describe('when scope contains post but no postId', function(){
        beforeEach(function(){
          $scope.postId = undefined;
          $scope.post = { postId: 'postId2' };

          result = target.internal.requestFreePostFromApi();
        });

        it('should call loadPost with postId', function(){
          expect(target.internal.getFullPost).toHaveBeenCalledWith('postId2', true);
        });

        it('should return the result', function(){
          expect(result).toBe('result');
        });
      });
    });

    describe('getFullPostFromScope', function(){
      it('should return the post on the scope', function(){
        $scope.post = 'post';

        var result;
        target.internal.getFullPostFromScope().then(function(r){ result = r; });
        $scope.$apply();

        expect(result).toBe('post');
      });
    });

    describe('attachToEvents', function(){
      beforeEach(function(){
        spyOn($scope, '$on');
      });

      describe('when dialog', function(){
        beforeEach(function(){
          $scope.isDialog = true;
          $scope.closeDialog = 'closeDialog';
          target.internal.attachToEvents();
        });

        it('should attach to user state updated event', function(){
          expect($scope.$on).toHaveBeenCalledWith(aggregateUserStateConstants.updatedEvent, target.internal.reloadPost);
        });

        it('should attach to state change start event', function(){
          expect($scope.$on).toHaveBeenCalledWith(uiRouterConstants.stateChangeStartEvent, 'closeDialog');
        });
      });

      describe('when not dialog', function(){
        beforeEach(function(){
          $scope.isDialog = false;
          $scope.closeDialog = 'closeDialog';
          target.internal.attachToEvents();
        });

        it('should attach to user state updated event', function(){
          expect($scope.$on).toHaveBeenCalledWith(aggregateUserStateConstants.updatedEvent, target.internal.reloadPost);
        });

        it('should not attach to state change start event', function(){
          expect($scope.$on).not.toHaveBeenCalledWith(uiRouterConstants.stateChangeStartEvent, 'closeDialog');
        });
      });
    });

    describe('loadPost', function(){
      var success;
      var deferredGetFullPost;
      var getFullPost;
      beforeEach(function(){
        deferredGetFullPost = $q.defer();

        spyOn(target.internal, 'replaceHiddenCharacters');

        getFullPost = jasmine.createSpy('getFullPost');
        getFullPost.and.returnValue(deferredGetFullPost.promise);

        target.internal.loadPost(getFullPost).then(function(){ success = true; });
      });

      it('should set isLoading to true', function(){
        expect($scope.model.isLoading).toBe(true);
      });

      it('should set showContent to false', function(){
        expect($scope.model.showContent).toBe(false);
      });

      it('should call getFullPost', function(){
        expect(getFullPost).toHaveBeenCalledWith();
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

        it('should set isLoading to false', function(){
          expect($scope.model.isLoading).toBe(false);
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
    });
  });
});
