angular.module('webApp')
  .controller('fwPostListCtrl',
  function($scope, $q, $state, states, landingPageConstants, fwPostListConstants, postInteractions, authenticationService, blogRepositoryFactory, accountSettingsRepositoryFactory, subscriptionRepositoryFactory, fetchAggregateUserState, postStub, errorFacade, postUtilities) {
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

    internal.loadPosts = function(){
      model.errorMessage = undefined;
      model.isLoading = true;

      var getNextPosts = function() { return internal.loadNext(0, 24); };

      var posts;
      return fetchAggregateUserState.updateInParallel(internal.currentUserId, getNextPosts)
        .then(function(result) {
          posts = result.posts;
          return postUtilities.processPostsForRendering(posts, accountSettingsRepository, blogRepository, subscriptionRepository);
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

    $scope.editPost = function(post) {
      var modalResult = postInteractions.editPost(post);

      modalResult.result.then(function(newPost){
        if(newPost){
          var isBacklog = $scope.source === fwPostListConstants.sources.creatorBacklog;
          postUtilities.replacePostAndReorderIfRequired(isBacklog, model.posts, post.moment, newPost);
        }
      });
    };

    $scope.viewPost = function(post) {
      return postInteractions.viewPost(post);
    };

    $scope.deletePost = function(postId) {
      return postInteractions.deletePost(postId)
        .then(function(){
          postUtilities.removePost(model.posts, postId);
        });
    };

    $scope.viewImage = function (image, imageSource) {
      postInteractions.viewImage(image, imageSource);
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
        var fetchNewsfeedDelegate;
        if($scope.source === fwPostListConstants.sources.preview){
          fetchNewsfeedDelegate = postStub.getPreviewNewsfeed;
        }
        else{
          fetchNewsfeedDelegate = postStub.getNewsfeed;
        }

        if($scope.source === fwPostListConstants.sources.creatorTimeline) {
          internal.timelineUserId = internal.currentUserId;
        }
        else{
          internal.timelineUserId = $scope.userId;
        }

        var channelId = $scope.channelId;

        internal.loadNext = function(startIndex, count) {
          return fetchNewsfeedDelegate({
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
