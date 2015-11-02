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
  var postStub;
  var errorFacade;
  var postUtilities;
  var fwPostListConstants;
  var $state;
  var states;
  var landingPageConstants;

  beforeEach(function() {

    postInteractions = jasmine.createSpyObj('postInteractions', ['viewImage', 'openFile', 'viewPost', 'editPost', 'deletePost', 'showComments', 'likePost', 'unlikePost']);
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
    postStub = jasmine.createSpyObj('postStub', ['getCreatorBacklog', 'getNewsfeed', 'getPreviewNewsfeed']);
    errorFacade = jasmine.createSpyObj('errorFacade', ['handleError']);
    postUtilities = jasmine.createSpyObj('postUtilities', ['populateCurrentCreatorInformation', 'populateCreatorInformation', 'processPostsForRendering', 'removePost', 'replacePostAndReorderIfRequired']);
    $state = jasmine.createSpyObj('$state', ['go']);

    module('webApp');
    module(function($provide) {
      $provide.value('postInteractions', postInteractions);
      $provide.value('authenticationService', authenticationService);
      $provide.value('blogRepositoryFactory', blogRepositoryFactory);
      $provide.value('subscriptionRepositoryFactory', subscriptionRepositoryFactory);
      $provide.value('accountSettingsRepositoryFactory', accountSettingsRepositoryFactory);
      $provide.value('fetchAggregateUserState', fetchAggregateUserState);
      $provide.value('postStub', postStub);
      $provide.value('errorFacade', errorFacade);
      $provide.value('postUtilities', postUtilities);
      $provide.value('$state', $state);
    });

    inject(function ($injector) {
      $q = $injector.get('$q');
      $scope = $injector.get('$rootScope').$new();
      fwPostListConstants = $injector.get('fwPostListConstants');
      states = $injector.get('states');
      landingPageConstants = $injector.get('landingPageConstants');
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

    describe('when loadPosts is called', function(){
      var success;
      var error;
      var deferredProcessPostsForRendering;
      var deferredUpdateInParallel;
      beforeEach(function(){
        success = undefined;
        error = undefined;

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
        expect(target.internal.loadNext).toHaveBeenCalledWith(0, 24);
      });

      describe('when updateInParallel succeeds', function(){
        beforeEach(function(){
          deferredUpdateInParallel.resolve({
            posts: 'posts'
          });
          $scope.$apply();
        });

        it('should call processPostsForRendering', function(){
          expect(postUtilities.processPostsForRendering).toHaveBeenCalledWith(
            'posts', accountSettingsRepository, blogRepository, subscriptionRepository);
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
            postStub.getCreatorBacklog.and.returnValue($q.when({ data: 'data' }));
            target.internal.loadNext().then(function(r){ result = r; });
            $scope.$apply();
          });

          it('should call getCreatorBacklog', function(){
            expect(postStub.getCreatorBacklog).toHaveBeenCalledWith('currentUserId');
          });

          it('should return the result', function(){
            expect(result).toEqual({posts: 'data'});
          });
        });
      });

      describe('when initialized with creator-timeline source', function(){

        beforeEach(function(){
          $scope.source = fwPostListConstants.sources.creatorTimeline;
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
            postStub.getNewsfeed.and.returnValue($q.when({ data: 'data' }));
            target.internal.loadNext(10, 20).then(function(r){ result = r; });
            $scope.$apply();
          });

          it('should call getNewsfeed', function(){
            expect(postStub.getNewsfeed).toHaveBeenCalledWith({
              creatorId: 'currentUserId',
              startIndex: 10,
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
            postStub.getNewsfeed.and.returnValue($q.when({ data: 'data' }));
            target.internal.loadNext(10, 20).then(function(r){ result = r; });
            $scope.$apply();
          });

          it('should call getNewsfeed', function(){
            expect(postStub.getNewsfeed).toHaveBeenCalledWith({
              creatorId: 'anotherUserId',
              startIndex: 10,
              channelId: 'channelId',
              count: 20
            });
          });

          it('should return the result', function(){
            expect(result).toEqual('data');
          });
        });
      });

      describe('when initialized with preview source', function(){

        beforeEach(function(){
          $scope.source = fwPostListConstants.sources.preview;
          $scope.userId = 'anotherUserId';
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
            postStub.getPreviewNewsfeed.and.returnValue($q.when({ data: 'data' }));
            target.internal.loadNext(10, 20).then(function(r){ result = r; });
            $scope.$apply();
          });

          it('should call getPreviewNewsfeed', function(){
            expect(postStub.getPreviewNewsfeed).toHaveBeenCalledWith({
              creatorId: 'anotherUserId',
              startIndex: 10,
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

    describe('when calling viewPost', function(){
      it('should forward the viewPost function to postInteractions', function(){
        $scope.viewPost('a');
        expect(postInteractions.viewPost).toHaveBeenCalledWith('a');
      });
    });

    describe('when calling managePostSubscription', function(){
      describe('when current page is landing page', function(){
        beforeEach(function(){
          $state.current = { name: states.landingPage.name };
          $scope.managePostSubscription({ creator: { username: 'username' }});
        });

        it('should naviagate to the manage subscription page', function(){
          expect($state.go).toHaveBeenCalledWith(
            states.landingPage.name,
            {
              username: 'username',
              action: landingPageConstants.actions.manage,
              key: undefined
            });
        });
      });

      describe('when current page is not landing page', function(){
        beforeEach(function(){
          $state.current = { name: 'some-state' };
          $scope.managePostSubscription({ creator: { username: 'username' }});
        });

        it('should naviagate to the manage subscription page', function(){
          expect($state.go).toHaveBeenCalledWith(
            states.landingPage.name,
            {
              username: 'username',
              action: landingPageConstants.actions.manage,
              key: 'some-state'
            });
        });
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
  });
});
