describe('fw-post-list-header-controller', function() {
  'use strict';

  var $q;
  var $scope;
  var target;

  var subscriptionRepositoryFactory;
  var subscriptionRepository;
  var blogRepositoryFactory;
  var blogRepository;
  var fwPostListConstants;
  var aggregateUserStateConstants;
  var errorFacade;

  var userId = 'userId';

  beforeEach(function () {

    subscriptionRepositoryFactory = jasmine.createSpyObj('subscriptionRepositoryFactory', ['forCurrentUser']);
    subscriptionRepository = jasmine.createSpyObj('subscriptionRepository', ['tryGetBlogs', 'getUserId']);
    subscriptionRepositoryFactory.forCurrentUser.and.returnValue(subscriptionRepository);
    subscriptionRepository.getUserId.and.returnValue(userId);
    blogRepositoryFactory = jasmine.createSpyObj('blogRepositoryFactory', ['forCurrentUser']);
    blogRepository = jasmine.createSpyObj('blogRepository', ['tryGetBlog']);
    blogRepositoryFactory.forCurrentUser.and.returnValue(blogRepository);
    errorFacade = jasmine.createSpyObj('errorFacade', ['handleError']);

    module('webApp');
    module(function ($provide) {
      $provide.value('subscriptionRepositoryFactory', subscriptionRepositoryFactory);
      $provide.value('blogRepositoryFactory', blogRepositoryFactory);
      $provide.value('errorFacade', errorFacade);
    });

    inject(function ($injector) {
      $q = $injector.get('$q');
      $scope = $injector.get('$rootScope').$new();
      fwPostListConstants = $injector.get('fwPostListConstants');
      aggregateUserStateConstants = $injector.get('aggregateUserStateConstants');
    });

    errorFacade.handleError.and.callFake(function(error, setMessage) {
      setMessage('friendlyError');
      return $q.when();
    });
  });

  var createController = function () {
    inject(function ($controller) {
      target = $controller('fwPostListHeaderCtrl', {$scope: $scope});
    });
  };

  describe('when creating', function(){
    beforeEach(function(){
      createController();
    });

    it('should create the model', function(){
      expect($scope.model).toBeDefined();
    });

    it('should set the channel name to undefined', function(){
      expect($scope.model.channelName).toBeUndefined();
    });

    it('should set the collection name to undefined', function(){
      expect($scope.model.collectionName).toBeUndefined();
    });

    it('should get a subscription repository', function(){
      expect(subscriptionRepositoryFactory.forCurrentUser).toHaveBeenCalledWith();
    });

    it('should get a blog repository', function(){
      expect(blogRepositoryFactory.forCurrentUser).toHaveBeenCalledWith();
    });
  });

  describe('when created', function(){
    beforeEach(function(){
      $scope.userId = userId;
      $scope.channelId = 'channelId';
      $scope.collectionId = 'collectionId';
      createController();
    });

    describe('when calling initialize', function(){
      beforeEach(function(){
        spyOn($scope, '$on');
        target.initialize();
      });

      it('should attach to the user state updated event', function(){
        expect($scope.$on).toHaveBeenCalledWith(aggregateUserStateConstants.updatedEvent, target.internal.load);
      });
    });

    describe('when loadFromBlogs is called', function(){
      var blogs;
      beforeEach(function(){
        $scope.model.channelName = undefined;
        $scope.model.collectionName = undefined;

        blogs = [
          {
            creatorId: '1',
            channels: [
              {
                channelId: '1.1',
                name: 'N1.1',
                collections: [
                  {
                    collectionId: '1.1.1',
                    name: 'N1.1.1'
                  },
                  {
                    collectionId: '1.1.2',
                    name: 'N1.1.2'
                  }
                ]
              },
              {
                channelId: '1.2',
                name: 'N1.2',
                collections: [
                  {
                    collectionId: '1.2.1',
                    name: 'N1.2.1'
                  },
                  {
                    collectionId: '1.2.2',
                    name: 'N1.2.2'
                  }
                ]
              }
            ]
          },
          {
            creatorId: '2'
          },
          {
            creatorId: '3',
            channels: [
              {
                channelId: '3.1',
                name: 'N3.1'
              }
            ]
          }
        ];
      });

      describe('when creator is undefined', function(){
        beforeEach(function(){
          target.internal.loadFromBlogs(undefined, '1.1', '1.1.1', blogs);
        });

        it('should not set channelName', function(){
          expect($scope.model.channelName).toBeUndefined();
        });

        it('should not set collectionName', function(){
          expect($scope.model.collectionName).toBeUndefined();
        });
      });

      describe('when channelId and collectionId are undefined', function(){
        beforeEach(function(){
          target.internal.loadFromBlogs('1', undefined, undefined, blogs);
        });

        it('should not set channelName', function(){
          expect($scope.model.channelName).toBeUndefined();
        });

        it('should not set collectionName', function(){
          expect($scope.model.collectionName).toBeUndefined();
        });
      });

      describe('when channelId is undefined', function(){
        beforeEach(function(){
          target.internal.loadFromBlogs('1', undefined, '1.2.2', blogs);
        });

        it('should set channelName', function(){
          expect($scope.model.channelName).toBe('N1.2');
        });

        it('should set collectionName', function(){
          expect($scope.model.collectionName).toBe('N1.2.2');
        });
      });

      describe('when collectionId is undefined', function(){
        beforeEach(function(){
          target.internal.loadFromBlogs('1', '1.2', undefined, blogs);
        });

        it('should set channelName', function(){
          expect($scope.model.channelName).toBe('N1.2');
        });

        it('should not set collectionName', function(){
          expect($scope.model.collectionName).toBeUndefined();
        });
      });

      describe('when channelId and collectionId are valid', function(){
        beforeEach(function(){
          target.internal.loadFromBlogs('1', '1.1', '1.1.1', blogs);
        });

        it('should set channelName', function(){
          expect($scope.model.channelName).toBe('N1.1');
        });

        it('should set collectionName', function(){
          expect($scope.model.collectionName).toBe('N1.1.1');
        });
      });

      describe('when channelId and collectionId are valid 2', function(){
        beforeEach(function(){
          target.internal.loadFromBlogs('1', '1.2', '1.2.2', blogs);
        });

        it('should set channelName', function(){
          expect($scope.model.channelName).toBe('N1.2');
        });

        it('should set collectionName', function(){
          expect($scope.model.collectionName).toBe('N1.2.2');
        });
      });

      describe('when creator has no channels', function(){
        beforeEach(function(){
          target.internal.loadFromBlogs('2', '2.1', '2.1.1', blogs);
        });

        it('should not set channelName', function(){
          expect($scope.model.channelName).toBeUndefined();
        });

        it('should not set collectionName', function(){
          expect($scope.model.collectionName).toBeUndefined();
        });
      });

      describe('when channel has no collections', function(){
        beforeEach(function(){
          target.internal.loadFromBlogs('3', '3.1', '3.1.1', blogs);
        });

        it('should set channelName', function(){
          expect($scope.model.channelName).toBe('N3.1');
        });

        it('should not set collectionName', function(){
          expect($scope.model.collectionName).toBeUndefined();
        });
      });

      describe('when channel is not found', function(){
        beforeEach(function(){
          target.internal.loadFromBlogs('1', '1.3', '1.3.1', blogs);
        });

        it('should not set channelName', function(){
          expect($scope.model.channelName).toBeUndefined();
        });

        it('should not set collectionName', function(){
          expect($scope.model.collectionName).toBeUndefined();
        });
      });

      describe('when collection is not found', function(){
        beforeEach(function(){
          target.internal.loadFromBlogs('1', '1.1', '1.1.3', blogs);
        });

        it('should set channelName', function(){
          expect($scope.model.channelName).toBe('N1.1');
        });

        it('should not set collectionName', function(){
          expect($scope.model.collectionName).toBeUndefined();
        });
      });
    });

    describe('when load is called', function(){
      var success;
      var error;
      var deferredGetBlogs;

      var performTests = function(userId){

        it('should set errorMessage to undefined', function(){
          expect($scope.model.errorMessage).toBeUndefined();
        });

        it('should set channelName to undefined', function(){
          expect($scope.model.channelName).toBeUndefined();
        });

        it('should set collectionName to undefined', function(){
          expect($scope.model.collectionName).toBeUndefined();
        });

        describe('when getting blogs succeeds', function(){
          beforeEach(function(){
            deferredGetBlogs.resolve('blogs');
            $scope.$apply();
          });

          it('should call loadFromBlogs', function(){
            expect(target.internal.loadFromBlogs).toHaveBeenCalledWith(userId, 'channelId', 'collectionId', 'blogs');
          });

          it('should complete successfully', function(){
            expect(success).toBe(true);
          });
        });

        describe('when getting blogs fails', function(){
          beforeEach(function(){
            deferredGetBlogs.reject('error');
            $scope.$apply();
          });

          it('should call handleError', function(){
            expect(errorFacade.handleError).toHaveBeenCalledWith('error', jasmine.any(Function));
          });

          it('should set the error message', function(){
            expect($scope.model.errorMessage).toBe('friendlyError');
          });

          it('should not propagate the error', function(){
            expect(error).toBeUndefined();
          });

          it('should complete successfully', function(){
            expect(success).toBe(true);
          });
        });
      };

      var configureTests = function(){
        success = undefined;
        error = undefined;
        deferredGetBlogs = $q.defer();

        spyOn(target.internal, 'loadFromBlogs');

        $scope.model.errorMessage = 'error';
        $scope.model.channelName = 'channel';
        $scope.model.collectionName = 'collection';
      };

      var execute = function(){
        target.internal.load().then(function(){ success = true; }, function(e){ error = e; });
        $scope.$apply();
      };

      describe('when current user is not blog owner', function(){
        beforeEach(function(){
          configureTests();
          $scope.userId = 'other-user';
          spyOn(target.internal, 'getSubscribedBlogs').and.returnValue(deferredGetBlogs.promise);
          execute();
        });

        it('should call tryGetBlogs', function(){
          expect(target.internal.getSubscribedBlogs).toHaveBeenCalledWith();
        });

        performTests('other-user');
      });

      describe('when current user is blog owner', function(){
        beforeEach(function(){
          configureTests();
          $scope.userId = userId;
          spyOn(target.internal, 'getCreatorBlog').and.returnValue(deferredGetBlogs.promise);
          execute();
        });

        it('should call tryGetBlogs', function(){
          expect(target.internal.getCreatorBlog).toHaveBeenCalledWith();
        });

        performTests(userId);
      });
    });

    describe('when getSubscribedBlogs is called', function(){
      var error;
      var result;
      var deferredTryGetBlogs;
      beforeEach(function(){
        error = undefined;
        result = undefined;
        deferredTryGetBlogs = $q.defer();
        subscriptionRepository.tryGetBlogs.and.returnValue(deferredTryGetBlogs.promise);
        target.internal.getSubscribedBlogs().then(function(r){ result = r; }, function(e){ error = e; });
        $scope.$apply();
      });

      it('should call tryGetBlogs', function(){
        expect(subscriptionRepository.tryGetBlogs).toHaveBeenCalledWith();
      });

      describe('when tryGetBlogs succeeds with blogs', function(){
        beforeEach(function(){
          deferredTryGetBlogs.resolve('blogs');
          $scope.$apply();
        });

        it('should return the blogs', function(){
          expect(result).toBe('blogs');
        });
      });

      describe('when tryGetBlogs succeeds with no blogs', function(){
        beforeEach(function(){
          deferredTryGetBlogs.resolve();
          $scope.$apply();
        });

        it('should return an empty array', function(){
          expect(result).toEqual([]);
        });
      });

      describe('when tryGetBlogs fails', function(){
        beforeEach(function(){
          deferredTryGetBlogs.reject('error');
          $scope.$apply();
        });

        it('should propagate the error', function(){
          expect(error).toBe('error');
        });
      });
    });

    describe('when getCreatorBlog is called', function(){
      var error;
      var result;
      var deferredTryGetBlog;
      beforeEach(function(){
        error = undefined;
        result = undefined;
        deferredTryGetBlog = $q.defer();
        blogRepository.tryGetBlog.and.returnValue(deferredTryGetBlog.promise);
        target.internal.getCreatorBlog().then(function(r){ result = r; }, function(e){ error = e; });
        $scope.$apply();
      });

      it('should call tryGetBlogs', function(){
        expect(blogRepository.tryGetBlog).toHaveBeenCalledWith();
      });

      describe('when tryGetBlog succeeds with a blog', function(){
        beforeEach(function(){
          deferredTryGetBlog.resolve({ name: 'blog' });
          $scope.$apply();
        });

        it('should return the blog in an array', function(){
          expect(result).toEqual([{ name: 'blog', creatorId: $scope.userId }]);
        });
      });

      describe('when tryGetBlog succeeds with no blogs', function(){
        beforeEach(function(){
          deferredTryGetBlog.resolve();
          $scope.$apply();
        });

        it('should return an empty array', function(){
          expect(result).toEqual([]);
        });
      });

      describe('when tryGetBlog fails', function(){
        beforeEach(function(){
          deferredTryGetBlog.reject('error');
          $scope.$apply();
        });

        it('should propagate the error', function(){
          expect(error).toBe('error');
        });
      });
    });
  });
});
