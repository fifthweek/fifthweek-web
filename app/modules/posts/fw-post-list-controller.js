angular.module('webApp').controller('fwPostListCtrl',
  function($scope, $q, fwPostListConstants, postInteractions, authenticationService, channelRepositoryFactory, accountSettingsRepositoryFactory, fetchAggregateUserState, postsStub, errorFacade, postUtilities) {
    'use strict';

    var model = {
      posts: undefined,
      isLoading: false,
      errorMessage: undefined
    };

    var loadNext = function(){ return $q.reject(new DisplayableError('Unknown fw-post-list source.')); };

    var accountSettingsRepository;
    var channelRepository;
    var userId;

    var loadPosts = function(){
      model.errorMessage = undefined;
      model.isLoading = true;

      var getNextPosts = function() { return loadNext(0, 1000); };

      var posts;
      fetchAggregateUserState.updateInParallel(userId, getNextPosts)
        .then(function(result) {
          posts = result.data;
          return postUtilities.populateCurrentCreatorInformation(posts, accountSettingsRepository, channelRepository);
        })
        .then(function(){
          return postUtilities.processPostsForRendering(posts);
        })
        .then(function(){
          model.posts = posts;
        })
        .catch(function(error){
          model.posts = undefined;
          return errorFacade.handleError(error, function(message) {
            model.errorMessage = message;
          });
        })
        .finally(function(){
          model.isLoading = false;
        });
    };

    $scope.model = model;

    $scope.viewImage = function (image, imageSource) {
      postInteractions.viewImage(image, imageSource);
    };

    $scope.openFile = function (file) {
      return postInteractions.openFile(file);
    };

    $scope.editPost = function(postId) {
      postInteractions.editPost(postId, true);
    };

    $scope.deletePost = function(postId) {
      postInteractions.deletePost(postId, true);
    };

    this.initialize = function(){

      accountSettingsRepository = accountSettingsRepositoryFactory.forCurrentUser();
      channelRepository = channelRepositoryFactory.forCurrentUser();

      userId = authenticationService.currentUser.userId;

      if($scope.source === fwPostListConstants.sources.creatorBacklog){
        loadNext = function() { return postsStub.getCreatorBacklog(userId); };
      }
      else if($scope.source === fwPostListConstants.sources.creatorTimeline) {
        loadNext = function(startIndex, count) { return postsStub.getCreatorNewsfeed(userId, startIndex, count); };
      }

      loadPosts();
    };
  }
);
