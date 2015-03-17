angular.module('webApp').controller('backlogPostListCtrl',
  function($scope, postInteractions, authenticationService, channelRepositoryFactory, accountSettingsRepositoryFactory, fetchAggregateUserState, postsStub, errorFacade, postUtilities) {
    'use strict';

    var model = {
      posts: undefined,
      isLoading: false,
      errorMessage: undefined
    };

    var loadPosts = function(){
      model.errorMessage = undefined;
      model.isLoading = true;

      var accountSettingsRepository = accountSettingsRepositoryFactory.forCurrentUser();
      var channelRepository = channelRepositoryFactory.forCurrentUser();

      var userId = authenticationService.currentUser.userId;
      var getCreatorBacklog = function() { return postsStub.getCreatorBacklog(userId); };

      var posts;
      fetchAggregateUserState.updateInParallel(userId, getCreatorBacklog)
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

    loadPosts();

    $scope.viewImage = function (image, imageSource) {
      postInteractions.viewImage(image, imageSource);
    };

    $scope.openFile = function (file) {
      return postInteractions.openFile(file);
    };

    $scope.edit = function(postId) {
      postInteractions.edit(postId, true);
    };

    $scope.delete = function(postId) {
      postInteractions.delete(postId, true);
    };
  }
);
