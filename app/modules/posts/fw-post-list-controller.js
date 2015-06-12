angular.module('webApp')
  .controller('fwPostListCtrl',
  function($scope, $q, fwPostListConstants, postInteractions, authenticationService, blogRepositoryFactory, accountSettingsRepositoryFactory, subscriptionRepositoryFactory, fetchAggregateUserState, postsStub, errorFacade, postUtilities) {
    'use strict';

    var model = {
      posts: undefined,
      isLoading: false,
      errorMessage: undefined
    };

    $scope.model = model;

    var internal = this.internal = {};

    internal.loadNext = function(){ return $q.reject(new DisplayableError('Unknown fw-post-list source.')); };

    var accountSettingsRepository = accountSettingsRepositoryFactory.forCurrentUser();
    var blogRepository = blogRepositoryFactory.forCurrentUser();
    var subscriptionRepository = subscriptionRepositoryFactory.forCurrentUser();

    internal.currentUserId = authenticationService.currentUser.userId;
    internal.timelineUserId = undefined;

    internal.populateCreatorInformation = function(posts){
      if(internal.currentUserId === internal.timelineUserId){
        return postUtilities.populateCurrentCreatorInformation(posts, accountSettingsRepository, blogRepository);
      }
      else{
        return postUtilities.populateCreatorInformation(posts, subscriptionRepository);
      }
    };

    internal.loadPosts = function(){
      model.errorMessage = undefined;
      model.isLoading = true;

      var getNextPosts = function() { return internal.loadNext(0, 1000); };

      var posts;
      return fetchAggregateUserState.updateInParallel(internal.currentUserId, getNextPosts)
        .then(function(nextPosts) {
          posts = nextPosts;
          return internal.populateCreatorInformation(posts);
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

    $scope.viewImage = function (image, imageSource) {
      postInteractions.viewImage(image, imageSource);
    };

    $scope.openFile = function (file) {
      return postInteractions.openFile(file);
    };

    $scope.editPost = function(post) {
      var modalResult = postInteractions.editPost(post);

      modalResult.result.then(function(newPost){
        if(newPost){
          var isBacklog = $scope.source === fwPostListConstants.sources.creatorBacklog;
          postUtilities.replacePostAndReorderIfRequired(isBacklog, model.posts, post.moment, newPost);
        }
      });
    };

    $scope.deletePost = function(postId) {
      return postInteractions.deletePost(postId)
        .then(function(){
          postUtilities.removePost(model.posts, postId);
        });
    };

    internal.attachToReloadEvent = function(){
      $scope.$on(fwPostListConstants.reloadEvent, internal.loadPosts);
    };

    this.initialize = function(){
      if($scope.source === fwPostListConstants.sources.creatorBacklog){
        internal.timelineUserId = internal.currentUserId;
        internal.loadNext = function() {
          return postsStub.getCreatorBacklog(internal.timelineUserId)
            .then(function(response){
              return $q.when(response.data);
            });
        };
      }
      else{
        if($scope.source === fwPostListConstants.sources.creatorTimeline) {
          internal.timelineUserId = internal.currentUserId;
        }
        else{
          internal.timelineUserId = $scope.userId;
        }

        var collectionId = $scope.collectionId;
        var channelId = $scope.channelId;

        internal.loadNext = function(startIndex, count) {
          return postsStub
            .getNewsfeed({
              creatorId: internal.timelineUserId,
              startIndex: startIndex,
              collectionId: collectionId,
              channelId: channelId,
              count: count
            })
            .then(function(response){
              return $q.when(response.data.posts);
            });
        };
      }

      internal.attachToReloadEvent();
      internal.loadPosts();
    };
  }
);
