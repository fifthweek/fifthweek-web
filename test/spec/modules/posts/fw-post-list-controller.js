describe('fw-post-list-controller', function(){
  'use strict';

  var $q;
  var $scope;
  var target;

  var postInteractions;
  var authenticationService;
  var blogRepositoryFactory;
  var blogRepository;
  var subscriptionRepositoryFactory;
  var subscriptionRepository;
  var accountSettingsRepositoryFactory;
  var accountSettingsRepository;
  var fetchAggregateUserState;
  var postsStub;
  var errorFacade;
  var postUtilities;
  var fwPostListConstants;

  beforeEach(function() {

    postInteractions = jasmine.createSpyObj('postInteractions', ['viewImage', 'openFile', 'editPost', 'deletePost', 'showComments', 'likePost', 'unlikePost']);
    authenticationService = { currentUser: { userId: 'currentUserId' }};
    blogRepositoryFactory = jasmine.createSpyObj('blogRepositoryFactory', ['forCurrentUser']);
    blogRepository = 'blogRepository';
    blogRepositoryFactory.forCurrentUser.and.returnValue(blogRepository);
    subscriptionRepositoryFactory = jasmine.createSpyObj('subscriptionRepositoryFactory', ['forCurrentUser']);
    subscriptionRepository = 'subscriptionRepository';
    subscriptionRepositoryFactory.forCurrentUser.and.returnValue(subscriptionRepository);
    accountSettingsRepositoryFactory = jasmine.createSpyObj('accountSettingsRepositoryFactory', ['forCurrentUser']);
    accountSettingsRepository = 'accountSettingsRepository';
    accountSettingsRepositoryFactory.forCurrentUser.and.returnValue(accountSettingsRepository);
    fetchAggregateUserState = jasmine.createSpyObj('fetchAggregateUserState', ['updateInParallel']);
    postsStub = jasmine.createSpyObj('postsStub', ['getCreatorBacklog', 'getNewsfeed']);
    errorFacade = jasmine.createSpyObj('errorFacade', ['handleError']);
    postUtilities = jasmine.createSpyObj('postUtilities', ['populateCurrentCreatorInformation', 'populateCreatorInformation', 'processPostsForRendering', 'removePost', 'replacePostAndReorderIfRequired']);

    module('webApp');
    module(function($provide) {
      $provide.value('postInteractions', postInteractions);
      $provide.value('authenticationService', authenticationService);
      $provide.value('blogRepositoryFactory', blogRepositoryFactory);
      $provide.value('subscriptionRepositoryFactory', subscriptionRepositoryFactory);
      $provide.value('accountSettingsRepositoryFactory', accountSettingsRepositoryFactory);
      $provide.value('fetchAggregateUserState', fetchAggregateUserState);
      $provide.value('postsStub', postsStub);
      $provide.value('errorFacade', errorFacade);
      $provide.value('postUtilities', postUtilities);
    });

    inject(function ($injector) {
      $q = $injector.get('$q');
      $scope = $injector.get('$rootScope').$new();
      fwPostListConstants = $injector.get('fwPostListConstants');
    });

    errorFacade.handleError.and.callFake(function(error, setMessage) {
      setMessage('friendlyError');
      return $q.when();
    });
  });

  var createController = function(){
    inject(function ($controller) {
      target = $controller('fwPostListCtrl', { $scope: $scope });
    });
  };

  describe('when creating', function(){
    beforeEach(function(){
      createController();
    });

    it('should create the model', function(){
      expect($scope.model).toBeDefined();
    });

    it('should set posts to undefined', function(){
      expect($scope.model.posts).toBeUndefined();
    });

    it('should set isLoading to false', function(){
      expect($scope.model.isLoading).toBe(false);
    });

    it('should not have an error message', function(){
      expect($scope.model.errorMessage).toBeUndefined();
    });

    it('should assign the current user id', function(){
      expect(target.internal.currentUserId).toBe('currentUserId');
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
      fetchAggregateUserState.updateInParallel.and.returnValue($q.when());
      createController();
    });

    describe('when populateCreatorInformation is called', function(){
      describe('when current user is creator', function(){
        var result;
        var error;
        var deferredPopulateCurrentCreatorInformation;
        beforeEach(function(){
          target.internal.timelineUserId = target.internal.currentUserId;

          result = undefined;
          error = undefined;
          deferredPopulateCurrentCreatorInformation = $q.defer();
          postUtilities.populateCurrentCreatorInformation.and.returnValue(deferredPopulateCurrentCreatorInformation.promise);

          target.internal.populateCreatorInformation('posts').then(function(r){ result = r; }, function(e) { error = e; });
          $scope.$apply();
        });

        it('should call populateCurrentCreatorInformation', function(){
          expect(postUtilities.populateCurrentCreatorInformation).toHaveBeenCalledWith('posts', accountSettingsRepository, blogRepository);
        });

        describe('when populateCurrentCreatorInformation succeeds', function(){
          beforeEach(function(){
            deferredPopulateCurrentCreatorInformation.resolve('result');
            $scope.$apply();
          });

          it('should complete successfully', function(){
            expect(result).toBe('result');
          });
        });

        describe('when populateCurrentCreatorInformation fails', function(){
          beforeEach(function(){
            deferredPopulateCurrentCreatorInformation.reject('error');
            $scope.$apply();
          });

          it('should propagate the error', function(){
            expect(error).toBe('error');
          });
        });
      });

      describe('when current user is not creator', function(){
        var result;
        var error;
        var deferredPopulateCreatorInformation;
        beforeEach(function(){
          target.internal.timelineUserId = 'anotherUserId';

          result = undefined;
          error = undefined;
          deferredPopulateCreatorInformation = $q.defer();
          postUtilities.populateCreatorInformation.and.returnValue(deferredPopulateCreatorInformation.promise);

          target.internal.populateCreatorInformation('posts').then(function(r){ result = r; }, function(e) { error = e; });
          $scope.$apply();
        });

        it('should call populateCreatorInformation', function(){
          expect(postUtilities.populateCreatorInformation).toHaveBeenCalledWith('posts', subscriptionRepository);
        });

        describe('when populateCreatorInformation succeeds', function(){
          beforeEach(function(){
            deferredPopulateCreatorInformation.resolve('result');
            $scope.$apply();
          });

          it('should complete successfully', function(){
            expect(result).toBe('result');
          });
        });

        describe('when populateCreatorInformation fails', function(){
          beforeEach(function(){
            deferredPopulateCreatorInformation.reject('error');
            $scope.$apply();
          });

          it('should propagate the error', function(){
            expect(error).toBe('error');
          });
        });
      });
    });

    describe('when loadPosts is called', function(){
      var success;
      var error;
      var deferredPopulateCreatorInformation;
      var deferredProcessPostsForRendering;
      var deferredUpdateInParallel;
      beforeEach(function(){
        success = undefined;
        error = undefined;

        deferredPopulateCreatorInformation = $q.defer();
        spyOn(target.internal, 'populateCreatorInformation').and.returnValue(deferredPopulateCreatorInformation.promise);

        deferredProcessPostsForRendering = $q.defer();
        postUtilities.processPostsForRendering.and.returnValue(deferredProcessPostsForRendering.promise);

        deferredUpdateInParallel = $q.defer();
        fetchAggregateUserState.updateInParallel.and.callFake(function(userId, delegate){
          delegate();
          return deferredUpdateInParallel.promise;
        });

        spyOn(target.internal, 'loadNext');

        $scope.model.isLoading = false;
        $scope.model.errorMessage = 'old-error';
        target.internal.loadPosts().then(function(){ success = true; }, function(e) { error = e; });
      });

      var testFailure = function(){
        it('should log the error', function(){
          expect(errorFacade.handleError).toHaveBeenCalledWith('error', jasmine.any(Function));
        });

        it('should update the error message', function(){
          expect($scope.model.errorMessage).toBe('friendlyError');
        });

        it('should set isLoading to false', function(){
          expect($scope.model.isLoading).toBe(false);
        });
      };

      it('should set isLoading to true', function(){
        expect($scope.model.isLoading).toBe(true);
      });

      it('should clear the error message', function(){
        expect($scope.model.errorMessage).toBeUndefined();
      });

      it('should call updateInParallel', function(){
        expect(fetchAggregateUserState.updateInParallel).toHaveBeenCalledWith('currentUserId', jasmine.any(Function));
      });

      it('should call loadNext', function(){
        expect(target.internal.loadNext).toHaveBeenCalledWith(0, 1000);
      });

      describe('when updateInParallel succeeds', function(){
        beforeEach(function(){
          deferredUpdateInParallel.resolve({
            posts: 'posts'
          });
          $scope.$apply();
        });

        it('should call populateCreatorInformation', function(){
          expect(target.internal.populateCreatorInformation).toHaveBeenCalledWith('posts');
        });

        describe('when populateCreatorInformation succeeds', function(){
          beforeEach(function(){
            deferredPopulateCreatorInformation.resolve();
            $scope.$apply();
          });

          it('should call processPostsForRendering', function(){
            expect(postUtilities.processPostsForRendering).toHaveBeenCalledWith('posts');
          });

          describe('when processPostsForRendering succeeds', function(){
            beforeEach(function(){
              deferredProcessPostsForRendering.resolve();
              $scope.$apply();
            });

            it('should assign posts to the model', function(){
              expect($scope.model.posts).toBe('posts');
            });

            it('should complete successfully', function(){
              expect(success).toBe(true);
            });

            it('should set isLoading to false', function(){
              expect($scope.model.isLoading).toBe(false);
            });
          });

          describe('when processPostsForRendering fails', function(){
            beforeEach(function(){
              deferredProcessPostsForRendering.reject('error');
              $scope.$apply();
            });

            testFailure();
          });
        });

        describe('when populateCreatorInformation fails', function(){
          beforeEach(function(){
            deferredPopulateCreatorInformation.reject('error');
            $scope.$apply();
          });

          testFailure();
        });
      });

      describe('when updateInParallel fails', function(){
        beforeEach(function(){
          deferredUpdateInParallel.reject('error');
          $scope.$apply();
        });

        testFailure();
      });
    });

    describe('when attachToReloadEvent is called', function(){
      beforeEach(function(){
        spyOn($scope, '$on');
        target.internal.attachToReloadEvent();
      });

      it('should attach to the reload event', function(){
        expect($scope.$on).toHaveBeenCalledWith(fwPostListConstants.reloadEvent, target.internal.loadPosts);
      });
    });

    describe('when calling initialize', function(){

      beforeEach(function(){
        spyOn(target.internal, 'attachToReloadEvent');
        spyOn(target.internal, 'loadPosts');
      });

      describe('when initialized with creator-backlog source', function(){

        beforeEach(function(){
          $scope.source = fwPostListConstants.sources.creatorBacklog;
          target.initialize();
          $scope.$apply();
        });

        it('should assign the current user id to the timeline user id', function(){
          expect(target.internal.timelineUserId).toBe('currentUserId');
        });

        it('should call attachToReloadEvent', function(){
          expect(target.internal.attachToReloadEvent).toHaveBeenCalledWith();
        });

        it('should call loadPosts', function(){
          expect(target.internal.loadPosts).toHaveBeenCalledWith();
        });

        describe('when loadNext is called', function(){
          var result;
          beforeEach(function(){
            result = undefined;
            postsStub.getCreatorBacklog.and.returnValue($q.when({ data: 'data' }));
            target.internal.loadNext().then(function(r){ result = r; });
            $scope.$apply();
          });

          it('should call getCreatorBacklog', function(){
            expect(postsStub.getCreatorBacklog).toHaveBeenCalledWith('currentUserId');
          });

          it('should return the result', function(){
            expect(result).toEqual({posts: 'data'});
          });
        });
      });

      describe('when initialized with creator-timeline source', function(){

        beforeEach(function(){
          $scope.source = fwPostListConstants.sources.creatorTimeline;
          $scope.collectionId = 'collectionId';
          $scope.channelId = 'channelId';
          target.initialize();
          $scope.$apply();
        });

        it('should assign the current user id to the timeline user id', function(){
          expect(target.internal.timelineUserId).toBe('currentUserId');
        });

        it('should call attachToReloadEvent', function(){
          expect(target.internal.attachToReloadEvent).toHaveBeenCalledWith();
        });

        it('should call loadPosts', function(){
          expect(target.internal.loadPosts).toHaveBeenCalledWith();
        });

        describe('when loadNext is called', function(){
          var result;
          beforeEach(function(){
            result = undefined;
            postsStub.getNewsfeed.and.returnValue($q.when({ data: 'data' }));
            target.internal.loadNext(10, 20).then(function(r){ result = r; });
            $scope.$apply();
          });

          it('should call getNewsfeed', function(){
            expect(postsStub.getNewsfeed).toHaveBeenCalledWith({
              creatorId: 'currentUserId',
              startIndex: 10,
              collectionId: 'collectionId',
              channelId: 'channelId',
              count: 20
            });
          });

          it('should return the result', function(){
            expect(result).toEqual('data');
          });
        });
      });

      describe('when initialized with timeline source', function(){

        beforeEach(function(){
          $scope.source = fwPostListConstants.sources.timeline;
          $scope.userId = 'anotherUserId';
          $scope.collectionId = 'collectionId';
          $scope.channelId = 'channelId';
          target.initialize();
          $scope.$apply();
        });

        it('should assign the scope user id to the timeline user id', function(){
          expect(target.internal.timelineUserId).toBe('anotherUserId');
        });

        it('should call attachToReloadEvent', function(){
          expect(target.internal.attachToReloadEvent).toHaveBeenCalledWith();
        });

        it('should call loadPosts', function(){
          expect(target.internal.loadPosts).toHaveBeenCalledWith();
        });

        describe('when loadNext is called', function(){
          var result;
          beforeEach(function(){
            result = undefined;
            postsStub.getNewsfeed.and.returnValue($q.when({ data: 'data' }));
            target.internal.loadNext(10, 20).then(function(r){ result = r; });
            $scope.$apply();
          });

          it('should call getNewsfeed', function(){
            expect(postsStub.getNewsfeed).toHaveBeenCalledWith({
              creatorId: 'anotherUserId',
              startIndex: 10,
              collectionId: 'collectionId',
              channelId: 'channelId',
              count: 20
            });
          });

          it('should return the result', function(){
            expect(result).toEqual('data');
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

    describe('when calling editPost', function(){
      var post1;
      var post2;

      beforeEach(function(){
        post1 = { moment: 'moment' };
        post2 = { moment: 'moment2' };
        $scope.model.posts = [ post1 ];
      });

      describe('when the dialog is saved', function(){
        describe('when the source is the backlog', function(){
          beforeEach(function(){
            $scope.source = fwPostListConstants.sources.creatorBacklog;
            postInteractions.editPost.and.returnValue({
              result: $q.when(post2)
            });

            $scope.editPost(post1);
            $scope.$apply();
          });

          it('should forward the call to postInteractions', function(){
            expect(postInteractions.editPost).toHaveBeenCalledWith(post1);
          });

          it('should reorder posts if required', function(){
            expect(postUtilities.replacePostAndReorderIfRequired).toHaveBeenCalledWith(
              true, $scope.model.posts, post1.moment, post2
            );
          });
        });

        describe('when the source is the backlog', function(){
          beforeEach(function(){
            $scope.source = fwPostListConstants.sources.creatorTimeline;
            postInteractions.editPost.and.returnValue({
              result: $q.when(post2)
            });

            $scope.editPost(post1);
            $scope.$apply();
          });

          it('should forward the call to postInteractions', function(){
            expect(postInteractions.editPost).toHaveBeenCalledWith(post1);
          });

          it('should reorder posts if required', function(){
            expect(postUtilities.replacePostAndReorderIfRequired).toHaveBeenCalledWith(
              false, $scope.model.posts, post1.moment, post2
            );
          });
        });
      });

      describe('when the dialog is dismissed as a rejected promise', function(){
        beforeEach(function(){
          postInteractions.editPost.and.returnValue({
            result: $q.reject('rejected')
          });

          $scope.editPost(post1);
          $scope.$apply();
        });

        it('should forward the call to postInteractions', function(){
          expect(postInteractions.editPost).toHaveBeenCalledWith(post1);
        });

        it('should not reorder posts', function(){
          expect(postUtilities.replacePostAndReorderIfRequired).not.toHaveBeenCalled();
        });
      });

      describe('when the dialog is dismissed as a resolved promise', function(){
        beforeEach(function(){
          postInteractions.editPost.and.returnValue({
            result: $q.when()
          });

          $scope.editPost(post1);
          $scope.$apply();
        });

        it('should forward the call to postInteractions', function(){
          expect(postInteractions.editPost).toHaveBeenCalledWith(post1);
        });

        it('should not reorder posts', function(){
          expect(postUtilities.replacePostAndReorderIfRequired).not.toHaveBeenCalled();
        });
      });
    });

    describe('when calling deletePost', function(){
      beforeEach(function(){
        $scope.model.posts = [
          { postId: 'a' },
          { postId: 'b' },
          { postId: 'c' }
        ];

        postInteractions.deletePost.and.returnValue($q.when());
      });

      it('should forward the call to postInteractions', function(){
        $scope.deletePost('b');
        expect(postInteractions.deletePost).toHaveBeenCalledWith('b');
      });

      describe('when postInteractions succeeds', function(){
        var success;
        beforeEach(function(){
          success = undefined;
          $scope.deletePost('b').then(function(){ success = true; });
          $scope.$apply();
        });

        it('should remove the post from the model', function(){
          expect(postUtilities.removePost).toHaveBeenCalledWith($scope.model.posts, 'b');
        });

        it('should return a successful promise', function(){
          expect(success).toBe(true);
        });
      });

      describe('when postInteractions fails', function(){
        var error;
        beforeEach(function(){
          postInteractions.deletePost.and.returnValue($q.reject('error'));
          $scope.deletePost('b').catch(function(e){ error = e; });
          $scope.$apply();
        });

        it('should not remove the post from the model', function(){
          expect(postUtilities.removePost).not.toHaveBeenCalled();
        });

        it('should propagate the error', function(){
          expect(error).toBe('error');
        });
      });
    });

    describe('when calling showComments', function(){
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

    describe('when calling showComments', function(){
      var success;
      var error;
      var deferredShowComments;
      beforeEach(function(){
        success = undefined;
        error = undefined;

        deferredShowComments = $q.defer();
        spyOn(target.internal, 'showComments').and.returnValue(deferredShowComments.promise);

        $scope.showComments('post')
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
          $scope.toggleLikePost(post).then(function(){ success = true; }, function(e){ error = e; });
          $scope.$apply();
        });

        it('should call unlikePost', function(){
          expect(target.internal.unlikePost).toHaveBeenCalledWith(post);
        });

        describe('when unlikePost succeeds', function(){
          beforeEach(function(){
            deferredUnlikePost.resolve();
            $scope.$apply();
          });

          it('should complete successfully', function(){
            expect(success).toBe(true);
          });
        });

        describe('when unlikePost fails', function(){
          beforeEach(function(){
            deferredUnlikePost.reject('error');
            $scope.$apply();
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
          $scope.toggleLikePost(post).then(function(){ success = true; }, function(e){ error = e; });
          $scope.$apply();
        });

        it('should call likePost', function(){
          expect(target.internal.likePost).toHaveBeenCalledWith(post);
        });

        describe('when likePost succeeds', function(){
          beforeEach(function(){
            deferredLikePost.resolve();
            $scope.$apply();
          });

          it('should complete successfully', function(){
            expect(success).toBe(true);
          });
        });

        describe('when likePost fails', function(){
          beforeEach(function(){
            deferredLikePost.reject('error');
            $scope.$apply();
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
        postInteractions.likePost.and.returnValue(deferredLikePost.promise);

        post = { postId: 'postId', hasLiked: false, likesCount: 10 };
        target.internal.likePost(post).then(function(){ success = true; }, function(e){ error = e; });
        $scope.$apply();
      });

      it('should set hasLiked to true', function(){
        expect(post.hasLiked).toBe(true);
      });

      it('should increment likesCount', function(){
        expect(post.likesCount).toBe(11);
      });

      it('should call likePost', function(){
        expect(postInteractions.likePost).toHaveBeenCalledWith('postId');
      });

      describe('when likePost succeeds', function(){
        beforeEach(function(){
          deferredLikePost.resolve();
          $scope.$apply();
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
          $scope.$apply();
        });

        it('should set the error message', function(){
          expect($scope.model.errorMessage).toBe('friendlyError');
        });

        it('should complete successfully', function(){
          expect(success).toBe(true);
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
        postInteractions.unlikePost.and.returnValue(deferredUnlikePost.promise);

        post = { postId: 'postId', hasLiked: true, likesCount: 10 };
        target.internal.unlikePost(post).then(function(){ success = true; }, function(e){ error = e; });
        $scope.$apply();
      });

      it('should set hasLiked to false', function(){
        expect(post.hasLiked).toBe(false);
      });

      it('should decrement likesCount', function(){
        expect(post.likesCount).toBe(9);
      });

      it('should call unlikePost', function(){
        expect(postInteractions.unlikePost).toHaveBeenCalledWith('postId');
      });

      describe('when unlikePost succeeds', function(){
        beforeEach(function(){
          deferredUnlikePost.resolve();
          $scope.$apply();
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
          $scope.$apply();
        });

        it('should set the error message', function(){
          expect($scope.model.errorMessage).toBe('friendlyError');
        });

        it('should complete successfully', function(){
          expect(success).toBe(true);
        });

        it('should revert hasLiked state', function(){
          expect(post.hasLiked).toBe(true);
        });

        it('should revert likesCount', function(){
          expect(post.likesCount).toBe(10);
        });
      });
    });
  });
});
