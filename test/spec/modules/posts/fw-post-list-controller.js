describe('fw-post-list-controller', function(){
  'use strict';

  var $q;
  var $scope;
  var target;

  var postInteractions;
  var authenticationService;
  var channelRepositoryFactory;
  var channelRepository;
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

    postInteractions = jasmine.createSpyObj('postInteractions', ['viewImage', 'openFile', 'editPost', 'deletePost']);
    authenticationService = { currentUser: { userId: 'currentUserId' }};
    channelRepositoryFactory = jasmine.createSpyObj('channelRepositoryFactory', ['forCurrentUser']);
    channelRepository = 'channelRepository';
    channelRepositoryFactory.forCurrentUser.and.returnValue(channelRepository);
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
      $provide.value('channelRepositoryFactory', channelRepositoryFactory);
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

  var includeInitializationTests = function(testData){

    it('should start loading posts', function(){
      expect($scope.model.isLoading).toBe(true);
    });

    it('should not have an error message', function(){
      expect($scope.model.errorMessage).toBeUndefined();
    });

    it('should call updateInParallel', function(){
      expect(fetchAggregateUserState.updateInParallel).toHaveBeenCalledWith('currentUserId', jasmine.any(Function));
    });

    it('should get an account settings repository', function(){
      expect(accountSettingsRepositoryFactory.forCurrentUser).toHaveBeenCalledWith();
    });

    it('should get a channel repository', function(){
      expect(channelRepositoryFactory.forCurrentUser).toHaveBeenCalledWith();
    });

    describe('when API fails', function(){
      beforeEach(function(){
        testData.updateDeferred.reject('error');
        $scope.$apply();
      });

      it('should log the error', function(){
        expect(errorFacade.handleError).toHaveBeenCalledWith('error', jasmine.any(Function));
      });

      it('should update the error message', function(){
        expect($scope.model.errorMessage).toBe('friendlyError');
      });

      it('should set isLoading to false', function(){
        expect($scope.model.isLoading).toBe(false);
      });
    });

    describe('when API returns', function(){
      var posts;
      beforeEach(function(){

        postUtilities.populateCurrentCreatorInformation.and.returnValue($q.when());
        postUtilities.populateCreatorInformation.and.returnValue($q.when());
        postUtilities.processPostsForRendering.and.returnValue($q.when());

        posts = {some: 'value' };
        testData.updateDeferred.resolve(posts);
        $scope.$apply();
      });

      it('should call populateCurrentCreatorInformation if user is creator', function(){
        if(testData.timelineUserId === 'currentUserId') {
          expect(postUtilities.populateCurrentCreatorInformation).toHaveBeenCalledWith(posts, accountSettingsRepository, channelRepository);
        }
        else{
          expect(postUtilities.populateCurrentCreatorInformation).not.toHaveBeenCalled();
        }
      });

      it('should call populateCreatorInformation if user is not creator', function(){
        if(testData.timelineUserId !== 'currentUserId') {
          expect(postUtilities.populateCreatorInformation).toHaveBeenCalledWith(posts, subscriptionRepository);
        }
        else{
          expect(postUtilities.populateCreatorInformation).not.toHaveBeenCalled();
        }
      });

      it('should call processPostsForRendering', function(){
        expect(postUtilities.processPostsForRendering).toHaveBeenCalledWith(posts);
      });

      it('should save posts to the model', function(){
        expect($scope.model.posts).toBe(posts);
      });

      it('should set isLoading to false', function(){
        expect($scope.model.isLoading).toBe(false);
      });
    });
  };

  describe('when created', function(){
    var testData = {};
    beforeEach(function(){
      $scope.userId = 'targetUserId';
      testData.updateDeferred = undefined;
      fetchAggregateUserState.updateInParallel.and.callFake(function(userId, delegate){
        delegate();
        testData.updateDeferred = $q.defer();
        return testData.updateDeferred.promise;
      });
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

    describe('when initialized with creator-backlog source', function(){

      beforeEach(function(){
        $scope.source = fwPostListConstants.sources.creatorBacklog;
        testData.timelineUserId = 'currentUserId';
        postsStub.getCreatorBacklog.and.returnValue($q.when({ data: [] }));
        target.initialize();
      });

      it('should call getCreatorBacklog', function(){
        expect(postsStub.getCreatorBacklog).toHaveBeenCalledWith('currentUserId');
      });

      includeInitializationTests(testData);
    });

    describe('when initialized with creator-timeline source', function(){

      beforeEach(function(){
        $scope.source = fwPostListConstants.sources.creatorTimeline;
        testData.timelineUserId = 'currentUserId';
        postsStub.getNewsfeed.and.returnValue($q.when({ data: { posts: [] } }));
        target.initialize();
      });

      it('should call getNewsfeed with the current user id', function(){
        expect(postsStub.getNewsfeed).toHaveBeenCalledWith({ creatorId: 'currentUserId', startIndex: 0, count: 1000 });
      });

      includeInitializationTests(testData);
    });

    describe('when initialized with timeline source', function(){

      beforeEach(function(){
        $scope.source = fwPostListConstants.sources.timeline;
        testData.timelineUserId = 'targetUserId';
        postsStub.getNewsfeed.and.returnValue($q.when({ data: { posts: [] } }));
        target.initialize();
      });

      it('should call getNewsfeed with the scope user id', function(){
        expect(postsStub.getNewsfeed).toHaveBeenCalledWith({ creatorId: 'targetUserId', startIndex: 0, count: 1000 });
      });

      includeInitializationTests(testData);
    });
  });

  describe('when calling scope methods', function(){
    beforeEach(function(){
      fetchAggregateUserState.updateInParallel.and.returnValue($q.when());
      createController();
    });

    it('should forward the viewImage function to postInteractions', function(){
      $scope.viewImage('a', 'b');
      expect(postInteractions.viewImage).toHaveBeenCalledWith('a', 'b');
    });

    it('should forward the openFile function to postInteractions', function(){
      $scope.openFile('a');
      expect(postInteractions.openFile).toHaveBeenCalledWith('a');
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
