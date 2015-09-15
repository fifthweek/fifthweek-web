angular.module('webApp')
  .controller('fwPostListCtrl',
  function($scope, $q, fwPostListConstants, postInteractions, authenticationService, blogRepositoryFactory, accountSettingsRepositoryFactory, subscriptionRepositoryFactory, fetchAggregateUserState, postStub, errorFacade, postUtilities) {
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
        .then(function(result) {
          posts = result.posts;
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

    internal.likePost = function(post){
      post.hasLiked = true;
      post.likesCount += 1;
      return postInteractions.likePost(post.postId)
        .catch(function(error){
          post.hasLiked = false;
          post.likesCount -= 1;
          return errorFacade.handleError(error, function(message) {
            model.errorMessage = message;
          });
        });
    };

    internal.unlikePost = function(post){
      post.hasLiked = false;
      post.likesCount -= 1;
      return postInteractions.unlikePost(post.postId)
        .catch(function(error){
          post.hasLiked = true;
          post.likesCount += 1;
          return errorFacade.handleError(error, function(message) {
            model.errorMessage = message;
          });
        });
    };

    $scope.toggleLikePost = function(post){
      if(post.hasLiked){
        return internal.unlikePost(post);
      }
      else{
        return internal.likePost(post);
      }
    };

    internal.showComments = function(post, isCommenting){
      var updateCommentsCount = function(totalComments){
        post.commentsCount = totalComments;
      };
      return postInteractions.showComments(post.postId, isCommenting, updateCommentsCount);
    };

    $scope.commentOnPost = function(post){
      return internal.showComments(post, true);
    };

    $scope.showComments = function(post){
      return internal.showComments(post, false);
    };

    internal.attachToReloadEvent = function(){
      $scope.$on(fwPostListConstants.reloadEvent, internal.loadPosts);
    };

    this.initialize = function(){
      if($scope.source === fwPostListConstants.sources.creatorBacklog){
        internal.timelineUserId = internal.currentUserId;
        internal.loadNext = function() {
          return postStub.getCreatorBacklog(internal.timelineUserId)
            .then(function(response){
              return $q.when({
                posts: response.data
              });
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

        var channelId = $scope.channelId;

        internal.loadNext = function(startIndex, count) {
          return postStub
            .getNewsfeed({
              creatorId: internal.timelineUserId,
              startIndex: startIndex,
              channelId: channelId,
              count: count
            })
            .then(function(response){
              return $q.when(response.data);
            });
        };
      }

      internal.attachToReloadEvent();
      internal.loadPosts();
    };
  }
);
