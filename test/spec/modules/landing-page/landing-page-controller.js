describe('landing page controller', function () {
  'use strict';

  var error404 = new ApiError('', {status: 404});

  var $controller;
  var $q;
  var $scope;
  var target;

  var landingPageConstants;
  var aggregateUserStateConstants;
  var fwSubscriptionInformationConstants;
  var fwPostListConstants;

  var accountSettingsRepositoryFactory;
  var accountSettingsRepository;
  var blogRepositoryFactory;
  var blogRepository;
  var subscriptionRepositoryFactory;
  var subscriptionRepository;
  var initializer;
  var $stateParams;
  var $state;
  var states;
  var errorFacade;
  var fetchAggregateUserState;
  var landingPageInformationLoader;
  var fullPostLoader;

  var accountSettings;

  beforeEach(function() {
    accountSettingsRepository = jasmine.createSpyObj('accountSettingsRepository', ['getAccountSettings']);
    accountSettingsRepositoryFactory = jasmine.createSpyObj('accountSettingsRepositoryFactory', ['forCurrentUser']);
    accountSettingsRepositoryFactory.forCurrentUser.and.returnValue(accountSettingsRepository);
    blogRepository = jasmine.createSpyObj('blogRepository', ['getBlog', 'getUserId']);
    blogRepositoryFactory = jasmine.createSpyObj('blogRepositoryFactory', ['forCurrentUser']);
    blogRepositoryFactory.forCurrentUser.and.returnValue(blogRepository);
    subscriptionRepository = jasmine.createSpyObj('subscriptionRepository', ['tryGetBlogs']);
    subscriptionRepositoryFactory = jasmine.createSpyObj('subscriptionRepositoryFactory', ['forCurrentUser']);
    subscriptionRepositoryFactory.forCurrentUser.and.returnValue(subscriptionRepository);
    initializer = jasmine.createSpyObj('initializer', ['initialize']);
    $state = jasmine.createSpyObj('$state', ['go', 'reload']);
    $stateParams = {};
    fetchAggregateUserState = jasmine.createSpyObj('fetchAggregateUserState', ['waitForExistingUpdate']);
    landingPageInformationLoader = jasmine.createSpyObj('landingPageInformationLoader', ['loadLandingPageData']);
    fullPostLoader = jasmine.createSpyObj('fullPostLoader', ['loadPost']);
    errorFacade = jasmine.createSpyObj('errorFacade', ['handleError']);

    errorFacade.handleError.and.callFake(function(error, delegate){ delegate('friendlyError'); });

    module('webApp');
    module(function($provide) {
      $provide.value('accountSettingsRepositoryFactory', accountSettingsRepositoryFactory);
      $provide.value('blogRepositoryFactory', blogRepositoryFactory);
      $provide.value('subscriptionRepositoryFactory', subscriptionRepositoryFactory);
      $provide.value('initializer', initializer);
      $provide.value('$stateParams', $stateParams);
      $provide.value('$state', $state);
      $provide.value('fetchAggregateUserState', fetchAggregateUserState);
      $provide.value('landingPageInformationLoader', landingPageInformationLoader);
      $provide.value('fullPostLoader', fullPostLoader);
      $provide.value('errorFacade', errorFacade);
    });

    inject(function ($injector) {
      $q = $injector.get('$q');
      $scope = $injector.get('$rootScope').$new();
      $controller = $injector.get('$controller');
      states = $injector.get('states');
      landingPageConstants = $injector.get('landingPageConstants');
      aggregateUserStateConstants = $injector.get('aggregateUserStateConstants');
      fwSubscriptionInformationConstants = $injector.get('fwSubscriptionInformationConstants');
      fwPostListConstants = $injector.get('fwPostListConstants');
    });

    accountSettings = { username: 'username', profileImage: { fileId: 'fileId' } };
  });

  var initializeTarget = function() {
    target = $controller('landingPageCtrl', { $scope: $scope });
    $scope.$apply();
  };

  describe('when creating', function(){
    beforeEach(function(){
      initializeTarget();
    });

    it('should set isLoaded to false', function(){
      expect($scope.model.isLoaded).toBe(false);
    });

    it('should set returnState to undefined', function(){
      expect($scope.model.returnState).toBeUndefined();
    });

    it('should set channelId to undefined', function(){
      expect($scope.model.channelId).toBeUndefined();
    });

    it('should set postId to undefined', function(){
      expect($scope.model.postId).toBeUndefined();
    });

    it('should set timelineType to undefined', function(){
      expect($scope.model.timelineType).toBeUndefined();
    });

    it('should set landingPage to undefined', function(){
      expect($scope.model.landingPage).toBeUndefined();
    });

    it('should set post to undefined', function(){
      expect($scope.model.post).toBeUndefined();
    });

    it('should set username to undefined', function(){
      expect($scope.model.username).toBeUndefined();
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

    it('should initialize with the loadLandingPage function', function(){
      expect(initializer.initialize).toHaveBeenCalledWith(target.internal.initialize);
    });
  });

  describe('when created', function(){
    beforeEach(function(){
      initializeTarget();
    });

    describe('when loadParameters is called', function(){
      beforeEach(function(){
        $scope.model.username = undefined;
        $scope.model.currentView = undefined;
        $scope.model.returnState = undefined;
        $scope.model.channelId = undefined;
        $scope.model.postId = undefined;
      });

      var expectResult = function(result){
        expect(target.internal.loadParameters()).toBe(result);
      };

      it('should return false if there is no username', function(){
        $stateParams.username = undefined;
        $stateParams.action = landingPageConstants.actions.timeline;
        $stateParams.key = 'key';
        expectResult(false);
      });

      describe('when username is provided', function(){
        beforeEach(function(){
          $stateParams.username = 'uSeRnAmE';
        });

        afterEach(function(){
          expect($scope.model.username).toBe('username');
        });

        it('should return false if the action is unrecognised', function(){
          $stateParams.action = '1234';
          expectResult(false);
        });

        it('should return true if action is manage and key is undefined', function(){
          $stateParams.action = landingPageConstants.actions.manage;
          $stateParams.key = undefined;
          expectResult(true);
          expect($scope.model.currentView).toBe(landingPageConstants.views.timeline);
          expect($scope.model.returnState).toBeUndefined();
          expect($scope.model.timelineType).toBe(landingPageConstants.timelineTypes.all);
        });

        it('should return true if action is manage and key is defined', function(){
          $stateParams.action = landingPageConstants.actions.manage;
          $stateParams.key = 'key';
          expectResult(true);
          expect($scope.model.currentView).toBe(landingPageConstants.views.timeline);
          expect($scope.model.returnState).toBe('key');
          expect($scope.model.timelineType).toBe(landingPageConstants.timelineTypes.all);
        });

        it('should return false if action is channel and key is undefined', function(){
          $stateParams.action = landingPageConstants.actions.channel;
          $stateParams.key = undefined;
          expectResult(false);
        });

        it('should return true if action is channel and key is defined', function(){
          $stateParams.action = landingPageConstants.actions.channel;
          $stateParams.key = 'key';
          expectResult(true);
          expect($scope.model.currentView).toBe(landingPageConstants.views.timeline);
          expect($scope.model.channelId).toBe('key');
          expect($scope.model.timelineType).toBe(landingPageConstants.timelineTypes.channel);
        });

        it('should return false if action is post and key is undefined', function(){
          $stateParams.action = landingPageConstants.actions.post;
          $stateParams.key = undefined;
          expectResult(false);
        });

        it('should return true if action is post and key is defined', function(){
          $stateParams.action = landingPageConstants.actions.post;
          $stateParams.key = 'key';
          expectResult(true);
          expect($scope.model.currentView).toBe(landingPageConstants.views.post);
          expect($scope.model.postId).toBe('key');
          expect($scope.model.timelineType).toBe(landingPageConstants.timelineTypes.all);
        });
      });
    });

    describe('when initialize is called', function(){

      describe('when loadParameters returns false', function(){
        var success;
        var error;
        beforeEach(function(){
          success = undefined;
          error = undefined;

          spyOn(target.internal, 'loadParameters').and.returnValue(false);

          target.internal.initialize().then(function(){ success = true; }, function(e){ error = e; });
          $scope.$apply();
        });

        it('should not call waitForExistingUpdate', function(){
          expect(fetchAggregateUserState.waitForExistingUpdate).not.toHaveBeenCalled();
        });

        it('should redirect to not found page', function(){
          expect($state.go).toHaveBeenCalledWith(states.notFound.name);
        });

        it('should complete successfully', function(){
          expect(success).toBe(true);
        });
      });

      describe('when loadParameters returns true', function(){
        var success;
        var error;
        var deferredWaitForExistingUpdate;
        var deferredLoadContent;
        beforeEach(function(){
          success = undefined;
          error = undefined;

          deferredWaitForExistingUpdate = $q.defer();
          fetchAggregateUserState.waitForExistingUpdate.and.returnValue(deferredWaitForExistingUpdate.promise);

          deferredLoadContent = $q.defer();
          spyOn(target.internal, 'loadContent').and.returnValue(deferredLoadContent.promise);

          spyOn(target.internal, 'loadParameters').and.returnValue(true);

          $scope.model.isLoaded = false;

          target.internal.initialize().then(function(){ success = true; }, function(e){ error = e; });
          $scope.$apply();
        });

        it('should call waitForExistingUpdate', function(){
          expect(fetchAggregateUserState.waitForExistingUpdate).toHaveBeenCalledWith();
        });

        describe('when waitForExistingUpdate succeeds', function(){
          beforeEach(function(){
            deferredWaitForExistingUpdate.resolve();
            $scope.$apply();
          });

          it('should call loadContent', function(){
            expect(target.internal.loadContent).toHaveBeenCalledWith();
          });

          describe('when loadContent succeeds', function(){
            beforeEach(function(){
              deferredLoadContent.resolve();
              $scope.$apply();
            });

            it('should set isLoaded to true', function(){
              expect($scope.model.isLoaded).toBe(true);
            });

            it('should complete successfully', function(){
              expect(success).toBe(true);
            });
          });

          describe('when loadContent fails with 404', function(){
            beforeEach(function(){
              deferredLoadContent.reject(error404);
              $scope.$apply();
            });

            it('should redirect to the notFound page', function(){
              expect($state.go).toHaveBeenCalledWith(states.notFound.name);
            });

            it('should complete successfully', function(){
              expect(success).toBe(true);
            });
          });

          describe('when loadContent fails', function(){
            beforeEach(function(){
              deferredLoadContent.reject('error');
              $scope.$apply();
            });

            it('should not redirect', function(){
              expect($state.go).not.toHaveBeenCalled();
            });

            it('should log the error', function(){
              expect(errorFacade.handleError).toHaveBeenCalledWith('error', jasmine.any(Function));
            });

            it('should set the errorMessage to a friendly message', function(){
              expect($scope.model.errorMessage).toBe('friendlyError');
            });

            it('should set isLoaded to true', function(){
              expect($scope.model.isLoaded).toBe(true);
            });

            it('should complete successfully', function(){
              expect(success).toBe(true);
            });
          });
        });

        describe('when waitForExistingUpdate fails', function(){
          beforeEach(function(){
            deferredWaitForExistingUpdate.reject('error');
            $scope.$apply();
          });

          it('should not redirect', function(){
            expect($state.go).not.toHaveBeenCalled();
          });

          it('should not call loadContent', function(){
            expect(target.internal.loadContent).not.toHaveBeenCalled();
          });

          it('should log the error', function(){
            expect(errorFacade.handleError).toHaveBeenCalledWith('error', jasmine.any(Function));
          });

          it('should set the errorMessage to a friendly message', function(){
            expect($scope.model.errorMessage).toBe('friendlyError');
          });

          it('should set isLoaded to true', function(){
            expect($scope.model.isLoaded).toBe(true);
          });

          it('should complete successfully', function(){
            expect(success).toBe(true);
          });
        });
      });
    });

    describe('when loadLandingPage is called', function(){
      var success;
      var error;
      var deferredLoadLandingPageData;
      beforeEach(function(){
        success = undefined;
        error = undefined;

        deferredLoadLandingPageData = $q.defer();
        landingPageInformationLoader.loadLandingPageData.and.returnValue(deferredLoadLandingPageData.promise);

        $scope.model.username = 'username';

        target.internal.loadLandingPage().then(function(){ success = true; }, function(e){ error = e; });
        $scope.$apply();
      });

      it('should call loadLandingPageData', function(){
        expect(landingPageInformationLoader.loadLandingPageData).toHaveBeenCalledWith('username', accountSettingsRepository, blogRepository, subscriptionRepository);
      });

      describe('when loadLandingPageData succeeds', function(){
        beforeEach(function(){
          deferredLoadLandingPageData.resolve('landingPage');
          $scope.$apply();
        });

        it('should store the landing page data', function(){
          expect($scope.model.landingPage).toBe('landingPage');
        });

        it('should complete successfully', function(){
          expect(success).toBe(true);
        });
      });

      describe('when loadLandingPageData fails', function(){
        beforeEach(function(){
          deferredLoadLandingPageData.reject('error');
          $scope.$apply();
        });

        it('should propagate the error', function(){
          expect(error).toBe('error');
        });
      });
    });

    describe('onSubscriptionInformationChanged', function(){
      it('should broadcast a reload event', function(){
        spyOn($scope, '$broadcast');
        target.internal.onSubscriptionInformationChanged();
        expect($scope.$broadcast).toHaveBeenCalledWith(fwPostListConstants.reloadEvent);
      });
    });

    describe('loadContent', function(){
      var result;
      beforeEach(function(){
        spyOn(target.internal, 'loadPost').and.returnValue('loadPostResult');
        spyOn(target.internal, 'loadLandingPage').and.returnValue('loadLandingPageResult');
      });

      describe('when current view is post', function(){
        beforeEach(function(){
          $scope.model.currentView = landingPageConstants.views.post;
          result = target.internal.loadContent();
        });

        it('should call loadPost', function(){
          expect(target.internal.loadPost).toHaveBeenCalledWith();
        });

        it('should return the result', function(){
          expect(result).toBe('loadPostResult');
        });
      });

      describe('when current view is not post', function(){
        beforeEach(function(){
          $scope.model.currentView = landingPageConstants.views.timeline;
          result = target.internal.loadContent();
        });

        it('should call loadLandingPage', function(){
          expect(target.internal.loadLandingPage).toHaveBeenCalledWith();
        });

        it('should return the result', function(){
          expect(result).toBe('loadLandingPageResult');
        });
      });
    });

    describe('getSummaryFromPost', function(){
      it('should return the landing page summary', function(){
        var post = {
          creator: {
            username: 'username',
            profileImage: 'profileImage'
          },
          creatorId: 'creatorId',
          blog: {
            name: 'blogName',
            introduction: 'introduction',
            headerImage: 'headerImage'
          },
          blogId: 'blogId'
        };

        var result = target.internal.getSummaryFromPost(post);

        expect(result).toEqual({
          username: 'username',
          userId: 'creatorId',
          profileImage: 'profileImage',
          blog: {
            blogId: 'blogId',
            name: 'blogName',
            introduction: 'introduction',
            headerImage: 'headerImage'
          }
        });
      });
    });

    describe('loadPost', function(){
      var success;
      var error;
      var deferredLoadPost;
      beforeEach(function(){
        success = undefined;
        error = undefined;

        deferredLoadPost = $q.defer();
        fullPostLoader.loadPost.and.returnValue(deferredLoadPost.promise);

        spyOn(target.internal, 'getSummaryFromPost').and.returnValue('summary');

        $scope.model.postId = 'postId';

        target.internal.loadPost().then(function(){ success = true; }, function(e){ error = e; });
        $scope.$apply();
      });

      it('should call loadPost', function(){
        expect(fullPostLoader.loadPost).toHaveBeenCalledWith('postId', accountSettingsRepository, blogRepository, subscriptionRepository);
      });

      describe('when loadPost succeeds', function(){
        beforeEach(function(){
          deferredLoadPost.resolve('post');
          $scope.$apply();
        });

        it('should store the post', function(){
          expect($scope.model.post).toBe('post');
        });

        it('should call getSummaryFromPost', function(){
          expect(target.internal.getSummaryFromPost).toHaveBeenCalledWith('post');
        });

        it('should store the landing page summary', function(){
          expect($scope.model.landingPage).toBe('summary');
        });

        it('should complete successfully', function(){
          expect(success).toBe(true);
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

    describe('goBack', function(){
      it('should redirect if returnState is specified', function(){
        $scope.model.returnState = 'returnState';
        $scope.goBack();
        expect($state.go).toHaveBeenCalledWith('returnState');
      });

      it('should not redirect if returnState is not specified', function(){
        $scope.model.returnState = undefined;
        $scope.goBack();
        expect($state.go).not.toHaveBeenCalled();
      });
    });

    describe('showAllPosts', function(){
      it('should update the state', function(){
        $scope.model.currentView = 'something';
        $scope.model.timelineType = 'somethingElse';
        $scope.showAllPosts();
        expect($scope.model.currentView).toBe(landingPageConstants.views.timeline);
        expect($scope.model.timelineType).toBe(landingPageConstants.timelineTypes.all);
      });
    });

    describe('showSubscribedPosts', function(){
      it('should update the state', function(){
        $scope.model.currentView = 'something';
        $scope.model.timelineType = 'somethingElse';
        $scope.showSubscribedPosts();
        expect($scope.model.currentView).toBe(landingPageConstants.views.timeline);
        expect($scope.model.timelineType).toBe(landingPageConstants.timelineTypes.subscribed);
      });
    });

    describe('showChannel', function(){
      it('should update the state', function(){
        $scope.model.currentView = 'something';
        $scope.model.timelineType = 'somethingElse';
        $scope.showChannel();
        expect($scope.model.currentView).toBe(landingPageConstants.views.timeline);
        expect($scope.model.timelineType).toBe(landingPageConstants.timelineTypes.channel);
      });
    });

    describe('showPost', function(){
      it('should update the state', function(){
        $scope.model.currentView = 'something';
        $scope.model.timelineType = 'somethingElse';
        $scope.showPost();
        expect($scope.model.currentView).toBe(landingPageConstants.views.post);
        expect($scope.model.timelineType).toBe('somethingElse');
      });
    });
  });
});
