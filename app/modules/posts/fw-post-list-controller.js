angular.module('webApp')
  .controller('fwPostListCtrl',
  function($scope, $q, fwPostListConstants, postInteractions, authenticationService, blogRepositoryFactory, accountSettingsRepositoryFactory, subscriptionRepositoryFactory, fetchAggregateUserState, postsStub, errorFacade, postUtilities) {
    'use strict';

    var model = {
      posts: undefined,
      isLoading: false,
      errorMessage: undefined
    };

    var internal = this.internal = {};

    var loadNext = function(){ return $q.reject(new DisplayableError('Unknown fw-post-list source.')); };

    var accountSettingsRepository;
    var blogRepository;
    var subscriptionRepository;
    var timelineUserId;
    var currentUserId;

    internal.loadPosts = function(){
      model.errorMessage = undefined;
      model.isLoading = true;

      var getNextPosts = function() { return loadNext(0, 1000); };

      var posts;
      fetchAggregateUserState.updateInParallel(currentUserId, getNextPosts)
        .then(function(nextPosts) {
          posts = nextPosts;
          if(currentUserId === timelineUserId){
            return postUtilities.populateCurrentCreatorInformation(posts, accountSettingsRepository, blogRepository);
          }
          else{
            return postUtilities.populateCreatorInformation(posts, subscriptionRepository);
          }
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
      accountSettingsRepository = accountSettingsRepositoryFactory.forCurrentUser();
      blogRepository = blogRepositoryFactory.forCurrentUser();
      subscriptionRepository = subscriptionRepositoryFactory.forCurrentUser();

      currentUserId = authenticationService.currentUser.userId;

      if($scope.source === fwPostListConstants.sources.creatorBacklog){
        timelineUserId = currentUserId;
        loadNext = function() {
          return postsStub.getCreatorBacklog(timelineUserId)
            .then(function(response){
              return $q.when(response.data);
            });
        };
      }
      else{
        if($scope.source === fwPostListConstants.sources.creatorTimeline) {
          timelineUserId = currentUserId;
        }
        else{
          timelineUserId = $scope.userId;
        }

        var collectionId = $scope.collectionId;
        var channelId = $scope.channelId;

        loadNext = function(startIndex, count) {
          return postsStub
            .getNewsfeed({
              creatorId: timelineUserId,
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
