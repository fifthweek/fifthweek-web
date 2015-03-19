describe('fw-post-list-controller', function(){
  'use strict';

  var $q;
  var $scope;
  var target;

  var postInteractions;
  var authenticationService;
  var channelRepositoryFactory;
  var channelRepository;
  var accountSettingsRepositoryFactory;
  var accountSettingsRepository;
  var fetchAggregateUserState;
  var postsStub;
  var errorFacade;
  var postUtilities;
  var fwPostListConstants;

  beforeEach(function() {

    postInteractions = jasmine.createSpyObj('postInteractions', ['viewImage', 'openFile', 'edit', 'delete']);
    authenticationService = { currentUser: { userId: 'userId' }};
    channelRepositoryFactory = jasmine.createSpyObj('channelRepositoryFactory', ['forCurrentUser']);
    channelRepository = 'channelRepository';
    channelRepositoryFactory.forCurrentUser.and.returnValue(channelRepository);
    accountSettingsRepositoryFactory = jasmine.createSpyObj('accountSettingsRepositoryFactory', ['forCurrentUser']);
    accountSettingsRepository = 'accountSettingsRepository';
    accountSettingsRepositoryFactory.forCurrentUser.and.returnValue(accountSettingsRepository);
    fetchAggregateUserState = jasmine.createSpyObj('fetchAggregateUserState', ['updateInParallel']);
    postsStub = jasmine.createSpyObj('postsStub', ['getCreatorBacklog']);
    errorFacade = jasmine.createSpyObj('errorFacade', ['handleError']);
    postUtilities = jasmine.createSpyObj('postUtilities', ['populateCurrentCreatorInformation', 'processPostsForRendering']);

    module('webApp');
    module(function($provide) {
      $provide.value('postInteractions', postInteractions);
      $provide.value('authenticationService', authenticationService);
      $provide.value('channelRepositoryFactory', channelRepositoryFactory);
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
    var apiDeferred;
    beforeEach(function(){
      fetchAggregateUserState.updateInParallel.and.callFake(function(userId, delegate){
        delegate();
        apiDeferred = $q.defer();
        return apiDeferred.promise;
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

    describe('when initializing', function(){

      beforeEach(function(){
        $scope.source = fwPostListConstants.sources.creatorBacklog;
        target.initialize();
      });

      it('should start loading posts', function(){
        expect($scope.model.isLoading).toBe(true);
      });

      it('should not have an error message', function(){
        expect($scope.model.errorMessage).toBeUndefined();
      });

      it('should call updateInParallel', function(){
        expect(fetchAggregateUserState.updateInParallel).toHaveBeenCalledWith('userId', jasmine.any(Function));
      });

      it('should call getCreatorBacklog', function(){
        expect(postsStub.getCreatorBacklog).toHaveBeenCalledWith('userId');
      });

      it('should get an account settings repository', function(){
        expect(accountSettingsRepositoryFactory.forCurrentUser).toHaveBeenCalledWith();
      });

      it('should get a channel repository', function(){
        expect(channelRepositoryFactory.forCurrentUser).toHaveBeenCalledWith();
      });

      describe('when API fails', function(){
        beforeEach(function(){
          apiDeferred.reject('error');
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
          postUtilities.processPostsForRendering.and.returnValue($q.when());

          posts = {some: 'value' };
          apiDeferred.resolve({data: posts});
          $scope.$apply();
        });

        it('should call populateCurrentCreatorInformation', function(){
          expect(postUtilities.populateCurrentCreatorInformation).toHaveBeenCalledWith(posts, accountSettingsRepository, channelRepository);
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

    it('should forward the edit function to postInteractions', function(){
      $scope.edit('a');
      expect(postInteractions.edit).toHaveBeenCalledWith('a', true);
    });

    it('should forward the delete function to postInteractions', function(){
      $scope.delete('a');
      expect(postInteractions.delete).toHaveBeenCalledWith('a', true);
    });
  });
});
